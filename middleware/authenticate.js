const jwt = require("jsonwebtoken");
const User = require("../models/user");
const commonConstants = require("../common/constants");

const protect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(commonConstants.STATUS_CODE.UNAUTHORIZED).json({
      success: false,
      message: commonConstants.ERROR_MESSAGE.NO_TOKEN,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

    if (decoded.exp < Date.now() / 1000) {
      return res.status(commonConstants.STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: commonConstants.TOKEN.TOKEN_EXPIRED,
      });
    }

    req.user = await User.findByPk(decoded.id, {
      attributes: commonConstants.USER_ATTRIBUTES,
    });

    if (!req.user) {
      return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
        success: false,
        message: commonConstants.ERROR_MESSAGE.NOT_FOUND,
      });
    }

    next();
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.UNAUTHORIZED).json({
      success: false,
      message: commonConstants.ERROR_MESSAGE.TOKEN_INVALID,
    });
  }
};

const adminAuthentication = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(commonConstants.STATUS_CODE.UNAUTHORIZED).json({
      success: false,
      message: commonConstants.ERROR_MESSAGE.NO_TOKEN,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    req.user = await User.findByPk(decoded.id);

    if (decoded.exp < Date.now() / 1000) {
      return res.status(commonConstants.STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: commonConstants.TOKEN.TOKEN_EXPIRED,
      });
    }

    if (req.user.role !== commonConstants.USER_ROLE.ADMIN) {
      return res.status(commonConstants.STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: commonConstants.TOKEN.ROLE_NOT_AUTHORIZED,
      });
    }

    next();
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.UNAUTHORIZED).json({
      success: false,
      message: commonConstants.ERROR_MESSAGE.TOKEN_INVALID,
      error: error.message,
    });
  }
};

module.exports = { protect, adminAuthentication };
