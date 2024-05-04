const fs = require('fs');
const { Sequelize } = require('sequelize');
const UsersModel = require('../models/users');
const NotesModel = require('../models/notes');
const StudentsModel = require('../models/students');

// Read the config file
const config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));

// Determine the environment
const env = process.env.NODE_ENV || 'development';

// Get the config for the current environment
const envConfig = config[env];

// Create a new Sequelize instance with the config
const sequelize = new Sequelize(envConfig);

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}


const Users = UsersModel(sequelize, Sequelize);
const Notes = NotesModel(sequelize, Sequelize);
const Students = StudentsModel(sequelize, Sequelize);

Users.sync()
  .then(() => {
    console.log('Users model synchronized successfully.');
  })
  .catch(err => {
    console.error('Error synchronizing Users model:', err);
  });

Notes.sync()
  .then(() => {
    console.log('Notes model synchronized successfully.');
  })
  .catch(err => {
    console.error('Error synchronizing Notes model:', err);
  });

Students.sync()
  .then(() => {
    console.log('Students model synchronized successfully.');
  })
  .catch(err => {
    console.error('Error synchronizing Students model:', err);
  });

sequelize.sync()
  .then(() => {
    console.log('All models synchronized successfully.');
  })
  .catch(err => {
    console.error('Error synchronizing models:', err);
  });
  

module.exports = {
  Sequelize,
  sequelize,
  Users,
  Notes,
  Students
};