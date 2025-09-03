import { supabase } from '../../../lib/supabase';

export async function GET(request) {
    try {
        console.log('👤 User Profile API Request');
        
        // جلب access token من headers
        const authHeader = request.headers.get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return Response.json(
                { error: 'Missing or invalid authorization header' }, 
                { status: 401 }
            );
        }
        
        const accessToken = authHeader.substring(7); // إزالة 'Bearer '
        console.log('🔑 Access Token received');
        
        // البحث عن المستخدم بـ access token
        const { data: tokenData, error: tokenError } = await supabase
            .from('user_tokens')
            .select(`
                user_id,
                expires_at,
                users (
                    id,
                    email,
                    created_at
                )
            `)
            .eq('access_token', accessToken)
            .single();
        
        if (tokenError || !tokenData) {
            console.log('❌ Token not found:', tokenError);
            return Response.json(
                { error: 'Invalid access token' }, 
                { status: 401 }
            );
        }
        
        // تحقق من انتهاء الصلاحية
        if (new Date() > new Date(tokenData.expires_at)) {
            console.log('⏰ Token expired');
            return Response.json(
                { error: 'Access token expired' }, 
                { status: 401 }
            );
        }
        
        // جلب إعدادات المستخدم
        const { data: settings, error: settingsError } = await supabase
            .from('prayer_settings')
            .select('*')
            .eq('user_id', tokenData.user_id)
            .single();
        
        // بناء response
        const userProfile = {
            id: tokenData.users.id,
            email: tokenData.users.email,
            city: settings?.city || 'Makkah',
            country: settings?.country || 'SA',
            method: settings?.calculation_method || 4,
            timezone: settings?.timezone || 'Asia/Riyadh',
            created_at: tokenData.users.created_at
        };
        
        console.log('✅ User profile found:', userProfile.email);
        
        return Response.json(userProfile, { status: 200 });
        
    } catch (error) {
        console.error('💥 User Profile API Error:', error);
        return Response.json(
            { error: 'Internal server error' }, 
            { status: 500 }
        );
    }
}