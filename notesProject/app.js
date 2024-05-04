const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('express-flash');

const indexRouter = require('./routes/index');
const studentsRouter = require('./routes/students');
const studentRouter = require('./routes/student')
const notesRouter = require('./routes/notes');
const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');

const app = express();

const { sequelize, Sequelize } = require('./models/index');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(session({
  store: new SequelizeStore({
    db: sequelize
  }),
  resave: false,
  secret: 'secretkey',
  cookie: {},
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.navbar = 'navbar';
  res.locals.messages = 'messages';
  next();
});

const Students = require('./models/index').Students;

app.get('/student/:name', (req, res) => {
  const name = req.params.name;
  Students.findOne({ where: { name: name } })
    .then(student => {
      if (student) {
          res.render('student', { student: student, navbar: res.locals.navbar, session: req.session });
      } else {
          res.status(404).send('Student not found');
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal server error');
    });
});

app.use('/', indexRouter);
app.use('/students', studentsRouter);
app.use('/student/:name', studentRouter);
app.use('/notes', notesRouter);
app.use('/auth', authRouter);
app.use('/api/v1', apiRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
