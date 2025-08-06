import UserService from "../service/user-service.js";

const userService = new UserService();

 
export const signup = async (req, res) => {
    try {
        const response = await userService.signup({
            businessName: req.body.businessName,
            email: req.body.email,
            password: req.body.password,
            
        });
        return res.status(201).json({
            success: true,
            message: 'Successfully created a new user',
            data: response,
            err: {}
        });
    } catch(err) {
        return res.status(500).json({
            message: 'Something went wrong',
            data: {},
            success: false,
            err: err
        });
    }
}