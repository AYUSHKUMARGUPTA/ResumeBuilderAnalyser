import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

// GridProps interface
interface GridProps {
    data: any[];
    onRowClick: (rowData:any) => void; 
    columns: GridColDef[];
}

const ResumeGrid: React.FC<GridProps> = ({ data, columns, onRowClick }) => {

    if (!data || data.length === 0) return <p>No resume data available.</p>;

    return (
        <DataGrid
            rows={data}
            columns={columns}
            initialState={{
                pagination: {
                  paginationModel: { pageSize: 25, page: 0 },
                },
              }}
            getRowId={(row) => row._id}
            onRowClick={(row) => onRowClick(row.row)} 
        />
    );
};

export default ResumeGrid;
