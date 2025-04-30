// Pages/Dashboard/QualityMetrics.jsx
import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function QualityMetrics() {
    const data = [
        {
            name: "Sulfuric Acid",
            purity: 98.5,
            targetPurity: 99.0,
        },
        {
            name: "Hydrochloric Acid",
            purity: 37.2,
            targetPurity: 37.0,
        },
        {
            name: "Phosphoric Acid",
            purity: 84.8,
            targetPurity: 85.0,
        },
        {
            name: "Nitric Acid",
            purity: 67.5,
            targetPurity: 68.0,
        },
        {
            name: "Acetic Acid",
            purity: 99.6,
            targetPurity: 99.5,
        },
    ];

    return (
        <div className="bg-white p-6 shadow sm:rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
                Quality Metrics - Product Purity (%)
            </h2>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 25,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="purity"
                            name="Current Purity"
                            fill="#8884d8"
                        />
                        <Bar
                            dataKey="targetPurity"
                            name="Target Purity"
                            fill="#82ca9d"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
