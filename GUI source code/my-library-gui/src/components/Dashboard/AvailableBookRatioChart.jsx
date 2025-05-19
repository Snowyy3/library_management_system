import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography, Box } from '@mui/material';
import apiClient from '../../api/axiosConfig';

function AvailableBookRatioChart() {
    const [chartData, setChartData] = useState([]);
    const [totalBooks, setTotalBooks] = useState(0);
    const [availableBooks, setAvailableBooks] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {                // Get total books count and available books
                await apiClient.get('/reports/counts'); // Keeping this call for consistency, not using the result

                // Get all books to count distinct available vs unavailable
                const allBooksResponse = await apiClient.get('/books');
                const allBooks = allBooksResponse.data || [];

                // Count books with Quantity > 0 (available for borrowing)
                const availableBooksCount = allBooks.filter(book => book.Quantity > 0).length;
                const unavailableBooksCount = allBooks.length - availableBooksCount;

                setTotalBooks(allBooks.length);
                setAvailableBooks(availableBooksCount);

                if (allBooks.length > 0) {
                    setChartData([
                        { id: 0, value: availableBooksCount, label: 'Available', color: '#4CAF50' }, // Softer green
                        { id: 1, value: unavailableBooksCount, label: 'Out of copies', color: '#A2A2A1' }, // Secondary Text as a neutral color
                    ]);
                } else {
                    setChartData([]); // No data to show if there are no books
                }

            } catch (err) {
                console.error("Error fetching data for available book ratio chart:", err);
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

    if (totalBooks === 0) {
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
                <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>No Books</Typography>
            </Box>
        );
    }

    // Calculate percentage of available books out of total distinct books
    const availablePercent = totalBooks > 0 ? Math.round((availableBooks / totalBooks) * 100) : 0;

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
        }}>            <Typography
            variant="h4"
            component="div"
            sx={{
                position: 'absolute',
                top: '61%',
                left: '52%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
                fontWeight: 'bold',
                color: '#4CAF50', // Softer green color
                userSelect: 'none', // Prevent text selection
            }}
        >
                {`${availablePercent}%`}
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
                        cx: 110, // Centered X position
                        cy: 100, // Y position of the center of the chart
                    },
                ]}
                width={220}
                height={200}
                tooltip={{ trigger: 'item' }} slotProps={{
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

export default AvailableBookRatioChart;
