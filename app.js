var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// bring in the database
require('./app_api/models/db');

// import middleware
const session = require('express-session');
const errorMiddleware = require('./app_api/middleware/errorMiddleware');

// define routers
var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
var aboutRouter = require('./app_server/routes/about');
var travelRouter = require('./app_server/routes/travel');
var contactRouter = require('./app_server/routes/contact');
var mealsRouter = require('./app_server/routes/meals');
var newsRouter = require('./app_server/routes/news');
var roomsRouter = require('./app_server/routes/rooms');
var authRouter = require('./app_server/routes/auth');
var profileRouter = require('./app_server/routes/profile');
var apiRouter = require('./app_api/routes/index');

// define handlebars 
var handlebars = require('hbs');

// bring in the authentication logic
require('dotenv').config();

// wire in authentication module
var passport = require('passport');
require('./app_api/config/passport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

// register handlebars helper (https://www.npmjs.com/package/hbs)
handlebars.registerHelper('eq', (a, b) => a === b);

// register handlbars partials (https://www.npmjs.com/package/hbs)
handlebars.registerPartials(__dirname + '/app_server/views/partials');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// set index for public path
app.get('/', (req, res) => { res.redirect('/index'); });
app.use(express.static(path.join(__dirname, 'public')));

// This serves the built Angular app from the dist folder
app.use('/admin', express.static(path.join(__dirname, 'app_admin/dist/travlr-admin/browser')));

// session information
app.use(session({
	secret: process.env.SESSION_SECRET || 'travlr-secret-key-change-in-production',
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false,
		maxAge: 1000 * 60 * 60 * 24 // 24 hours
	}
}));

// passport authentication
app.use(passport.initialize());

// Enable CORS
app.use('/api', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	if (req.method === 'OPTIONS') {
		return res.status(200).end();
	}
	next();
});

// pass userId to all templates automatically
app.use((req, res, next) => {
	res.locals.userId = req.session.userId;
	res.locals.username = req.session.username;	
	next();
});


app.use('/rooms', roomsRouter);
app.use('/auth', authRouter);

// wire-up routes to controllers
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/about', aboutRouter);
app.use('/travel', travelRouter);
app.use('/contact', contactRouter);
app.use('/meals', mealsRouter);
app.use('/news', newsRouter);
app.use('/profile', profileRouter);

// API routes (with error handling)
app.use('/api', apiRouter);

// Catch any requests that don't match a routers
app.use((req, res, next) => {
	next(createError(404, 'Route not found'));
});

// catches all errors from routes and asyncHandler
app.use(errorMiddleware);

module.exports = app;
