const express = require('express')
const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const router = express.Router(); // a new router object created
const { validationResult } = require('express-validator');


router.post('/signup', async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
    }
    
    const { username, email, password } = req.body; // Destruct the request body to get username, email and pssword from the request body
    try {

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword }); // Create a new instance with provided username, email and password
        await newUser.save(); // Save it to database

        res.status(201).json({ message: 'User created successfully.', user_id: newUser._id }); 
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error }); // Throws an error while creation
    }
});

router.post('/login', async (req, res) => {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ status: false, errors: errors.array() });
      }
  
      const { email, password } = req.body; // Get the login details from the request body
      try {
  
          const user = await User.findOne({ email }); // Find the user using the username  
  
          if (!user || !(await bcrypt.compare(password, user.password))) {
              return res.status(400).json({ status: false, message: 'Invalid Username or password' });
          }
          
          res.status(200).json({ message: 'Login successful.' });
      } catch (error) {
          res.status(500).json({ message: 'Error logging in', error });
      }
});


module.exports = router;

