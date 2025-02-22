import { Request, Response, NextFunction } from "express";
import ResumeDetails from "../../models/ResumeDetails";

export const submitResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
    
    const {
      account_id,
      resumeName,
      fullName,
      email,
      phone,
      linkedin,
      github,
      portfolio,
      education,
      skills,
      experience,
      projects,
      certifications,
    } = req.body;

    // Validate required fields
    if (!account_id || !fullName || !email || !phone || !linkedin || !github || !education || !skills) {
      console.log("Missing required fields:", {
        account_id,
        resumeName,
        fullName,
        email,
        phone,
        linkedin,
        github,
        education,
        skills
      });
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Create the resumeDetails document
    const resumeDetails = new ResumeDetails({
      account_id: account_id,
      resumeName,
      fullName,
      email,
      phone,
      linkedin,
      github,
      portfolio,
      education,
      skills,
      experience,
      projects,
      certifications,
    });

    // Save the resume to the database
    await resumeDetails.save();

    res.status(201).json({
      message: "Resume submitted successfully",
      resumeDetails,
    });
  } catch (error) {
    console.error("Error submitting resume:", error);
    next(error);
  }
};
