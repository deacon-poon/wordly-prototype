"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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
  {
    name: "Dec",
    Translation: 12,
    Interpretation: 8,
    Transcription: 5,
  },
  {
    name: "Jan",
    Translation: 15,
    Interpretation: 10,
    Transcription: 7,
  },
  {
    name: "Feb",
    Translation: 18,
    Interpretation: 12,
    Transcription: 9,
  },
  {
    name: "Mar",
    Translation: 14,
    Interpretation: 9,
    Transcription: 6,
  },
  {
    name: "Apr",
    Translation: 20,
    Interpretation: 15,
    Transcription: 10,
  },
  {
    name: "May",
    Translation: 24,
    Interpretation: 18,
    Transcription: 13,
  },
];

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce(
      (sum: number, entry: any) => sum + entry.value,
      0
    );

    return (
      <div className="bg-white p-3 rounded-md shadow-md border border-gray-100">
        <p className="font-medium text-sm mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div
            key={`tooltip-${index}`}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.fill }}
              />
              <p className="text-xs">{entry.name}</p>
            </div>
            <p className="text-xs font-medium">{entry.value}</p>
          </div>
        ))}
        <div className="mt-1 pt-1 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xs font-medium">{total}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export function SessionsBarChart() {
  return (
    <Card className="dashboard-card shadow-sm hover:shadow-md transition-shadow w-full">
      <CardHeader className="pb-2 pt-6 px-6">
        <CardTitle className="text-gray-900">Session Distribution</CardTitle>
        <CardDescription className="text-gray-500">
          Monthly sessions by type
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
              barGap={2}
              barCategoryGap={16}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#E5E7EB" }}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#E5E7EB" }}
                axisLine={{ stroke: "#E5E7EB" }}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(236, 236, 236, 0.2)" }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  paddingTop: 15,
                  fontSize: 12,
                  paddingBottom: 5,
                }}
              />
              <Bar
                dataKey="Translation"
                name="Translation"
                fill="#118197" // brand-teal
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Interpretation"
                name="Interpretation"
                fill="#E0007B" // brand-pink
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Transcription"
                name="Transcription"
                fill="#30A3B7" // lighter teal
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
