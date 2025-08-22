import { UserRepository } from '../repository/index.js';
import sendBasicMail from './email-service.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

class UserService {
    constructor() {
        this.userRepository = UserRepository;
    }

    async signup(data) {
        try {
            const user = await this.userRepository.create(data);
            return user;
        } catch(error) {
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await this.userRepository.findBy({email})
            return user;
        } catch(error) {
            throw error;
        }
    }

    async signin(data) {
        try {
            const user = await this.getUserByEmail(data.email);
            if(!user) {
                throw {
                    message: 'no user found'
                };
            }
            if(!user.comparePassword(data.password)) {
                throw {
                    message: 'incorrect password',
                };
            }
            const token = user.genJWT();
            return token;
        } catch(error) {
            throw error;
        }
    }



async handleForgotPassword(email) {
    try {
        const user = await this.userRepository.findBy({ email });
        if (!user) {
            // We don't throw an error to prevent revealing if a user exists.
            // The controller will send a generic success message.
            console.log('Forgot password request for non-existent user.');
            return;
        }

        const resetToken = user.createPasswordResetToken();
        await user.save(); // Using save() here is okay as it triggers Mongoose middleware

        // Use the correct frontend URL from environment variables
        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const mailBody = `You are receiving this email because you have requested the reset of a password. Please click the link to complete the process: \n\n ${resetURL} \n\nIf you did not request this, please ignore this email.`;

        await sendBasicMail(process.env.EMAIL_ID, user.email, 'Your Password Reset Link', mailBody);

        return true; // Indicate success
    } catch (error) {
        console.error("Error in handleForgotPassword service:", error);
        throw error;
    }
}

async handleResetPassword(token, newPassword) {
    try {
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find the user with a valid, unexpired token
        const user = await this.userRepository.findBy({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new Error('Token is invalid or has expired');
        }

        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        
        await user.save(); // Save the updated user

        return user;
    } catch (error) {
        console.error("Error in handleResetPassword service:", error);
        throw error;
    }
}
}


export default UserService;