import React, { useMemo } from "react";
import moment from "moment";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { addThousandsSeparator } from "../../utils/helper";

// Custom tick for XAxis to show date
const CustomizedAxisTick = (props) => {
  const { x, y, payload, index } = props;

  // Try to parse as ISO date first, then fall back to other formats
  const momentDate = moment(payload.value, [moment.ISO_8601, "YYYY-MM-DD", "DD MMM YYYY"], true);

  if (momentDate.isValid()) {
    const day = momentDate.format("D");
    const month = momentDate.format("MMM");

    // Show month on first tick or when month changes (check index)
    const showMonth = index === 0 || momentDate.date() === 1;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={10}>
          {showMonth ? `${day} ${month}` : day}
        </text>
      </g>
    );
  }

  // If not a valid date, just show the value as-is
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={10}>
        {payload.value}
      </text>
    </g>
  );
};

// Format large numbers to shorter format (e.g., 1.3M, 500K)
const formatYAxisValue = (value) => {
  if (value >= 1000000) {
    return `₹${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }
  return `₹${value}`;
};

// Truncate long labels for horizontal display - more aggressive truncation
const truncateLabel = (label, maxLength = 12) => {
  if (!label) return "";
  if (label.length <= maxLength) return label;
  return label.substring(0, maxLength - 3) + "...";
};

const CustomBarChart = React.memo(({ data = [], colors }) => {
  // Memoize color function
  const getBarColor = useMemo(() => {
    const defaultColors = ["#875cf5", "#a78bfa", "#c4b5fd", "#ddd6fe"];
    const colorArray = colors && Array.isArray(colors) ? colors : defaultColors;
    return (index) => colorArray[index % colorArray.length];
  }, [colors]);



  // Calculate bottom margin - minimal space for horizontal labels
  const bottomMargin = useMemo(() => {
    if (!data || data.length === 0) return 15;
    if (data.length <= 3) return 5; // Minimal space for 3 bars or less
    return 15; // Minimal space for horizontal labels
  }, [data]);

  // Calculate XAxis height - minimal for horizontal labels
  const xAxisHeight = useMemo(() => {
    if (!data || data.length === 0) return 20;
    return 25; // Consistent height for horizontal labels
  }, [data]);

  // Memoize cells to prevent re-renders
  const barCells = useMemo(() => {
    if (!data || data.length === 0) return [];
    return (data || []).map((entry, index) => (
      <Cell key={`cell-${index}`} fill={getBarColor(index)} />
    ));
  }, [data, getBarColor]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const source = payload[0].payload.source;
      const category = payload[0].payload.category;
      const name = payload[0].payload.name;
      const amount = payload[0].payload.amount || payload[0].value || 0;

      // Show source if available (for income), otherwise show category (for expense), otherwise show name
      const displayLabel = source || category || name || "N/A";

      return (
        <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {displayLabel}
          </p>
          <p className="text-sm text-gray-600">
            Amount:{" "}
            <span className="text-sm font-bold text-purple-600">
              ₹{addThousandsSeparator(amount)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-sm">No data available</p>
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-visible"
      style={{ height: "380px", minHeight: "380px" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data || []}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: bottomMargin,
          }}
          barCategoryGap={data.length <= 3 ? "25%" : "10%"}
        >
          <defs>
            <clipPath id="chart-clip">
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f3f4f6"
            vertical={false}
            opacity={0.5}
          />

          <XAxis
            dataKey="name"
            tick={<CustomizedAxisTick />}
            stroke="#e5e7eb"
            axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
            tickLine={{ stroke: "#e5e7eb" }}
            height={xAxisHeight}
            interval={0}
            dy={5}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 500 }}
            stroke="#e5e7eb"
            axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
            tickLine={{ stroke: "#e5e7eb" }}
            domain={[0, "dataMax + 500"]}
            tickFormatter={formatYAxisValue}
            allowDuplicatedCategory={false}
            allowDataOverflow={false}
            width={60}
            dx={-5}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(135, 92, 245, 0.1)" }}
          />
          <Bar
            dataKey="amount"
            radius={[6, 6, 0, 0]}
            animationDuration={200}
            animationEasing="ease-out"
          >
            {barCells}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

CustomBarChart.displayName = "CustomBarChart";

export default CustomBarChart;
