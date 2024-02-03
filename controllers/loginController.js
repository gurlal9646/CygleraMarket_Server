require('dotenv').config();
const jwt = require('jsonwebtoken');
const { connect } = require("../utils/DataBase.js");
const { encryptPassword, comparePasswords } = require("../utils/bcrypt.js");
const { Seller } = require("../utils/models/SellerInfo.js");
const ApiResponse = require('../utils/models/ApiResponse.js'); // Importing ApiResponse from the apiResponse.js file
const { Counter } = require("../utils/models/Counter.js");
const {ResponseCode, ResponseMessage,Roles} = require('../utils/Enums.js'); 
const { AccessInfo } = require('../utils/models/AccessInfo.js');


const loginController = async function(request,response){
    const { email , password,roleId } = request.body;
    const defaultRoleId = 0;
    const userRoleId = roleId || defaultRoleId;
    let userId
    if (!await AccessInfo.findOne({ email })) {
        const result = new ApiResponse(ResponseCode.FAILURE, ResponseMessage.NONEXISTINGUSER, ResponseMessage.NONEXISTINGUSERMESSAGE, null);
        response.json(result);
    }
    else{

        const userInfo = await AccessInfo.findOne({ email });
        console.log(await comparePasswords(password,userInfo.password))
        console.log(userRoleId)
        console.log(userInfo.roleId)

        if(userRoleId == 0 && (await comparePasswords(password,userInfo.password))){

            if (userInfo.roleId == Roles.SELLER){

                const token = jwt.sign({
                    userId: userInfo.sellerId,
                    email: userInfo.email,
                    role: userInfo.roleId
                },process.env.SECRET_KEY);
                userId = userInfo.sellerId;
                const result = new ApiResponse(ResponseCode.SUCCESS, ResponseMessage.LOGINUSER, ResponseMessage.LOGINUSERMESSAGE, {token});
                response.json(result);
            }
            if (userInfo.roleId == Roles.BUYER){
                userId = userInfo.buyerId;
                const result = new ApiResponse(ResponseCode.SUCCESS, ResponseMessage.LOGINUSER, ResponseMessage.LOGINUSERMESSAGE, null);
                response.json(result);
            }
            if (userInfo.roleId == Roles.ADMIN){
                
            }
        }
        else if(roleId == Roles.BUYER && comparePasswords(password,userInfo.password)){
            userId = userInfo.buyerId;
            const result = new ApiResponse(ResponseCode.SUCCESS, ResponseMessage.LOGINUSER, ResponseMessage.LOGINUSERMESSAGE, null);
            response.json(result);
    

        }
        else if(userId == Roles.SELLER && comparePasswords(password,userInfo.password)){
            userId = userInfo.sellerId;
            const result = new ApiResponse(ResponseCode.SUCCESS, ResponseMessage.LOGINUSER, ResponseMessage.LOGINUSERMESSAGE, null);
            response.json(result);

        }
        else if(userId === Roles.ADMIN && comparePasswords(password,userInfo.password)){
           

        }
        else{
            console.log("Wrong password")

            const result = new ApiResponse(ResponseCode.FAILURE, ResponseMessage.LOGINFAILED, ResponseMessage.WRONGPASSMESSAGE, null);
            response.json(result);
        }
        
        

    }
}


connect()
    .then((connectedClient) => {
        client = connectedClient;

        console.log("Connected to MongoDB Login router");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);

        process.exit(1); // Exit the application if the database connection fails
    });


module.exports = { loginController };