class Roles {
    static BUYER = 1;
    static SELLER = 2;
    static ADMIN = 10;
}


class ResponseCode{
    static SUCCESS =1;
    static FAILURE = 0;
}

class ResponseSubCode{
    static USERNOTEXISTS =1;
    static MULTIPLEACCOUNT = 2;
    static EXCEPTION = 100;
}

class EmailTemplate{
    static RESETPASSWORD=`<!DOCTYPE html>
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
    `;;
}

class ResponseMessage{

        static EXISTINGUSERMESSAGE = 'User with this email already exists';
        static NEWUSERMESSAGE = 'User added';
        static NONEXISTINGUSERMESSAGE = 'User with this email does not exists';
        static LOGINUSER = 'LOGIN_SUCCESSFULL'
        static LOGINUSERMESSAGE ='User logged in.'
        static LOGINFAILED = 'LOGIN_FAILED'
        static WRONGPASSMESSAGE = 'Invalid Password';
        static MULTIPLEACCOUNT = 'Multiple account found for the given email';
        static PRODUCTADDED = 'Product added';
        static PRODUCTNOTADDED = 'Product not added';
        static PRODUCTUPDATED = 'Product updated';
        static PRODUCTNOTUPDATED = 'Product not updated';
        static NODATAFOUND ='No data found';
        static PRODUCTDELETED = 'Product deleted';
        static PRODUCTNOTFOUND = 'Product not found';
        static PRODUCTNOTDELETED = 'Product not deleted';

        static SERVICEADDED = 'Service added';
        static SERVICENOTADDED = 'Service not added';
        static SERVICEUPDATED = 'Service updated';
        static SERVICENOTUPDATED = 'Service not updated';
        static SERVICEDELETED = 'Service deleted';
        static SERVICENOTFOUND = 'Service not found';
        static SERVICENOTDELETED = 'Service not deleted';

        static RFAADDED = 'Request for purchase  has been raised. Please wait until admin approves your request';
        static RFAUPDATED = 'Request for purchase  has been updated. Please wait for admin response';
        static RFANOTUPDATED = 'Unable to update request for approval ';

        static PROGRAMADDED = 'Program added';
        static PROGRAMNOTADDED = 'Program not added';
        static PROGRAMUPDATED = 'Program updated';
        static PROGRAMNOTUPDATED = 'Program not updated';
        static PROGRAMDELETED = 'Program deleted';
        static PROGRAMNOTFOUND = 'Program not found';
        static PROGRAMNOTDELETED = 'Program not deleted';

        static CONTRACTADDED = 'Contract added';
        static CONTRACTNOTADDED = 'Contract not added';
        static CONTRACTUPDATED = 'Contract updated';
        static CONTRACTNOTUPDATED = 'Contract not updated';
        static CONTRACTDELETED = 'Contract deleted';
        static CONTRACTNOTFOUND = 'Contract not found';
        static CONTRACTNOTDELETED = 'Contract not deleted';

        static REQUESTSTATUSUPDATED='Purchase request has been updated.';
        static REQUESTSTATUSNOTUPDATED='Purchase request not updated.';




}

module.exports = { Roles ,ResponseCode ,ResponseSubCode,ResponseMessage,EmailTemplate };