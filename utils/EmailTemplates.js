class EmailTemplateType {
  static RESET_PASSWORD = "RESET_PASSWORD";
  static WELCOME_BUYER = "WELCOME_BUYER";
  static WELCOME_SUPPLIER = "WELCOME_SUPPLIER";
  static OTP ="OTP"
  static CHANGE_PASSWORD_CONFIRMATION= "CHANGE_PASSWORD_CONFIRMATION";
}

// Define an array of email templates
const emailTemplates = [
  {
    type: EmailTemplateType.RESET_PASSWORD,
    subject: "Password Reset",
    content: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
        </head>
        <body style="font-family: Arial, sans-serif;">
        
            <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f4f4f4">
                <tr>
                    <td align="center" style="padding: 40px 0;">
                        <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                            <tr>
                                <td style="padding: 40px; text-align: center;">
                                    <h1 style="color: #333333;">Password Reset</h1>
                                    <p style="font-size: 16px; color: #666666; line-height: 1.6;">Dear User,</p>
                                    <p style="font-size: 16px; color: #666666; line-height: 1.6;">You have requested to reset your password. Click the link below to proceed with the password reset:</p>
                                    <p style="font-size: 16px; color: #666666; line-height: 1.6;"><a href="$link" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
                                    <p style="font-size: 16px; color: #666666; line-height: 1.6;">If you did not request this password reset, please ignore this email.</p>
                                    <p style="font-size: 16px; color: #666666; line-height: 1.6;">Thank you,<br>Cyglera Market</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        
        </body>
        </html>
      `,
  },
  {
    type: EmailTemplateType.WELCOME_BUYER,
    subject: "Welcome to Cyglera Market!",
    content: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Cyglera Market!</title>
        </head>
        <body style="font-family: Arial, sans-serif;">
        
            <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f4f4f4">
                <tr>
                    <td align="center" style="padding: 40px 0;">
                        <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                            <tr>
                                <td style="padding: 40px; text-align: center;">
                                    <h1 style="color: #333333;">Welcome to Cyglera Market!</h1>
                                    <p style="font-size: 16px; color: #666666; line-height: 1.6;">Dear $name,</p>
                                    <p style="font-size: 16px; color: #666666; line-height: 1.6;">Welcome to Cyglera Market! We're thrilled to have you onboard.</p>
                                    <p style="font-size: 16px; color: #666666; line-height: 1.6;">Explore our wide range of products and enjoy a seamless shopping experience.</p>
                                    <p style="font-size: 16px; color: #666666; line-height: 1.6;">If you have any questions or need assistance, feel free to reach out to our support team.</p>
                                    <p style="font-size: 16px; color: #666666; line-height: 1.6;">Thank you for choosing Cyglera Market!</p>
                                    <p style="font-size: 16px; color: #666666; line-height: 1.6;">Best regards,<br>Cyglera Market Team</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        
        </body>
        </html>
      `,
  },
  {
    type: EmailTemplateType.WELCOME_SUPPLIER,
    subject: "Welcome to Cyglera Market!",
    content: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Cyglera Market!</title>
      </head>
      <body style="font-family: Arial, sans-serif;">
      
          <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f4f4f4">
              <tr>
                  <td align="center" style="padding: 40px 0;">
                      <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                          <tr>
                              <td style="padding: 40px; text-align: center;">
                                  <h1 style="color: #333333;">Welcome to Cyglera Market!</h1>
                                  <p style="font-size: 16px; color: #666666; line-height: 1.6;">Dear $name,</p>
                                  <p style="font-size: 16px; color: #666666; line-height: 1.6;">Welcome to Cyglera Market! We're delighted to have you as our supplier.</p>
                                  <p style="font-size: 16px; color: #666666; line-height: 1.6;">As a supplier on our platform, you'll benefit from:</p>
                                  <ul style="font-size: 16px; color: #666666; line-height: 1.6; text-align: left; margin-left: 30px;">
                                      <li>Access to a wide network of buyers, expanding your market reach.</li>
                                      <li>Efficient order management tools, streamlining your processes.</li>
                                      <li>Insights and analytics to help you understand market trends and optimize your offerings.</li>
                                      <li>Dedicated support from our team to assist you every step of the way.</li>
                                  </ul>
                                  <p style="font-size: 16px; color: #666666; line-height: 1.6;">If you have any questions or need assistance regarding your supplier account, feel free to reach out to our support team.</p>
                                  <p style="font-size: 16px; color: #666666; line-height: 1.6;">Thank you for partnering with Cyglera Market!</p>
                                  <p style="font-size: 16px; color: #666666; line-height: 1.6;">Best regards,<br>Cyglera Market Team</p>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      
      </body>
      </html>
    `,
  },
  {
    type: EmailTemplateType.OTP,
    subject: "Your One-Time Password (OTP)",
    content: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your One-Time Password (OTP)</title>
        </head>
        <body style="font-family: Arial, sans-serif;">
        
            <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f4f4f4">
                <tr>
                    <td align="center" style="padding: 40px 0;">
                        <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                            <tr>
                                <td style="padding: 40px; text-align: center;">
                                    <p style="font-size: 16px; color: #666666; line-height: 1.6;">Dear User,</p>
                                    <p style="font-size: 16px; color: #666666; line-height: 1.6;">Your One-Time Password (OTP) is: <strong>$otp</strong></p>
                                    <p style="font-size: 16px; color: #666666; line-height: 1.6;">This OTP is valid for a single use and expires shortly.</p>
                                    <p style="font-size: 16px; color: #666666; line-height: 1.6;">If you did not request this OTP, please ignore this email.</p>
                                    <p style="font-size: 16px; color: #666666; line-height: 1.6;">Thank you for using our service!</p>
                                    <p style="font-size: 16px; color: #666666; line-height: 1.6;">Best regards,<br>Cyglera Market Team</p>
                                 </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        
        </body>
        </html>
      `,
},
{
    type: EmailTemplateType.CHANGE_PASSWORD_CONFIRMATION,
    subject: "Password Change Confirmation",
    content: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Change Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif;">
      
          <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f4f4f4">
              <tr>
                  <td align="center" style="padding: 40px 0;">
                      <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                          <tr>
                              <td style="padding: 40px; text-align: center;">
                                  <h1 style="color: #333333;">Password Change Confirmation</h1>
                                  <p style="font-size: 16px; color: #666666; line-height: 1.6;">Dear User,</p>
                                  <p style="font-size: 16px; color: #666666; line-height: 1.6;">Your password has been successfully changed.</p>
                                  <p style="font-size: 16px; color: #666666; line-height: 1.6;">If you did not request this change, please contact our support team immediately.</p>
                                  <p style="font-size: 16px; color: #666666; line-height: 1.6;">Thank you.</p>
                                  <p style="font-size: 16px; color: #666666; line-height: 1.6;">Best regards,<br>Cyglera Market</p>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      
      </body>
      </html>
    `,
}


];

const getEmailTemplate = (templateType) => {
  const template = emailTemplates.find((item) => item.type === templateType);
  if (!template) {
    throw new Error("Template type not found");
  }
  return template;
};

module.exports = { EmailTemplateType, getEmailTemplate };
