import JWT from 'passport-jwt';
import User from '../models/user.js';

const JwtStrategy = JWT.Strategy;
const ExtractJwt = JWT.ExtractJwt;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'smart-sales-service_secret'
}

export const passportAuth = (passport) => {
    try {
        passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
            console.log("JWT Strategy called with payload:", jwt_payload);
            try {
                const user = await User.findById(jwt_payload.id);
                console.log("User found:", user ? "Yes" : "No");
                if(!user) {
                    console.log("User not found in database");
                    done(null, false);
                } else {
                    console.log("User authenticated successfully");
                    done(null, user);
                }
            } catch (dbError) {
                console.log("Database error:", dbError);
                done(dbError, false);
            }
        }));
    } catch(err) {
        console.log("Passport strategy setup error:", err);
        throw err;
    }
}