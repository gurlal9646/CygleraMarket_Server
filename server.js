require("dotenv").config();
const port = process.env.PORT;
const express = require("express");




const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.set("view engine", "ejs");

const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');



const options = {
  definition:{
    openapi:"3.0.0",
    info:{
      title:"Library API",
      version:"1.0.0",
      description:"A Simple Express Library API"
    },
    servers:[
      {
        url:process.env.LOCAL
      },
      {
        url:process.env.REMOTE
      }
    ]
  },
  apis:["./routes/api/*.js"] // path to your files

};
const swaggerSpecs= swaggerJSDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

app.get("docs.json",(request,response)=>{
   response.setHeader("Content-Type","application/json");
   response.send(swaggerSpecs);
})


const apiRouter = require("./routes/api");

// Mount routers
app.use("/api", apiRouter);
app.use((req, res, next) => {
  res.render("404");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
