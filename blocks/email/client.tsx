import { Block } from '@/components/base/create-block';
import { EmailList } from '@/components/email-ui/email-list';
import { EmailResult } from './types/email';

interface EmailBlockMetadata {
  emails: EmailResult[];
}

export const emailBlock = new Block<'email', EmailBlockMetadata>({
  kind: 'email',
  description: 'Useful for displaying email search results',
  initialize: async ({ setMetadata }) => {
    setMetadata({
      emails: [],
    });
  },
  onStreamPart: ({ streamPart, setMetadata }) => {
    if (streamPart.type === 'email-delta') {
      setMetadata((metadata) => ({
        ...metadata,
        emails: streamPart.content as EmailResult[],
      }));
    }
  },
  content: ({ metadata, block, setBlock }) => {
    if (!metadata?.emails) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">No emails to display</div>
        </div>
      );
    }

    return (
      <div className="p-4">
        <EmailList
          emails={metadata.emails}
          isVisible={block.isVisible}
          onClose={() => {
            setBlock((block) => ({ ...block, isVisible: false }));
          }}
          onSelect={(email) => {
            // Handle email selection if needed
          }}
        />
      </div>
    );
  },
  actions: [],
  toolbar: [],
}); 