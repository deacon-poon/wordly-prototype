"use client";

import React from "react";
import {
  LineChart,
  Line,
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
import { Button } from "@/components/ui/button";

// Sample data - this would come from your API in a real app
const generateData = (timeframe: "week" | "month" | "year") => {
  const now = new Date();
  const data = [];

  if (timeframe === "week") {
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString("en-US", { weekday: "short" }),
        "Translation Sessions": Math.floor(Math.random() * 7) + 3,
        "Interpretation Sessions": Math.floor(Math.random() * 6) + 2,
        "Total Minutes": Math.floor(Math.random() * 120) + 60,
      });
    }
  } else if (timeframe === "month") {
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      if (i % 3 === 0) {
        // Show every 3rd day for readability
        data.push({
          date: `${date.getMonth() + 1}/${date.getDate()}`,
          "Translation Sessions": Math.floor(Math.random() * 9) + 2,
          "Interpretation Sessions": Math.floor(Math.random() * 7) + 1,
          "Total Minutes": Math.floor(Math.random() * 150) + 50,
        });
      }
    }
  } else {
    // Year
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      data.push({
        date: date.toLocaleDateString("en-US", { month: "short" }),
        "Translation Sessions": Math.floor(Math.random() * 25) + 15,
        "Interpretation Sessions": Math.floor(Math.random() * 20) + 10,
        "Total Minutes": Math.floor(Math.random() * 600) + 200,
      });
    }
  }

  return data;
};

type TimeframeOption = "week" | "month" | "year";

export function ActivityChart() {
  const [timeframe, setTimeframe] = React.useState<TimeframeOption>("month");
  const [chartData, setChartData] = React.useState(() =>
    generateData(timeframe)
  );

  React.useEffect(() => {
    setChartData(generateData(timeframe));
  }, [timeframe]);

  return (
    <Card className="col-span-4 dashboard-card shadow-sm hover:shadow-md transition-shadow w-full">
      <CardHeader className="pb-2 pt-6 px-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gray-900">Activity Overview</CardTitle>
            <CardDescription className="text-gray-500">
              Your session activity over time
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`h-8 text-xs ${
                timeframe === "week"
                  ? "bg-primary-navy-50 text-primary-navy-500 border-primary-navy-100"
                  : ""
              }`}
              onClick={() => setTimeframe("week")}
            >
              Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`h-8 text-xs ${
                timeframe === "month"
                  ? "bg-primary-navy-50 text-primary-navy-500 border-primary-navy-100"
                  : ""
              }`}
              onClick={() => setTimeframe("month")}
            >
              Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`h-8 text-xs ${
                timeframe === "year"
                  ? "bg-primary-navy-50 text-primary-navy-500 border-primary-navy-100"
                  : ""
              }`}
              onClick={() => setTimeframe("year")}
            >
              Year
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#E5E7EB" }}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#E5E7EB" }}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "0.5rem",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: 15,
                  fontSize: 12,
                }}
              />
              <Line
                name="Translation Sessions"
                type="monotone"
                dataKey="Translation Sessions"
                stroke="#0063CC" // brand-navy (primary)
                strokeWidth={2}
                dot={{ fill: "#0063CC", r: 4 }}
                activeDot={{ r: 6, fill: "#0063CC", stroke: "#fff" }}
              />
              <Line
                name="Interpretation Sessions"
                type="monotone"
                dataKey="Interpretation Sessions"
                stroke="#15B743" // brand-green
                strokeWidth={2}
                dot={{ fill: "#15B743", r: 4 }}
                activeDot={{ r: 6, fill: "#15B743", stroke: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
