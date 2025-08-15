import React from "react";
import DataTable from "../components/DataTable";
import ConfigTable from "../components/ConfigTable";

const DataPage = () => {
  return (
    <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col space-y-8">
        <ConfigTable />
        <DataTable />
      </div>
    </div>
  );
};

export default DataPage;