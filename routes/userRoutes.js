const express = require('express')
const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const router = express.Router(); 
const { validationResult } = require('express-validator');


router.post('/signup', async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
    }

    // Destruct the request body to get username, email and pssword from the request body
    const { username, email, password } = req.body; 
    try {

        // Hashing the password before saving it.
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new instance with provided username, email and password
        const newUser = new User({ username, email, password: hashedPassword }); 
        // Saving the data mongo
        await newUser.save(); 

        res.status(201).json({ message: 'User created successfully.', user_id: newUser._id }); 
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error }); 
    }
});

router.post('/login', async (req, res) => {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ status: false, errors: errors.array() });
      }
  
      // Get the login details from the request body
      const { email, password } = req.body; 
      try {
  
        // Find the user using the email  
          const user = await User.findOne({ email }); 
  
          if (!user || !(await bcrypt.compare(password, user.password))) {
              return res.status(400).json({ status: false, message: 'Invalid Username or password' });
          }
          
          res.status(200).json({ message: 'Login successful.' });
      } catch (error) {
          res.status(500).json({ message: 'Error logging in', error });
      }
});


module.exports = router;

