import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY || ''
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

export async function generateContent(prompt: string, contentType: 'title' | 'subtitle' | 'description' | 'project') {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your environment variables.')
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    let systemPrompt = ''
    
    switch (contentType) {
      case 'title':
        systemPrompt = 'Generate a compelling, professional title for an architectural firm\'s website. Keep it concise (2-4 words), impactful, and related to architecture, design, or construction. Focus on excellence, innovation, or craftsmanship.'
        break
      case 'subtitle':
        systemPrompt = 'Generate a professional subtitle for an architectural firm\'s hero section. Keep it under 10 words, inspiring, and clearly communicate the value proposition. Focus on transformation, spaces, innovation, or design.'
        break
      case 'description':
        systemPrompt = 'Generate a compelling description for an architectural firm\'s hero section. Keep it 1-2 sentences, professional tone, and highlight the firm\'s expertise in creating innovative, functional, and sustainable architectural solutions.'
        break
      case 'project':
        systemPrompt = 'Generate a brief, professional description for an architectural project. Keep it 1-2 sentences, highlighting key features, design elements, or unique aspects. Use architectural terminology appropriately.'
        break
    }

    const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}\n\nGenerate only the content, no additional formatting or explanation.`

    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()

    return text.trim()
  } catch (error) {
    console.error('Error generating content with Gemini:', error)
    throw new Error('Failed to generate content')
  }
}

export async function generateProjectIdeas() {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your environment variables.')
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `Generate 3 diverse architectural project ideas for a portfolio showcase. Include:
    - A creative project title
    - Project category (Residential/Commercial/Cultural/Industrial)
    - A brief description (1-2 sentences)
    
    Format as JSON array with objects containing: title, category, description
    
    Focus on modern, innovative architectural concepts that would appeal to potential clients.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      // Try to parse as JSON, fallback to plain text if it fails
      return JSON.parse(text)
    } catch {
      return text
    }
  } catch (error) {
    console.error('Error generating project ideas:', error)
    throw new Error('Failed to generate project ideas')
  }
}