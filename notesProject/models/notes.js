'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Notes.belongsTo(models.Users, {
        foreignKey: 'userid',
        onDelete: 'CASCADE'
      });
    }
  }
  Notes.init({      
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true
    },
    userid: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING
    },
    text: {
      type: DataTypes.STRING
    }}, {
    sequelize,
    modelName: 'Notes',
  });
  return Notes;
};