// // utils/nodemailer.js
// const nodemailer = require("nodemailer");
// require('dotenv').config()
// // Create a transporter using Gmail's SMTP server
// const transporter = nodemailer.createTransport({
//   service: 'gmail',  // You can use other services like 'smtp.mailtrap.io', 'sendgrid', etc.
//   auth: {
//     user: process.env.EMAIL, // Replace with your email
//     pass: process.env.PASSWORD // Replace with your email password or app-specific password if 2FA is enabled
//   }
// });

// // Send email notification
// const sendEmailNotification = (toEmail, subject, text) => {
//   const mailOptions = {
//     from: process.env.EMAIL,
//     to: toEmail,
//     subject: subject,
//     html:html
//   };

//   // Send email
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log("Error sending email:", error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
// };

// module.exports = sendEmailNotification;
// utils/nodemailer.js
const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

const sendEmailNotification = (toEmail, subject, html) => { // ✅ rename 'text' to 'html'
  const mailOptions = {
    from: process.env.EMAIL,
    to: toEmail,
    subject: subject,
    html: html // ✅ now this works correctly
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendEmailNotification;
