const TokenExpire = require("../Middlewares/TokenExpire");

const CommonServerError =  (err,req,res,next)=>{

    TokenExpire(err, req, res, next);
    if (err && !res.headersSent) {
     res.status(500).json({ "error": "Internal Server Error" });
     return;
    }
}

const AuthserverError = (err, res, next) => {
    if(err && !res.headersSent) {
    res.status(500).json({ "error": "Internal Server Error" });
    }
    next(err);
}


module.exports ={
    CommonServerError,
    AuthserverError
};