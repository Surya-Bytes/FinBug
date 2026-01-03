import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';

const CustomPieChart = ({ data, label, totalAmount, colors, showTextAnchor, legendData }) => {
  // Ensure data is an array and has valid entries
  const chartData = Array.isArray(data) && data.length > 0
    ? data.filter(item => item && item.amount > 0)
    : [];

  // Ensure colors array exists
  const chartColors = colors || ["#875cf5", "#FF6900", "#FA2C37"];

  // If no valid data, show placeholder
  if (chartData.length === 0) {
    return (
      <div className="w-full flex items-center justify-center" style={{ minHeight: '300px' }}>
        <div className="text-center">
          <p className="text-gray-400 text-sm">No data available</p>
          <p className="text-gray-300 text-xs mt-1">Add data to see the chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ minHeight: '300px', position: 'relative' }}>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={showTextAnchor ? 70 : 0}
            labelLine={false}
            startAngle={90}
            endAngle={-270}
            animationDuration={200}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={chartColors[index % chartColors.length]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={CustomTooltip} />

          {showTextAnchor && (
            <>
              <text
                x="50%"
                y="50%"
                dy={-20}
                textAnchor="middle"
                fill='#9CA3AF'
                fontSize="14px"
                fontWeight="500"
                dominantBaseline="middle"
              > {label}
              </text>
              <text
                x="50%"
                y="50%"
                dy={8}
                textAnchor="middle"
                fill='#111827'
                fontSize="24px"
                fontWeight="bold"
                dominantBaseline="middle"
              > {totalAmount}
              </text>
            </>
          )}
        </PieChart>
      </ResponsiveContainer>
      {legendData && legendData.length > 0 && (
        <CustomLegend payload={legendData.map(item => ({ value: item.name, color: item.color }))} />
      )}
    </div>
  );
};

export default CustomPieChart