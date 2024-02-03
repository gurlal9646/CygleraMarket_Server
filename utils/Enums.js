class Roles {
    static BUYER = 1;
    static SELLER = 2;
    static ADMIN = 10;
}


class ResponseCode{
    static SUCCESS =1;
    static FAILURE = 0;
}

class ResponseMessage{

        static EXISTINGUSER = 'USER_ALREADY_EXISTS';
        static EXISTINGUSERMESSAGE = 'User with this email already exists';
        static NEWUSER = 'REGISTERED_SUCCESSFULLY';
        static NEWUSERMESSAGE = 'User added';
        static NONEXISTINGUSER = 'USER_DOES_NOT_EXISTS';
        static NONEXISTINGUSERMESSAGE = 'User with this email does not exists';
        static LOGINUSER = 'LOGIN_SUCCESSFULL'
        static LOGINUSERMESSAGE ='User logged in.'
        static LOGINFAILED = 'LOGIN_FAILED'
        static WRONGPASSMESSAGE = 'Invalid Password'

}

module.exports = { Roles ,ResponseCode ,ResponseMessage };