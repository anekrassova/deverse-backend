import { User } from '../modules/user/model/user.model.js';
import { Post } from '../modules/post/model/post.model.js';
import { Like } from '../modules/post/model/like.model.js';
import { PostComment } from '../modules/post/model/post_comment.model.js';
import { Project } from '../modules/project/model/project.model.js';

export const setupAssociations = () => {
  // USER ↔ POSTS
  User.hasMany(Post, {
    foreignKey: 'user_id',
    as: 'posts',
  });

  Post.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'author',
  });

  // POST ↔ COMMENTS
  Post.hasMany(PostComment, {
    foreignKey: 'post_id',
    as: 'comments',
  });

  PostComment.belongsTo(Post, {
    foreignKey: 'post_id',
    as: 'post',
  });

  // USER ↔ COMMENTS
  User.hasMany(PostComment, {
    foreignKey: 'user_id',
    as: 'comments',
  });

  PostComment.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'author',
  });

  // USER ↔ LIKES
  User.hasMany(Like, {
    foreignKey: 'user_id',
    as: 'likes',
  });

  Like.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // POST ↔ LIKES
  Post.hasMany(Like, {
    foreignKey: 'post_id',
    as: 'likes',
  });

  Like.belongsTo(Post, {
    foreignKey: 'post_id',
    as: 'post',
  });

  // USER ↔ PROJECTS
  User.hasMany(Project, {
    foreignKey: 'user_id',
    as: 'projects',
  });

  Project.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'owner',
  });
};
