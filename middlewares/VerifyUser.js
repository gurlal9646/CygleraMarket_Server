const VerifyUser = (req, res, next) => {
    if(req.url.includes('/login') || req.url.includes('/register')){
        return next();
    }
    const logged = req.signedCookies.IsLogin;
    if (logged === "true"){
        next();
    }
    else{
        res.redirect("/login");
    }

  };

  module.exports = VerifyUser;
