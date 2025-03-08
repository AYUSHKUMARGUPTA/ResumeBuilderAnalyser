import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Button from "@mui/material/Button";
import CreateIcon from "@mui/icons-material/Create";
import { Typography } from "@mui/material";
import { useModalStore } from "store/useModalStore";
import { GridColDef } from "@mui/x-data-grid";
import jsPDF from "jspdf";
import ResumeGrid from "components/Grid";
import FullPageCircularProgress from "components/Loader";

const ResumeBuilder: React.FC = () => {
  const { setRowData } = useModalStore();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<Resume[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const storedaccount_id = localStorage.getItem("_id");
  const account_id = storedaccount_id || null;
  console.log("Fetching account_id from localStorage:", account_id);

  useEffect(() => {
    if (!account_id) return;

    (async () => {
      setLoading(true);
      try {
        console.log(
          `Fetching data from: http://localhost:8080/api/get-by-account/${account_id}`
        );
        const response = await axios.get(
          `http://localhost:8080/api/get-by-account/${account_id}`
        );
        if (response.status === 200) {
          console.log("Resume data fetched successfully:", response.data);
          setResumeData(response.data);
        } else {
          setError(`Failed to load resume data: ${response.statusText}`);
        }
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError("Failed to load resume data");
      } finally {
        setLoading(false);
      }
    })();
  }, [account_id]);

  const handleCreateResume = () => {
    navigate("/resume-details");
  };
  
// Define proper types for the Resume structure
interface Education {
  degree: string;
  institution: string;
  duration: string;
}

interface Experience {
  role: string;
  company: string;
  duration: string;
  responsibilities: string | string[];
}

interface Resume {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  education: Education[];
  skills: string[];
  experience: Experience[];
  certifications: string | string[];
}

const handleDownloadResume = (row_data: Resume, event: React.MouseEvent) => {
  setLoading(true);
  event.stopPropagation();
  
  const pdf = new jsPDF();
  const { width: pageWidth } = pdf.internal.pageSize;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let y = 20; // Current y position
  
  // Utility functions
  const safeText = (text: any): string => text ? String(text).trim() : '';
  
  const addText = (text: string, x: number, fontSize = 11, isBold = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", isBold ? "bold" : "normal");
    pdf.text(safeText(text), x, y);
  };
  
  const addSection = (title: string) => {
    // Reduced spacing before section headings
    y += 3;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text(title, margin, y);
    pdf.line(margin, y + 2, pageWidth - margin, y + 2);
    y += 8; // Reduced spacing after section heading
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
  };
  
  const addBullet = (text: string, indent = 0) => {
    if (!text || !text.trim()) return;
    
    const bulletX = margin + indent;
    const textX = bulletX + 5;
    const wrappedText = pdf.splitTextToSize(text, contentWidth - textX);
    
    pdf.text("•", bulletX, y);
    pdf.text(wrappedText, textX, y);
    y += wrappedText.length * 5;
  };
  
  const addRightAligned = (text: string) => {
    const textWidth = pdf.getStringUnitWidth(text) * pdf.getFontSize() / pdf.internal.scaleFactor;
    pdf.text(text, pageWidth - margin - textWidth, y);
  };
  
  // Process responsibilities into an array of strings
  const getResponsibilities = (resp: string | string[]): string[] => {
    if (typeof resp === 'string') {
      return resp.split('.')
        .map(item => item.trim())
        .filter(item => item.length > 0)
        .map(item => item.endsWith('.') ? item : `${item}.`);
    }
    return Array.isArray(resp) ? resp.map(safeText) : [String(resp)];
  };
  
  // Process array or string to array
  const toArray = (value: string | string[]): string[] => {
    if (typeof value === 'string') {
      return value.split(',').map(item => item.trim()).filter(Boolean);
    }
    return Array.isArray(value) ? value.map(safeText) : [String(value)];
  };
  
  // 1. Name (centered, large)
  addText(row_data.fullName, (pageWidth - pdf.getStringUnitWidth(safeText(row_data.fullName)) * 20 / pdf.internal.scaleFactor) / 2, 20, true);
  y += 8; // Reduced spacing after name
  
  // 2. Contact information
  pdf.setFontSize(10);
  const contactFields = [
    { label: 'Email', value: row_data.email },
    { label: 'Phone', value: row_data.phone },
    { label: 'LinkedIn', value: row_data.linkedin },
    { label: 'GitHub', value: row_data.github },
    { label: 'Portfolio', value: row_data.portfolio }
  ].filter(field => field.value);
  
  if (contactFields.length >= 4) {
    // Two column layout
    const mid = Math.ceil(contactFields.length / 2);
    for (let i = 0; i < mid; i++) {
      pdf.text(`${contactFields[i].label}: ${safeText(contactFields[i].value)}`, margin, y + (i * 5)); // Tighter spacing
    }
    
    for (let i = 0; i < contactFields.length - mid; i++) {
      pdf.text(`${contactFields[i + mid].label}: ${safeText(contactFields[i + mid].value)}`, pageWidth / 2, y + (i * 5)); // Tighter spacing
    }
    
    y += Math.max(mid, contactFields.length - mid) * 5 + 2; // Reduced padding after contact section
  } else {
    // Single column
    contactFields.forEach(field => {
      pdf.text(`${field.label}: ${safeText(field.value)}`, margin, y);
      y += 5; // Tighter spacing
    });
    y += 2; // Reduced padding after contact section
  }
  
  // 3. Education
  if (row_data.education?.length) {
    addSection("EDUCATION");
    
    row_data.education.forEach((edu, index) => {
      addText(edu.degree, margin, 11, true);
      y += 5;
      addText(edu.institution, margin);
      addRightAligned(edu.duration);
      
      // Less spacing if not the last education entry
      y += (index === row_data.education.length - 1) ? 6 : 8;
    });
  }
  
  // 4. Skills
  if (row_data.skills?.length) {
    addSection("TECHNICAL SKILLS");
    const skillsText = pdf.splitTextToSize(row_data.skills.map(safeText).join(" • "), contentWidth);
    pdf.text(skillsText, margin, y);
    y += skillsText.length * 5 + 2; // Reduced padding after skills
  }
  
  // 5. Experience
  if (row_data.experience?.length) {
    addSection("PROFESSIONAL EXPERIENCE");
    
    row_data.experience.forEach((exp, index) => {
      addText(exp.role, margin, 11, true);
      y += 5;
      addText(exp.company, margin);
      addRightAligned(exp.duration);
      y += 8; // Reduced spacing
      
      const responsibilities = getResponsibilities(exp.responsibilities);
      responsibilities.forEach((item, i) => {
        addBullet(item, 5);
        // Less spacing between bullet points
        if (i < responsibilities.length - 1) {
          y -= 1; // Slightly decrease spacing between bullet points
        }
      });
      
      // Different spacing based on whether this is the last experience
      y += (index === row_data.experience.length - 1) ? 3 : 5;
    });
  }
  
  // 6. Certifications
  if (row_data.certifications) {
    addSection("CERTIFICATIONS");
    const certs = toArray(row_data.certifications);
    certs.forEach((cert, i) => {
      addBullet(cert);
      // Less spacing between certification bullet points
      if (i < certs.length - 1) {
        y -= 1;
      }
    });
  }
  
  pdf.save(`${safeText(row_data.fullName)}_Resume.pdf`);
  setLoading(false);
};
  const handleDownloadPortfolio = async (row_data: Resume, event: React.MouseEvent) => {
    event.stopPropagation();
    setLoading(true);
    try {
      const portfolioContent = row_data;

      const response = await fetch("http://localhost:8080/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ portfolioContent }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accResult:any = "";
  
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        accResult = lines.reduce((acc, line) => processLine(line, acc), accResult);
      }
  
      // Create a Blob from the result state and trigger a download
      const blob = new Blob([accResult], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${row_data.fullName}_Portfolio.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error during streaming:", error);
    } finally {
      setLoading(false);
    }
  };
  const processLine = (line: string, accumulatedResult: string) => {
    if (line.startsWith("data:")) {
      const data = line.replace("data: ", "").trim();
      if (data === "[DONE]") {
        return accumulatedResult;
      }
      try {
        const parsedData = JSON.parse(data);
        if (parsedData.response) {
          accumulatedResult += parsedData.response;
        }
      } catch (err) {
        console.error("Error parsing JSON chunk:", err);
      }
    }
    return accumulatedResult;
  };
  const handleRowClick = (row_data: any) => {
    setRowData(row_data);
    navigate(`/resume-details/${row_data._id}`);
  };
  const columns: GridColDef[] = [
    { field: "fullName", headerName: "Full Name", width: 300 },
    { field: "resumeName", headerName: "Resume Name", width: 300 },
    {
      field: "downloadUrl",
      headerName: "Export Resume",
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={(event) => handleDownloadResume(params.row, event)}
        >
          Export Resume
        </Button>
      ),
    },
    {
      field: "exportUrl",
      headerName: "Export Portfolio",
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={(event) => handleDownloadPortfolio(params.row, event)}
        >
          Export Portfolio
        </Button>
      ),
    },
  ];
  return (
    <div>
      <Button
        variant="contained"
        startIcon={<CreateIcon />}
        onClick={handleCreateResume}
        sx={{ mb: 2, mt:1 }} // Adds margin below button
      >
        Create New Resume
      </Button>

      {loading && <FullPageCircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && resumeData.length > 0 && (
        <ResumeGrid
          data={resumeData}
          onRowClick={handleRowClick}
          columns={columns}
        />
      )}
    </div>
  );
};

export default ResumeBuilder;
