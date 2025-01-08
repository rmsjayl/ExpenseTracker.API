const User = require("../models/user");
const commonConstants = require("../common/constants");

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || commonConstants.PAGINATION.PAGE;
    const limit = parseInt(req.query.limit) || commonConstants.PAGINATION.LIMIT;
    const offset = (page - 1) * limit;

    // Fetch total count and paginated users
    const { count, rows } = await User.findAndCountAll({
      attributes: commonConstants.USER_ATTRIBUTES,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    if (page > totalPages && totalPages > 0) {
      return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: `${commonConstants.PAGINATION.INVALID_PAGE_NUMBER} ${totalPages}`,
      });
    }

    if (count === 0) {
      return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
        success: true,
        message: commonConstants.USER.NO_USER_FOUND,
      });
    }

    return res.status(commonConstants.STATUS_CODE.OK).json({
      success: true,
      message: commonConstants.USER.USER_RETRIEVED,
      totalRecords: count,
      pagination: {
        page: `${page} out of ${totalPages}`,
        limit: limit,
      },
      users: rows,
    });
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: commonConstants.USER_ATTRIBUTES,
    });

    if (!user) {
      return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
        success: true,
        message: commonConstants.USER.NO_USER_FOUND,
      });
    }

    return res.status(commonConstants.STATUS_CODE.OK).json({
      success: true,
      message: commonConstants.USER.USER_RETRIEVED,
      user: user,
    });
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
        success: true,
        message: commonConstants.USER.NO_USER_FOUND,
      });
    }

    await user.destroy();

    return res.status(commonConstants.STATUS_CODE.OK).json({
      success: true,
      message: commonConstants.USER.USER_DELETED,
    });
  } catch (error) {
    return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
