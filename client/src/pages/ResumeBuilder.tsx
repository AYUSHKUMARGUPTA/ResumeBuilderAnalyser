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
interface Resume {
  resume_id: string;
  _id: string;
  downloadUrl: string;
  resumeName: string;
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  education: { institution: string; degree: string; duration: string }[];
  experience: {
    company: string;
    role: string;
    duration: string;
    responsibilities: string;
  }[];
  projects: { title: string; description: string; tech_stack: string }[];
  skills: string[];
  certifications: string;
  account_id?: string;
}

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
  const handleDownloadResume = (row_data: Resume, event: React.MouseEvent) => {
    setLoading(true);
    event.stopPropagation();
    const pdf = new jsPDF();
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(row_data.fullName, 10, 20);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Email: ${row_data.email}`, 10, 30);
    pdf.text(`Phone: ${row_data.phone}`, 10, 40);
    pdf.text(`LinkedIn: ${row_data.linkedin}`, 10, 50);
    pdf.text(`GitHub: ${row_data.github}`, 10, 60);
    pdf.text(`Portfolio: ${row_data.portfolio}`, 10, 70);

    let yOffset = 80;

    // Education Section
    pdf.setFont("helvetica", "bold");
    pdf.text("Education", 10, yOffset);
    pdf.setFont("helvetica", "normal");
    yOffset += 10;
    row_data.education.forEach((edu) => {
      pdf.text(
        `${edu.degree}, ${edu.institution} (${edu.duration})`,
        10,
        yOffset
      );
      yOffset += 10;
    });

    // Skills Section
    yOffset += 10;
    pdf.setFont("helvetica", "bold");
    pdf.text("Technical Skills", 10, yOffset);
    pdf.setFont("helvetica", "normal");
    yOffset += 10;
    pdf.text(row_data.skills.join(", "), 10, yOffset);
    yOffset += 10;

    // Experience Section
    yOffset += 10;
    pdf.setFont("helvetica", "bold");
    pdf.text("Experience", 10, yOffset);
    pdf.setFont("helvetica", "normal");
    yOffset += 10;
    row_data.experience.forEach((exp) => {
      pdf.text(`${exp.role}, ${exp.company} (${exp.duration})`, 10, yOffset);
      yOffset += 6;
      pdf.text(exp.responsibilities, 10, yOffset, { maxWidth: 180 });
      yOffset += 12;
    });

    // Certifications Section
    yOffset += 10;
    pdf.setFont("helvetica", "bold");
    pdf.text("Certifications", 10, yOffset);
    pdf.setFont("helvetica", "normal");
    yOffset += 10;
    pdf.text(row_data.certifications, 10, yOffset);

    pdf.save(`${row_data.fullName}_Resume.pdf`);
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
