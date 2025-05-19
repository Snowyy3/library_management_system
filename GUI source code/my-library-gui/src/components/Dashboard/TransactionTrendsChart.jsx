import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Paper, Typography, Box, Select, MenuItem } from '@mui/material';
import api from '../../api/axiosConfig';

function TransactionTrendsChart() {
    const [period, setPeriod] = useState('week');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [originalDates, setOriginalDates] = useState([]);

    useEffect(() => {
        setLoading(true);
        setError(null);
        api.get(`/reports/transaction-trends?period=${period}`)
            .then(res => {
                const responseData = res.data.data || [];
                setData(responseData);
                // Store original date strings for tooltips
                setOriginalDates(responseData.map(item => item.label));
            })
            .catch(() => {
                setError('Failed to load trend data.');
                setData([]);
                setOriginalDates([]);
            })
            .finally(() => setLoading(false));
    }, [period]);

    if (loading) {
        return <Paper sx={{
            padding: '20px',
            backgroundColor: 'var(--card-background, #fff)',
            borderRadius: '18px',
            boxShadow: '0 4px 24px 0 rgba(60,72,100,0.07)',
            marginBottom: '24px',
            minHeight: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Typography sx={{ color: 'var(--secondary-text)', textAlign: 'center' }}>Loading Chart...</Typography>
        </Paper>;
    }

    if (error) {
        return <Paper sx={{
            padding: '20px',
            backgroundColor: 'var(--card-background, #fff)',
            borderRadius: '18px',
            boxShadow: '0 4px 24px 0 rgba(60,72,100,0.07)',
            marginBottom: '24px',
            minHeight: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Typography sx={{ color: 'var(--color-error)', textAlign: 'center' }}>{error}</Typography>
        </Paper>;
    }

    if (!data.length) {
        return <Paper sx={{
            padding: '20px',
            backgroundColor: 'var(--card-background, #fff)',
            borderRadius: '18px',
            boxShadow: '0 4px 24px 0 rgba(60,72,100,0.07)',
            marginBottom: '24px',
            minHeight: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Typography sx={{ color: 'var(--secondary-text)', textAlign: 'center' }}>No data available</Typography>
        </Paper>;
    }

    // Format dates for display and tooltips
    const formatWeekdayLabel = (dateStr) => {
        if (period !== 'week') return dateStr;

        try {
            const date = new Date(dateStr);
            // Format to day name (Monday, Tuesday, etc.)
            return date.toLocaleDateString('en-US', { weekday: 'long' });
        } catch {
            return dateStr; // Fallback to original string if parsing fails
        }
    };

    const labels = data.map((item, index) => formatWeekdayLabel(originalDates[index]));
    const borrows = data.map(item => item.borrows);
    const returns = data.map(item => item.returns);

    // Softer, muted colors for bars
    const softColors = {
        borrows: '#F88B9B', // Muted red (matches design system, softer than #F65867)
        returns: '#6FC1A2', // Muted green (softer than #36976E)
    };

    // Bar width adjustment for month view
    const barCategoryGap = period === 'month' ? 0.5 : 0.2; // higher gap for month, default for week
    const barGap = period === 'month' ? 0.4 : 0.1;

    return (
        <Paper sx={{
            padding: { xs: '20px', sm: '36px 24px 36px 24px' },
            backgroundColor: 'var(--card-background, #fff)',
            borderRadius: '18px',
            boxShadow: '0 4px 24px 0 rgba(60,72,100,0.07)',
            height: { xs: 440, md: 480 },
            minHeight: 340,
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '24px',
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5" sx={{ color: 'var(--primary-text, #262221)', fontWeight: 700, fontFamily: 'Roboto, var(--font-family-primary)' }}>
                    Borrowing Trends
                </Typography>
                <Select
                    value={period}
                    onChange={e => setPeriod(e.target.value)}
                    size="small"
                    sx={{
                        minWidth: 140,
                        background: '#fff',
                        borderRadius: 3,
                        fontSize: 16,
                        color: 'var(--primary-text, #262221)',
                        boxShadow: 'none',
                        '.MuiOutlinedInput-notchedOutline': { border: '1.5px solid #DEE2E6' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#F65867' },
                    }}
                >
                    <MenuItem value="week">Past week</MenuItem>
                    <MenuItem value="month">Past month</MenuItem>
                </Select>
            </Box>

            {/* Chart container without additional card wrapper */}
            <Box sx={{
                flexGrow: 1,
                height: '100%',
                width: '100%',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                background: 'transparent'
            }}>
                <BarChart
                    xAxis={[{
                        id: 'period',
                        data: labels,
                        scaleType: 'band',
                        tickLabelStyle: {
                            fontSize: 13,
                            fill: 'var(--secondary-text, #A2A2A1)',
                            fontFamily: 'Roboto, var(--font-family-primary)',
                            fontWeight: 500
                        },
                        tickSize: 5,
                        tickPosition: 'center'
                    }]}
                    series={[
                        {
                            label: 'Borrows',
                            data: borrows,
                            color: softColors.borrows,
                        },
                        {
                            label: 'Returns',
                            data: returns,
                            color: softColors.returns,
                        }
                    ]}
                    height={350}
                    barCategoryGap={barCategoryGap}
                    barGap={barGap}
                    tooltip={{
                        trigger: 'item',
                        labelFormatter: (params) => {
                            // params has { value, index, seriesId, seriesLabel, ... }
                            // We want to show: 'Friday (May 9, 2025)' as the main label
                            // and then the values for Borrows/Returns below
                            const idx = params.dataIndex ?? params.index ?? 0;
                            const dateStr = originalDates[idx];
                            let weekday = dateStr;
                            let fullDate = dateStr;
                            try {
                                const date = new Date(dateStr);
                                weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
                                fullDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                            } catch { /* fallback to original string */ }
                            return `${weekday} (${fullDate})`;
                        },
                    }}
                    legend={{
                        direction: 'row',
                        position: 'top',
                        align: 'right',
                        itemMarkWidth: 20,
                        itemMarkHeight: 20,
                        labelStyle: {
                            fontSize: 14,
                            fontFamily: 'Roboto, var(--font-family-primary)',
                            padding: '0 10px'
                        }
                    }}
                    slotProps={{
                        bar: {
                            // Apply custom styling to individually shape bars with flat bottoms and rounded tops
                            shape: (props) => {
                                const { x, y, width, height } = props;
                                // Only round the top corners, keep bottom flat
                                const radius = 8;
                                return (
                                    <path
                                        d={`
                                            M ${x},${y + height}
                                            L ${x},${y + radius}
                                            Q ${x},${y} ${x + radius},${y}
                                            L ${x + width - radius},${y}
                                            Q ${x + width},${y} ${x + width},${y + radius}
                                            L ${x + width},${y + height}
                                            Z
                                        `}
                                        fill={props.fill}
                                    />
                                );
                            }
                        }
                    }}
                    margin={{
                        left: 40,
                        right: 40,
                        top: 40,
                        bottom: 40
                    }}
                    grid={{
                        horizontal: true,
                        vertical: false
                    }}
                    sx={{
                        '& .MuiChartsAxis-root .MuiChartsAxis-tickLabel': {
                            fontWeight: 500,
                        },
                        '& .MuiChartsAxis-root .MuiChartsAxis-line': {
                            stroke: '#DEE2E6'
                        },
                        '& .MuiChartsAxis-root .MuiChartsAxis-tick': {
                            stroke: '#DEE2E6'
                        },
                        '& .MuiChartsGrid-root .MuiChartsGrid-line': {
                            stroke: '#f0f0f0'
                        }
                    }}
                />
            </Box>
        </Paper>
    );
}

export default TransactionTrendsChart;
