const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Profile = require("../models/profileModel");

exports.createUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();

        const newProfile = new Profile({
            userId: newUser._id,
            fullName: username, 
            bio: "",
            location: "",
            profilePicture: ""
        });
        await newProfile.save();

        res.status(200).json({ message: "User created successfully", userId: newUser._id });
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: e.message });
    }
};




exports.getUser = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({users: users});
    } catch (e) {
        res.status(400).json({erro: e});
    }
}

exports.login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({error: "No user found"});
        }
        const isMatched = await bcrypt.compare(password,user.password);

        if(!isMatched) {
            return res.status(400).json({error: "Password incorrect"});
        }

        const token = jwt.sign({user_id: user._id, email: email}, "secret_token", {
            expiresIn: "1h"
        })

        return res.status(200).json({
            token: token,
        userId : user._id.toString(),
    email:user.email
}); 


    } catch(e) {
        console.log(e)
        res.status(400).json({error: e});
    }
}

exports.logout = async (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
  };
  
  exports.delete = async (req, res) => {
    const { email } = req.body;
    
    try {
      await User.findOneAndDelete({ email });
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
  };
  
