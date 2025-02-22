import { type RequestHandler } from 'express';

const portfolio: RequestHandler = async (req, res) => {
    const { portfolioContent } = req.body;

    if (!portfolioContent) {
        res.status(400).json({ error: 'Portfolio Content required.' });
        return;
    }

    const prompt = `
    You are an advanced and highly experienced Portfolio Builder specializing in the tech industry. Your task is to generate a fully functional, single-file HTML portfolio that is visually appealing and competitive in the job market.

    The portfolio should target Software Development roles.
    The HTML file should be fully self-contained, including:
    - CSS (for styling) within <style> tags, or inline styles
    - JavaScript (for interactivity) within <script> tags
    - No external dependencies (no separate CSS or JS files)
    - The content of the portfolio should be exactly based on the following details: ${JSON.stringify(portfolioContent)}, formatted properly in HTML.
    - The design should be modern, professional, and responsive.
    - Include sections for About, Projects, Skills, Education, Experience, Certifications, and Contact. Each section should be clearly labeled and visually distinct.
    - Each section should have relevant content based on the provided details.
    - Use placeholder images and text where necessary, but ensure the structure is complete.
    - Ensure that the HTML is well-formed and valid.
    - Replace placeholders with actual content from the provided details.
    - Follow best practices for HTML and CSS, including semantic HTML elements and responsive design techniques.
    - Ensure the CSS includes styles for typography, layout, and color scheme that are visually appealing and consistent.
    - Use CSS Flexbox or Grid for layout to ensure the portfolio is responsive and looks good on all devices.
    - Make sure to add Background colors, fonts, and other design elements should be chosen to create a visually appealing and professional portfolio.
    - After every time whenever a user refreshes a page, if the provided content is same, then always give same result. 

    The response must contain only the complete HTML file—no explanations, placeholders, or additional text.
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