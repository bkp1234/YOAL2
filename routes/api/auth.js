const express = require('express');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
// adding auth midlleware
const auth = require('../../middlleware/auth');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
// we have to extrace the user information so we must import models
const User = require('../../models/User');
//@route   GET api/auth
//@desc    Testing route
//@access  Not Private

//by includeing auth middleware it protects this route
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//@route   POST api/auth
//@desc    Authenticate  User and obtain  token
//@access  Not Private
router.post(
  '/',
  [
    check('email', 'Please include valid email').isEmail(),
    check('password', 'Please enter a password with min 6').exists()
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // we will input in POSTMAN body raw
    const { email, password } = req.body;
    // here we will  check existingusers
    //encrypt password,gravatar

    // to check
    try {
      let user = await User.findOne({ email }); // User is model

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'invalid credentials' }] });
        // error will be added like array
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'invalid credentials' }] });
        // error will be added like array
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),

        { expiresIn: 3600000 },
        // callback function
        (err, token) => {
          if (err) throw err;
          //else
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
