'use client';

import {
    Conversation,
    ConversationContent,
    ConversationEmptyState,
    ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
    PromptInput,
    PromptInputBody,
    PromptInputFooter,
    PromptInputMessage,
    PromptInputProvider,
    PromptInputSubmit,
    PromptInputTextarea,
} from '@/components/ai-elements/prompt-input';
import { Response } from '@/components/ai-elements/response';
import Header from '@/components/header';
import { Providers } from '@/components/providers';
import { useTaskContext } from '@/context/task-context';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { MessageSquareIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

function ChatComponent({ initialMessages }: { initialMessages: UIMessage[] }) {
    const { id } = useParams<{ id: string }>();
    console.log(initialMessages);

    const { setSidebarOpen, isSidebarOpen } = useTaskContext();
    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: `/api/chat/${id}`,
        }),
        messages: initialMessages,
    });
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (message: PromptInputMessage) => {
        const hasText = Boolean(message.text);
        if (!hasText) {
            return;
        }
        sendMessage({ text: message.text || '' });
    };

    return (
        <div className='flex h-screen bg-white text-gray-900 font-sans'>
            <main className='flex-1 flex flex-col overflow-hidden'>
                <Header
                    title='AI Chat'
                    onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                    showViewOptions={false}
                    showAddButton={false}
                />
                <div className='p-6'>
                    <Conversation
                        className='relative size-full'
                        style={{ height: '498px' }}
                    >
                        <ConversationContent>
                            {messages.length === 0 ? (
                                <ConversationEmptyState
                                    description='Messages will appear here as the conversation progresses.'
                                    icon={
                                        <MessageSquareIcon className='size-6' />
                                    }
                                    title='Start a conversation'
                                />
                            ) : (
                                messages.map(message => (
                                    <Message
                                        from={message.role}
                                        key={message.id}
                                    >
                                        {message.parts.map((part, index) =>
                                            part.type === 'text' ? (
                                                <MessageContent key={index}>
                                                    <Response>
                                                        {part.text}
                                                    </Response>
                                                </MessageContent>
                                            ) : null
                                        )}
                                    </Message>
                                ))
                            )}
                        </ConversationContent>
                        <ConversationScrollButton />
                    </Conversation>

                    <PromptInputProvider>
                        <PromptInput
                            globalDrop
                            multiple
                            onSubmit={handleSubmit}
                        >
                            <PromptInputBody>
                                <PromptInputTextarea ref={textareaRef} />
                            </PromptInputBody>
                            <PromptInputFooter>
                                <PromptInputSubmit status={status} />
                            </PromptInputFooter>
                        </PromptInput>
                    </PromptInputProvider>
                </div>
            </main>
            <div />
        </div>
    );
}

export default function ChatPage() {
    const { id } = useParams<{ id: string }>();

    const [initialMessages, setInitialMessages] = useState<any>([]);
    const [isChatLoading, setIsChatLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadMessages() {
            setIsChatLoading(true);
            const res = await fetch(`/api/chat/${id}`);
            const json = await res.json();
            if (json.thread) {
                setInitialMessages(json.thread || []);
            }
            setIsChatLoading(false);
        }
        loadMessages();
    }, [id]);

    if (isChatLoading) {
        return (
            <div className='animate-pulse p-4 max-w-sm mx-auto'>
                <div className='h-6 bg-gray-300 rounded mb-2'></div>
                <div className='h-6 bg-gray-300 rounded mb-2'></div>
                <div className='h-6 bg-gray-300 rounded'></div>
            </div>
        );
    }
    return (
        <Providers>
            <ChatComponent initialMessages={initialMessages} />
        </Providers>
    );
}
