'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from './ui/badge';
import { useAppTranslation } from '@/context/language-provider';

interface WhatsNewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WhatsNewDialog({ isOpen, onOpenChange }: WhatsNewDialogProps) {
  const { t } = useAppTranslation();
  
  const features = [
    t('whatsNew.features.pocketCoach'),
    t('whatsNew.features.aboutPage'),
    t('whatsNew.features.images'),
    t('whatsNew.features.breathingFix'),
    t('whatsNew.features.fullSuite')
  ];

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
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ul>
            {features.map((feature, index) => (
                <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
