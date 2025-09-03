import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
    console.log('🎫 OAuth Token Request:', req.body);
    
    const { 
        grant_type, 
        code, 
        client_id, 
        client_secret,
        redirect_uri 
    } = req.body;
    
    // تحقق من credentials
    if (client_id !== 'alexa-azan-skill-2024' || 
        client_secret !== 'sk_azan_secret_key_2024_secure') {
        return res.status(401).json({ error: 'Invalid client credentials' });
    }
    
    // البحث عن authorization code
    const { data: authData, error } = await supabase
        .from('auth_requests')
        .select('*')
        .eq('auth_code', code)
        .eq('client_id', client_id)
        .single();
    
    if (error || !authData) {
        return res.status(400).json({ error: 'Invalid authorization code' });
    }
    
    // إنشاء access token
    const access_token = `at_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
    const refresh_token = `rt_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
    
    // إرسال tokens لـ Alexa
    res.status(200).json({
        access_token,
        refresh_token,
        token_type: 'bearer',
        expires_in: 3600
    });
}