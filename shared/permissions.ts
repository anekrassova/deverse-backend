import { User, UserRole } from '../modules/user/model/user.model.js';
import { CustomError } from './errors';

export function assertOwnershipOrAdmin(reqUser: User, targetUserId: number) {
  if (reqUser.role !== UserRole.Admin && reqUser.id !== targetUserId) {
    throw new CustomError(403, 'You do not have permission for this action.');
  }
}
