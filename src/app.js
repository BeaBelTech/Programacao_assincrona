require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const exphbs = require('express-handlebars');
const authRoutes = require('./routes/login_routes');
const votesRoutes = require('./routes/votes_routes');
const authMiddleware = require('./middlewares/isLoggedIn');
const flash = require('express-flash');
const ideiaRoutes = require('./routes/idea_routes');
const path = require("path");
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main', extname: '.handlebars' }));
app.set('view engine', 'handlebars');
app.set("views", path.join(__dirname, "views"));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'nada',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

app.use(authMiddleware);

app.use('/', authRoutes, ideiaRoutes, votesRoutes);
app.get('/', (req, res) => res.redirect('/login'));

module.exports = { app, connectDB };
