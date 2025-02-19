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
import { useUiVisiableStore } from '@/toolbox/stores/uiVisiableStore';
import { UIContainer } from '@/components/base/ui-container';

const UITitle = 'New Email Draft';

export function InlineDraftInput({
  draftData,
  toolResultId,
}: {
  draftData: DraftData;
  toolResultId: string;
}) {
  const showDraftUI = useUiVisiableStore((state) => state.visiableUIs.has(toolResultId));
  const addVisiableUI = useUiVisiableStore((state) => state.addVisiableUI);

  return (
    <Button
      onClick={() => addVisiableUI(toolResultId)}
      className={cn(
        'flex flex-row gap-4 rounded-2xl p-4 bg-gray-800 hover:bg-gray-100 max-w-[300px] h-auto border border-gray-200'
      )}
    >
      <div className="flex flex-col">
        <div className="text-sm font-medium text-gray-900">
          New draft to {draftData.recipients.to.join(', ')}
        </div>
        <div className="text-xs text-gray-500">
          {showDraftUI ? 'Editing...' : 'Click to open draft'}
        </div>
      </div>
    </Button>
  );
}

export function DraftInputs({
  draftData,
  onClose,
  isInline = false,
  toolResultId,
}: {
  className?: string;
  draftData: DraftData;
  onClose: () => void;
  isInline?: boolean;
  toolResultId: string;
}) {

  const [draft, setDraft] = useState(draftData);
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    try {
      setIsSending(true);
      // TODO: send email here

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

  if (isInline) {
    return (
      <InlineDraftInput
        draftData={draftData}
        toolResultId={toolResultId}
      />
    );
  }

  return (
    <UIContainer onClose={onClose} title={UITitle + ' - ' + draft.subject} className="max-w-[800px] h-screen flex flex-col">
      <div className="space-y-4 flex-1 overflow-y-auto flex flex-col p-4">
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

        <div className="flex-1">
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
            className="w-full h-full min-h-[600px] resize-none"
            style={{ overflow: 'auto', minHeight: '300px' }}
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
    </UIContainer>
  );
}
