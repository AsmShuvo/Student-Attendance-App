"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import GlobalApi from "@/app/_services/GlobalApi"; 
import { toast } from "sonner";

function AddNewStudent() {
  const [open, setOpen] = useState(false);
  const [grades, setGrades] = useState([]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    GetAllGradesList();
  }, []);

  const GetAllGradesList = () => {
    GlobalApi.GetAllGrades().then((res) => {
      // console.log(res.data);
      setGrades(res.data);
    });
  };

  const onSubmit = (data) => {
    console.log("Form data : ", data);

    GlobalApi.CreateNewStudent(data).then((res) => {
      console.log("--", res);
      if (res.data) {
        setOpen(false);
        toast("New Student Added");
      }
    });
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>+ Add New Student</Button>
      <Dialog open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="py-2">
                  <label>Full Name</label>
                  <Input
                    placeholder="Ex. John Carry"
                    {...register("name", { required: true })}
                  />
                </div>
                <div className="py-2 flex flex-col">
                  <label>Select Grade</label>
                  <select
                    className="p-3 border rounded-lg"
                    {...register("grade", { required: true })}
                  >
                    {grades?.map((item, index) => (
                      <option key={index} value={item.grade}>
                        {item.grade}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="py-2">
                  <label>Contact Number</label>
                  <Input
                    type="number"
                    placeholder="Ex. 01XXXXXXXXX"
                    {...register("contact")}
                  />
                </div>
                <div className="py-2">
                  <label>Address</label>
                  <Input
                    placeholder="Ex. 123 Exmaple Street, Sylhet, Bangladesh"
                    {...register("address")}
                  />
                </div>
                <div className="flex gap-3 items-center justify-end mt-4">
                  <Button onClick={() => setOpen(false)} variant="ghost">
                    Cancel
                  </Button>
                  <Button type="submit" onClick={() => console.log("Save")}>
                    Save
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewStudent;
