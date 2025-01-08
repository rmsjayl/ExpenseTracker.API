const commonConstants = require("../common/constants");

const ownership = (Model) => async (req, res, next) => {
  const resource = await Model.findByPk(req.params.id);

  if (!resource || resource.userId !== req.user.id) {
    return res.status(commonConstants.STATUS_CODE.FORBIDDEN).json({
      success: false,
      message: commonConstants.ERROR_MESSAGE.FORBIDDEN,
    });
  }

  next();
};

module.exports = { ownership };
