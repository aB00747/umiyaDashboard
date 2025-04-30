// Pages/Dashboard/ProductionChart.jsx
import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function ProductionChart() {
    const data = [
        {
            month: "Jan",
            sulfuricAcid: 4000,
            hydrochloricAcid: 2400,
            phosphoricAcid: 2400,
        },
        {
            month: "Feb",
            sulfuricAcid: 3000,
            hydrochloricAcid: 1398,
            phosphoricAcid: 2210,
        },
        {
            month: "Mar",
            sulfuricAcid: 2000,
            hydrochloricAcid: 9800,
            phosphoricAcid: 2290,
        },
        {
            month: "Apr",
            sulfuricAcid: 2780,
            hydrochloricAcid: 3908,
            phosphoricAcid: 2000,
        },
        {
            month: "May",
            sulfuricAcid: 1890,
            hydrochloricAcid: 4800,
            phosphoricAcid: 2181,
        },
        {
            month: "Jun",
            sulfuricAcid: 2390,
            hydrochloricAcid: 3800,
            phosphoricAcid: 2500,
        },
        {
            month: "Jul",
            sulfuricAcid: 3490,
            hydrochloricAcid: 4300,
            phosphoricAcid: 2100,
        },
    ];

    return (
        <div className="bg-white p-6 shadow sm:rounded-lg mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
                Production Trends (Liters)
            </h2>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 25,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="sulfuricAcid"
                            name="Sulfuric Acid"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="hydrochloricAcid"
                            name="Hydrochloric Acid"
                            stroke="#82ca9d"
                        />
                        <Line
                            type="monotone"
                            dataKey="phosphoricAcid"
                            name="Phosphoric Acid"
                            stroke="#ff7300"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
