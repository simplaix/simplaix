'use client';

import { motion } from 'framer-motion';
import { X, Users, Paperclip } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { DraftData } from '@/toolbox/tools/local/email/types/draft';

export function DraftInputs({
  className,
  draftData,
  onClose,
}: {
  className?: string;
  draftData: DraftData;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(draftData);
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    try {
      setIsSending(true);

      toast.success('Email sent successfully');
      onClose();
    } catch (error) {
      console.error('Failed to send email:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to send email'
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={cn(
        'relative bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-auto h-[600px] flex flex-col',
        className
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">New Email Draft</h2>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100 rounded-full size-8"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto min-h-0 flex flex-col">
        <div className="space-y-2 shrink-0">
          <Label htmlFor="to" className="text-sm font-medium text-gray-700">
            To
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="to"
                value={draft.recipients.to.join(', ')}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    recipients: {
                      ...draft.recipients,
                      to: e.target.value
                        .split(',')
                        .map((email) => email.trim()),
                    },
                  })
                }
                placeholder="Add recipients..."
                className="pl-8"
              />
              <Users className="size-4 absolute top-2 left-2 text-gray-500" />
            </div>
            <Button variant="outline" size="sm">
              Cc
            </Button>
            <Button variant="outline" size="sm">
              Bcc
            </Button>
          </div>
        </div>

        <div className="space-y-2 shrink-0">
          <Label
            htmlFor="subject"
            className="text-sm font-medium text-gray-700"
          >
            Subject
          </Label>
          <Input
            id="subject"
            value={draft.subject}
            onChange={(e) =>
              setDraft({
                ...draft,
                subject: e.target.value,
              })
            }
            placeholder="Email subject"
            className="w-full"
          />
        </div>

        <Separator className="my-4 shrink-0" />

        <div className="flex-1 flex flex-col min-h-0">
          <Textarea
            id="content"
            value={draft.content}
            onChange={(e) =>
              setDraft({
                ...draft,
                content: e.target.value,
              })
            }
            placeholder="Write your email..."
            className="size-full resize-none"
          />
        </div>

        <div className="flex items-center justify-between pt-4 shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 px-3">
              <Paperclip className="size-4" />
              Attach
            </Button>
            {draft.attachments && draft.attachments.length > 0 && (
              <span className="text-sm text-gray-500">
                {draft.attachments.length} file(s) attached
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Save as Draft</Button>
            <Button onClick={handleSendEmail} disabled={isSending}>
              {isSending ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
