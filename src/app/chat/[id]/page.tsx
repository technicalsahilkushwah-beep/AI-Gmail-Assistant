import Chat from '@/components/Chat'
import { getChat } from '@/lib/chat'
import { UIMessage } from 'ai'
import { notFound } from 'next/navigation'

type pageProps = {
  params: Promise<{
    id: string
  }>
}

const page = async ({ params }: pageProps) => {

  const { id } = await params

  const chat = await getChat(id)

  if (!chat) {
    notFound()
  }

  const messages = chat.messages as UIMessage[]
  return (
    <div className="flex min-w-0 flex-1">
      <Chat Id={id} initialMessages={messages}/>
    </div>
  )
}

export default page
