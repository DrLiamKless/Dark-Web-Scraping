import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
require('dotenv').config()

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AAAAAA','#800080'];

export default function ByTimePie() {

  const [byTimeData, setByTimeData] = useState([])

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`http://localhost:8080/api/es/data/bytime/`);
      setByTimeData(data);
    })();
  }, []);

  return (
    <>
      {byTimeData && 
        <div className="chart">
          <h3>Pastes By Hours Pie</h3>
          <ResponsiveContainer width="100%" height={300}>
          <PieChart width={400} height={300}>
            <Pie 
                data={byTimeData}
                dataKey="am"
                nameKey="time"
                cx="50%"
                cy="50%"
                innerRadius={50}
                fill="#8884d8"
                label
            >
            {byTimeData.map((entry, index) => 
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
            }    
            </Pie>
            <Tooltip/>
            <Legend/>
          </PieChart>
        </ResponsiveContainer>
        </div>
      }
    </>
  );
}
