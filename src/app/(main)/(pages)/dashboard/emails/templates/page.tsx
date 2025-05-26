"use client";
import { useState } from "react";
import TemplatesPanel from "@/features/emails/templates/components/TemplatesPanel";

const TemplatesPage = () => {
  const [mainContentWidth, setMainContentWidth] = useState("100%");

  return (
    <div className="flex h-full p-6 gap-6">
      {/* Main content - will resize when an email panel opens */}
      <section
        className="flex flex-col h-full transition-all duration-300 ease-in-out"
        style={{ width: mainContentWidth }}
      >
        <TemplatesPanel />
      </section>
    </div>
  );
};

export default TemplatesPage;
