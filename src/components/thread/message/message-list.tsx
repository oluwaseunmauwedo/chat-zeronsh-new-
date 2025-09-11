import { MessageItem } from '@/components/thread/message/message-item';
import { MultiModalInput } from '@/components/thread/multi-modal-input';
import { MessageContext, useThreadSelector } from '@/context/thread';
import { useAutoResume } from '@/hooks/use-auto-resume';
import { StickToBottom, useStickToBottom } from 'use-stick-to-bottom';
import { Virtualizer, VirtualizerHandle } from 'virtua';
import { useEffect, useRef } from 'react';

export function MessageList() {
    const mounted = useRef(false);
    const ref = useRef<VirtualizerHandle>(null);
    const messageIds = useThreadSelector(state => state.messageIds);
    const isStreaming = useThreadSelector(state => state.status === 'streaming');
    const instance = useStickToBottom({
        initial: 'instant',
        resize: isStreaming ? 'smooth' : 'instant',
    });

    useAutoResume();

    useEffect(() => {
        if (mounted.current) {
            return;
        }

        ref.current?.scrollToIndex(messageIds.length - 1, {
            align: 'end',
        });

        const timer = setTimeout(() => {
            mounted.current = true;
        }, 100);

        return () => clearTimeout(timer);
    }, [messageIds.length]);

    return (
        <StickToBottom className="absolute top-0 left-0 right-0 bottom-4" instance={instance}>
            <Virtualizer
                as={StickToBottom.Content}
                ref={ref}
                scrollRef={instance.scrollRef}
                ssrCount={5}
                overscan={1}
            >
                {messageIds.map(id => (
                    <MessageContext key={id} value={id}>
                        <MessageItem id={id} />
                    </MessageContext>
                ))}
            </Virtualizer>
            <MultiModalInput />
        </StickToBottom>
    );
}
