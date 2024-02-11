const express = require('express');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

const studentData = {

  Vlad: {
    name: 'Vlad',
    age: 19,
    quote: 'you only live once , but if you do right, once is enoug',
    photo: '/images/vlad.jpg',
    about: ' I am currently a second-year software engineering student, and currently I’m into a web development, I also do sports. My favourite things to do: hanging out with friends, and spending time with myself' ,
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
    age: 18,
    quote: 'One day or day one',
    photo: '/images/ivan.JPG',
    about: ' I am currently a second-year student of National Technical University of Ukraine "Igor Sikorsky Kyiv Polytechnic Institute". I spend my free time learning new technologies and programing languages. I also like to do sports, such as: table tennis and light athletics.'
  }
};


app.get('/students', (req, res) => {
  res.render('students', { students: Object.values(studentData) });
});

app.get('/student/:name', (req, res) => {
  const name = req.params.name;
  if (studentData.hasOwnProperty(name)) {
    res.render('student', { student: studentData[name] });
  } else {
    res.status(404).send('Student not found');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
