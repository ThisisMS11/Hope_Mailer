import React, { createContext, useContext, useState } from "react";
const WorkflowContext = createContext<any>(null);

const EmailWorkflowProvider = ({ children }: any) => {
  const initialState = {
    currentStep: "selectOption",
    emailContext: null,
    jobDescription: "",
    resumeFile: null,
    emailTemplate: "",
    emailContent: "",
    finalSubject: "",
  };

  const [state, setState] = useState(initialState);
  return (
    <WorkflowContext.Provider value={{ state, setState, initialState }}>
      {children}
    </WorkflowContext.Provider>
  );
};

const useWorkflow = () => useContext(WorkflowContext);

export { EmailWorkflowProvider, useWorkflow };
