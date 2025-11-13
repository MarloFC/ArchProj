import { NextRequest, NextResponse } from 'next/server'
import { generateContent } from '@/lib/gemini'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { prompt, contentType } = body

    if (!prompt || !contentType) {
      return NextResponse.json({ error: 'Missing prompt or contentType' }, { status: 400 })
    }

    const content = await generateContent(prompt, contentType)

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error in generate-content API:', error)
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 })
  }
}