

 const TokenExpire =((err,req,res, next) => {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token has expired',
        message: 'Please login again to get a new token'
      });
    }
    next(err);
  });

module.exports = TokenExpire;