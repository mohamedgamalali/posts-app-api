const jwt = require('jsonwebtoken');

const privateKey = 'hellothatisourincriptionpleasedonothackme';

module.exports = (req,res,next)=>{
    const authHeader = req.get('Authorization');
    if(!authHeader){
        const error = new Error('not Authorized!!');
        error.statusCode = 401;
        throw error;
    }
    const token =req.get('Authorization').split(' ')[1];
    
    let decodedToken;
    try{
        decodedToken = jwt.verify(token,privateKey);
    } catch(err){
        if(!err.statusCode){
            err.statusCode =500;
        }
        throw err ;
    }
    if(!decodedToken){
        const error = new Error('not Authorized!!');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};