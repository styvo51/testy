'use strict';

module.exports = (sequelize, DataTypes) => {
  const person = sequelize.define('person', {
    title: DataTypes.STRING,
    forename: DataTypes.STRING,
    lastname: DataTypes.STRING,
    addr1: DataTypes.STRING,
    addr3: DataTypes.STRING,
    postcode: DataTypes.STRING,
    dob: DataTypes.STRING,
    telephone: DataTypes.STRING,
    url: DataTypes.STRING,
    ip: DataTypes.STRING
  }, {});
  person.associate = function(models) {
    // associations can be defined here
  };
  return person;
};
