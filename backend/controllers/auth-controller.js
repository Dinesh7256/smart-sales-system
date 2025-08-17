import UserService from "../service/user-service.js";

const userService = new UserService();


const sendErrorResponse = (res, error) => {
    console.error("API Error:", error.message);
    return res.status(500).json({
        success: false,
        message: 'Something went wrong',
        data: {},
        err: 'Internal Server Error'
    });
};

export const signup = async (req, res) => {
    try {
        const response = await userService.signup(req.body);
        return res.status(201).json({
            success: true,
            message: 'Successfully created a new user',
            data: response,
            err: {}
        });
    } catch(error) {
        return sendErrorResponse(res, error);
    }
};

export const login = async (req, res) => {
    try {
        const token = await userService.signin(req.body);
        return res.status(200).json({
            success: true,
            message: 'Successfully logged in',
            data: token,
            err: {}
        });
    } catch(error) {
        return sendErrorResponse(res, error);
    }
};

export const forgotPassword = async (req, res) => {
    try {
        await userService.handleForgotPassword(req.body.email);
        // Always send a generic success response for security
        return res.status(200).json({
            success: true,
            message: 'A password reset link has been sent.',
            err: {}
        });
    } catch(error) {
        return sendErrorResponse(res, error);
    }
};

export const resetPassword = async (req, res) => {
    try {
        await userService.handleResetPassword(req.params.token, req.body.password);
        return res.status(200).json({
            success: true,
            message: 'Password has been successfully reset.'
        });
    } catch(error) {
        // Handle specific error for invalid token
        if (error.message === 'Token is invalid or has expired') {
            return res.status(400).json({ success: false, message: error.message });
        }
        return sendErrorResponse(res, error);
    }
};