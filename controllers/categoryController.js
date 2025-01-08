const Category = require("../models/category");
const commonConstants = require("../common/constants");
const commonValidation = require("../common/validation");

exports.getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || commonConstants.PAGINATION.PAGE;
    const limit = parseInt(req.query.limit) || commonConstants.PAGINATION.LIMIT;
    const offset = (page - 1) * limit;

    const { count, rows } = await Category.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    if (page > totalPages && totalPages > 0) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: commonConstants.PAGINATION.INVALID_PAGE_NUMBER + totalPages,
      });
    }

    if (count === 0) {
      return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
        success: true,
        message: commonConstants.CATEGORY.NO_CATEGORY_FOUND,
        category: rows,
      });
    }

    return res.status(commonConstants.STATUS_CODE.OK).json({
      success: true,
      message: commonConstants.CATEGORY.CATEGORY_RETRIEVED,
      totalRecords: count,
      pagination: {
        page: `${page} out of ${totalPages}`,
        limit,
      },
      category: rows,
    });
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createCategory = async (req, res) => {
  const { name } = req.body;

  const user = req.user;

  try {
    const payload = {
      name: name,
    };

    const validation = commonValidation.payloadValidation(payload);

    if (validation) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: validation,
      });
    }

    const categoryExist = await Category.findOne({
      where: { name: name },
    });

    if (categoryExist) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: commonConstants.CATEGORY.CATEGORY_ALREADY_EXIST,
      });
    }

    const category = await Category.create({
      name: name,
      createdBy: user.email,
    });

    return res.status(commonConstants.STATUS_CODE.CREATED).json({
      success: true,
      message: commonConstants.CATEGORY.CATEGORY_CREATED,
      category: category,
    });
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { name, status } = req.body;

  const user = req.user;

  const category = await Category.findByPk(categoryId);

  try {
    const payload = {
      name: name,
    };

    const validation = commonValidation.payloadValidation(payload);

    if (validation) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: validation,
      });
    }

    const statusValidation = commonValidation.statusValidation(status);

    if (statusValidation) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: statusValidation,
      });
    }

    if (category.name === name && category.status === status) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: commonConstants.CATEGORY.NO_CHANGES,
      });
    }

    const updatedCategory = await category.update({
      name: name,
      status: status || commonConstants.CATEGORY_STATUS.ACTIVE,
      updatedBy: user.email,
    });

    return res.status(commonConstants.STATUS_CODE.OK).json({
      success: true,
      message: commonConstants.CATEGORY.CATEGORY_UPDATED,
      category: updatedCategory,
    });
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
        success: true,
        message: commonConstants.CATEGORY.NO_CATEGORY_FOUND,
      });
    }

    await category.destroy();

    return res.status(commonConstants.STATUS_CODE.OK).json({
      success: true,
      message: commonConstants.CATEGORY.CATEGORY_DELETED,
    });
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
