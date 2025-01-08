const sequelize = require("../database/db");
const { DataTypes } = require("sequelize");
const commonConstants = require("../common/constants");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: commonConstants.CATEGORY.STATUS_ACTIVE,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Category.sync({ alter: true })
  .then(() => {
    console.log(commonConstants.DATABASE_TABLES.CATEGORY + commonConstants.DATABASE_TABLE_CREATION.SUCCESS);
  })
  .catch((error) => {
    console.error(`${commonConstants.DATABASE_TABLES.CATEGORY} ${commonConstants.DATABASE_CONNECTION.ERROR} ${error}`);
  });

module.exports = Category;
