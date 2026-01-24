import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../modules/user/repository/user.repository.js';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
};

const userRepository = new UserRepository();

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await userRepository.findById(jwtPayload.userId);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }),
);

export default passport;
