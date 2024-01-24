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
}

module.exports = { Roles ,ResponseCode ,ResponseMessage };