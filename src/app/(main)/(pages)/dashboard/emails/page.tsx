"use client";
import React, { useState } from "react";

const EmailsPage = () => {
  const [mainContentWidth, setMainContentWidth] = useState("100%");

  return (
    <div className="flex h-full p-6 gap-6 bb">
      {/* Main content - will resize when an email panel opens */}
      <section
        className="flex flex-col h-full transition-all duration-300 ease-in-out"
        style={{ width: mainContentWidth }}
      >
        something
      </section>
    </div>
  );
};

export default EmailsPage;
