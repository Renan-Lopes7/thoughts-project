const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');
const app = express();

const conn = require('./db/conn');

//models 
const Tought = require('./models/Toughts');
const User = require('./models/User');

//import Routes
const ToughtsRoutes = require('./routes/ToughtsRouter');
const AuthRoutes = require('./routes/authRoutes');

//import controller
const ToughtController = require('./controllers/ToughtController');

//template engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
//confi css
app.use(express.static('public'));

app.use(
    express.urlencoded({
        extended: true,
    })
)
app.use(express.json());

//session middleware
app.use(
    session({
        name: 'session',
        secret: "nosso_secret", //vai ajudar a proteger as sessoes do usu
        resave: false, //caiu a sessão ele vai desconectar 
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () { },
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000, //tempo em que ele dura
            expires: new Date(Date.now() + 360000), //automaticamente expira em um dia 
            httpOnly: true,
        }
    }),
)

//confi flash message
app.use(flash());

app.use((req, res, next) => {

    if (req.session.userid) {
        res.locals.session = req.session
    }

    next();

})

//ROUTES
app.use('/toughts', ToughtsRoutes);
app.use('/', AuthRoutes);

app.get('/', ToughtController.showToughts);



conn
    //.sync({ force: true })
    .sync()
    .then(() => {
        app.listen(1000);
    })
    .catch((err) => {
        console.log(err);
    })