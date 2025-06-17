import supabase from '../utils/supabaseClient';

class AnalyticsService {
    async getLinkAnalytics(linkId: string) {
        const { data, error } = await supabase
            .from('links')
            .select('*')
            .eq('id', linkId)
            .limit(1);
        if (error || !data || data.length === 0) {
            throw new Error('Link not found');
        }
        const link = data[0];
        return {
            originalUrl: link.originalUrl,
            shortenedUrl: link.shortenedUrl,
            clicks: link.analytics?.clicks || 0,
            createdAt: link.createdAt,
            expirationTime: link.expirationTime,
        };
    }

    async recordClick(linkId: string) {
        const { data, error } = await supabase
            .from('links')
            .select('analytics')
            .eq('id', linkId)
            .limit(1);
        if (error || !data || data.length === 0) {
            throw new Error('Link not found');
        }
        const analytics = data[0].analytics || { clicks: 0, lastAccessed: null };
        analytics.clicks = (analytics.clicks || 0) + 1;
        analytics.lastAccessed = new Date().toISOString();
        await supabase
            .from('links')
            .update({ analytics })
            .eq('id', linkId);
    }
}

export default AnalyticsService;