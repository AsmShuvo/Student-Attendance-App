"use client";

import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";  // ⬅️ NEW
import { useState } from "react";

// register all community features once
ModuleRegistry.registerModules([AllCommunityModule]);                     // ⬅️ NEW

function StudentListTable({ studentList = [] }) {
  const [colDefs] = useState([
    { field: "id", filter: true },
    { field: "name", filter: true },
    { field: "address", filter: true },
    { field: "contact", filter: true },
  ]);

  console.log("stlist:", studentList);

  return (
    <div
      className="ag-theme-quartz"
      style={{ height: 500, width: "100%" }}
    >
      <AgGridReact rowData={studentList} columnDefs={colDefs} />
    </div>
  );
}

export default StudentListTable;
