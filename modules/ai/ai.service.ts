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

    console.debug('[AI] outputs:', JSON.stringify(interaction.outputs, null, 2));

    if (!interaction.outputs?.length) {
      return '';
    }

    const text =
      interaction.outputs
        ?.filter(
          (
            part,
          ): part is Extract<(typeof interaction.outputs)[number], { type: 'text' }> =>
            part.type === 'text',
        )
        .map((part) => part.text)
        .join('') ?? '';

    return text;
  }
}
