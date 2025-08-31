import { NextRequest, NextResponse } from 'next/server'

// Temporary storage for auth codes (في الإنتاج نستخدم Redis أو Database)
const authCodes = new Map<string, { userId: string, expiresAt: number }>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { grant_type, code, client_id, client_secret } = body

    // Validate grant_type
    if (grant_type !== 'authorization_code') {
      return NextResponse.json(
        { error: 'unsupported_grant_type' },
        { status: 400 }
      )
    }

    // Validate client credentials
    if (client_id !== 'alexa-azan-skill' || client_secret !== 'alexa-azan-secret-2024') {
      return NextResponse.json(
        { error: 'invalid_client' },
        { status: 401 }
      )
    }

    // Validate authorization code
    const authData = authCodes.get(code)
    if (!authData || authData.expiresAt < Date.now()) {
      authCodes.delete(code) // Clean up expired code
      return NextResponse.json(
        { error: 'invalid_grant', error_description: 'Invalid or expired authorization code' },
        { status: 400 }
      )
    }

    // Clean up used code
    authCodes.delete(code)

    // Generate access token (في الإنتاج نستخدم JWT)
    const accessToken = `access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const refreshToken = `refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: refreshToken,
      scope: 'read:prayer_times control:devices'
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'server_error', error_description: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Export the auth codes map for use in other endpoints
export { authCodes }