import { create } from 'zustand';
import { EmailResult } from '@/toolbox/tools/local/email/types/email';

interface EmailStore {
  showEmailUI: boolean;
  selectedEmail: EmailResult | null;
  setShowEmailUI: (show: boolean) => void;
  setSelectedEmail: (email: EmailResult) => void;
}

export const useEmailStore = create<EmailStore>((set) => ({
  showEmailUI: false,
  selectedEmail: null,
  setShowEmailUI: (show) => set({ showEmailUI: show }),
  setSelectedEmail: (email) => set({ selectedEmail: email }),

}));
