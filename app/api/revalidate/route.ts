import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { paths } = await request.json()

    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json({ error: 'Invalid paths provided' }, { status: 400 })
    }

    // Revalidate the specified paths
    for (const path of paths) {
      revalidatePath(path)
    }

    return NextResponse.json({
      revalidated: true,
      paths,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error revalidating paths:', error)
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 })
  }
}