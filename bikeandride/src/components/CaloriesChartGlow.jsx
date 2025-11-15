"use client"
import { CartesianGrid, Line, LineChart, XAxis, ReferenceLine } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Badge } from "../ui/badge";
import { TrendingUp } from "lucide-react";
import dayjs from "dayjs";
import { Spin } from "antd";
import { useStats } from "../context/StatsContext";

const chartConfig = {
    calories: {
        label: "Calorias",
        color: "hsl(var(--chart-3))",
    },
};

export function CaloriesChartGlow() {
    const { stats, loading } = useStats();

    const processActivitiesByMonth = () => {
        if (!stats.activities || stats.activities.length === 0) {
            return [];
        }

        const currentYear = new Date().getFullYear();
        const monthsData = {};

        const monthNames = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        monthNames.forEach((month, index) => {
            monthsData[index] = {month, calories: 0};
        });

        stats.activities.forEach(activity => {
            const activityDate = dayjs(activity.fecha);

            if (activityDate.year() === currentYear){
                const monthIndex = activityDate.month();
                const calories = parseFloat(activity.calorias) || 0;
                monthsData[monthIndex].calories += calories;
            }
        });

        return Object.values(monthsData).map(month => ({
            month: month.month,
            calories: parseFloat(month.calories.toFixed(0))
        }));
    };

    const chartData = processActivitiesByMonth();

    const calculateTrend = () =>{
        const monthsWithData = chartData.filter(m => m.calories > 0);

        if (monthsWithData.length < 2){
            return 0;
        }

        const lastMonth = monthsWithData[monthsWithData.length -1].calories;
        const previousMonth = monthsWithData[monthsWithData.length -2].calories;

        if (previousMonth === 0) return 0;

        return (((lastMonth - previousMonth) / previousMonth) * 100).toFixed(0);
    };

    const trend = calculateTrend();
    const totalCalories = chartData.reduce((sum, month) => sum + month.calories, 0);
    const avgCalories = totalCalories / 12;

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <div style={{
                        textAlign: "center",
                        padding: "100px 50px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "16px"
                    }}>
                        <Spin size="large" />
                        <div style={{ color:"#8c8c8c"}}>Cargando estadísticas...</div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card style={{ border: "none"}}>
            <CardHeader>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            🔥 Calorías Quemadas
                            {trend !== 0 && (
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
                            )}
                        </CardTitle>
                        <CardDescription>Enero - Diciembre {new Date().getFullYear()}</CardDescription>
                    </div>

                    <div style={{
                        textAlign: "right",
                        padding: "8px 16px",
                        backgroundColor:"#fef2f2",
                        borderRadius: "8px",
                        border: "1px solid #fecaca"
                    }}>
                        <div style={{ fontSize: "12px", color: "#dc2626", fontWeight: "500px"}}>
                            Total {new Date().getFullYear()}
                        </div>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#b91c1c"}}>
                            {totalCalories.toFixed(0)} kcal
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div style={{ width: "100%", height: "300px" }}>
                    {chartData.length > 0 && chartData.some(d => d.calories > 0) ? (
                        <>
                            <ChartContainer config={chartConfig}>
                                <LineChart
                                    width={800}
                                    height={250}
                                    data={chartData}
                                    margin={{
                                        left:12,
                                        right: 12,
                                        top: 20,
                                        bottom: 20
                                    }}
                                >
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />

                                    <XAxis
                                        dataKey="month"  // ← dataKey con K mayúscula
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}  // ← tickMargin es número
                                        tick={{ fill:"#6b7280", fontSize: 12}}  // ← tick es objeto separado
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />

                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />

                                    <ReferenceLine
                                        y={avgCalories}
                                        stroke="#f87171"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        label={{
                                            value: `Promedio: ${avgCalories.toFixed(0)} kcal`,
                                            position: "insideTopRight",
                                            fill: "#dc2626",
                                            fontSize: 12
                                        }}
                                    />

                                    <Line
                                        dataKey="calories"
                                        type="monotone"
                                        stroke="#ef4444"
                                        strokeWidth={3}
                                        dot={{ fill: "#ef4444", r:4 }}
                                        activeDot={{ r:6}}
                                        filter="url(#glow-calories)"
                                    />

                                    <defs>
                                        <filter id="glow-calories" x="-20%" y="-20%" width="140%" height="140%">
                                            <feGaussianBlur stdDeviation="8" result="blur" />
                                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                        </filter>
                                    </defs>
                                </LineChart>
                            </ChartContainer>

                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "16px",
                                gap: "24px",
                                flexWrap: "wrap"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px"}}>
                                    <div style={{
                                        width:"32px",
                                        height:"3px",
                                        backgroundColor: "#ef4444",
                                        borderRadius: "2px",
                                        boxShadow: "0 0 8px rgba(239, 68, 68, 0.4)"
                                    }}></div>
                                    <span style={{ fontSize: "14px", color:"#6b7280"}}>Calorias quemadas</span>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "8px"}}>
                                    <div style={{
                                        width: "32px",
                                        height: "2px",
                                        backgroundColor: "#f87171" ,
                                        borderRadius: "2px",
                                        backgroundImage: "linear-gradient(to right, #b87171 50%, transparent 50%)",
                                        backgroundSize: "10px 2px"
                                    }}></div>
                                    <span style={{ fontSize: "14px", color: "#6b7280"}}>
                                        Promedio mensual ({avgCalories.toFixed(0)} kcal)
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{
                            textAlign: "center",
                            padding: "50px",
                            color:"#8c8c8c",
                            height:"100%",
                            display:"flex",
                            alignItems:"center",
                            justifyContent:"center"
                        }}>
                            No hay Actividades con calorias registradas este año
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}