const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");
const commonConstants = require("../common/constants");
const User = require("./user");
const Category = require("./category");

const Expense = sequelize.define(
  "Expense",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.UUID,
      references: {
        model: Category,
        key: "id",
      },
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paidVia: {
      type: DataTypes.STRING,
      allowNull: false,
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

User.hasMany(Expense, {
  foreignKey: "userId",
  as: "expenses",
});

Expense.belongsTo(User, {
  foreignKey: "userId",
  as: "users",
});

Category.hasMany(Expense, {
  foreignKey: "categoryId",
  as: "expenses",
});

Expense.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

Expense.sync({ alter: true })
  .then(() => {
    console.log(commonConstants.DATABASE_TABLES.EXPENSE + commonConstants.DATABASE_TABLE_CREATION.SUCCESS);
  })
  .catch((error) => {
    console.error(`${commonConstants.DATABASE_TABLES.EXPENSE} ${commonConstants.DATABASE_CONNECTION.ERROR} ${error}`);
  });

module.exports = Expense;
