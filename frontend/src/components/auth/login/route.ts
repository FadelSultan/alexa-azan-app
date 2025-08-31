import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { authCodes } from '../token/route'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, redirect_uri, state } = body

    // Authenticate user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error || !data.user) {
      return NextResponse.json({
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      })
    }

    // Generate authorization code
    const authCode = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Store auth code (expires in 10 minutes)
    authCodes.set(authCode, {
      userId: data.user.id,
      expiresAt: Date.now() + (10 * 60 * 1000)
    })

    // Build redirect URL
    const redirectUrl = new URL(redirect_uri)
    redirectUrl.searchParams.set('code', authCode)
    if (state) {
      redirectUrl.searchParams.set('state', state)
    }

    return NextResponse.json({
      success: true,
      redirect_url: redirectUrl.toString()
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ غير متوقع'
    })
  }
}