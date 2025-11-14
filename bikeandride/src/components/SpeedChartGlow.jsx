"use client"
import { CartesianGrid, Line, LineChart, XAxis, ReferenceLine } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Badge } from "../ui/badge";
import  { TrendingUp } from "lucide-react";
import { useStats } from "../context/StatsContext";
import dayjs from "dayjs";
import { Spin } from "antd";

const chartConfig = {
    speed: {
        label: "Velocidad",
        color: "hsl(var(--chart-1))",
    },
};

export function SpeedChartGlow(){
    const { stats, loading} = useStats();

    const processActivitiesByMonth = () => {
        if (!stats.activities || stats.activities === 0){
            return [];
        }

        const currentYear = new Date().getFullYear();
        const monthsData = {};

        const monthNames = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        monthNames.forEach((month, index) => {
            monthsData[index] = { month, speed: 0, count: 0};
        });

        stats.activities.forEach(activity => {
            const activityDate = dayjs(activity.fecha);

            if (activityDate.year === currentYear){
                const monthIndex = activityDate.month();
                const speed = parseFloat(activity.velocidadMedia) || 0 ;
                monthsData[monthIndex].speed += speed;
                monthsData[monthIndex].count += 1;
            }
        });

        return Object.values(monthsData).map(month => ({
            month: month.month,
            speed: month.count > 0 ? parseFloat((month.speed / month.count).toFixed(2)) : 0
        }));
    };

    const chartData = processActivitiesByMonth();

    const calculateTrend = () => {
        const monthsWithData = chartData.filter(m => m.speed > 0);

        if (monthsWithData.length < 2) {
            return 0;
        }

        const lastMonth = monthsWithData[monthsWithData.length -1].speed;
        const previousMonth = monthsWithData[monthsWithData.length -2].speed;

        if (previousMonth === 0) return 0;

        return (((lastMonth - previousMonth) / previousMonth) * 100).toFixed(2);
    };

    const trend = calculateTrend();
    const avgSpeed = chartData.reduce((sum, m) => sum + m.speed, 0) / chartData.filter(m => m.speed > 0).length || 0;

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <div style={{
                        textAlign: "center",
                        padding: "100px 50px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent:"center",
                        flexDirection: "column",
                        gap: "16px"
                    }}>
                        <Spin size= "large" />
                        <div style={{ color: "#8c8c8c" }}>Cargando Estadisticas ...</div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            ⚡ Velocidad Promedio
                            {trend !== 0 && (
                                <Badge
                                    variant="outline"
                                    className={`${
                                        trend >= 0
                                        ? 'text-green-500 bg-green-500/10'
                                        : 'text-red-500 bg-red-500/10'
                                    }border-none ml-2`}
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
                        backgroundColor: "#fff8ed",
                        borderRadius: "8px",
                        border: "1px solid #fed7aa"
                    }}>
                        <div style={{ fontSize: "12px", color: "#ea580c", fontWeight: "500"}}>
                            Promedio {new Date().getFullYear}
                        </div>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#c2410c"}}>
                            {avgSpeed.toFixed(2)} km/h
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div style={{ width: "100px", height:"300px"}}>
                    {chartData.length > 0 && chartData.some(d => d.speed > 0) ? (
                        <>
                            <ChartContainer config={chartConfig}>
                                <LineChart
                                    width={800}
                                    height={250}
                                    data={chartData}
                                    margin={{
                                        left: 12,
                                        right: 12,
                                        top: 20,
                                        bottom: 20
                                    }}
                                >
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />

                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tick={{ fill: "#6b7280", fontSize: 12}}
                                        tickFormatter={(value) => value.slice(0,3)}
                                    />

                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />

                                    <ReferenceLine
                                        y={avgSpeed}
                                        stroke="#fb923c"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        label={{
                                            value: `Promedio: ${avgSpeed.toFixed(2)} km/h`,
                                            position: "insideTopRight",
                                            fill: "#ea580c",
                                            fontSize: 12
                                        }}
                                    />

                                    <Line
                                        dataKey="speed"
                                        type="monotone"
                                        stroke="#f97316"
                                        strokeWidth={3}
                                        dot={{ fill: "#f97316", r: 4 }}
                                        activeDot={{ r: 6}}
                                        filter="url(#glow-speed)"
                                    />

                                    <defs>
                                        <filter
                                            id="glow-speed"
                                            x="-20%"
                                            y="-20%"
                                            width="140%"
                                            height="140%"
                                        >
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
                                        width: "32px",
                                        height: "3px",
                                        backgroundColor: "#f97316",
                                        borderRadius: "2px",
                                        boxShadow: "0 0 8px rgba(249, 115, 22, 0.4)"
                                    }}></div>
                                    <span style={{ fontSize: "14px", color:"#6b7280"}}>Velocidad promedio</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap:"8px"}}>
                                    <div style={{
                                        width: "32px",
                                        height: "2px",
                                        backgroundColor: "#fb923c",
                                        borderRadius: "2px",
                                        backgroundImage: "linear-gradient(to right, #fb923c 50%, transparent 50%)",
                                        backgroundSize: "10px 2px"
                                    }}></div>
                                    <span style={{ fontSize: "14px", color:"#6b7280"}}>
                                        Promedio General ({avgSpeed.toFixed(2)} km/h)
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{
                            textAlign: "center",
                            padding: "50px",
                            color: "#8c8c8c",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            No hay actividades registradas este año
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}


