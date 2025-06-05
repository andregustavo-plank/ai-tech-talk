import OpenAI from 'openai';

export const OPENAI_MODELS = {
    GPT_3_5_TURBO: 'gpt-3.5-turbo',
    GPT_4: 'gpt-4',
    GPT_4_TURBO: 'gpt-4-turbo',
    GPT_4_O: 'gpt-4o',
    GPT_4_O_MINI: 'gpt-4o-mini',
};

export const generateCompletion = async (prompt: string, model: string = OPENAI_MODELS.GPT_3_5_TURBO): Promise<string> => {
    try {
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await client.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: model,
            temperature: 0.1,
        });

        return completion.choices[0]?.message?.content || 'No response generated';
    } catch (error: any) {
        throw new Error(`OpenAI API error: ${error.message}`);
    }
}
