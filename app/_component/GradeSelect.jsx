"use client";

import React, { useEffect, useState } from "react";
import GlobalApi from "../_services/GlobalApi";

function GradeSelect({ selectedGrade }) {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    GlobalApi.GetAllGrades().then((res) => {
      // Unique grade filtering
      const unique = Array.from(
        new Map(res.data.map((g) => [g.grade, g])).values()
      );

      setGrades(unique);
    });
  }, []);

  return (
    <select
      className="p-3 border rounded-lg text-black"
      defaultValue=""
      onChange={(e) => selectedGrade(e.target.value)}
    >
      <option value="" disabled>
        Select grade
      </option>

      {grades.map((g) => (
        <option key={g.id} value={g.grade}>
          {g.grade}
        </option>
      ))}
    </select>
  );
}

export default GradeSelect;
