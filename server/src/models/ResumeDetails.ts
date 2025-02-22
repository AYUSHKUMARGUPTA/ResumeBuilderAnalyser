import mongoose from 'mongoose';

// Experience Schema
const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  duration: { type: String, required: true },
  responsibilities: [{ type: String, maxlength: 500 }] // Changed to an array of strings
});

// Project Schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true, maxlength: 500 },
  tech_stack: [{ type: String, required: true }] // Changed to an array of strings
});

// Education Schema
const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, maxlength: 500 }
});

// Resume Schema
const resumeSchema = new mongoose.Schema({
  account_id: { type: String, required: true},
  resumeName: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, match: /^\S+@\S+\.\S+$/ },
  phone: { type: String, required: true },
  linkedin: { type: String, required: true, match: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/i },
  github: { type: String, required: true, match: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/i },
  portfolio: { type: String, match: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/i },
  education: [educationSchema],
  skills: [{ type: String, required: true }], 
  experience: [experienceSchema],
  projects: [projectSchema],
  certifications: [{ type: String, maxlength: 500, required: true }] 
});

// Create model for Resume
const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
