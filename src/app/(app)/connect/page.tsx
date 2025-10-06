
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Link as LinkIcon, Send, Mailbox } from 'lucide-react';
import { useAppTranslation } from '@/context/language-provider';
import { useUser } from '@/context/user-provider';

const preWrittenMessages = [
    "You're doing great, keep going!",
    "Sending some positive energy your way.",
    "Remember to take a moment for yourself today.",
    "Your hard work is noticed and appreciated.",
    "It's okay to not be okay. Be kind to yourself."
];

export default function ConnectPage() {
    const { t } = useAppTranslation();
    const { toast } = useToast();
    const { user } = useUser();
    const [selectedMessage, setSelectedMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lastReceived, setLastReceived] = useState<string | null>(null);

    const messageKey = `connect_last_received_${user?.id}`;

    useEffect(() => {
        try {
            const storedMessage = localStorage.getItem(messageKey);
            if (storedMessage) {
                setLastReceived(storedMessage);
            }
        } catch (error) {
            console.error("Failed to access localStorage", error);
        }
    }, [user, messageKey]);

    const handleSendMessage = () => {
        if (!selectedMessage) return;

        setIsLoading(true);
        // Simulate sending a message and receiving one back
        setTimeout(() => {
            // Simulate another user sending a message to you
            const receivedMessage = preWrittenMessages[Math.floor(Math.random() * preWrittenMessages.length)];
            
            try {
                localStorage.setItem(messageKey, receivedMessage);
                setLastReceived(receivedMessage);
            } catch (error) {
                console.error("Failed to save to localStorage", error);
            }

            toast({
                title: t('connectPage.messageSent'),
                description: t('connectPage.messageSentDescription'),
            });
            setIsLoading(false);
            setSelectedMessage('');
        }, 1000);
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl flex items-center gap-2">
                            <LinkIcon /> {t('connectPage.title')}
                        </CardTitle>
                        <CardDescription>{t('connectPage.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select
                            onValueChange={setSelectedMessage}
                            value={selectedMessage}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('connectPage.selectMessage')} />
                            </SelectTrigger>
                            <SelectContent>
                                {preWrittenMessages.map((msg, index) => (
                                    <SelectItem key={index} value={msg}>{msg}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleSendMessage} disabled={!selectedMessage || isLoading} className="w-full">
                            <Send className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            {isLoading ? t('connectPage.sending') : t('connectPage.sendButton')}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2">
                           <Mailbox /> {t('connectPage.yourLastReceived')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {lastReceived ? (
                            <p className="italic text-muted-foreground">&ldquo;{lastReceived}&rdquo;</p>
                        ) : (
                            <p className="text-muted-foreground">{t('connectPage.noMessages')}</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
