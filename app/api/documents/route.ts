import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { put } from '@vercel/blob'
import { encrypt } from '@/lib/encryption'

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const caseId = formData.get('caseId') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Read file as buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Encrypt file content
    const encryptedContent = encrypt(buffer.toString('base64'))
    const encryptedBlob = new Blob([encryptedContent], { type: 'text/plain' })

    // Upload to Vercel Blob
    const blob = await put(`documents/${session.user.id}/${Date.now()}-${file.name}`, encryptedBlob, {
      access: 'public',
    })

    // Save document record
    const document = await db.document.create({
      data: {
        userId: session.user.id,
        caseId: caseId || null,
        fileName: file.name,
        fileUrl: blob.url,
        fileSize: file.size,
        fileType: file.type,
        encrypted: true,
        category: category || 'GENERAL',
        description: description || null,
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      message: 'File uploaded successfully',
      document,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const documents = await db.document.findMany({
      where: { userId: session.user.id },
      orderBy: { uploadedAt: 'desc' },
      include: {
        case: {
          select: {
            caseNumber: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json({ documents })
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}
