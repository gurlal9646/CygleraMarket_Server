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
}

class ResponseMessage{

        static EXISTINGUSER = 'USER_ALREADY_EXISTS';
        static EXISTINGUSERMESSAGE = 'User with this email already exists';
        static NEWUSER = 'REGISTERED_SUCCESSFULLY';
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
        static PRODUCTDELETED = 'Product deleted successfully';
        static PRODUCTNOTFOUND = 'Product not found';
        static PRODUCTNOTDELETED = 'Product not deleted';




}

module.exports = { Roles ,ResponseCode ,ResponseSubCode,ResponseMessage };