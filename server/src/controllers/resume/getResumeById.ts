import { Request, Response, NextFunction } from "express";
import ResumeDetails from "../../models/ResumeDetails";

export const getResumeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log("Request received:", req.method, req.url);
    console.log("Request Params:", req.params);

    const { _id } = req.params; // Extract ID from request URL

    if (!_id) {
      console.log("Resume ID is missing!");
      res.status(400).json({ error: "Resume ID is required" });
      return;
    }

    console.log("Fetching resume of resume ID:", _id);
    const resume = await ResumeDetails.findById(_id);

    if (!resume) {
      console.log("No resume found for the given ID");
      res.status(404).json({ error: "Resume not found" });
      return;
    }

    console.log("Resume found:", resume);
    res.status(200).json(resume);
  } catch (error) {
    console.error("Error retrieving resume by ID:", error);
    next(error);
  }
};
