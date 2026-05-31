// modules/ai/ai.service.ts
import { GoogleGenAI } from '@google/genai';

export class AiService {
  private client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: process.env.GEMINI_TOKEN,
    });
  }

  async generate(prompt: string): Promise<string> {
    const interaction = await this.client.interactions.create({
      model: 'gemini-3-flash-preview',
      input: prompt,
    });

    // Для нового steps schema используем output_text как основной способ чтения ответа.
    if (interaction.output_text) {
      return interaction.output_text;
    }

    // Fallback на переходный период, если окружение еще возвращает legacy outputs.
    const legacyOutputs = (interaction as { outputs?: Array<{ type?: string; text?: string }> })
      .outputs;

    if (!legacyOutputs?.length) {
      return '';
    }

    const text = legacyOutputs
      .filter((part) => part.type === 'text' && typeof part.text === 'string')
      .map((part) => part.text as string)
      .join('');

    return text;
  }
}
