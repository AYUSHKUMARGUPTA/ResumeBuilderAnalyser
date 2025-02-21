import { Request, Response, NextFunction } from "express";
import ResumeDetails from "../../models/ResumeDetails";

export const getResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log("Request received:", req.method, req.url);
    console.log("Request Params:", req.params);
    const account_id = req.params.account_id; // Extract account_id from request URL

    if (!account_id) {
      console.log("account_id is not present in params!");
      res.status(400).json({ error: "account_id is required" });
      return;
    }

    console.log("Fetching resume for account_id:", account_id);

    const resumes = await ResumeDetails.find({ account_id });
    console.log("Resumes found:", resumes);
    resumes.forEach(resume => console.log("Resume ID found:", resume._id));

    if (!resumes || resumes.length === 0) {
      res.status(404).json({ error: "No resumes found for this account" });
      return;
    }

    res.status(200).json(resumes); // Send the list of resumes as JSON response
  } catch (error) {
    console.error("Error retrieving resumes:", error);
    next(error); // Forward the error to Express error handler
  }
};
