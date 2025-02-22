import { Request, Response, NextFunction } from "express";
import ResumeDetails from "../../models/ResumeDetails";

export const updateResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { account_id } = req.params;
    const updateData = req.body;

    if (!account_id) {
      res.status(400).json({ error: "account_id is required" });
      return;
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      res.status(400).json({ error: "No data provided to update" });
      return;
    }

    const updatedResume = await ResumeDetails.findOneAndUpdate(
      { account_id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedResume) {
      res.status(404).json({ error: "Resume not found" });
      return;
    }

    res.status(200).json({
      message: "Resume updated successfully",
      updatedResume,
    });
  } catch (error) {
    next(error);
  }
};
