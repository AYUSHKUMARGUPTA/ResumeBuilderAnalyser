import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ResumeGrid from "./Grid"; // Ensure correct import
import Button from "@mui/material/Button";
import CreateIcon from "@mui/icons-material/Create";
import { CircularProgress, Typography } from "@mui/material";
import { useModalStore } from "store/useModalStore";

// Define the Resume interface
interface Resume {
    resume_id: string;
    _id: string;
    fullName: string;
    resumeName: string;
    downloadUrl: string;
}

const ResumeBuilder: React.FC = () => {
    const { setRowData } = useModalStore()
    const navigate = useNavigate();
    const { resume_id } = useParams();
    console.log("Resume ID:", resume_id);
    const [resumeData, setResumeData] = useState<Resume[]>([]);
    const [formData, setFormData] = useState<Resume | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch account_id from localStorage
    const storedaccount_id = localStorage.getItem("_id");
    const account_id = storedaccount_id || null;
    console.log("Fetching account_id from localStorage:", account_id);

    useEffect(() => {
        if (!account_id) return;

        (async () => {
            setLoading(true);
            try {
                console.log(`Fetching data from: http://localhost:8080/api/get-by-account/${account_id}`);
                const response = await axios.get(`http://localhost:8080/api/get-by-account/${account_id}`);
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

    // Fetch resume details if an ID is present
    useEffect(() => {
        console.log("Fetching resume details for ID:", resume_id);
        if (resume_id) {
            axios.get(`http://localhost:8080/api/get-by-id/${resume_id}`)
                .then(response => {
                    if (response.data) {
                        console.log("Fetched Resume:", response.data);
                        setFormData(response.data);
                    } else {
                        console.error("Resume not found. Redirecting...");
                        navigate("/resume-details");
                    }
                })
                .catch(error => {
                    console.error("Error fetching resume data:", error);
                    navigate("/resume-details");
                });
        }
    }, [resume_id, navigate]);

    const handleCreateResume = () => {
        navigate("/resume-details");
    };

    const handleRowClick = (row_data: any) => {
        console.log("Navigating to resume details with ID:", row_data);
        setRowData(row_data)
        navigate(`/resume-details/${row_data._id}`);
    };

    return (
        <div>
            <Button 
                variant="contained" 
                startIcon={<CreateIcon />} 
                onClick={handleCreateResume}
                sx={{ mb: 2 }} // Adds margin below button
            >
                Create New Resume
            </Button>

            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            {!loading && !error && resumeData.length > 0 && (
                <ResumeGrid data={resumeData} onRowClick={handleRowClick}/>
            )}

            {formData && (
                <div>
                    <Typography variant="h6">Resume Details:</Typography>
                    <Typography>Name: {formData.fullName}</Typography>
                    <Typography>Resume Name: {formData.resumeName}</Typography>
                    {/* You can add more fields here as needed */}
                </div>
            )}
        </div>
    );
};

export default ResumeBuilder;
