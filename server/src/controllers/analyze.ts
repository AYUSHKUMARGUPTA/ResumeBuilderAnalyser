import { type RequestHandler } from 'express';

const analyze: RequestHandler = async (req, res) => {
  const { jd, extractedText } = req.body;

  if (!jd || !extractedText) {
    res.status(400).json({ error: 'Job description and extracted text are required.' });
    return;
  }

  const prompt = `
      You are an advanced and highly experienced Applicant Tracking System (ATS) with specialized knowledge in the tech industry, including but not limited to software engineering, data science, data analysis, big data engineering. Your primary task is to meticulously evaluate resumes based on the provided job description. Considering the highly competitive job market, your goal is to offer the best possible guidance for enhancing resumes.
  
      Responsibilities:
  
      1. Assess resumes with a high degree of accuracy against the job description.
      2. Identify and highlight missing keywords crucial for the role.
      3. Always rovide a percentage match score reflecting the resume's alignment with the job requirements on the scale of 1-100 under application success rate section.
      4. Offer detailed feedback for improvement to help candidates stand out.
      5. Analyze the Resume, Job description and industry trends and provide personalized suggestions for skills, keywords and achievements that can enhance the provided resume.
      6. Provide the suggestions for improving the language, tone and clarity of the resume content.
      7. Provide users with insights into the performance of their resumes. Track the metrics such as - a) Application Success rates b) Views c) engagement. offers valuable feedback to improve the candidate's chances in the job market use your trained knowledge of gemini trained data . Provide a application success rate on the scale of 1-100.
  
      after every time whenever a user refreshes a page, if the provided job description and resume is same, then always give same result. 
  
      Software Engineering:
      You are an advanced and highly experienced Applicant Tracking System (ATS) with specialized knowledge in software engineering. Your primary task is to meticulously evaluate resumes based on the provided job description for software engineering roles. Considering the highly competitive job market, your goal is to offer the best possible guidance for enhancing resumes.
  
      Resume: ${extractedText}
      Description: ${jd}
  
      I want the only response in 5 sections as follows:
      • Job Description Match: \n\n
      • Missing Keywords: \n\n
      • Profile Summary: \n\n
      • Personalized suggestions for skills, keywords and achievements that can enhance the provided resume: \n\n
      • Application Success rates : \n\n
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
export default analyze