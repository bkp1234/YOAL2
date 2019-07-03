const express = require('express');
const router = express.Router();
// middleware for authentication
const auth = require('../../middlleware/auth');
const user = require('../../models/User');
const Profile = require('../../models/Userprof');
const { check, validationResult } = require('express-validator');
//@route   GET api/profile/me
//@desc    Get current users profile
//@access  Not PUBLIC

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',

      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile' });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//@route   POST api/profile
//@desc    create or update user prof
//@access  Not PUBLIC
router.post(
  '/',
  [
    auth,
    [
      check('Bookinginfo', 'booking info is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { Bookinginfo, twitter, facebook } = req.body;

    const profilefields = {};
    profilefields.user = req.user.id;
    if (Bookinginfo) profilefields.Bookinginfo = Bookinginfo;

    profilefields.social = {};
    if (twitter) profilefields.social.twitter = twitter;
    if (facebook) profilefields.social.facebook = facebook;

    try {
      // finds by id
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // we can update by findandupdate
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profilefields },
          { new: true }
        );
        return res.json(profile);
      }
      // not created adding new profile
      profile = new Profile(profilefields);
      await profile.save(); // save as model

      res.json(profile);
    } catch (err) {
      console.log(err.messsage);
      res.status(400).send('error in server');
    }
    console.log(profilefields.social.facebook);
    res.send('Hello');
  }
);

//@route   GET api/profiles
//@desc    GET all profiles
//@access  PUBLIC
router.get('/', async (req, res) => {
  try {
    // below user_id is obtained from routes url
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    //if(!profile) return res.status(400).json({ msg: 'There is no profile for this user' });
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//@route   GET api/profile/user/:user_id
//@desc    GET profile by userid
//@access  PUBLIC
router.get('/user/:user_id', async (req, res) => {
  try {
    // below user_id is obtained from routes url
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile)
      return res.status(400).json({ msg: 'There is no profile for this user' });
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//@route   GET api/profile/user/:user_id
//@desc    GET profile by userid
//@access  PUBLIC
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('company', 'Company is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
