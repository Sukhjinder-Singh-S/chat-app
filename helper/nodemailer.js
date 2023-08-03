const nodemailer = require("nodemailer");

const emailContent = (check, mailType, otp) => {
  if (mailType == 1) {
    return `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to MyApp</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
            }
      
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 40px;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
      
            h1 {
              font-size: 24px;
              margin-bottom: 20px;
            }
      
            p {
              margin-bottom: 20px;
            }
      
            .cta-button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #fefeff;
              color: #000000;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to WeChat</h1>
            <p>Dear ${check.name}</p>
            <p>Thank you for signing up for our app. We are excited to have you on board!</p>
            <p>If you have any questions or need assistance, please feel free to contact our support team.</p>
            <p>Best regards,</p>
            <p>WeChat Team</p>
          </div>
        </body>
      </html>
      `;
  } else if (mailType == 2) {
    return `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to MyApp</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
            }
      
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 40px;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
      
            h1 {
              font-size: 24px;
              margin-bottom: 20px;
            }
      
            p {
              margin-bottom: 20px;
            }
      
            .cta-button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #fefeff;
              color: #000000;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Forgot Password</h1>
            <p>Dear ${check.name}</p>
            <p>You're otp to change password is ${otp}</p>
            <p>If you have any questions or need assistance, please feel free to contact our support team.</p>
            <p>Best regards,</p>
            <p>WeChat Team</p>
          </div>
        </body>
      </html>
      `;
  }
};

exports.SENDMAIL = async (check, mailType, otp) => {
  console.log(">>>>>>>>>>> In mail condition  >>>>>>>>>>>>>");
  const mailer = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  
  let subject;
  if (mailType == 1) {
    subject = `Welcome`;
  } else if (mailType == 2) {
    subject = `Forgot Password`;
  }

  await mailer.sendMail({
    from: `WeChat <${process.env.MAIL_USERNAME}>`,
    to: check.email,
    subject: subject,
    html: emailContent(check, mailType, otp),
  });
  console.log(">>>>>>>>>>>>>> Mail send >>>>>>>>>>>>>>>>>>>");
};
