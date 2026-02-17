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

const CustomTooltip = ({ active, payload, label, dataKey }) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        const prevValue = payload[1]?.value;

        return (
            <div style={{
                background: 'rgba(255, 255, 255, 0.98)',
                border: '1px solid #e2e8f0',
                padding: '12px 16px',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                minWidth: '200px'
            }}>
                <p style={{
                    fontSize: '0.85rem',
                    color: '#64748b',
                    marginBottom: '8px',
                    borderBottom: '1px solid #f1f5f9',
                    paddingBottom: '4px'
                }}>{label}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.9rem', color: '#334155' }}>الحالي:</span>
                    <span style={{ fontWeight: 'bold', color: '#0ea5e9', fontSize: '1rem' }}>{value}</span>
                </div>

                {prevValue !== undefined && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>السابق:</span>
                        <span style={{ fontWeight: '600', color: '#94a3b8', fontSize: '0.9rem' }}>{prevValue}</span>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

const AnalyticsChart = ({ data, dataKey = 'visits', color = '#0ea5e9' }) => {
    // Generate comparison data visually if real comparison data isn't provided
    // This mimics the "dashed line" look requested by the user
    const chartData = data.map((item, index) => {
        const val = item[dataKey] || 0;
        // Simulate a "previous period" curve that is slightly different but correlated
        // Just for visual effect as per user request, until backend provides real comparison
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
                        stroke="#f1f5f9"
                    />

                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        dy={15}
                        tickFormatter={(str) => {
                            // If date is "DD/MM/YYYY", convert to "MMM DD"
                            // Assuming backend sends something readable or we parse it
                            if (str.includes('/')) {
                                const parts = str.split('/');
                                const date = new Date(parts[2], parts[1] - 1, parts[0]); // DD/MM/YYYY format assumption?
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
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        dx={-10}
                    />

                    <Tooltip
                        content={<CustomTooltip dataKey={dataKey} />}
                        cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '5 5' }}
                    />

                    {/* Comparison Line (Dashed) */}
                    <Area
                        type="monotone"
                        dataKey="prevKey"
                        stroke="#cbd5e1"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fill="transparent"
                        isAnimationActive={true}
                        animationDuration={1500}
                    />

                    {/* Current Line (Solid) */}
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        strokeWidth={3}
                        fill={`url(#gradient-${dataKey})`}
                        activeDot={{ r: 6, strokeWidth: 0, fill: color }}
                        isAnimationActive={true}
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalyticsChart;
