const VerifyUser = (req, res, next) => {
    console.log('in middleware' + req.url);

    if(req.url.includes('/login') || req.url.includes('/register') || req.url.includes('/test') ){
        return next();
    }
    const logged = req.signedCookies.IsLogin;
    if (logged === "true"){
        next();
    }
    else{
        console.log('User not logged in. Redirecting to /login');
        res.redirect("/login");
    }

  };

  module.exports = VerifyUser;
