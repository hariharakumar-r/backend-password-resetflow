const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../utils/auth');
const nodemailer=require('nodemailer')
require('dotenv').config();

const authController = {
    register: async (request, response) => {
        try {
            //extract detail
            const { name, email, password} = request.body;
            //Check if the user is already registered
            const user = await User.findOne({ email });
            if (user) return response.status(400).json({ error: 'User already exists' });
            //Create a new user

            const hashedPassword = await bcrypt.hash(password, 10);
            
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS, // Use app password here
                },
            });
    
            const message = {
                from: process.env.EMAIL_USER,
                to: email, // Ensure this is defined
                subject: "Account Created Success",
                text: `Account in the Password Reset APP has been created successfully.You can use the following login credentials \n Your Username: ${email} \n Your Password: ${password}`,
            };
    
            await transporter.sendMail(message);

            const newUser = new User({
                name,
                email,
                password: hashedPassword,
            });
            await newUser.save();
            return response.status(201).json({ message: "User Created Successfully" });
        }
        catch (error) {
            response.status(400).json({ error: error.message })
        }

    },
    login:async(request,response)=>{
        try{
            const { email, password } = request.body;
            const user = await User.findOne({ email: email });
            if (!user) return response.status(400).json({ message: 'User does not exist' });
            const passwordIsValid = await bcrypt.compare(password, user.password);
            if (!passwordIsValid) {
                return response.status(400).json({ message: 'Invalid Password' });
            }
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
            console.log(token);
            //store the token in cookies
            response.cookie('token', token, {
                httpOnly: true,
                secure: true, // Ensure cookies are secure in production
                sameSite: 'none', // Required for cross-origin requests
              });
            response.status(201).json({message: "Login Successful"})
        }
        catch (error) {
            response.status(400).json({ error: error.message });

        }
    },
    userInfo: async (request, response) => {
        try {
            //get the user_Id after middleware parsed from token(Auth middleware)
            const userID = request.userID;
            //find the user by ID
            const user = await User.findById(userID).select('-password -_id -__v');
            //return user details
            // return response.status(200).json(user);
            return response.status(200).json({ Name: user.name, Email: user.email });
        }
        catch {
            return response.status(500).json({ message: error.message });
        }
    },
    logout: async (request, response) => {
        try {
            //clear the cookie
            response.clearCookie('token', {
                httpOnly: true,
                secure: true, // Same as the one used when setting the cookie
                sameSite: 'none', // Same as the one used when setting the cookie
              });
              response.status(200).json({ message: 'Logout Successful' });

        }
        catch (error) {
            response.status(400).json({ error: error.message });
        }
    },
    resetPassword: async (request, response) => {
        try {
            const { email } = request.body;
            const user = await User.findOne({ email: email });
    
            if (!user) {
                return response.status(404).json({ message: "User Not Found" });
            }
    
            const token = Math.random().toString(36).slice(-8);
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 360000; // Token expires in 1 hour
            await user.save();
    
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS // Use app password here
                },
            });
    
            const message = {
                from: process.env.EMAIL_USER,
                to: user.email, // Ensure this is defined
                subject: "Password Reset Request",
                text: `You are receiving this email because you (or someone else) have requested a password reset for your account. \n\n Please use the following token to reset your password: ${token} \n\n If you did not request this, please ignore this email.`,
            };
    
            await transporter.sendMail(message);
    
            response.status(200).json({ message: "Password reset email sent successfully!" });
        } catch (error) {
            response.status(500).json({ error: error.message });
        }
    },
    setNewPassword: async (req, res) => {
        try {
          const { token, newPassword } = req.body;
      
          if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required." });
          }
      
          const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }, // Ensure token is not expired
          });
      
          if (!user) {
            return res.status(400).json({ message: "Invalid or expired token." });
          }
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          user.password = hashedPassword; // Hash password before saving (use bcrypt)
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          await user.save();
      
          res.status(200).json({ message: "Password updated successfully!" });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
      
    
    
}


module.exports = authController;