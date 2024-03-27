'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Students extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Students.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING 
    },
    age: { 
      type: DataTypes.INTEGER 
    },
    quote: { 
      type: DataTypes.STRING 
    },
    photo: { 
      type: DataTypes.STRING 
    },
    about: { 
      type: DataTypes.STRING 
    },
    insta: { 
      type: DataTypes.STRING 
    },
    instatag: { 
      type: DataTypes.STRING 
    }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Students',
  });
  return Students;
};