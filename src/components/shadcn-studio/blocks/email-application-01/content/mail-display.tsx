import MailDisplayContent from '@/components/shadcn-studio/blocks/email-application-01/content/mail-display-content';

// Type Imports
import type { Email } from '@/components/shadcn-studio/blocks/email-application-01/email-application-01';

const MailDisplay = ({ email }: { email: Email | null }) => {
  if (!email) {
    return (
      <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 p-10 text-center">
        <p className="text-foreground text-sm font-medium">No message selected</p>
        <p className="text-xs">Choose an email from the list to read it here.</p>
      </div>
    );
  }

  return <MailDisplayContent key={email.id} email={email} />;
};

export default MailDisplay;
