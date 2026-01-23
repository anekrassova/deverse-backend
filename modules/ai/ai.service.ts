// modules/ai/ai.service.ts
import { GoogleGenAI } from '@google/genai';

export class AiService {
  private client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: 'process.env.GEMINI_TOKEN',
    });
  }

  async generate(prompt: string): Promise<string> {
    const interaction = await this.client.interactions.create({
      model: 'gemini-3-flash-preview',
      input: prompt,
    });

    const outputs = interaction.outputs;
    if (!outputs || outputs.length === 0) {
      return '';
    }

    const lastOutput = outputs[outputs.length - 1];

    if (!('content' in lastOutput) || !Array.isArray(lastOutput.content)) {
      return '';
    }

    const textPart = lastOutput.content.find(
      (part): part is { text: string } => typeof (part as any).text === 'string',
    );

    return textPart?.text ?? '';
  }
}
