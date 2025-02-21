import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useModalStore } from "store/useModalStore";

interface FormData {
  resumeName: string;
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  education: { institution: string; degree: string; duration: string }[];
  experience: { company: string; role: string; duration: string; responsibilities: string }[];
  projects: { title: string; description: string; tech_stack: string }[];
  skills: string[];
  certifications: string;
  account_id?: string;
}

const initialFormData: FormData = {
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
};

const ResumeDetails = () => {
  const { account } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("Resume ID:", id);
  const { rowData } = useModalStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({ ...initialFormData, account_id: account?._id || "" });

  useEffect(() => {
    if (account?._id) setFormData((prev) => ({ ...prev, account_id: account._id }));
  }, [account]);

  useEffect(() => {
    if (id && rowData) {
      setFormData((prev) => ({ ...prev, ...rowData }));
    }
  }, [id, rowData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number,
    fieldName?: keyof FormData
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (index !== undefined && fieldName) {
        const updatedField = [...prev[fieldName] as any[]];
        updatedField[index] = { ...updatedField[index], [name]: value };
        return { ...prev, [fieldName]: updatedField };
      }
      return { ...prev, [name]: name === "skills" ? value.split(",").map((s) => s.trim()) : value };
    });
  };

  const handleEntry = (fieldName: keyof FormData, action: string, index?: number) => {
    setFormData((prev) => {
      const updatedField = [...prev[fieldName] as any[]];
      if (action === "add") updatedField.push(Object.fromEntries(Object.keys(updatedField[0]).map((k) => [k, ""])));
      else updatedField.splice(index!, 1);
      return { ...prev, [fieldName]: updatedField };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/submit", formData);
      alert("Resume details submitted successfully!");
      navigate("/resume-builder");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "An error occurred while submitting your resume.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  const renderDynamicFields = (fieldName: keyof FormData, label: string) => (
    <Accordion key={fieldName}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{label}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {(formData[fieldName] as any[]).map((item, index) => (
          <Grid container key={index}>
            {Object.keys(item).map((key) => (
              <Grid size={{ xs: 12, md: 10 }} key={key}>
                <TextField
                  fullWidth
                  label={key}
                  name={key}
                  value={item[key]}
                  onChange={(e) => handleChange(e, index, fieldName)}
                  required
                />
              </Grid>
            ))}
            <Grid size={{ xs: 12, md: 10 }}>
              <IconButton onClick={() => handleEntry(fieldName, "remove", index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button fullWidth variant="outlined" onClick={() => handleEntry(fieldName, "add")}>
          Add More {label}
        </Button>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Container maxWidth="md">
      <Box textAlign="center" my={3}>
        <Typography variant="h4" gutterBottom>
          Resume Details
        </Typography>
        <Typography variant="body1">Fill in the details to generate your resume.</Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {["resumeName", "fullName", "email", "phone", "linkedin", "github", "portfolio"].map((field) => (
            <Grid size={{ xs: 12, md: 10 }} key={field}>
              <TextField fullWidth label={field} name={field} value={formData[field as keyof FormData] as string} onChange={handleChange} required />
            </Grid>
          ))}
          <Grid size={{ xs: 12, md: 10 }}>
          {renderDynamicFields("education", "Education")}
          {renderDynamicFields("experience", "Experience")}
          {renderDynamicFields("projects", "Projects")}
          </Grid>

          <Grid size={{ xs: 12, md: 10 }}>
            <TextField
              fullWidth
              label="Technical Skills (comma separated)"
              name="skills"
              value={formData.skills.join(", ")}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 10 }}>
            <TextField
              fullWidth
              label="Certifications"
              name="certifications"
              value={formData.certifications}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 10 }}>
            <Button fullWidth variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>

      {errorMessage && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {errorMessage}
        </Typography>
      )}
    </Container>
  );
};

export default ResumeDetails;