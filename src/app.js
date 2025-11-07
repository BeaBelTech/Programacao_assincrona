require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const exphbs = require('express-handlebars');
const authRoutes = require('./routes/login_routes');
const votesRoutes = require('./routes/votes_routes');
const authMiddleware = require('./middlewares/isLoggedIn');

const ideiaRoutes = require('./routes/idea_routes');
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main', extname: '.handlebars' }));
app.set('view engine', 'handlebars');
app.set("views", path.join(__dirname, "views"));
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'nada',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(authMiddleware);

app.use('/', authRoutes);
app.use('/ideas', ideiaRoutes);
app.use('/votes', votesRoutes);

app.get('/', (req, res) => res.redirect('/login'));

module.exports = { app, connectDB };
