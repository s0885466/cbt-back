const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth-controller');
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();

router.post(
  '/signup',
  check('email').isEmail(),
  check('password').isLength({ min: 6 }),
  authController.signup.bind(authController)
);
router.post(
  '/login',
  check('email').isEmail(),
  check('password').isLength({ min: 6 }),
  authController.login.bind(authController)
);
router.get(
  '/refresh',
  authMiddleware,
  authController.refresh.bind(authController)
);

module.exports = router;
