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

  // delete function needs the id
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

  // cell renderer can now see deleteRecord via closure
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

  // no need to keep colDefs in state; it's static
  const colDefs = useMemo(
    () => [
      { field: "id", filter: true },
      { field: "name", filter: true },
      { field: "address", filter: true },
      { field: "contact", filter: true },
      { field: "action", cellRenderer: customBtns },
    ],
    [] // customBtns is stable enough; if you want to be strict, include it here
  );

  return (
    <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
      <div className="p-2 mb-4 rounded-lg max-w-sm border shadow-sm flex gap-2 items-center">
        <SearchSlashIcon className="w-4 h-4" />
        <input
          type="text"
          className="outline-none w-full text-sm"
          placeholder="Search on anything..."
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <AgGridReact
        rowData={studentList}
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
