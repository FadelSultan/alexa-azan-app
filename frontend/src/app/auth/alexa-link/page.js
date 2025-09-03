'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function AlexaLink() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const client_id = searchParams.get('client_id');
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [linking, setLinking] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setLoading(false);
        };
        getUser();
    }, []);

    const handleLink = async () => {
        if (!user) return;
        
        setLinking(true);
        
        try {
            const { error } = await supabase
                .from('auth_requests')
                .update({ user_id: user.id })
                .eq('auth_code', code);

            if (error) throw error;

            alert('✅ Account linked successfully! You can now close this page.');
            
        } catch (error) {
            console.error('Linking error:', error);
            alert('❌ Failed to link account. Please try again.');
        } finally {
            setLinking(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">🕌 Link Your Account</h1>
                        <p className="text-gray-600 mt-2">Sign in to connect your Alexa skill</p>
                    </div>
                    
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                        Sign In to Link Alexa
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">🕌 Connect Alexa</h1>
                    <p className="text-gray-600 mt-2">Link your account for personalized prayer times</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-blue-900">✨ You'll get:</h3>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                        <li>🕌 Prayer times for your location</li>
                        <li>⚙️ Personalized settings</li>
                        <li>🌍 Multiple city support</li>
                    </ul>
                </div>
                
                <div className="bg-gray-50 p-3 rounded mb-4 text-sm text-gray-600">
                    <strong>Account:</strong> {user.email}
                </div>
                
                <button
                    onClick={handleLink}
                    disabled={linking}
                    className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 font-medium"
                >
                    {linking ? '🔄 Linking...' : '🔗 Link Account to Alexa'}
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                    By linking, you agree to share your settings with Alexa
                </p>
            </div>
        </div>
    );
}