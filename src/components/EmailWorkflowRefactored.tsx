import { useState } from "react";
import { CircleX, Loader } from "lucide-react";
import axios from "axios";
import {
  extractSubject,
  personalizeEmail,
  removeSubjectLine,
  steps,
} from "@/utils/UtilFunctions";
import { useWorkflow } from "@/context/EmailWorkflow";
import {
  StepSelectOption,
  StepJobDescription,
  StepUploadResume,
  StepProvideEmailTemplate,
  StepEmailContext,
  StepEditContent,
  FinalMailing,
} from "@/components/EmailWorkflowComps";

const EmailWorkflow = ({
  isModalOpen,
  setIsModalOpen,
  employees,
}: {
  isModalOpen: Boolean;
  setIsModalOpen: any;
  employees: any;
}) => {
  const { state, setState, initialState } = useWorkflow();

  const [contentLoading, setContentLoading] = useState(false);

  const [mailingProgressBar, setMailingProgressBar] = useState<number>(0);
  const [sendingTo, setSendingTo] = useState<string>("");

  const updateState = (setState: any, updates: Partial<any>) => {
    setState((prev: any) => ({ ...prev, ...updates }));
  };

  const fetchGeneratedContent = async () => {
    setContentLoading(true); // Show loader
    try {
      const formData = new FormData();
      formData.append("optionSelected", state.emailContext || "");
      formData.append("jobDescription", state.jobDescription);
      if (state.resumeFile) {
        formData.append("resume", state.resumeFile);
      }
      formData.append("emailTemplate", state.emailTemplate);

      const url = `${process.env.NEXT_PUBLIC_URL}/api/sendToAi`;
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // console.info(`data : ${response.data.data}`)

      const generated_body = response.data.data;

      setState((prev: any) => ({
        ...prev,
        emailContent: removeSubjectLine(generated_body),
      }));

      setState((prev: any) => ({
        ...prev,
        finalSubject: extractSubject(generated_body),
      }));

      setState((prev: any) => ({
        ...prev,
        currentStep: steps.aiGenerated.steps.editAndMark.key,
      }));
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setContentLoading(false); // Hide loader
  };

  const handleModalClose = () => {
    updateState(setState, initialState);
    setIsModalOpen(false);
  };

  const handleStartMailing = async () => {
    console.log({ state, employees });
    updateState(setState, { currentStep: steps.final.key });

    if (employees.length > 0) {
      const url = `${process.env.NEXT_PUBLIC_URL}/api/mailer`;

      for (let i = 0; i < employees.length; i++) {
        const employee = employees[i];
        const finalEmailContent = personalizeEmail(
          employee,
          state.emailContent,
        );
        const payload = {
          subject: state.finalSubject,
          message: finalEmailContent,
          email: employee.email,
        };

        console.log(finalEmailContent);

        console.log(`Sending Email to ${employee.firstName}`);

        setSendingTo(employee.firstName);

        try {
          const response = await axios.post(url, payload);
          // Simulate a fake email sending event
          // await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate 500ms delay

          console.log(
            `Email sent successfully to ${employee.email}:`,
            response.data,
          );
        } catch (error) {
          console.error(`Failed to send email to ${employee.email}:`, error);
        }

        // Update progress bar
        const progress = Math.round(((i + 1) / employees.length) * 100);
        setMailingProgressBar(progress);
      }

      setMailingProgressBar(100);

      await new Promise((resolve) => setTimeout(resolve, 250));
      handleModalClose();
    } else {
      console.log("No employees to send emails to.");
    }
  };

  if (employees.length === 0) {
    alert("No Employees are selected for sending email to");
    setIsModalOpen(false);
    return null;
  }

  const renderStep = (step: string) => {
    const components: Record<string, JSX.Element> = {
      selectOption: <StepSelectOption />,
      pasteAndMark: (
        <StepEditContent
          fetchGeneratedContent={fetchGeneratedContent}
          handleStartMailing={handleStartMailing}
        />
      ),
      emailContext: <StepEmailContext />,
      jobDescription: <StepJobDescription />,
      chooseResume: <StepUploadResume />,
      referenceTemplate: (
        <StepProvideEmailTemplate
          fetchGeneratedContent={fetchGeneratedContent}
        />
      ),
      editAndMark: (
        <StepEditContent
          fetchGeneratedContent={fetchGeneratedContent}
          handleStartMailing={handleStartMailing}
        />
      ),
      MailingStarts: (
        <FinalMailing
          mailingProgressBar={mailingProgressBar}
          sendingTo={sendingTo}
        />
      ),
    };

    return components[step] || null;
  };

  const currentStepComponent = renderStep(state.currentStep);

  // console.log("EmailWorkflow Re-rendered with currentStep : ", state.currentStep)

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <CircleX
              className="text-gray-500 mb-4 cursor-pointer"
              onClick={handleModalClose}
            />

            {contentLoading && (
              <div className="flex justify-center items-center mb-4">
                <Loader className="w-6 h-6 text-blue-500 animate-spin" />
                <span className="ml-2 text-gray-500">Loading...</span>
              </div>
            )}

            {/* Step-Based Rendering */}
            {currentStepComponent && currentStepComponent}
          </div>
        </div>
      )}
    </>
  );
};

export default EmailWorkflow;
