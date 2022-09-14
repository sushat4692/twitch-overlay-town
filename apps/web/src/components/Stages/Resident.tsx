import React from "react";
import { useResidentValue } from "@/state/Resident";
import { Building } from "@/components/Stages/Building";

export const Resident: React.FC = () => {
  const residents = useResidentValue();

  return (
    <>
      {residents.map((resident) => (
        <Building key={resident.user_id} resident={resident} />
      ))}
    </>
  );
};
