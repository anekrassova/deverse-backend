import { CustomError } from '../../../shared/errors.js';
import { PostRepository } from '../repository/post.repository.js';
import { assertOwnershipOrAdmin } from '../../../shared/permissions.js';
import { User } from '../../user/model/user.model.js';
import { AiService } from '../../ai/ai.service.js';
import { PostCommentRepository } from '../repository/post_comment.repository.js';

export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly aiService: AiService,
    private readonly postCommentRepository: PostCommentRepository,
  ) {}

  // СОЗДАТЬ ПОСТ
  async createPost(user_id: number, content: string) {
    return await this.postRepository.create({ user_id, content });
  }

  // ПОЛУЧИТЬ ПОСТ ПО АЙДИ
  async getPostById(postId: number, currentUserId?: number) {
    const post = await this.postRepository.readById(postId, currentUserId);

    if (!post) {
      throw new CustomError(404, 'Post not found');
    }

    return post;
  }

  // ПОЛУЧИТЬ ВСЕ ПОСТЫ ПОЛЬЗОВАТЕЛЯ
  async getUsersPosts(user_id: number, currentUserId?: number) {
    return this.postRepository.readAllByUserId(user_id, currentUserId);
  }

  // ПОЛУЧИТЬ САММАРИ ПОСТА
  async getPostSummary(postId: number) {
    const post = await this.postRepository.readById(postId);

    if (!post) {
      throw new CustomError(404, 'Post not found');
    }

    const prompt = `
      Summarize the following post content in 1 short sentences.
      Do not add any new information.
      Use neutral, informative tone.
      Do not change language of the post.
      Post content:
      ${post.content}
      `;

    // реальное обращение к апи (раскомментить при обращении к апи)
    //const postSummary = await this.aiService.generate(prompt);

    // моковая подмена обращения к апи (закомментить при обращени к апи)
    const postSummary = 'Это укороченная версия поста.';

    return { summary: postSummary };
  }

  // УЛУЧШЕНИЕ ПОСТА С ИИ
  async improvePostContent(content: string, requestUser: User) {
    const prompt = `
      Improve the following post content.
      Keep the same language.
      Keep the meaning.
      Make it clearer and more readable.
      Return only improved text, without any additional comments.
      Post content:
      ${content}
      `;

    // реальный запрос к апи раскоментить
    // const improved = await this.aiService.generate(prompt);

    // это моковое, закомментить при реальном обращении к апи
    const improved = 'Это улучшенное содержание поста!';

    return { content: improved };
  }

  // ПОЛУЧИТЬ КОММЕНТАРИИ К ПОСТУ
  async getPostComments(postId: number) {
    const post = await this.postRepository.readById(postId);

    if (!post) {
      throw new CustomError(404, 'Post not found');
    }

    return this.postCommentRepository.readAllByPostId(postId);
  }

  // РЕДАКТИРОВАТЬ КОНТЕНТ ПОСТА
  async updatePostContent(postId: number, content: string, requestUser: User) {
    const post = await this.postRepository.readById(postId);

    if (!post) {
      throw new CustomError(404, 'Post not found');
    }

    assertOwnershipOrAdmin(requestUser, post.user_id);

    return this.postRepository.update(postId, { content });
  }

  // УДАЛИТЬ ПОСТ
  async deletePostById(postId: number, requestUser: User) {
    const post = await this.postRepository.readById(postId);

    if (!post) {
      throw new CustomError(404, 'Post not found');
    }

    assertOwnershipOrAdmin(requestUser, post.user_id);

    await this.postRepository.delete(postId);
  }
}
