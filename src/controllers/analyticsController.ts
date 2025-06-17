import { Request, Response } from 'express';
import AnalyticsService from '../services/analyticsService';

class AnalyticsController {
    private analyticsService: AnalyticsService;

    constructor() {
        this.analyticsService = new AnalyticsService();
    }

    public async getLinkAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const linkId = req.params.id;
            const analyticsData = await this.analyticsService.getLinkAnalytics(linkId);
            res.status(200).json(analyticsData);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving analytics data', error });
        }
    }

    public async getUserAnalytics(req: Request, res: Response): Promise<void> {
        // Not implemented
        res.status(501).json({ message: 'Not implemented' });
    }
}

export default AnalyticsController;