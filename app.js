const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
var path = require('path');
const db = require('./config')
const dotenv = require("dotenv")
const cookieParser = require('cookie-parser')

dotenv.config({ path: './.env' })

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser())
// define Routes
const pages = require('./routes/pages')
const registerPage = require('./routes/register')




// const view = path.join(__dirname)
// app.use(express.static(view))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs')

app.use('/', pages)
app.use('/auth', registerPage)
app.use('/auth', registerPage)




app.listen(5000, () => {
    console.log('app is runnning on port 5000');
})

// action="auth" method="POST"