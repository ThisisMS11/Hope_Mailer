import React, { createContext, useContext, useState } from "react";
const WorkflowContext = createContext<any>(null);

const EmailWorkflowProvider = ({ children }: any) => {
  const initialState = {
    currentStep: "selectOption",
    emailContext: null,
    jobDescription: "",
    jobPosition: "",
    resumeFile: null,
    emailTemplate: "",
    emailContent: "",
    finalSubject: "",
    attachResumeLink: false,
    resumeLink: "",
    attachInternshipLink: false,
    internshipLink: "",
  };

  const [state, setState] = useState(initialState);

  const updateState = (updates: Partial<any>) => {
    setState((prev: any) => ({ ...prev, ...updates }));
  };

  return (
    <WorkflowContext.Provider
      value={{ state, setState, initialState, updateState }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

const useWorkflow = () => useContext(WorkflowContext);

export { EmailWorkflowProvider, useWorkflow };
