import { Request, Response } from 'express';
import LinkService from '../services/linkService';

class LinkController {
    private linkService: LinkService;

    constructor() {
        this.linkService = new LinkService();
    }

    public createLink = async (req: Request, res: Response): Promise<void> => {
        try {
            const { originalUrl, expirationTime } = req.body;
            const userId = req.userId; // Set by auth middleware
            if (!originalUrl || !expirationTime) {
                res.status(400).json({ message: 'originalUrl and expirationTime are required' });
                return;
            }
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized: userId missing' });
                return;
            }
            const link = await this.linkService.createLink(
                originalUrl,
                userId,
                new Date(expirationTime)
            );
            res.status(201).json(link);
        } catch (error) {
            res.status(500).json({ message: 'Error creating link', error });
        }
    };

    public getLink = async (req: Request, res: Response): Promise<void> => {
        try {
            const { shortenedUrl } = req.params;
            const link = await this.linkService.getLink(shortenedUrl);
            if (link) {
                res.redirect(link.originalUrl);
            } else {
                res.status(404).json({ message: 'Link not found or expired' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving link', error });
        }
    };

    public getUserLinks = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized: userId missing' });
                return;
            }
            const links = await this.linkService.getUserLinks(userId);
            res.status(200).json(links);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving user links', error });
        }
    };

    public getExpiredLinks = async (req: Request, res: Response): Promise<void> => {
        // Implement if needed, or return 501 Not Implemented
        res.status(501).json({ message: 'Not implemented' });
    };
}

export default LinkController;