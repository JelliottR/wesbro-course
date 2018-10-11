const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto = require('crypto');
const promisfy = require('es6-promisify');

exports.login = passport.authenticate('local', {
   failureRedirect: '/login',
   failureFlash: 'Failed Login!',
   successRedirect: '/',
   successFlash: 'You are now logged in!'
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are now logged out!');
    res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }

    req.flash('error', 'Oops! You must be logged in to do that!');
    res.redirect('/login');
};

exports.forgot = async (req, res) => {
  const user = await User.findOne({email: req.body.email});
  if(!user){
      req.flash('success', 'If this email has been registered, a password reset has been mailed to you.');
      return res.redirect('/login');
  }
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetUrl = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    req.flash('success', `If this email has been registered, a password reset has been mailed to you. ${resetUrl}`);
    res.redirect('/login');
};

exports.reset = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {$gt: Date.now()}
    });

    if (!user){
        req.flash('error', 'Password reset token is invalid or has expired');
        return res.redirect('/login');
    }

    res.render('reset', {title: 'Reset Password'});
};

exports.confirmedPasswords = (req, res, next) => {
    if (req.body.password === req.body['password-confirm']){
        return next();
    }

    req.flash('error', 'Passwords do not match!');
    res.redirect('back');
};

exports.update = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {$gt: Date.now()}
    });

    if (!user){
        req.flash('error', 'Password reset token is invalid or has expired');
        return res.redirect('/login');
    }
    const setPassword = promisfy(user.setPassword, user);
    await setPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    const updatedUser = await user.save();
    await req.login(updatedUser);
    req.flash('success', 'Nice! Your password has been reset! You are now logged in!');
    res.redirect('/');
};