export const generateEmbeddings = async (prompt: string, model: string): Promise<number[]> => {
    try {
        const openaiProxyApiUrl: string = process.env.OPENAI_PROXY_API_URL as string;
        console.error(openaiProxyApiUrl);
        const response = await fetch(openaiProxyApiUrl, {
            method: 'POST',
            body: JSON.stringify({
                model: model,
                input: prompt
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.error(data);
        return data;
    } catch (error: any) {
        throw new Error(`OpenAI API error: ${error.message}`);
    }
}
