import React, { useEffect, useMemo, useState } from "react";
import { Card, Row, Col, Statistic, Typography, Spin, Select, DatePicker } from "antd";
import {
    TrophyOutlined, 
    RiseOutlined, 
    FireOutlined, 
    ThunderboltOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined
} from "@ant-design/icons";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";
import dayjs from "dayjs";
import { useStats } from "../context/StatsContext";


const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

function Statistics() {
    const { stats, loading, loadStats } = useStats();
    const [timeRange, setTimeRange] = useState("all");
    const [dateRange, setDateRange] = useState(null);


    useEffect(() => {
        loadStats();
    }, []);

    /**
     * Filtramos actividades por rango de tiempo
     */
    const filteredActivities = useMemo(() => {
        if(!stats.activities) return [];

        let filtered = [...stats.activities];

        if (dateRange) {
            const [start, end] = dateRange;
            filtered = filtered.filter(act => {
                const actDate = dayjs(act.fecha);
                return actDate.isAfter(start) && actDate.isBefore(end);
            });
        } else {
            const now = dayjs();
            if (timeRange === "week"){
                filtered = filtered.filter(act => dayjs(act.fecha).isAfter(now.subtract(7, "day")));
            } else if (timeRange === "month") {
                filtered = filtered.filter(act => dayjs(act.fecha).isAfter(now.subtract(30, "day")));
            } else if (timeRange === "year") {
                filtered = filtered.filter(act => dayjs(act.fecha).isAfter(now.subtract(365, "day")));
            }
            // Si es "all", no filtrar nada, mostrar todas las actividades
        }

        return filtered.sort((a, b) => dayjs(a.fecha).unix() - dayjs(b.fecha).unix());
    }, [stats.activities, timeRange, dateRange]);

    /**
     * Datos para la gráfica de distancia recorrida en el mes
     */
    const distanceByMonth = React.useMemo(() => {
        const monthData = {};

        filteredActivities.forEach(act => {
            const month = dayjs(act.fecha).format("MMM YYYY");
            if (!monthData[month]) {
                monthData[month] = { month, distance: 0, activities: 0 };
            }
            monthData[month].distance += parseFloat(act.distancia || 0);
            monthData[month].activities += 1;
        });

        return Object.values(monthData).map(d => ({
            ...d,
            distance: parseFloat(d.distance.toFixed(2)),
        }));
    }, [filteredActivities]);

    /**
     * Datos para gráfica de velocidad media
     */
    const speedMedia = React.useMemo(() => {

        if(!filteredActivities || filteredActivities.length === 0) return [];

        return filteredActivities.map(act => ({
                fecha: dayjs(act.fecha).format("DD/MM"),
                velocidad: parseFloat(act.velocidadMedia || 0),
            }));
    }, [filteredActivities]);

    /**
     * Datos para la gráfica de calorias
     */
    const caloriesData = React.useMemo(() => {
        return filteredActivities
            .filter(act => act.calorias)
            .map(act => ({
                fecha: dayjs(act.fecha).format("DD/MM"),
                calorias: parseFloat(act.calorias || 0),
            }));
    }, [filteredActivities]);

    /**
     * Datos para la grafica de desnivel
     */

    const elevationData = React.useMemo(() => {
        if (!filteredActivities || filteredActivities.length === 0) return [];
        return filteredActivities.map(act => {
            const ruta = stats.routes?.find(r => r.idRuta === act.idRuta);
            return {
                fecha: dayjs(act.fecha).format("DD/MM"),
                desnivel: parseFloat(ruta?.desnivel || 0),
            };
        });
    }, [filteredActivities, stats.routes]);

    /**
     * Desnivel total acumulado
     */

    const totalElevation = React.useMemo(() => {
        return filteredActivities.reduce((sum, act) => {
            const ruta = stats.routes?.find(r => r.idRuta === act.idRuta);
            return sum + parseFloat(ruta?.desnivel || 0);
        }, 0);
    }, [filteredActivities, stats.routes]);

    /**
     * Estadisticas resumidas
     */
    const summary = React.useMemo(() => {
        const totalDistance = filteredActivities.reduce((sum, act) => sum + parseFloat(act.distancia || 0), 0);
        const totalCalories = filteredActivities.reduce((sum, act) => sum + parseFloat(act.calorias || 0 ), 0);
        const avgSpeed = filteredActivities.length > 0
            ? filteredActivities.reduce((sum, act) => sum + parseFloat(act.velocidadMedia || 0), 0) / filteredActivities.length : 0;

        const totalSeconds = filteredActivities.reduce((sum, act) => {
            if (!act.duracion) return sum;
            const [hours, minutes, seconds] = act.duracion.split(':').map(Number);
            return sum + (hours * 3600) + (minutes * 60) + (seconds || 0);
        }, 0);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        console.log("timeRange:", timeRange);
        console.log("dateRange:", dateRange);
        console.log("filteredActivities:", filteredActivities);
        console.log("distanceByMonth:", distanceByMonth);
        console.log("elevationData:", elevationData);
        console.log("stats.routes:", stats.routes);
        return {
            totalDistance: totalDistance.toFixed(2),
            totalActivities: filteredActivities.length,
            totalCalories: Math.round(totalCalories),
            avgSpeed: avgSpeed.toFixed(2),
            totalTime: `${hours}h ${minutes}m`,
            totalElevation: Math.round(totalElevation),
        };
    }, [filteredActivities]);

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "100px"}}>
                <Spin size="large" />
                <div style={{ marginTop: "16px"}}>
                    <Text type="secondary">Cargando estadísticas...</Text>
                </div>
            </div>
        );
    }

    if ( !stats.activities || stats.activities.length === 0) {
        return (
            <div style={{ textAlign: "center", padding:"100px"}}>
                <Text type="secondary">No hay actividades registradas</Text>
            </div>
        );
    }

    return (
        <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: "24px", display: "flex", justifyContent:"space-between"}}>
                <div>
                    <Title level={2}>
                        <RiseOutlined style={{ margin: "12px", color: "#1890ff"}} />
                        Estadisticas Avanzadas
                    </Title>
                    <Text type="secondary">Analiza tu rendimiento en detalle</Text>
                </div>

                <div style={{ display:"flex", gap:"12px", flexWrap: "wrap" }}>
                    <Select
                        value={timeRange}
                        onChange={setTimeRange}
                        style={{ width: 120 }}
                        disabled={!!dateRange}
                    >
                        <Option value="all">Todo</Option>
                        <Option value="week">Última semana</Option>
                        <Option value="month">Último mes</Option>
                        <Option value="year">Último año</Option>
                    </Select>

                    <RangePicker
                        value={dateRange}
                        onChange={setDateRange}
                        format="DD/MM/YYYY"
                        placeholder={["Fecha inicio", "Fecha fin"]}
                    />
                </div>
            </div>

            {/* Tarjetas resumen por categorias */}
            <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card>
                        <Statistic
                            title="Distancia Total"
                            value={summary.totalDistance}
                            suffix="km"
                            prefix={<EnvironmentOutlined style={{ color: "#54c41a"}} />}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card>
                        <Statistic
                            title="Actividades"
                            value={summary.totalActivities}
                            prefix={<TrophyOutlined style={{ color: "#fa8c16" }} />}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card>
                        <Statistic
                            title="Velocidad Media"
                            value={summary.avgSpeed}
                            suffix="km/h"
                            prefix={<ThunderboltOutlined style={{ color:"#1894af" }} />}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card>
                        <Statistic
                            title="Calorias"
                            value={summary.totalCalories}
                            suffix="kcal"
                            prefix={<FireOutlined style={{ color:"#f5222d" }} />}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card>
                        <Statistic
                            title="Tiempo total"
                            value={summary.totalTime}
                            prefix={<ClockCircleOutlined style={{ color: "#722ed4" }} />}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card>
                        <Statistic
                            title="Desnivel total"
                            value={summary.totalElevation}
                            suffix="m"
                            prefix={<span style={{ color: "#13c2c2"}}>🏔️</span>}
                        />
                    </Card>
                </Col>
            </Row>

        {/* Gráficas */}
            <Row gutter={[16, 16]}>
                {/* Distancia mensual */}
                <Col xs={24} lg={12}>
                    <Card title="Distancia recorrida">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={distanceByMonth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="distance"
                                    stroke="#52c41a"
                                    strokeWidth={3}
                                    fill="#52c41a"
                                    fillOpacity={0.6}
                                    name="Distancia (km)"
                                    dot={{ r:6 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* Actividades mensuales */}
                <Col xs={24} lg={12}>
                    <Card title="Actividades">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={distanceByMonth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="activities" fill="#fa8c16" name="Actividades" barSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* Velocidad Media */}
                <Col xs={24} lg={12}>
                    <Card title="Velocidad media">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={speedMedia}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="fecha" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="velocidad"
                                    stroke="#1890ff"
                                    strokeWidth={2}
                                    name="Velocidad (km/h)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* Calorias */}
                <Col xs={24} lg={12}>
                    <Card title="Calorias">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={caloriesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="fecha" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="calorias" fill="#f5222d" name="Calorias (Kcal)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* Desnivel */}
                <Col xs={24} lg={12}>
                    <Card title="Desnivel">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={elevationData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="fecha" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="desnivel"
                                    stroke="#48e"
                                    fill="#48e"
                                    fillOpacity={0.6}
                                    name="Desnivel (m)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Statistics;