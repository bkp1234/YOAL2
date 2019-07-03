const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
// we have to bring user model
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
//@route   POST api/users
//@desc    Registration of  user
//@access  Not Private

router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include valid email').isEmail(),
    check('password', 'Please enter a password with min 6').isLength({ min: 6 })
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    // here we will  check existingusers
    //encrypt password,gravatar

    // to check
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'user already exists' }] });
        // error will be added like array
      }

      const avatar = gravatar.url(email, {
        r: 'pg',
        s: '200',
        d: 'mm'
      });

      user = new User({
        // here User is the user model where everything is defined
        name,
        email,
        password,
        avatar
      });

      const salt = await bcrypt.genSalt(10); // 10 rounds of authentication
      user.password = await bcrypt.hash(password, salt);

      await user.save();

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
