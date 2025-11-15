"use client";
import { CartesianGrid, Line, LineChart, XAxis, ReferenceLine, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Badge } from "../ui/badge";
import { TrendingUp } from "lucide-react";
import { useStats } from "../context/StatsContext";
import dayjs from "dayjs";
import { Spin } from "antd";

const chartConfig = {
  km: {
    label: "Kilómetros",
    color: "hsl(var(--chart-2))",
  },
};

export function KilometersChartGlow() {
  const { stats, loading } = useStats();

  // Procesar actividades para agrupar por mes
  const processActivitiesByMonth = () => {
    if (!stats.activities || stats.activities.length === 0) {
      return [];
    }

    const currentYear = new Date().getFullYear();
    const monthsData = {};

    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    monthNames.forEach((month, index) => {
      monthsData[index] = { month, km: 0 };
    });

    stats.activities.forEach((activity) => {
      const activityDate = dayjs(activity.fecha);

      if (activityDate.year() === currentYear) {
        const monthIndex = activityDate.month();
        const km = parseFloat(activity.distancia) || 0;
        monthsData[monthIndex].km += km;
      }
    });

    return Object.values(monthsData).map((month) => ({
      month: month.month,
      km: parseFloat(month.km.toFixed(1)),
    }));
  };

  const chartData = processActivitiesByMonth();

  const calculateTrend = () => {
    const monthsWithData = chartData.filter((m) => m.km > 0);

    if (monthsWithData.length < 2) {
      return 0;
    }

    const lastMonth = monthsWithData[monthsWithData.length - 1].km;
    const previousMonth = monthsWithData[monthsWithData.length - 2].km;

    if (previousMonth === 0) return 0;

    return (((lastMonth - previousMonth) / previousMonth) * 100).toFixed(1);
  };

  const trend = calculateTrend();

  // Mostramos spin loading mientras cargan los datos
  if (loading) {
    return (
      <Card style={{ marginBottom: "32px" }}>
        <CardContent>
          <div
            style={{
              textAlign: "center",
              padding: "100px 50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <Spin size="large" />
            <div style={{ color: "#8c8c8c" }}>Cargando estadísticas...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalKmYear = chartData
    .reduce((sum, month) => sum + month.km, 0)
    .toFixed(1);

  return (
    <Card style={{ marginBottom: "32px", border: "none" }}>
      <CardHeader>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <CardTitle className="flex items-center gap-2">
              📊 Kilómetros por Mes
              {trend !== 0 && (
                <Badge
                  variant="outline"
                  className={`${
                    trend >= 0
                      ? "text-green-500 bg-green-500/10"
                      : "text-red-500 bg-red-500/10"
                  } border-none ml-2`}
                >
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>
                    {trend >= 0 ? "+" : ""}
                    {trend}%
                  </span>
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Enero - Diciembre {new Date().getFullYear()}
            </CardDescription>
          </div>

          {/* Total del año */}
          <div
            style={{
              textAlign: "right",
              padding: "8px 16px",
              backgroundColor: "#f0f9ff",
              borderRadius: "8px",
              border: "1px solid #bae6fd",
            }}
          >
            <div
              style={{ fontSize: "12px", color: "#0284c7", fontWeight: "500" }}
            >
              Total Km {new Date().getFullYear()}
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#0369a1" }}
            >
              {totalKmYear} km
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div style={{ width: "100%", height: "300px" }}>
          {chartData.length > 0 && chartData.some((d) => d.km > 0) ? (
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
                    bottom: 20,
                  }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                  />

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />

                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />

                  {/* Línea de promedio mensual */}
                  <ReferenceLine
                    y={parseFloat(totalKmYear) / 12}
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{
                      value: `Promedio: ${(
                        parseFloat(totalKmYear) / 12
                      ).toFixed(1)} km`,
                      position: "insideTopRight",
                      fill: "#64748b",
                      fontSize: 12,
                    }}
                  />

                  {/* Línea principal de km */}
                  <Line
                    dataKey="km"
                    type="monotone"
                    stroke="#52c41a"
                    strokeWidth={3}
                    dot={{ fill: "#52c41a", r: 4 }}
                    activeDot={{ r: 6 }}
                    filter="url(#glow-line)"
                    name="Kilómetros"
                  />

                  <defs>
                    <filter
                      id="glow-line"
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feComposite
                        in="SourceGraphic"
                        in2="blur"
                        operator="over"
                      />
                    </filter>
                  </defs>
                </LineChart>
              </ChartContainer>

              {/* Leyenda */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "16px",
                  gap: "24px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "3px",
                      backgroundColor: "#52c41a",
                      borderRadius: "2px",
                      boxShadow: "0 0 8px rgba(82, 196, 26, 0.4)",
                    }}
                  ></div>
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    Kilómetros recorridos
                  </span>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "2px",
                      backgroundColor: "#94a3b8",
                      borderRadius: "2px",
                      backgroundImage:
                        "linear-gradient(to right, #94a3b8 50%, transparent 50%)",
                      backgroundSize: "10px 2px",
                    }}
                  ></div>
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    Promedio mensual (
                    {(parseFloat(totalKmYear) / 12).toFixed(1)} km)
                  </span>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#52c41a",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    Actividad registrada
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "50px",
                color: "#8c8c8c",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              No hay actividades registradas este año
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
