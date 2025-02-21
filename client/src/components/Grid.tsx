import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";

// Resume interface
interface Resume {
    _id: string;
    fullName: string;
    resumeName: string;
    downloadUrl: string;
}

// GridProps interface
interface GridProps {
    data: Resume[];
    onRowClick: (rowData:any) => void; 
}

const ResumeGrid: React.FC<GridProps> = ({ data, onRowClick }) => {

    if (!data || data.length === 0) return <p>No resume data available.</p>;

    const columns: GridColDef[] = [
        { field: "fullName", headerName: "Full Name", width: 300 },
        { field: "resumeName", headerName: "Resume Name", width: 300 },
        {
            field: "downloadUrl",
            headerName: "Download",
            width: 150,
            renderCell: () => (
                <Button variant="contained" color="primary">
                    Download
                </Button>
            ),
        },
    ];

    // Map over the data and assign a simple sequence number as the `id`
    // const rows = data.map((resume, index) => ({
    //     _id: resume._id,
    //     index: index + 1, 
    //     fullName: resume.fullName,
    //     resumeName: resume.resumeName,
    //     downloadUrl: resume.downloadUrl,
    // }));

    return (
        <DataGrid
            rows={data}
            columns={columns}
            pagination
            paginationModel={{ page: 0, pageSize: 5 }} 
            pageSizeOptions={[5]}
            getRowId={(row) => row._id}
            onRowClick={(row) => onRowClick(row.row)} 
        />
    );
};

export default ResumeGrid;
