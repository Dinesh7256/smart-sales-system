import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        match: [/\S+@\S+\.\S+/]
    },
    password: {
        type: String,
        required: true,
    },
    passwordResetToken:{
        type: String 
    },
    passwordResetExpires: {
        type: Date
    }   
}, {
    timestamps: true 
});

userSchema.pre('save', function (next) {
    const user = this;
    const SALT = bcrypt.genSaltSync(9);
    const encryptedPassword = bcrypt.hashSync(user.password, SALT);
    user.password = encryptedPassword;
    next();
});

userSchema.methods.comparePassword = function compare(password) {
    return bcrypt.compareSync(password, this.password);
}

userSchema.methods.genJWT = function generate() {
    return jwt.sign({id: this._id, email: this.email}, 'smart-sales-service_secret', {
        expiresIn: '5h'
    });
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken; // Return the unhashed token to be sent via email
};

const User = mongoose.model('User', userSchema);

export default User;