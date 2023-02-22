const express = require('express');
const port = process.env.PORT || 5000;
const app = express();

const cors = require('cors')
const SignUpData = require('./model/signupmodel');


const multer = require('multer');
const session = require('express-session');
    // aPZAsutyIsa8
    const fs = require('fs');
// const signupdata = require('./model/signupmodel');



const cookieparser = require('cookie-parser');

const jwt = require('jsonwebtoken');
const { requireAuth, checkUser } = require('./middleware/middleware');
app.use(session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false
}));





app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})

;
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("./public"));

app.set("views", __dirname + "/src/views");
app.use(cookieparser());
app.use(cors({
    credentials: true,
    origin: [ 'http://localhost:4200']
}))

app.get('*', checkUser)
// index or login page
    app.get("/", function (req, res) {
            res.render("index");
        });

// i page
    app.get("/home",requireAuth ,function (req, res) {
        employmodel.find()
            .then(function (items) {
                res.render("home", {
                    // items
                });
            });
    });


    // app.get("/single", function (req, res) {
    //     res.render("single");
    // });

// signup page
app.get("/signup", function (req, res) {
    res.render("signup");
});
// logout
    app.get('/logout', (req, res) => {
        res.cookie('jwt', '', { maxAge: 1 });
        res.redirect('/');
    });


// multer
    var fileStorageEngine = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/images/')
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '--' + file.originalname);
        },
    });
    var imageupload = multer({ storage: fileStorageEngine });
    









//error handlng
    const signuperrors = (err) => {
        console.log(err.message, err.code);
        let errors = { email: '', password: '' };

        //incorrect email
        if (err.message === "incorrect email") {
            errors.email='that email is not registered'
        }
        //incorrect password
        if (err.message === "incorrect password") {
            errors.password='that password is incorrect'
        }
        
        // duplicate email error code mesage
        if (err.code === 11000) {
            errors.email = 'that email is already registered';
            return errors;
        };
        // validation errors
        if (err.message.includes('signupdata validation failed')) {
            // console.log(Object.values(err.errors));

            Object.values(err.errors).forEach(({properties}) => {
                // console.log(error.properties);
                errors[properties.path] = properties.message;
            })
        }
        return errors;
    }  


// jwt token create
    const maxAge = 60 * 60 * 15
    //jwt expects seconds not milliseconds like cookies
    const createToken = (id) => {
        return jwt.sign({ id }, 'my secret jwt secret key',{
            expiresIn: maxAge
        })
    }

    
//signup data insert to mongo db
    app.post('/signup', async function (req, res) {
        let email = req.body.email;
        let password = req.body.password;
        let username = req.body.username;
        // const { username, email, password } = req.body;
        try {
            const signup = await SignUpData.create({ username, email, password });
            const token = createToken(signup._id);
        
            res.cookie('jwt', token, { httpOnly: true, maxAge : maxAge * 1000 });
            res.status(201).json({ signup: signup._id });

        } catch (err) {
            const errors= signuperrors(err);
            // console.log(err);
            res.status(400).json({ errors })
        }
        
    });



//login post
app.post('/logins', async function (req, res) {
            
    const { email, password } = req.body;

    try {
        const user = await SignUpData.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ signup: user._id });
    }
    catch (err) {
        const errors = signuperrors(err);
        res.status(400).json({ errors });
    }
})


   
// cookies
    // app.get('/set-cookies', (req, res) => {
    //     // res.setHeader('Set-Cookie', 'newUser=true');
    //     res.cookie('newUser', false);
    //     res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 15 });
    //     // res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 15, httpOnly:true });
    //     // res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 15, secure:true });
    //     res.send('you got the cookie!');
    // })

    // app.get('/read-cookies', (req, res) => {
    //     const cookies = req.cookies;
    //     console.log(cookies);
    //     console.log(cookies.isEmployee);
    //     res.json(cookies);
    // })


app.listen(port, () => console.log("app listening at " + port))