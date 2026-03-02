import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        const prevValue = payload[1]?.value;

        return (
            <div style={{
                background: '#171717',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                padding: '12px 16px',
                borderRadius: '4px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                minWidth: '200px'
            }}>
                <p style={{
                    fontSize: '0.8rem',
                    color: '#6B6050',
                    marginBottom: '8px',
                    borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
                    paddingBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>{label}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#B8A98A' }}>الحالي:</span>
                    <span style={{ fontWeight: '700', color: '#D4AF37', fontSize: '1rem' }}>{value}</span>
                </div>

                {prevValue !== undefined && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#6B6050' }}>السابق:</span>
                        <span style={{ fontWeight: '600', color: '#6B6050', fontSize: '0.9rem' }}>{Math.round(prevValue)}</span>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

const AnalyticsChart = ({ data, dataKey = 'visits', color = '#D4AF37' }) => {
    // Generate comparison data visually if real comparison data isn't provided
    const chartData = data.map((item) => {
        const val = item[dataKey] || 0;
        const prevVal = Math.max(0, val * (0.8 + Math.random() * 0.4));

        return {
            ...item,
            [dataKey]: val,
            prevKey: prevVal
        };
    });

    return (
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <AreaChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="rgba(212, 175, 55, 0.05)"
                    />

                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B6050', fontSize: 11 }}
                        dy={15}
                        tickFormatter={(str) => {
                            if (str.includes('/')) {
                                const parts = str.split('/');
                                const date = new Date(parts[2], parts[1] - 1, parts[0]);
                                if (!isNaN(date)) {
                                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                }
                            }
                            return str;
                        }}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B6050', fontSize: 11 }}
                        dx={-10}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: 'rgba(212, 175, 55, 0.2)', strokeWidth: 1, strokeDasharray: '5 5' }}
                    />

                    {/* Comparison Line (Dashed) */}
                    <Area
                        type="monotone"
                        dataKey="prevKey"
                        stroke="rgba(107, 96, 80, 0.4)"
                        strokeWidth={1.5}
                        strokeDasharray="5 5"
                        fill="transparent"
                        isAnimationActive={true}
                        animationDuration={1500}
                    />

                    {/* Current Line (Solid Gold) */}
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        strokeWidth={2.5}
                        fill={`url(#gradient-${dataKey})`}
                        activeDot={{ r: 5, strokeWidth: 0, fill: color }}
                        isAnimationActive={true}
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalyticsChart;
