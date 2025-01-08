const Expense = require("../models/expense");
const User = require("../models/user");
const Category = require("../models/category");
const commonConstants = require("../common/constants");
const commonValidation = require("../common/validation");

exports.getAllExpense = async (req, res) => {
  try {
    const expense = await Expense.findAll();

    const page = parseInt(req.query.page) || commonConstants.PAGINATION.PAGE;
    const limit = parseInt(req.query.limit) || commonConstants.PAGINATION.LIMIT;
    const offset = (page - 1) * limit;

    const totalPages = Math.ceil(expense.length / limit);

    if (page > totalPages) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: commonConstants.PAGINATION.INVALID_PAGE_NUMBER + totalPages,
      });
    }

    const { count, rows } = await Expense.findAndCountAll({
      include: [
        {
          model: User,
          as: "users",
          attributes: ["firstName", "lastName", "email"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["name", "status"],
        },
      ],
      limit: limit,
      order: [["createdAt", "DESC"]],
      offset,
    });

    if (!rows) {
      return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
        success: true,
        message: commonConstants.EXPENSE.NO_EXPENSE_FOUND,
        expense: rows,
      });
    }

    if (rows.length === 0) {
      return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
        success: true,
        message: commonConstants.EXPENSE.NO_EXPENSE_FOUND,
        expense: rows,
      });
    }

    return res.status(commonConstants.STATUS_CODE.OK).json({
      success: true,
      message: commonConstants.EXPENSE.EXPENSE_RETRIEVED,
      totalRecords: count,
      pagination: {
        limit: limit,
        page: `${page} out of ${totalPages}`,
      },
      expense: rows,
    });
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getExpenseById = async (req, res) => {
  const expenseId = req.params.id;

  try {
    const expense = await Expense.findByPk(expenseId);

    if (!expense) {
      return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
        success: true,
        message: commonConstants.EXPENSE.NO_EXPENSE_FOUND,
      });
    }

    return res.status(commonConstants.STATUS_CODE.OK).json({
      success: true,
      message: commonConstants.EXPENSE.EXPENSE_FOUND,
      expense: expense,
    });
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createExpense = async (req, res) => {
  const { name, description, price, categoryName, paidVia } = req.body;

  const user = req.user;

  try {
    const payload = {
      userId: user.id,
      name: name,
      description: description,
      price: price,
      categoryName: categoryName,
      paidVia: paidVia,
      createdBy: user.id,
    };

    const validation = commonValidation.payloadValidation(payload);

    if (validation) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: validation,
      });
    }

    const priceValidation = commonValidation.priceValidation(price);

    if (priceValidation) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: priceValidation,
      });
    }

    const paymentModeValidation = commonValidation.modeOfPayment(paidVia);

    if (paymentModeValidation) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: paymentModeValidation,
      });
    }

    const findCategory = await Category.findOne({ where: { name: categoryName } });

    if (!findCategory) {
      return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
        success: false,
        message: commonConstants.CATEGORY.NO_CATEGORY_FOUND,
      });
    }

    const expense = await Expense.create({
      name: name,
      description: description,
      price: price.toFixed(2),
      categoryName: findCategory.name,
      categoryId: findCategory.id,
      paidVia: paidVia,
      userId: user.id,
      createdBy: user.email,
    });

    return res.status(commonConstants.STATUS_CODE.CREATED).json({
      success: true,
      message: commonConstants.EXPENSE.EXPENSE_CREATED,
      expense: expense,
    });
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteExpense = async (req, res) => {
  const expenseId = req.params.id;

  try {
    const expense = await Expense.findByPk(expenseId);

    if (!expense) {
      return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
        success: false,
        message: commonConstants.ERROR_MESSAGE.NOT_FOUND,
      });
    }

    await expense.destroy();

    return res.status(commonConstants.STATUS_CODE.OK).json({
      success: true,
      message: commonConstants.SUCCESS_MESSAGE.DATA_DELETED,
      expense: expense,
    });
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateExpense = async (req, res) => {
  const expenseId = req.params.id;
  const { name, description, price, categoryName } = req.body;
  const user = req.user;

  const expense = await Expense.findByPk(expenseId);

  try {
    if (expense.userId !== user.id) {
      return res.status(commonConstants.STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: commonConstants.ERROR_MESSAGE.UNAUTHORIZED,
      });
    }

    const payload = {
      name: name,
      description: description,
      price: price,
      categoryName: categoryName,
    };

    const validation = commonValidation.payloadValidation(payload);

    if (validation) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: validation,
      });
    }

    const priceValidation = commonValidation.priceValidation(price);

    if (priceValidation) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: priceValidation,
      });
    }

    if (!expense) {
      return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
        success: true,
        message: commonConstants.EXPENSE.NO_EXPENSE_FOUND,
      });
    }

    const findCategory = await Category.findOne({ where: { name: categoryName } });

    if (!findCategory) {
      return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
        success: false,
        message: commonConstants.CATEGORY.NO_CATEGORY_FOUND,
      });
    }

    expense.name = name;
    expense.description = description;
    expense.price = price;
    expense.category = findCategory.name;
    expense.categoryId = findCategory.id;

    await expense.save();

    return res.status(commonConstants.STATUS_CODE.OK).json({
      success: true,
      message: commonConstants.EXPENSE.EXPENSE_UPDATED,
      expense: expense,
    });
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
