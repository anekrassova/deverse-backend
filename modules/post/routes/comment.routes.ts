import { Router, Request, Response, NextFunction } from 'express';
import { handleValidation } from '../../../shared/middleware/handleValidation.js';
import passport from '../../../config/passport.js';
import { roles } from '../../../shared/middleware/roles.js';

import { UserRole } from '../../user/model/user.model.js';
