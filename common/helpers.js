const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto-js");

var commonHelpers = {
  passwordHash: function (password) {
    const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
    return bcrypt.hashSync(password, salt, function (error, hash) {
      if (error) {
        return error;
      }

      return hash;
    });
  },
  passwordCompare: function (password, hash) {
    return bcrypt.compareSync(password, hash, function (error, result) {
      if (error) {
        return error;
      }

      return result;
    });
  },
  generateToken: function (id, role) {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  },
  generateRandomKeyToken: function () {
    return crypto.lib.WordArray.random(16).toString(crypto.enc.Hex);
  },
};

module.exports = commonHelpers;
