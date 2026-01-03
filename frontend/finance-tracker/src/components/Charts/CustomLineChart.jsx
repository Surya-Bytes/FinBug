import React, { useMemo } from 'react'
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";

const CustomLineChart = React.memo(({ data = [] }) => {

    const CustomToolTip = React.useCallback(({ active, payload }) => {
        if (active && payload && payload.length) {
            const label = payload[0].payload.category || payload[0].payload.source || 'N/A';
            return (
                <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
                    <p className="text-xs font-semibold text-purple-800 mb-1">{label}</p>
                    <p className="text-sm text-gray-600">
                        Amount: <span className="text-sm font-medium text-gray-900">₹{payload[0].payload.amount}</span>
                    </p>
                </div>
            );
        }
        return null;
    }, []);

    // Memoize chart data to prevent unnecessary re-renders
    const chartData = useMemo(() => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return [];
        }
        return data;
    }, [data]);

    // Custom tick formatter to show only day number
    const formatXAxisTick = (value) => {
        // Extract just the day number if it contains month
        return value.split(' ')[0];
    };

    return <div className="bg-white">
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
                <defs>
                    <linearGradient id='incomeGradient' x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor='#875cf5' stopOpacity={0.4} />
                        <stop offset="95%" stopColor='#875cf5' stopOpacity={0} />
                    </linearGradient>
                </defs>

                <CartesianGrid stroke='none' />
                <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#555" }}
                    stroke='none'
                    tickCount={8}
                    minTickGap={30}
                    angle={0}
                    tickFormatter={formatXAxisTick}
                />
                <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke='none' />
                <Tooltip content={<CustomToolTip />} />

                <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#875cf5"
                    fill="url(#incomeGradient)"
                    strokeWidth={3}
                    dot={{ r: 3, fill: "#ab8df8" }}
                    animationDuration={200}
                    animationEasing="ease-out"
                />
            </AreaChart>
        </ResponsiveContainer>
    </div>
});

CustomLineChart.displayName = 'CustomLineChart';

export default CustomLineChart