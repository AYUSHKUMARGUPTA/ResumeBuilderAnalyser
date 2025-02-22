import express, { Request, Response, NextFunction } from 'express';
import analyze from '../controllers/analyze';
import { submitResume } from "../controllers/resume/submitResume";
import { getResume } from "../controllers/resume/getResume";
import { updateResume } from "../controllers/resume/updateResume";
import checkBearerToken from "../middlewares/check-bearer-token";
import { getResumeById } from "../controllers/resume/getResumeById"; 
import portfolio from '../controllers/portfolio';
const router = express.Router();

router.post('/analyze', [], analyze);
router.post('/portfolio', [], portfolio);
router.post("/submit", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await submitResume(req, res, next);
    } catch (error) {
      next(error); // Forward error to Express error handler
    }
  });
  
  // GET route for fetching resumes by account_id
  router.get("/get-by-account/:account_id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getResume(req, res, next);
    } catch (error) {
      next(error); // Forward error to Express error handler
    }
  });
  
  // PUT route for updating a resume by account_id
  router.put("/put/:account_id", [checkBearerToken], async (req: Request, res: Response, next: NextFunction) => {
    try {
      await updateResume(req, res, next);
    } catch (error) {
      next(error); // Forward error to Express error handler
    }
  });
  
  // GET route for fetching resume details by resume_id
  router.get("/get-by-id/:_id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getResumeById(req, res, next);
    } catch (error) {
      next(error);
    }
  });
export default router;