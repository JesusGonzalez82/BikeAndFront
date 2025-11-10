"use client";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../ui/chart";
import { Badge } from "../ui/badge";
import { TrendingUp, ChevronDown, ChevronUp } from "lucide-react"; // ✅ Importados íconos

const chartData = [
    { month: "Jan", kilometers: 120 },
    { month: "Feb", kilometers: 210 },
    { month: "Mar", kilometers: 180 },
    { month: "Apr", kilometers: 250 },
    { month: "May", kilometers: 300 },
    { month: "Jun", kilometers: 280 },
    { month: "Jul", kilometers: 350 },
    { month: "Aug", kilometers: 400 },
    { month: "Sep", kilometers: 380 },
    { month: "Oct", kilometers: 450 },
    { month: "Nov", kilometers: 500 },
    { month: "Dec", kilometers: 480 },
];

const accumulatedData = chartData.map((item, index) => ({
  month: item.month,
  kilometers: item.kilometers,
  accumulated: chartData.slice(0, index + 1).reduce((sum, d) => sum + d.kilometers, 0)
}));

export function KilometersChartGlow() {
    const [isExpanded, setIsExpanded] = useState(true); // ✅ ESTADO para controlar colapso
    const lastMonth = chartData[chartData.length - 1]?.kilometers || 0;
    const previousMonth = chartData[chartData.length - 2]?.kilometers || 0;
    const trend = previousMonth > 0 ? (((lastMonth - previousMonth) / previousMonth) * 100).toFixed(1) : 0;

    const totalAccumulated = accumulatedData[accumulatedData.length - 1]?.accumulated || 0;

    return (
        <Card style={{ marginBottom: "32px" }}>
            <CardHeader>
                {/* ✅ BOTÓN COLAPSABLE CON ÍCONO */}
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        Kilometros recorridos
                        <Badge 
                            variant="outline" 
                            className={`${
                                trend >= 0
                                ? 'text-green-500 bg-green-500/10'
                                : 'text-red-500 bg-red-500/10'
                            } border-none ml-2`}
                        >
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span>{trend >= 0 ? '+' : ''}{trend}%</span>
                        </Badge>
                    </CardTitle>
                    
                    {/* ✅ TOGGLE CON ANIMACIÓN */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label={isExpanded ? "Colapsar gráfico" : "Expandir gráfico"}
                    >
                        {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-600" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-gray-600" />
                        )}
                    </button>
                </div>
                <CardDescription>Enero - Diciembre 2025</CardDescription>
            </CardHeader>

            {!isExpanded && (
                <CardContent className="pt-0 pb-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Total 2025:</span>
                        <span className="font-bold text-teal-600 text-lg">
                            {totalAccumulated.toLocaleString()} km
                        </span>
                    </div>
                </CardContent>
            )}
            
            {isExpanded && (
                <CardContent style={{ height: "300px" }} className="transition-all duration-300">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={accumulatedData}
                            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="month" 
                                tickLine={false} 
                                axisLine={false}
                                tickMargin={8}
                            />
                            <YAxis yAxisId="left" tickLine={false} axisLine={false} />
                            <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} />
                            
                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            
                            <Line
                                yAxisId="left"
                                dataKey="kilometers"
                                type="monotone"
                                stroke="#2dd4bf"
                                strokeWidth={3}
                                dot={{ fill: "#2dd4bf", r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Kilómetros"
                            />
                            
                            <Line
                                yAxisId="right"
                                dataKey="accumulated"
                                type="monotone"
                                stroke="#94a3b8"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={false}
                                name="Acumulado"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            )}
        </Card>
    );
}