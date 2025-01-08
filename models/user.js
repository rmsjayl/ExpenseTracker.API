const commonConstants = require("../common/constants");
const commonHelpers = require("../common/helpers");
const sequelize = require("../database/db");
const { DataTypes } = require("sequelize");
const sendEmail = require("../utilities/sendEmail");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    dateVerified: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: commonConstants.USER_ROLE.ADMIN,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    accountVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accountVerificationTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },

  {
    timestamps: true,
  }
);

User.afterCreate(async (user) => {
  try {
    const token = commonHelpers.generateRandomKeyToken();
    const expires = Date.now() + 30 * 60 * 1000;

    await user.update({
      accountVerificationToken: token,
      accountVerificationTokenExpires: expires,
    });

    await sendEmail(
      commonConstants.EMAIL_TYPE.ACCOUNT_VERIFICATION,
      user.email,
      commonConstants.EMAIL_SUBJECT.SUBJECT_ACCOUNT_VERIFICATION,
      user
    );
    console.log(commonConstants.USER.USER_AND_SEND_EMAIL_RESPONSE);
  } catch (error) {
    console.error(commonConstants.USER.ERROR_CREATING_USER_SEND_EMAIL, error);
    return error;
  }
});

User.sync({ alter: true })
  .then(() => {
    console.log(commonConstants.DATABASE_TABLES.USER + commonConstants.DATABASE_TABLE_CREATION.SUCCESS);
  })
  .catch((error) => {
    console.error(`${commonConstants.DATABASE_TABLES.USER} ${commonConstants.DATABASE_CONNECTION.ERROR} ${error}`);
  });

module.exports = User;
