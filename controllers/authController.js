const User = require("../models/user");
const commonConstants = require("../common/constants");
const commonValidation = require("../common/validation");
const commonHelpers = require("../common/helpers");
const sendEmail = require("../utilities/sendEmail");

exports.register = async (req, res) => {
  const findUserEmail = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  const findUsername = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  if (findUsername) {
    return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
      success: false,
      message: commonConstants.USER.USERNAME_EXISTS,
    });
  }

  if (findUserEmail) {
    return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
      success: false,
      message: commonConstants.USER.USER_EXISTS,
    });
  }

  const { firstName, lastName, email, username, password } = req.body;

  try {
    const payload = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: password,
    };

    const validation = commonValidation.payloadValidation(payload);

    if (validation) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: validation,
      });
    }

    const passwordValidation = commonValidation.passwordComplexity(password);

    if (passwordValidation) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: passwordValidation,
      });
    }

    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: commonHelpers.passwordHash(password),
    });

    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      role: user.role,
      isVerified: user.isVerified,
    };

    return res.status(commonConstants.STATUS_CODE.CREATED).json({
      success: true,
      message: commonConstants.USER.USER_CREATED,
      user: userResponse,
    });
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const payload = {
      email: email,
      password: password,
    };

    const validation = commonValidation.payloadValidation(payload);

    if (validation) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: validation,
      });
    }

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
        success: false,
        message: commonConstants.USER.INVALID_CREDENTIALS,
      });
    }

    const isMatch = commonHelpers.passwordCompare(password, user.password);

    if (!isMatch) {
      return res.status(commonConstants.STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: commonConstants.USER.INVALID_CREDENTIALS,
      });
    }

    const token = commonHelpers.generateToken(user.id, user.role);

    return res.status(commonConstants.STATUS_CODE.OK).json({
      success: true,
      message: commonConstants.USER.LOGIN_SUCCESS,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        token: token,
      },
    });
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

exports.accountVerification = async (req, res) => {
  const { verificationToken, id } = req.params;

  try {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: commonConstants.USER.NO_USER_FOUND,
      });
    }

    if (user.isVerified === true) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: commonConstants.USER.ALREADY_VERIFIED,
      });
    }

    const token = await User.findOne({
      where: {
        accountVerificationToken: verificationToken,
      },
    });

    if (!token) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: commonConstants.USER.INVALID_ACCOUNT_VERIFICATION_TOKEN,
      });
    }

    if (token.accountVerificationTokenExpires < Date.now()) {
      const issuedNewToken = await user.update({
        accountVerificationToken: commonHelpers.generateRandomKeyToken(),
        accountVerificationTokenExpires: Date.now() + 30 * 60 * 1000,
      });

      const issuedNewTokenResponse = {
        id: issuedNewToken.id,
        accountVerificationToken: issuedNewToken.accountVerificationToken,
        accountVerificationTokenExpires: issuedNewToken.accountVerificationTokenExpires,
      };

      await sendEmail(
        commonConstants.EMAIL_TYPE.RESEND_TOKEN_VERIFICATION,
        user.email,
        commonConstants.EMAIL_SUBJECT.SUBJECT_RESEND_TOKEN_VERIFICATION,
        user
      );

      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: commonConstants.USER.ACCOUNTVERIFICATION_EXPIRED,
        data: issuedNewTokenResponse,
      });
    }

    const verifiedUser = await user.update({
      accountVerificationToken: null,
      accountVerificationTokenExpires: null,
      isVerified: true,
      dateVerified: Date.now(),
    });

    const updatedUserResponse = {
      id: verifiedUser.id,
      email: verifiedUser.email,
      username: verifiedUser.username,
      isVerified: verifiedUser.isVerified,
    };

    return res.status(commonConstants.STATUS_CODE.OK).json({
      success: true,
      message: commonConstants.USER.ACCOUNT_VERIFIED,
      user: updatedUserResponse,
    });
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const payload = {
      email: email,
    };

    const validation = commonValidation.payloadValidation(payload);

    if (validation) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: validation,
      });
    }

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
        success: false,
        message: commonConstants.USER.NO_USER_FOUND,
      });
    }

    await user.update({
      resetPasswordToken: commonHelpers.generateRandomKeyToken(),
      resetPasswordExpires: Date.now() + 30 * 60 * 1000,
    });

    await sendEmail(
      commonConstants.EMAIL_TYPE.FORGOT_PASSWORD,
      user.email,
      commonConstants.EMAIL_SUBJECT.SUBJECT_FORGOT_PASSWORD,
      user
    );

    return res.status(commonConstants.STATUS_CODE.OK).json({
      success: true,
      message: commonConstants.USER.FORGOT_PASSWORD_EMAIL_SENT,
      email: user.email,
    });
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { resetPasswordToken, id } = req.params;

  const { password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });

    const payload = {
      password: password,
    };

    const validation = commonValidation.payloadValidation(payload);

    if (validation) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: validation,
      });
    }

    if (!user) {
      return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
        success: false,
        message: commonConstants.USER.NO_USER_FOUND,
      });
    }

    if (!resetPasswordToken) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: commonConstants.USER.INVALID_RESET_PASSWORD_TOKEN,
      });
    }

    if (user.resetPasswordToken && user.resetPasswordExpires < Date.now()) {
      const issuedNewToken = await user.update({
        resetPasswordToken: commonHelpers.generateRandomKeyToken(),
        resetPasswordExpires: Date.now() + 30 * 60 * 1000,
      });

      const issuedNewTokenResponse = {
        id: issuedNewToken.id,
        email: issuedNewToken.email,
        resetPasswordToken: issuedNewToken.resetPasswordToken,
        resetPasswordExpires: issuedNewToken.resetPasswordExpires,
      };

      await sendEmail(
        commonConstants.EMAIL_TYPE.FORGOT_PASSWORD,
        user.email,
        commonConstants.EMAIL_SUBJECT.SUBJECT_FORGOT_PASSWORD,
        user
      );

      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: commonConstants.USER.RESET_PASSWORD_EXPIRED,
        data: issuedNewTokenResponse,
      });
    }

    const resetToken = await User.findOne({
      where: {
        resetPasswordToken: resetPasswordToken,
      },
    });

    if (!resetToken) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: commonConstants.USER.INVALID_RESET_PASSWORD_TOKEN,
      });
    }

    const validatePassword = commonValidation.passwordComplexity(password);

    if (validatePassword) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: validatePassword,
      });
    }

    // if the password is the same as the old password
    const isMatch = commonHelpers.passwordCompare(password, user.password);

    if (isMatch) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: commonConstants.USER.PASSWORD_SAME,
      });
    }

    const updatedUserPassword = await user.update({
      password: commonHelpers.passwordHash(password),
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    const updatedUserPasswordResponse = {
      email: updatedUserPassword.email,
      password: updatedUserPassword.password,
    };

    return res.status(commonConstants.STATUS_CODE.OK).json({
      success: true,
      message: commonConstants.USER.PASSWORD_RESET_SUCCESS,
      user: updatedUserPasswordResponse,
    });
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  const { id } = req.params;

  const { firstName, lastName, email, username } = req.body;

  try {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
        success: false,
        message: commonConstants.USER.NO_USER_FOUND,
      });
    }

    const payload = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
    };

    const validation = commonValidation.payloadValidation(payload);

    if (validation) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: validation,
      });
    }

    if (payload.email !== user.email) {
      const findUserEmail = await User.findOne({
        where: {
          email: email,
        },
      });

      if (findUserEmail) {
        return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: commonConstants.USER.USER_EXISTS,
        });
      }
    }

    if (payload.username !== user.username) {
      const findUsername = await User.findOne({
        where: {
          username: username,
        },
      });

      if (findUsername) {
        return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: commonConstants.USER.USERNAME_EXISTS,
        });
      }
    }

    if (user.isVerified === false) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: commonConstants.USER.ACCOUNT_NOT_VERIFIED,
      });
    }

    if (
      user.firstName === firstName &&
      user.lastName === lastName &&
      user.email === email &&
      user.username === username
    ) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: commonConstants.USER.NO_UPDATE_MADE,
      });
    }

    const updatedUser = await user.update({
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
    });

    const updatedUserResponse = {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      username: updatedUser.username,
    };

    if (user.email !== email) {
      await sendEmail(
        commonConstants.EMAIL_TYPE.ACCOUNT_VERIFICATION,
        updatedUser.email,
        commonConstants.EMAIL_SUBJECT.SUBJECT_ACCOUNT_VERIFICATION,
        updatedUser
      );
    }

    return res.status(commonConstants.STATUS_CODE.OK).json({
      success: true,
      message: commonConstants.USER.PROFILE_UPDATED,
      user: updatedUserResponse,
    });
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
