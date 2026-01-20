"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

// Sample data
const data = [
  { name: "Completed", value: 75 },
  { name: "Remaining", value: 25 },
];

export function ProgressChart() {
  return (
    <Card className="dashboard-card shadow-sm hover:shadow-md transition-shadow h-full w-full flex flex-col">
      <CardHeader className="pb-2 pt-6 px-6">
        <CardTitle className="text-gray-900">Goal Progress</CardTitle>
        <CardDescription className="text-gray-500">
          Monthly usage target
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6 flex-1 flex flex-col">
        <div className="h-[180px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={-270}
                innerRadius="60%"
                outerRadius="80%"
                dataKey="value"
                cornerRadius={5}
                strokeWidth={0}
              >
                <Cell
                  key="cell-0"
                  fill="#0063CC" // Brand Blue 500 (primary)
                />
                <Cell
                  key="cell-1"
                  fill="#E5E7EB" // light gray
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-3xl font-bold text-gray-900">75%</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500">Current</p>
              <div className="flex items-center text-green-600 text-xs">
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                <span>+12%</span>
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-900">1,500</p>
            <p className="text-xs text-gray-500">Minutes used</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500">Target</p>
            </div>
            <p className="text-xl font-semibold text-gray-900">2,000</p>
            <p className="text-xs text-gray-500">Minutes goal</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
