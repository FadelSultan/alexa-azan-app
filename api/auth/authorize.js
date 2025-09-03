import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
    console.log('🔐 OAuth Authorize Request:', req.query);
    
    const { 
        client_id, 
        response_type, 
        state, 
        redirect_uri,
        scope 
    } = req.query;
    
    // تحقق من client_id
    if (client_id !== 'alexa-azan-skill-2024') {
        return res.status(400).json({ error: 'Invalid client_id' });
    }
    
    // إنشاء authorization code
    const auth_code = `ac_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // حفظ authorization request في database
    const { error } = await supabase.from('auth_requests').upsert({
        auth_code,
        client_id,
        state,
        redirect_uri,
        scope,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
    });
    
    if (error) {
        console.log('❌ Database error:', error);
        return res.status(500).json({ error: 'Database error' });
    }
    
    // إعادة توجيه لصفحة Authorization
    const authUrl = `/auth/alexa-link?code=${auth_code}&state=${state}&client_id=${client_id}`;
    res.redirect(302, authUrl);
}