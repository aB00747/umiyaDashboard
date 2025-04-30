// Pages/Dashboard/RevenueChart.jsx
import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";

export default function RevenueChart() {
    const data = [
        { name: "Sulfuric Acid", value: 42 },
        { name: "Hydrochloric Acid", value: 28 },
        { name: "Phosphoric Acid", value: 15 },
        { name: "Nitric Acid", value: 10 },
        { name: "Other Chemicals", value: 5 },
    ];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="bg-white p-6 shadow sm:rounded-lg h-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
                Revenue Distribution by Product
            </h2>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
