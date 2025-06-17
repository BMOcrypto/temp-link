import supabase from '../utils/supabaseClient';
import { schedule } from 'node-cron';

const expiryJob = () => {
    schedule('0 * * * *', async () => {
        const currentTime = new Date();
        try {
            await supabase
                .from('links')
                .delete()
                .lt('expirationTime', currentTime.toISOString());
            console.log('Expired links deleted successfully');
        } catch (error) {
            console.error('Error deleting expired links:', error);
        }
    });
};

export default expiryJob;