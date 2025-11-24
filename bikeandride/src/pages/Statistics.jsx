import React, { useEffect, useState } from "react";
import { Card, Row, Statistic, Typography, Spin, Select, DatePicker } from "antd";
import {
    TrophyOutlined, 
    RiseOutlined, 
    FireOutlined, 
    ThunderboltOutlined,
    ClockCircleOutlined
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

const { title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

function Statistics() {
    const { stats, loading, loadStats } = useStats();
    const [timeRange, setTimeRange] = useState("year");
    const [dateRange, setDateRange] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    /**
     * Filtramos actividades por rango de tiempo
     */
    const filteredActivities = React.useMemo(() => {
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
        }

        return filtered.sort((a, b) => dayjs(a.fecha).unix() - dayjs(b.fecha).unix());
    }, [stats.activities, timeRange, dateRange]);

    /**
     * Datos para la gráfica de distancia recorrida en el mes
     */
    const distanceByMonth = React.useMemo(() => {
        const monthData = {};

        filteredActivities.foreach(act => {
            const month = dayjs(act.fecha).format("MMM YYYY");
            if (!monthData[month]) {
                monthData[month] = { month, distance: 0, activities: 0 };
            }
            monthData[month].distance += parseFloat(act.distance || 0);
            monthData[month].activities += 1;
        });

        return Object.values(monthData).map(d => ({
            ...d,
            distance: parseFloat(d.distance.toFixed(2)),
        }));
    }, [filteredActivities]);

    
}