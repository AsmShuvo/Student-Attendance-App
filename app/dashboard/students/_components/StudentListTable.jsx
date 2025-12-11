"use client";

import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchSlashIcon, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import GlobalApi from "@/app/_services/GlobalApi";
import { toast } from "sonner";

const pagination = true;
const paginationPageSize = 500;
const paginationPageSizeSelector = [25, 50, 100];

// register all community features once
ModuleRegistry.registerModules([AllCommunityModule]);

function StudentListTable({ studentList = [], refreshData }) {
  const [searchInput, setSearchInput] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");

  // 🔹 unique grade list from DB
  const gradeOptions = useMemo(() => {
    const set = new Set();
    studentList.forEach((s) => {
      if (s.grade) set.add(s.grade);
    });
    return Array.from(set).sort();
  }, [studentList]);

  // 🔹 delete API
  const deleteRecord = async (id) => {
    try {
      const res = await GlobalApi.DeleteStudentRecord(id);
      if (res) {
        toast("Record deleted");
        refreshData?.();
      }
    } catch (err) {
      console.error(err);
      toast("Failed to delete record");
    }
  };

  // 🔹 action buttons
  const customBtns = (props) => {
    const id = props?.data?.id;
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon">
            <Trash className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              record from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteRecord(id)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  // 🔹 columns (grade column added)
  const colDefs = useMemo(
    () => [
      { field: "id", headerName: "Id", filter: true },
      { field: "name", headerName: "Name", filter: true },
      { field: "grade", headerName: "Grade", filter: true },
      { field: "address", headerName: "Address", filter: true },
      { field: "contact", headerName: "Contact", filter: true },
      { field: "action", headerName: "Action", cellRenderer: customBtns },
    ],
    []
  );

  // 🔹 grade filter -> rowData
  const filteredRows = useMemo(() => {
    if (!selectedGrade) return studentList;
    return studentList.filter((s) => s.grade === selectedGrade);
  }, [studentList, selectedGrade]);

  return (
    <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
      {/* top controls: search + grade select */}
      <div className="flex flex-wrap gap-3 mb-4">
        {/* Search box */}
        <div className="p-2 rounded-lg max-w-sm border shadow-sm flex gap-2 items-center flex-1">
          <SearchSlashIcon className="w-4 h-4" />
          <input
            type="text"
            className="outline-none w-full text-sm"
            placeholder="Search on anything..."
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* Grade select */}
        <div className="p-2 rounded-lg border shadow-sm flex items-center gap-2">
          <span className="text-sm text-slate-600">Filter by grade:</span>
          <select
            className="border rounded-md px-2 py-1 text-sm text-black"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option value="">All</option>
            {gradeOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <AgGridReact
        rowData={filteredRows}
        columnDefs={colDefs}
        pagination={pagination}
        quickFilterText={searchInput}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
      />
    </div>
  );
}

export default StudentListTable;
