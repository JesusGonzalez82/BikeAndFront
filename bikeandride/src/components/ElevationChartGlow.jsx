"use client"
import { CartesianGrid, Line, LineChart, XAxis, ReferenceLine } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Badge } from "../ui/badge";
import { TrendingUp } from "lucide-react";
import { useStats } from "../context/StatsContext";
import dayjs from "dayjs";
import { Spin } from "antd";

const chartConfig = {
    elevation: {
        label: "Desnivel",
        color: "hsl(var(--chart-4))",
    },
};

export function ElevationChartGlow(){
    const { stats, loading } = useStats();

    const processActivitiesByMonth = () => {
        if(!stats.activities || stats.activities.length === 0 || !stats.routes) {
            return [];
        }

        const currentYear = new Date().getFullYear();
        const monthsData = {};

        const monthNames = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        monthNames.forEach((month, index) => {
            monthsData[index] = {month, elevation: 0};
        });

        // Obtenemos el desnivel de las rutas realizadas
        stats.activities.forEach(activity => {
            const activityDate = dayjs(activity.fecha);

            if (activityDate.year() === currentYear && activity.idRuta) {
                const monthIndex = activityDate.month();

                // Localizamos la ruta correspondiente
                const route = stats.routes.find(r => r.idRuta === activity.idRuta);
                if (route && route.desnivel) {
                    monthsData[monthIndex].elevation +=(route.desnivel);
                }
            }
        });

        return Object.values(monthsData).map(month => ({
            month: month.month,
            elevation: month.elevation
        }));
    };

    const chartData = processActivitiesByMonth();

    const calculateTrend = () => {
        const monthsWithData = chartData.filter(m => m.elevation > 0);

        if (monthsWithData.length < 2){
            return 0;
        }

        const lastMonth = monthsWithData[monthsWithData.length - 1].elevation;
        const previousMonth = monthsWithData[monthsWithData.length - 2].elevation;

        if (previousMonth === 0) return 0;

        return (((lastMonth - previousMonth) / previousMonth) * 100).toFixed(0);
    };

    const trend = calculateTrend();
    const totalElevation = chartData.reduce((sum, month) => sum + month.elevation, 0);
    const avgElevation = totalElevation / 12;

    if (loading){
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
                        gap:"16px"
                    }}>
                        <Spin size="large" />
                        <div style={{ color: "#8c8c8c" }}>Cargando estadísticas...</div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card style={{ marginBottom: "32px", border: "none", maxWidth:"100%", overflow: "hidden"}}>
            <CardHeader>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap:"12px"}}>
                    <div>
                        <CardTitle className="flex items-center gap-2">
                           ⛰️ Desnivel Acumulado
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
                        backgroundColor: "#fefce8",
                        borderRadius: "8px",
                        border: "1px solid #fde047",
                        minWidth:"fit-container"
                    }}>
                        <div style={{ fontSize: "12px", color:"#ca8a04", fontWeight:"500px"}}>
                            Desnivel Acumulad {new Date().getFullYear()}
                        </div>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color:"#a16207" }}>
                            {totalElevation.toLocaleString()} m
                        </div>
                    </div>
                </div>
            </CardHeader>
            
            <CardContent>
                <div style={{ width: "100%", height:"300px", minHeight:"250px", position:"relative" }}>
                    {chartData.length > 0 && chartData.some(d => d.elevation > 0) ? (
                        <>
                            <ChartContainer config={chartConfig} style={{ width: "100%", height: "100%"}}>
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
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />

                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    
                                    <ReferenceLine
                                        y={avgElevation}
                                        stroke="#facc15"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        label={{
                                            value:`Promedio: ${avgElevation.toFixed(0)} m`,
                                            position: "insideTopRight",
                                            fill: "#ca8a04",
                                            fontSize: 12
                                        }}
                                    />

                                    <Line
                                        dataKey="elevation"
                                        type="monotone"
                                        stroke="#eab308"
                                        strokeWidth={3}
                                        dot={{ fill: "#eab308", r: 4}}
                                        activeDot={{ r:6 }}
                                        filter="url(#glow-elevation)"
                                    />

                                    <defs>
                                        <filter
                                            id="glow-elevation"
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
                                alignContent: "center",
                                marginTop: "16px",
                                gap: "24px",
                                flexWrap: "wrap"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap:"8px"}}>
                                    <div style={{
                                        width: "32px",
                                        height: "3px",
                                        backgroundColor: "#eab308",
                                        borderRadius: "2px",
                                        boxShadow: "0 0 8px rgba(234, 179, 8, 0.4)"
                                    }}></div>
                                    <span style={{ fontSize: "14px", color:"#6b7280"}}>Desnivel Acumulado</span>
                                </div>

                                <div style={{ display: "flex", alignItems:"center", gap:"8px"}}>
                                    <div style={{
                                        width: "32px",
                                        height: "2px",
                                        backgroundColor: "#facc15",
                                        borderRadius: "2px",
                                        backgroundImage: "linear-gradient(to right, #facc15 50%, transparent 50%)",
                                        backgroundSize: "10px 2px"
                                    }}></div>
                                    <span style={{ fontSize: "14px", color:"#6b7280" }}>
                                        Promedio mensual ({avgElevation.toFixed(0)} m)
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
                            justifyContent:"center"
                        }}>
                            No hay actividades con rutas registradas este año
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}