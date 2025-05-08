"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Sample data - this would come from your API in a real app
const data = [
  { name: "Spanish", value: 380, color: "#118197" }, // brand-teal
  { name: "Chinese", value: 250, color: "#E0007B" }, // brand-pink
  { name: "Russian", value: 180, color: "#30A3B7" }, // lighter teal
  { name: "Arabic", value: 150, color: "#F04CA7" }, // lighter pink
  { name: "French", value: 120, color: "#0B5A6B" }, // darker teal
];

const COLORS = data.map((item) => item.color);

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-md shadow-md border border-gray-100">
        <p className="font-medium text-sm">{data.name}</p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">{data.value}</span> minutes
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {Math.round((data.value / 1080) * 100)}% of total
        </p>
      </div>
    );
  }
  return null;
};

export function MinutesUsageChart() {
  return (
    <Card className="dashboard-card shadow-sm hover:shadow-md transition-shadow w-full">
      <CardHeader className="pb-2 pt-6 px-6">
        <CardTitle className="text-gray-900">Minutes Usage</CardTitle>
        <CardDescription className="text-gray-500">
          Distribution by language
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                }) => {
                  const radius =
                    innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                  return percent > 0.1 ? (
                    <text
                      x={x}
                      y={y}
                      fill="#fff"
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ fontSize: "11px", fontWeight: "medium" }}
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  ) : null;
                }}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconSize={8}
                iconType="circle"
                wrapperStyle={{
                  fontSize: "12px",
                  paddingTop: "15px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex justify-between text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">1,080</p>
            <p className="text-xs text-gray-500">Total Minutes Used</p>
          </div>
          <div className="border-l border-gray-200" />
          <div>
            <p className="text-2xl font-bold text-gray-900">1,920</p>
            <p className="text-xs text-gray-500">Minutes Remaining</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
