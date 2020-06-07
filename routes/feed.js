const express    = require('express');
const {body}     = require('express-validator/check');
const jwt = require('jsonwebtoken');
const router     = express.Router();

const feedContruler = require('../controulers/feed');

const isAuth = require('../middlewere/isAuth');


router.get('/posts',isAuth,feedContruler.getPosts);

router.post('/posts',isAuth,[
  body('title')
  .trim()
  .isLength({min:5}),
  body('content')
  .trim()
  .isLength({min:5})
],feedContruler.creatPost);

router.get('/post/:id',isAuth,feedContruler.getSinglePost);

router.put('/post/:id',[
  body('title')
  .trim()
  .isLength({min:5}),
  body('content')
  .trim()
  .isLength({min:5})
],isAuth,feedContruler.putEdit);

router.delete('/post/:postId',isAuth,feedContruler.deletePost);

module.exports = router ;
