var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var studentsRouter = require('./routes/students');
var studentRouter = require('./routes/student')
var notesRouter = require('./routes/notes');
var notesManager = require('./models/mockData');

var app = express();

//Data Base setup
const { sequelize, Sequelize } = require('./models/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const studentData = {

  Vlad: {
    name: 'Vlad',
    age: 19,
    quote: 'you only live once , but if you do right, once is enough',
    photo: '/images/vlad.jpg',
    about: ' I am currently a second-year software engineering student, and currently I’m into a web development, I also do sports. My favourite things to do: hanging out with friends, and spending time with myself',
    insta: 'https://www.instagram.com/coibelevin?igsh=MzRlODBiNWFlZA==',
    "instaTag": '@coibelevin'
  },
  Vita: {
    name: 'Vita',
    age: 19,
    quote: 'per aspera ad astra',
    photo: '/images/vita.jpg',
    about: 'Just a front-end developer at a local company. Specialize in e-commerce',
    insta: 'https://www.instagram.com/brrevq?igsh=MXdhZmE2b2E0bzJ4bw==',
    "instaTag": '@brrevq'
  },
  Ivan: {
    name: 'Ivan',
    age: 19,
    quote: 'One day or day one',
    photo: '/images/ivan.JPG',
    about: ' I am currently a second-year student of National Technical University of Ukraine "Igor Sikorsky Kyiv Polytechnic Institute". I spend my free time learning new technologies and programing languages. I also like to do sports, such as: table tennis and light athletics.'
  }
};

app.use((req, res, next) => {
  res.locals.navbar = 'navbar';
  next();
});

app.get('/student/:name', (req, res) => {
  const name = req.params.name;
  if (studentData.hasOwnProperty(name)) {
    res.render('student', { student: studentData[name], navbar: res.locals.navbar });
  } else {
    res.status(404).send('Student not found');
  }
});

app.use(function (req, res, next) {
  res.locals.studentData = studentData;
  //Notes goes like local parameter to template and called here as sync function. Can be called async functions as well.(getNotes_callback(), getNotes_promise(), getNotes_async())
  res.locals.notes = notesManager.getNotes_sync();
  next();
});

app.use('/', indexRouter);
app.use('/students', studentsRouter);
app.use('/student/:name', studentRouter);
app.use('/notes', notesRouter);

//Post request for adding new note.
app.post('/createNote', (req, res) => {
  console.log(req.body)
  if (notesManager.addNotes(req.body)) {
    res.redirect('/notes'); 
  } else {
    res.status(500).send('Помилка при додаванні нотатки');
  }
});

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
