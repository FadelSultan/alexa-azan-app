import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const clientId = searchParams.get('client_id')
  const redirectUri = searchParams.get('redirect_uri') 
  const responseType = searchParams.get('response_type')
  const state = searchParams.get('state')
  const scope = searchParams.get('scope')

  // Validate required parameters
  if (!clientId || !redirectUri || responseType !== 'code') {
    return NextResponse.json(
      { error: 'invalid_request', error_description: 'Missing or invalid parameters' },
      { status: 400 }
    )
  }

  // Validate client_id
  if (clientId !== 'alexa-azan-skill') {
    return NextResponse.json(
      { error: 'invalid_client', error_description: 'Invalid client_id' },
      { status: 400 }
    )
  }

  // Create authorization page
  const authPageHtml = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ربط حساب Alexa Azan</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 400px; margin: 50px auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h2 { text-align: center; color: #333; margin-bottom: 30px; }
            input { width: 100%; padding: 12px; margin: 8px 0; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box; }
            button { width: 100%; background: #0066cc; color: white; padding: 12px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
            button:hover { background: #0052a3; }
            .error { color: red; text-align: center; margin-top: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>🕌 ربط حساب Alexa Azan</h2>
            <form id="loginForm">
                <input type="email" id="email" placeholder="البريد الإلكتروني" required>
                <input type="password" id="password" placeholder="كلمة المرور" required>
                <button type="submit">تسجيل الدخول وربط الحساب</button>
            </form>
            <div id="error" class="error"></div>
        </div>
        
        <script>
            document.getElementById('loginForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const errorDiv = document.getElementById('error');
                
                try {
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            email, 
                            password, 
                            redirect_uri: '${redirectUri}',
                            state: '${state}'
                        })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        window.location.href = result.redirect_url;
                    } else {
                        errorDiv.textContent = result.error || 'خطأ في تسجيل الدخول';
                    }
                } catch (err) {
                    errorDiv.textContent = 'حدث خطأ غير متوقع';
                }
            });
        </script>
    </body>
    </html>
  `

  return new NextResponse(authPageHtml, {
    headers: { 'Content-Type': 'text/html' }
  })
}