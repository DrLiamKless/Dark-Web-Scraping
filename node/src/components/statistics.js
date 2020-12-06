import axios from "axios";
import React from "react";
import ByTimePie from "./byTimePie";
import ByLabelsPie from "./byLabelsPie";

export default function Statistics() {

  return (
    <div className="statistics">
      <h1 style={{paddingTop: '100px'}}>Statistics</h1>
        <ByLabelsPie/>
        <ByTimePie/>
    </div>
  );
}
