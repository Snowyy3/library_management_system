import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography, Box } from '@mui/material';
import apiClient from '../../api/axiosConfig';

function OverdueRatioChart() {
    const [chartData, setChartData] = useState([]);
    const [totalBorrowed, setTotalBorrowed] = useState(0);
    const [totalOverdue, setTotalOverdue] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const borrowedResponse = await apiClient.get('/reports/currently-borrowed');
                const overdueResponse = await apiClient.get('/reports/overdue');

                const borrowedCount = borrowedResponse.data?.length || 0;
                const overdueCount = overdueResponse.data?.length || 0;

                setTotalBorrowed(borrowedCount);
                setTotalOverdue(overdueCount);

                if (borrowedCount > 0) {
                    const notOverdueCount = borrowedCount - overdueCount;
                    setChartData([
                        { id: 0, value: overdueCount, label: 'Overdue', color: '#F65867' }, // Primary Accent
                        { id: 1, value: notOverdueCount > 0 ? notOverdueCount : 0, label: 'Borrowed (not overdue)', color: '#A2A2A1' }, // Secondary Text as a neutral color
                    ]);
                } else {
                    setChartData([]); // No data to show if nothing is borrowed
                }

            } catch (err) {
                console.error("Error fetching data for ratio chart:", err);
                setError("Failed to load chart data.");
                setChartData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <Typography sx={{ color: 'var(--text-secondary)', textAlign: 'center', py: 2 }}>Loading...</Typography>;
    }

    if (error) {
        return <Typography sx={{ color: 'var(--color-error)', textAlign: 'center', py: 2 }}>{error}</Typography>;
    }

    if (totalBorrowed === 0) {
        return (
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
            }}>
                <Typography variant="h5" sx={{ color: 'var(--text-secondary)', fontWeight: 600 }}>-</Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>No Borrowed Books</Typography>
            </Box>
        );
    }

    const overduePercent = totalBorrowed > 0 ? Math.round((totalOverdue / totalBorrowed) * 100) : 0;

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
        }}>
            <Typography
                variant="h4"
                component="div"
                sx={{
                    position: 'absolute',
                    top: '61%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                    fontWeight: 'bold',
                    color: '#F65867', // Primary Accent
                    userSelect: 'none', // Prevent text selection
                }}
            >
                {`${overduePercent}%`}
            </Typography>
            <PieChart
                series={[
                    {
                        data: chartData,
                        innerRadius: 65,
                        outerRadius: 90,
                        paddingAngle: 1,
                        cornerRadius: 8,
                        startAngle: 0,
                        endAngle: 360,
                        cx: 100, // Centered X position
                        cy: 100, // Y position of the center of the chart
                    },
                ]}
                width={220}
                height={200}
                tooltip={{ trigger: 'item' }}
                slotProps={{
                    legend: {
                        direction: 'column',
                        position: { vertical: 'middle', horizontal: 'right' },
                        itemMarkWidth: 12,
                        itemMarkHeight: 12,
                        markGap: 5,
                        itemGap: 8,
                        labelStyle: {
                            fontSize: 12,
                            fontFamily: 'var(--font-family-primary)',
                        },
                        sx: {
                            pt: 1,
                            pb: 0,
                        },
                    },
                }}
            />
        </Box>
    );
}

export default OverdueRatioChart;
