import JWT from 'passport-jwt';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const JwtStrategy = JWT.Strategy;
const ExtractJwt = JWT.ExtractJwt;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

export const passportAuth = (passport) => {
    try {
        passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
            console.log("🔑 JWT Strategy called with payload:", jwt_payload);
            try {
                const user = await User.findById(jwt_payload.id);
                console.log("👤 User lookup result:", user ? `Found: ${user.email}` : "Not found");
                if(!user) {
                    console.log("❌ User not found in database for ID:", jwt_payload.id);
                    done(null, false);
                } else {
                    console.log("✅ User authenticated successfully:", user.email);
                    done(null, user);
                }
            } catch (dbError) {
                console.log("❌ Database error during authentication:", dbError);
                done(dbError, false);
            }
        }));
    } catch(err) {
        console.log("Passport strategy setup error:", err);
        throw err;
    }
}