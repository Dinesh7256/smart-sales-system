import passport from "passport";

export const authenticate = (req, res, next) => {
    console.log('🔐 Authentication attempt - Headers:', req.headers.authorization ? 'Present' : 'Missing');
    
    passport.authenticate('jwt', (err, user) => {
        if (err) {
            console.log('❌ Authentication error:', err);
            return next(err);
        }
        if (!user) {
            console.log('❌ Authentication failed - No user found');
            return res.status(401).json({
                message: 'Unauthorised access no token'
            });
        }
        console.log('✅ Authentication successful for user:', user._id);
        req.user = user;
        next();
    })(req, res, next);
};