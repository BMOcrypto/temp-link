import supabase from '../utils/supabaseClient';

class LinkService {
    async createLink(originalUrl: string, userId: string, expirationTime: Date): Promise<any> {
        let shortenedUrl: string;
        let exists = true;
        // Ensure unique shortenedUrl
        do {
            shortenedUrl = this.generateShortenedUrl();
            const { data: links } = await supabase
                .from('links')
                .select('id')
                .eq('shortenedUrl', shortenedUrl);
            exists = !!(links && links.length > 0);
        } while (exists);

        const { data, error } = await supabase
            .from('links')
            .insert([{ originalUrl, shortenedUrl, userId, expirationTime, createdAt: new Date() }]);
        if (error) throw new Error(error.message);
        return data && data[0];
    }

    async getLink(shortenedUrl: string): Promise<any> {
        const { data, error } = await supabase
            .from('links')
            .select('*')
            .eq('shortenedUrl', shortenedUrl)
            .limit(1);
        if (error) throw new Error(error.message);
        return data && data[0];
    }

    async deleteExpiredLinks(): Promise<void> {
        const now = new Date();
        await supabase
            .from('links')
            .delete()
            .lt('expirationTime', now.toISOString());
    }

    private generateShortenedUrl(): string {
        return Math.random().toString(36).substring(2, 8);
    }

    async getUserLinks(userId: string): Promise<any[]> {
        const { data, error } = await supabase
            .from('links')
            .select('*')
            .eq('userId', userId);
        if (error) throw new Error(error.message);
        return data || [];
    }

    async getLinkAnalytics(shortenedUrl: string): Promise<any> {
        const link = await this.getLink(shortenedUrl);
        if (!link) {
            throw new Error('Link not found');
        }
        return {
            originalUrl: link.originalUrl,
            shortenedUrl: link.shortenedUrl,
            clicks: link.analytics?.clicks || 0,
            createdAt: link.createdAt,
            expirationTime: link.expirationTime,
        };
    }
}

export default LinkService;