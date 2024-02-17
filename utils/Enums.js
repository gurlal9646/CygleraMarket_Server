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
        static NODATAFOUND ='No data found';
        static SERVICEDELETED = 'Service deleted';
        static SERVICENOTFOUND = 'Service not found';
        static SERVICENOTDELETED = 'Service not deleted';




}

module.exports = { Roles ,ResponseCode ,ResponseSubCode,ResponseMessage };