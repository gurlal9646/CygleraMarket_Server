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

// Define an enum for email templates




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

        static VALID_OTP_MESSAGE = 'The OTP is correct. Access granted!';
        static INVALID_OTP_MESSAGE = 'The OTP is incorrect. Please try again.';



}

module.exports = { Roles ,ResponseCode ,ResponseSubCode,ResponseMessage };