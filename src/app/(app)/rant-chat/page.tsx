'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { rantChatEmpathy } from '@/ai/flows/rant-chat-empathy';
import { useUser } from '@/context/user-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppTranslation } from '@/context/language-provider';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

type Personality = 'Empathetic Listener' | 'Talkative Friend' | 'Problem Solver';

export default function RantChatPage() {
  const { t } = useAppTranslation();
  
  const personalities: { value: Personality, description: string }[] = [
      { value: 'Empathetic Listener', description: t('rantChatPage.personalities.listenerDesc') },
      { value: 'Talkative Friend', description: t('rantChatPage.personalities.friendDesc') },
      { value: 'Problem Solver', description: t('rantChatPage.personalities.solverDesc') },
  ];

  const getTranslatedPersonality = (p: Personality) => {
    if (p === 'Empathetic Listener') return t('rantChatPage.personalities.listener');
    if (p === 'Talkative Friend') return t('rantChatPage.personalities.friend');
    if (p === 'Problem Solver') return t('rantChatPage.personalities.solver');
    return p;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: t('rantChatPage.initialMessage'),
      sender: 'ai',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [personality, setPersonality] = useState<Personality>('Empathetic Listener');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const context = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
      const response = await rantChatEmpathy({ rant: inputValue, context, personality });
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: response.response,
        sender: 'ai',
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: t('rantChatPage.connectionError'),
        sender: 'ai',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="flex-1 p-6 flex flex-col items-center">
        <div className="w-full max-w-3xl flex flex-col h-full border rounded-xl shadow-sm">
            <header className="p-4 border-b space-y-2">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-headline font-semibold">{t('rantChatPage.title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('rantChatPage.description')}</p>
                    </div>
                    <div className="w-48">
                        <Select value={personality} onValueChange={(value: Personality) => setPersonality(value)} disabled={isLoading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a personality" />
                            </SelectTrigger>
                            <SelectContent>
                                {personalities.map(p => (
                                    <SelectItem key={p.value} value={p.value}>
                                        <p className="font-semibold">{getTranslatedPersonality(p.value)}</p>
                                        <p className="text-xs text-muted-foreground">{p.description}</p>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </header>
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-start gap-3',
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.sender === 'ai' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-md rounded-lg p-3 text-sm',
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>
                  {message.sender === 'user' && (
                     <Avatar className="h-8 w-8">
                        <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-0"></span>
                            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-150"></span>
                            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-300"></span>
                        </div>
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="relative">
              <Input
                placeholder={t('rantChatPage.inputPlaceholder')}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
                className="pr-12"
              />
              <Button
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
