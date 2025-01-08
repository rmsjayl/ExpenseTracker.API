require("dotenv").config({ path: "./config/config.env" });
const passwordComplexity = require("joi-password-complexity");
const commonConstants = require("./constants").default;

var commonValidation = {
  payloadValidation: function (payload) {
    if (Object.keys(payload).length === 0) {
      return commonConstants.VALIDATION.PAYLOAD_EMPTY;
    }

    for (let key in payload) {
      if (payload[key] === undefined || payload[key] === null || payload[key] === "") {
        key = key.charAt(0).toUpperCase() + key.slice(1);
        return `${key} is required. ${commonConstants.VALIDATION.KEY_NOT_PROVIDED}`;
      }
    }
  },
  priceValidation: function (payloadPrice) {
    let price = parseFloat(payloadPrice);

    if (isNaN(price)) {
      return commonConstants.VALIDATION.PRICE_NOT_A_NUMBER;
    }

    if (price < 0) {
      return commonConstants.VALIDATION.PRICE_INVALID;
    }
  },
  emailValidation: function (email) {
    var emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      return commonConstants.VALIDATION.EMAIL_INVALID;
    }
  },
  contactNumber: function (number) {
    var numberRegex = /^[0-9]{10}$/;

    if (!numberRegex.test(number)) {
      return commonConstants.VALIDATION.CONTACT_NUMBER_INVALID;
    }
  },
  modeOfPayment: function (payment) {
    const paymentModes = Object.values(commonConstants.PAID_VIA);

    if (!paymentModes.includes(payment)) {
      return commonConstants.VALIDATION.PAYMENT_MODE_INVALID;
    }
  },
  passwordComplexity: function (password) {
    const complexityOptions = {
      min: 8,
      max: 30,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 4,
    };

    const label = "Password";

    if (passwordComplexity(complexityOptions, label).validate(password).error) {
      return passwordComplexity(complexityOptions, label).validate(password).error.message;
    }
  },
  statusValidation: function (status) {
    const categoryStatus = Object.values(commonConstants.CATEGORY_STATUS);

    if (!categoryStatus.includes(status)) {
      return commonConstants.CATEGORY.INVALID_STATUS;
    }
  },
};

module.exports = commonValidation;
