const Analytics = require('../models/Analytics');

// Track a new visit
exports.trackVisit = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let analytics = await Analytics.findOne({ date: today });
        if (!analytics) {
            analytics = new Analytics({ date: today });
        }

        analytics.visits += 1;
        await analytics.save();

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error tracking visit:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Get Dashboard Statistics (Protected)
exports.getDashboardStats = async (req, res) => {
    try {
        const { range } = req.query; // 'today', 'week', 'month'
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let startDate = new Date(today);

        switch (range) {
            case 'week':
                startDate.setDate(today.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(today.getMonth() - 1);
                break;
            default: // 'today'
                // startDate is already today
                break;
        }

        const stats = await Analytics.find({
            date: { $gte: startDate }
        }).sort({ date: 1 });

        // Calculate totals
        const totalVisits = stats.reduce((acc, curr) => acc + curr.visits, 0);
        const totalOrders = stats.reduce((acc, curr) => acc + curr.ordersCount, 0);
        const totalRevenue = stats.reduce((acc, curr) => acc + curr.revenue, 0);

        // Daily breakdown for charts
        const dailyData = stats.map(stat => ({
            date: stat.date.toLocaleDateString(),
            visits: stat.visits,
            orders: stat.ordersCount,
            revenue: stat.revenue
        }));

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    visits: totalVisits,
                    orders: totalOrders,
                    revenue: totalRevenue
                },
                chartData: dailyData
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
