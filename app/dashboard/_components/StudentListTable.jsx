"use client";

import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchSlashIcon, Trash } from "lucide-react";
const pagination = true;
const paginationPageSize = 500;
const paginationPageSizeSelector = [25, 50, 100];

// register all community features once
ModuleRegistry.registerModules([AllCommunityModule]);

const customBtns = (props) => {
  return (
    <Button>
      <Trash />
    </Button>
  );
};

function StudentListTable({ studentList = [] }) {
  const [colDefs] = useState([
    { field: "id", filter: true },
    { field: "name", filter: true },
    { field: "address", filter: true },
    { field: "contact", filter: true },
    { field: "action", cellRenderer: customBtns },
  ]);

  //   console.log("stlist:", studentList);
  const [serchInput, setSearchInput] = useState();

  return (
    <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
      <div className="p-2 mb-4 rounded-lg max-w-sm border shadow-sm flex gap-2">
        <SearchSlashIcon />
        <input
          type="text"
          className="outline-none w-full"
          placeholder="Search on Anything..."
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
      </div>

      <AgGridReact
        rowData={studentList}
        columnDefs={colDefs}
        pagination={pagination}
        quickFilterText={serchInput}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
      />
    </div>
  );
}

export default StudentListTable;
