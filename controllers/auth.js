const db = require('../config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'Please provide an email and password'
            })
        }
        db.query('SELECT * FROM login_data WHERE email=?', [email], async (error, results) => {
            console.log(results);
            if (error) {
                throw error;
            } else if (results.length == 0) {
                res.status(401).render('login', {
                    message: 'Email  is incorrect'
                }) //this is what you are missing
            } if (!(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render('login', {
                    message: 'Password is incorrect'
                })
            } else {
                const id = results[0].id;
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                })

                console.log("The token: " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).render("home");
            }


        })
    } catch (error) {
        console.log(error);
    }
}

exports.register = (req, res) => {
    console.log(req.body);

    const { username, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM login_data WHERE email=?', email, async (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            return res.render('register', {
                message: 'That email is already registered'
            })
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Password does not match'
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO login_data SET ?', { username: username, password: hashedPassword, email: email }, (err, results) => {
            if (err) {
                throw err;
            } else {
                console.log(results)
                res.render('register', {
                    message: 'User Registered'
                })
                return res.redirect('/')
            }
        })
    })

}
