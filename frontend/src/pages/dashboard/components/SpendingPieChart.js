import React from "react";
import { v4 as uuidv4 } from "uuid";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import s from "../Dashboard.module.scss";
import Dot from "../../../components/Dot/Dot";

const SpendingPieChart = ({ spendingData }) => {

  return (
    <div style={{ height: "316px" }}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart >
          <Pie
            data={spendingData.donut.data}
            innerRadius={50}
            outerRadius={80}
            dataKey="value"
          >
            {spendingData.donut.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className={s.donutLabels}>
        {spendingData.donut.data.map((entry, index) => (
          <div key={uuidv4()} className={s.label}>
            <Dot color={entry.color} />
            <span className="body-3 ml-2">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
};

export default SpendingPieChart;
