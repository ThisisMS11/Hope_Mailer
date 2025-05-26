"use client";
import Contact from "@/features/contacts/components/Contact";
import Email from "@/features/emails/templates/components/TemplatesPanel";
import { useNavigation } from "@/context/NavigationContext";

export default function Dashboard() {
  const componentMap: { [key: string]: () => JSX.Element } = {
    contacts: Contact,
    emails: Email,
  };

  const { activeView } = useNavigation();
  const ActiveComponent = componentMap[activeView] || Contact;

  return (
    <>
      <ActiveComponent />
    </>
  );
}
