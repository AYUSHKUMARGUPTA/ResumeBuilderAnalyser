import { type RequestHandler } from 'express';

const portfolio: RequestHandler = async (req, res) => {
    const { portfolioContent } = req.body;

    if (!portfolioContent) {
        res.status(400).json({ error: 'Portfolio Content required.' });
        return;
    }

    const prompt = `
    You are an expert Portfolio Builder specializing in tech industry portfolios. Your task is to generate a fully functional, single-file HTML portfolio optimized for Software Development roles.

        Requirements:
        - Generate a fully self-contained HTML file that includes:
        - CSS (for styling) inside <style> tags.
        - JavaScript (for interactivity) inside <script> tags.
        - No external dependencies (no separate CSS or JS files).
        - The content must be exactly based on the provided details, formatted properly in HTML:
        ${JSON.stringify(portfolioContent)}
        - Ensure a modern, professional, and responsive design.
        - Use semantic HTML, CSS Flexbox or Grid, and consistent typography & colors.
        - The output must be deterministic—for the same input, the portfolio should always render identically.

        Styling & Design:
            Typography: Professional and readable fonts.
            Color Scheme: Consistent and visually appealing.
            Layout: CSS Grid or Flexbox for responsiveness.
            Effects: Hover effects, smooth scrolling, and interactive navigation.
            Call-to-Action: Buttons for Contact & Project Links.

        Response Format:
            Output only the complete HTML file—no explanations, comments, or placeholders.
            The generated HTML must be valid and properly structured.
            Ensure consistent output across multiple runs for the same input.
    `;

    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gemma2:2b',
                prompt: prompt,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        if (response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            const read = () => {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        res.write('data: [DONE]\n\n');
                        res.end();
                        return;
                    }
                    const chunkStr = decoder.decode(value, { stream: true });
                    res.write(`data: ${chunkStr}\n\n`);
                    read();
                }).catch(error => {
                    console.error('Stream read error:', error);
                    res.status(500).json({ error: 'Something went wrong while reading the stream' });
                });
            };
            read();
        } else {
            throw new Error('Response body is null');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}
export default portfolio