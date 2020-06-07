const express       = require('express');

const router        = express.Router();

const User = require('../models/user');

const {body}     = require('express-validator/check');

const authControler = require('../controulers/auth');


router.put('/signup',[
    body('email')
    .isEmail()
    .withMessage('please enter a valid email.')
    .custom((value,{req})=>{
        return User.findOne({email:value})
        .then(result=>{
            if(result){
                return Promise.reject('E-mail allready exists!');
            }
        })
    })
    .normalizeEmail(),
    body('password')
    .trim().isLength({min:5}),
    body('name')
    .trim()
    .not()
    .isEmpty()
],authControler.signup);

router.post('/login',authControler.login);

module.exports = router;