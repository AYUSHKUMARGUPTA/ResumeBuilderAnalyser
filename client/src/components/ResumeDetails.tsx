import React, { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import { 
  Container, TextField, Button, Typography, Grid, Box, Accordion, AccordionSummary, AccordionDetails, IconButton 
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";


interface Experience {
  company: string;
  role: string;
  duration: string;
  responsibilities: string;
}

interface Education {
  institution: string;
  degree: string;
  duration: string;
}

interface Project {
  title: string;
  description: string;
  tech_stack: string;
}

interface FormData {
  account_id: string;
  resumeName: string;
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: string[];
  certifications: string;
}

const ResumeDetails: React.FC = () => {
  
  const { account } = useAuth(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    account_id: account?._id  || "",
    resumeName: "",
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
    education: [{ institution: "", degree: "", duration: "" }],
    experience: [{ company: "", role: "", duration: "", responsibilities: "" }],
    projects: [{ title: "", description: "", tech_stack: "" }],
    skills: [],
    certifications: "",
  });


  useEffect(() => {
    if (account?._id) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        account_id: account._id, 
      }));
    }
  }, [account]);
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number,
    fieldName?: keyof FormData
  ) => {
    if (index !== undefined && fieldName) {
      const updatedFieldData = [...(formData[fieldName] as any[])];
      updatedFieldData[index] = { ...updatedFieldData[index], [e.target.name]: e.target.value };
      setFormData({ ...formData, [fieldName]: updatedFieldData });
    } else if (e.target.name === "skills") {
      // Handle comma separated skills input
      const updatedSkills = e.target.value.split(',').map(skill => skill.trim());
      setFormData({ ...formData, skills: updatedSkills });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleAddEntry = (fieldName: keyof FormData, entry: any) => {
    setFormData({ ...formData, [fieldName]: [...(formData[fieldName] as any[]), entry] });
  };

  const handleRemoveEntry = (fieldName: keyof FormData, index: number) => {
    const updatedFieldData = [...(formData[fieldName] as any[])];
    updatedFieldData.splice(index, 1);
    setFormData({ ...formData, [fieldName]: updatedFieldData });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data Being Sent:", formData);
    try {
      const response = await axios.post("http://localhost:8080/api/submit", formData);
      console.log("Resume Data Submitted:", response.data);
      alert("Resume details submitted successfully!");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "An error occurred while submitting your resume details.");
      console.error("Error submitting resume data:", error);
    }
    navigate('/resume-builder');
    
  };

  const handleAddProject = () => {
    const newProject = { title: "", description: "", tech_stack: "" };
    handleAddEntry("projects", newProject);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: "center", my: 3 }}>
        <Typography variant="h4" gutterBottom>
          Resume Details
        </Typography>
        <Typography variant="body1">
          Please fill in the following details to generate your resume.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Resume Name" name="resumeName" value={formData.resumeName} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth type="email" label="Email" name="email" value={formData.email} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth type="tel" label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth type="url" label="LinkedIn Profile" name="linkedin" value={formData.linkedin} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth type="url" label="GitHub Profile" name="github" value={formData.github} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth type="url" label="Portfolio Website" name="portfolio" value={formData.portfolio} onChange={handleChange} required/>
          </Grid>

          {/* Education Section */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Education</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {formData.education.map((edu, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item xs={12}><TextField fullWidth label="Institution" name="institution" value={edu.institution} required onChange={(e) => handleChange(e, index, "education")} /></Grid>
                    <Grid item xs={12}><TextField fullWidth label="Degree" name="degree" value={edu.degree} required onChange={(e) => handleChange(e, index, "education")} /></Grid>
                    <Grid item xs={12}><TextField fullWidth label="Duration" name="duration" value={edu.duration} required onChange={(e) => handleChange(e, index, "education")} /></Grid>
                    <IconButton onClick={() => handleRemoveEntry("education", index)}><DeleteIcon /></IconButton>
                  </Grid>
                ))}
                <Button fullWidth variant="outlined" onClick={() => handleAddEntry("education", { institution: "", degree: "", duration: "" })}>
                  Add More Education
                </Button>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Work Experience Section */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Work Experience</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {formData.experience.map((exp, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item xs={12}><TextField fullWidth label="Company" name="company" value={exp.company} required onChange={(e) => handleChange(e, index, "experience")} /></Grid>
                    <Grid item xs={12}><TextField fullWidth label="Role" name="role" value={exp.role} required onChange={(e) => handleChange(e, index, "experience")} /></Grid>
                    <Grid item xs={12}><TextField fullWidth label="Duration" name="duration" value={exp.duration} required onChange={(e) => handleChange(e, index, "experience")} /></Grid>
                    <Grid item xs={12}><TextField fullWidth label="Responsibilities" name="responsibilities" value={exp.responsibilities} required onChange={(e) => handleChange(e, index, "experience")} /></Grid>
                    <IconButton onClick={() => handleRemoveEntry("experience", index)}><DeleteIcon /></IconButton>
                  </Grid>
                ))}
                <Button fullWidth variant="outlined" onClick={() => handleAddEntry("experience", { company: "", role: "", duration: "", responsibilities: "" })}>
                  Add More Experience
                </Button>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Projects Section */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Projects</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {formData.projects.map((proj, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Project Title"
                        name="title"
                        value={proj.title}
                        onChange={(e) => handleChange(e, index, "projects")}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Project Description"
                        name="description"
                        value={proj.description}
                        onChange={(e) => handleChange(e, index, "projects")}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Tech Stack"
                        name="tech_stack"
                        value={proj.tech_stack}
                        onChange={(e) => handleChange(e, index, "projects")}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                    <IconButton onClick={() => handleRemoveEntry("projects", index)}><DeleteIcon /></IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleAddProject}
                >
                  Add More Projects
                </Button>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Skills Section */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Technical Skills (comma separated)"
              name="skills"
              value={formData.skills.join(", ")} // Display as comma-separated string
              onChange={handleChange} // Handle input change
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Certifications" name="certifications" value={formData.certifications} onChange={handleChange} required />
          </Grid>
          
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="primary" type="submit">Submit</Button>
          </Grid>
        </Grid>
      </form>

      {errorMessage && <Typography color="error" variant="body2" sx={{ mt: 2 }}>{errorMessage}</Typography>}
    </Container>
  );
}

export default ResumeDetails;
