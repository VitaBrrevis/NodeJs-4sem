var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require('express-flash');

var indexRouter = require('./routes/index');
var studentsRouter = require('./routes/students');
var studentRouter = require('./routes/student')
var notesRouter = require('./routes/notes');
var authRouter = require('./routes/auth');

var app = express();

//Data Base setup
const { sequelize, Sequelize } = require('./models/index');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// view engine setup
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
  cookie: { maxAge: 1200000 },
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

app.use(function (req, res, next) {
  //Notes goes like local parameter to template and called here as sync function. Can be called async functions as well.(getNotes_callback(), getNotes_promise(), getNotes_async())
  // res.locals.notes = notesManager.getNotes_sync();
  next();
});

app.use('/', indexRouter);
app.use('/students', studentsRouter);
app.use('/student/:name', studentRouter);
app.use('/notes', notesRouter);
app.use('/auth', authRouter);


//Get request for deleting note by id.
app.get('/deleteNote/:id', (req, res) => {
  const id = req.params.id;
  if (notesManager.deleteNotes(id)) {
    res.redirect('/notes');
  } else {
    res.status(500).send('Помилка при видаленні нотатки');
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
