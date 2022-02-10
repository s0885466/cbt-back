const express = require('express');

const authController = require('../controllers/auth-controller');

const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();

router.post('/signup', authController.signup.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get(
  '/refresh',
  authMiddleware,
  authController.refresh.bind(authController)
);

module.exports = router;
