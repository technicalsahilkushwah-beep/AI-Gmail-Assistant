import { NextResponse } from 'next/server'
import {auth} from '../../../../../auth'
import { createChat, deleteChat } from '@/lib/chat'


export async function POST() {
    const session = await auth()

    if(!session?.user?.id){
        return NextResponse.json({
            error:"Please login first"
        },{status:400})
    }

    const chat = await createChat(session?.user?.id)

    return NextResponse.json({
        chatId: chat
    },{status:201})
}

export async function DELETE(request: Request) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Please login first" }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const chatId = body?.chatId
    if (typeof chatId !== "string" || !chatId.trim()) {
        return NextResponse.json({ error: "A valid chat ID is required" }, { status: 400 })
    }

    const deleted = await deleteChat(chatId, session.user.id)
    return deleted
        ? NextResponse.json({ success: true })
        : NextResponse.json({ error: "Chat not found" }, { status: 404 })
}