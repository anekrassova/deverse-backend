import { User } from '../../user/model/user.model.js';
import { AiService } from '../ai.service.js';

export class AiFeatureService {
  constructor(private readonly aiService: AiService) {}

  // ВОПРОС-ОТВЕТ С ИИ ПО ТЕМЕ ПРОЕКТА И IT
  async answerQuestion(question: string, requestUser: User) {
    const prompt = `
      You are an AI assistant for a social network for developers.
      Answer only questions related to software development, programming, IT, developer tools,
      career in IT, or the developer social network product context.
      If the question is outside these topics, politely refuse in the same language as the user question.
      Keep the answer concise and useful.
      Do not pretend to know information you do not know.
      Return only the final answer text, without any extra comments.
      Do not use text formatting in the response.
      User question:
      ${question}
      `;

    // реальный запрос к апи раскоментить
    const answer = await this.aiService.generate(prompt);

    // это моковое, закомментить при реальном обращении к апи
    //const answer = 'Это ответ ИИ по теме проекта, программирования или другой IT-теме.';

    return { answer };
  }
}
