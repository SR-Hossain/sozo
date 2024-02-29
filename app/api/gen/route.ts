import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(req: Request) {
    return new Response('Not found', { status: 404 });
}

export async function POST(req: Request) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const { prompt } = await req.json();
    try {
        if (GEMINI_API_KEY) {

            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const finalPrompt = `i am generating images. this is the prompt: '${prompt}'. generate 10 different prompts for the prompt, so that 10 different types of images can be generated. The prompts should be separated by this word '\$<sep>\$'.`;
            console.log(finalPrompt);
            const result = await model.generateContent(finalPrompt);
            const response = await result.response;
            const text = response.text();

            const newPrompts = text.split('\$<sep>\$').filter(newPrompt => newPrompt.trim() !== '');

            const newImageUrls = await Promise.all(newPrompts.map(async (newPrompt) => {
                const response = await fetch(`${process.env.IMAGE_GENERATOR_URL}/${newPrompt}`);

                if (response.headers.get('content-type')?.includes('application/json')) {
                    const data = await response.json();
                    return data.image;
                } else {
                    return response.url;
                }
            }));

            return new Response(JSON.stringify({ imageUrls: newImageUrls }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } else {
            console.error('GEMINI_API_KEY is not defined!');
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
