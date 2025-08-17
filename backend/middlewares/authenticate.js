import passport from "passport";

export const authenticate = (req, res, next) => {
    console.log("Authentication middleware called");
    console.log("Authorization header:", req.headers.authorization);
    
    passport.authenticate('jwt', (err, user) => {
        console.log("Passport authenticate callback - err:", err, "user:", user ? "Found" : "Not found");
        
        if(err) {
            console.log("Authentication error:", err);
            return next(err);
        }
        
        if(!user) {
            console.log("No user found - authentication failed");
            return res.status(401).json({
                message: 'Unauthorised access no token'
            });
        }
        
        console.log("Authentication successful for user:", user.email);
        req.user = user;
        next();
    })(req, res, next);
}