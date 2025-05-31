import {} from "react";
import EmailRecordsPanel from "@/features/emails/records/components/EmailRecordsPanel";
const EmailsRecordsPage = () => {
  return (
    <div className="flex h-full p-6 gap-6">
      <section className="flex flex-col h-full w-full transition-all duration-300 ease-in-out">
        <EmailRecordsPanel />
      </section>
    </div>
  );
};

export default EmailsRecordsPage;
