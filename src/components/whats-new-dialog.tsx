
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from './ui/badge';
import { useAppTranslation } from '@/context/language-provider';
import ReactMarkdown from 'react-markdown';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';

interface WhatsNewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WhatsNewDialog({ isOpen, onOpenChange }: WhatsNewDialogProps) {
  const { t } = useAppTranslation();
  
  const features = t('whatsNew.features', { returnObjects: true }) as string[];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <Badge variant="outline" className="mb-4">{t('whatsNew.badge')}</Badge>
            <div className="font-headline text-3xl font-bold text-primary">
              {t('whatsNew.version')}
            </div>
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {t('whatsNew.description')}
          </DialogDescription>
        </DialogHeader>
        <ul className="prose prose-sm dark:prose-invert max-w-none list-disc pl-5 space-y-2">
            {features.map((feature, index) => (
                <li key={index}><ReactMarkdown components={{p: React.Fragment}}>{feature}</ReactMarkdown></li>
            ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
