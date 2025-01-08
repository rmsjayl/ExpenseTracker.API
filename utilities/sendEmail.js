const nodeMailer = require("nodemailer");
const commonConstants = require("../common/constants");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

const sendEmail = async (type, email, subject, user) => {
  const transporter = nodeMailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  //PATHS
  const ACCOUNTVERIFICATION = "../template/accountVerification.hbs";
  const RESENDTOKENVERIFICATION = "../template/resendTokenVerification.hbs";
  const FORGOTPASSWORD = "../template/forgotPassword.hbs";

  //TEMPLATES
  const accountVerificationTemplatePath = path.join(__dirname, ACCOUNTVERIFICATION);
  const accountVerificationTemplateSource = fs.readFileSync(accountVerificationTemplatePath, "utf8");
  const accountVerificationEmailTemplate = Handlebars.compile(accountVerificationTemplateSource);

  const resendTokenVerificationTemplatePath = path.join(__dirname, RESENDTOKENVERIFICATION);
  const resendTokenVerificationTemplateSource = fs.readFileSync(resendTokenVerificationTemplatePath, "utf8");
  const resendTokenVerificationEmailTemplate = Handlebars.compile(resendTokenVerificationTemplateSource);

  const forgotPasswordTemplatePath = path.join(__dirname, FORGOTPASSWORD);
  const forgotPasswordTemplateSource = fs.readFileSync(forgotPasswordTemplatePath, "utf8");
  const forgotPasswordEmailTemplate = Handlebars.compile(forgotPasswordTemplateSource);

  const accountVerificationContent = accountVerificationEmailTemplate({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    fullUrl: process.env.BASE_URL + "/verifyaccount/" + user.id + "/token/" + user.accountVerificationToken,
  });

  const resendTokenVerificationContent = resendTokenVerificationEmailTemplate({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    fullUrl: process.env.BASE_URL + "/verifyaccount/" + user.id + "/token/" + user.accountVerificationToken,
  });

  const forgotPasswordContent = forgotPasswordEmailTemplate({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    fullUrl: process.env.BASE_URL + "/resetpassword/" + user.id + "/" + user.resetPasswordToken,
  });

  switch (type) {
    case commonConstants.EMAIL_TYPE.ACCOUNT_VERIFICATION:
      await transporter
        .sendMail({
          from: process.env.GMAIL_USER,
          to: email,
          subject: subject,
          html: accountVerificationContent,
        })
        .then(() => {
          console.log(commonConstants.EMAIL_RESPONSE.SUCCESS);
        })
        .catch((error) => {
          return `${commonConstants.EMAIL_RESPONSE.ERROR} ${error}`;
        });
      break;
    case commonConstants.EMAIL_TYPE.RESEND_TOKEN_VERIFICATION:
      await transporter
        .sendMail({
          from: process.env.GMAIL_USER,
          to: email,
          subject: subject,
          html: resendTokenVerificationContent,
        })
        .then(() => {
          console.log(commonConstants.EMAIL_RESPONSE.SUCCESS);
        })
        .catch((error) => {
          return `${commonConstants.EMAIL_RESPONSE.ERROR} ${error}`;
        });
      break;
    case commonConstants.EMAIL_TYPE.FORGOT_PASSWORD:
      await transporter
        .sendMail({
          from: process.env.GMAIL_USER,
          to: email,
          subject: subject,
          html: forgotPasswordContent,
        })
        .then(() => {
          console.log(commonConstants.EMAIL_RESPONSE.SUCCESS);
        })
        .catch((error) => {
          return `${commonConstants.EMAIL_RESPONSE.ERROR} ${error}`;
        });
      break;

    default:
      break;
  }
};

module.exports = sendEmail;
