const openaiProxyApiUrl: string = "https://pf5erfmgwx.us-west-2.awsapprunner.com/embeddings";
export const generateEmbeddings = async (prompt: string, model: string): Promise<number[]> => {
    try {
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
