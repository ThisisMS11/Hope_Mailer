import { useState } from "react";
import {
  Button,
  Textarea,
  Label,
  Input,
  Progress,
} from "@/imports/Shadcn_imports"; // Assuming Spinner is available in the imports
import { CircleX, Loader } from "lucide-react";
import axios from "axios";
import {
  extractSubject,
  personalizeEmail,
  defaultEmailTemplate,
  removeSubjectLine,
} from "@/utils/UtilFunctions";
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
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<
    "referral" | "followup" | null
  >(null);

  // State variables for collecting input
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [emailTemplate, setEmailTemplate] = useState("");
  const [contentLoading, setContentLoading] = useState(false);
  const [emailContent, setEmailContent] = useState<string>("");
  const [finalSubject, setFinalSubject] = useState<string>("");

  const [mailingProgressBar, setMailingProgressBar] = useState<number>(0);
  const [sendingTo, setSendingTo] = useState<string>("");

  const handleOptionSelect = (option: "referral" | "followup") => {
    setSelectedOption(option);
    setCurrentStep(1);
  };

  const handleNextStep = () => setCurrentStep((prev) => prev + 1);
  const handleBackStep = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setContentLoading(true); // Show loader
    try {
      const formData = new FormData();
      formData.append("optionSelected", selectedOption || "");
      formData.append("jobDescription", jobDescription);
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }
      formData.append("emailTemplate", emailTemplate);

      const url = `${process.env.NEXT_PUBLIC_URL}/api/sendToAi`;
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // console.info(`data : ${response.data.data}`)

      const generated_body = response.data.data;
      setFinalSubject(extractSubject(generated_body));
      setEmailContent(removeSubjectLine(generated_body));

      setCurrentStep(4);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setContentLoading(false); // Hide loader
  };

  const handleModalClose = () => {
    setJobDescription("");
    setEmailTemplate("");
    setResumeFile(null);
    setEmailContent("");
    setCurrentStep(0);
    setIsModalOpen(false);
  };

  const handleStartMailing = async () => {
    handleNextStep();
    if (employees.length > 0) {
      const url = `${process.env.NEXT_PUBLIC_URL}/api/mailer`;

      for (let i = 0; i < employees.length; i++) {
        const employee = employees[i];
        const finalEmailContent = personalizeEmail(employee, emailContent);
        const payload = {
          subject: finalSubject,
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
            {currentStep === 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Select an Option</h2>
                <div className="flex flex-col space-y-4">
                  <Button onClick={() => handleOptionSelect("referral")}>
                    Ask for Referral
                  </Button>
                  <Button onClick={() => handleOptionSelect("followup")}>
                    Follow-up with Manager
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-4">
                  Enter Job Description
                </h2>
                <Textarea
                  className="w-full border rounded p-2"
                  placeholder="Paste job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <div className="flex justify-between mt-4">
                  <Button onClick={handleBackStep}>Back</Button>
                  <Button onClick={handleNextStep}>Next</Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <Label htmlFor="resume" className="mb-2">
                  Resume
                </Label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
                <div className="flex justify-between mt-4">
                  <Button onClick={handleBackStep}>Back</Button>
                  <Button onClick={handleNextStep}>Next</Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="flex justify-between">
                  <h2 className="text-xl font-bold mb-4">
                    Provide Email Template
                  </h2>
                  <Button
                    onClick={() => {
                      setEmailTemplate(defaultEmailTemplate);
                    }}
                  >
                    Use Default
                  </Button>
                </div>
                <Textarea
                  className="w-full border rounded p-2"
                  placeholder="Paste Email Template here..."
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                />
                <div className="flex justify-between mt-4">
                  <Button onClick={handleBackStep}>Back</Button>
                  <Button onClick={handleSubmit}>Submit</Button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Mark Your Variables</h2>

                <Label htmlFor="finalSubject" className="mb-2">
                  Subject
                </Label>
                <Input
                  id="finalSubject"
                  name="finalSubject"
                  type="text"
                  value={finalSubject}
                  onChange={(e) => setFinalSubject(e.target.value)}
                />

                <Label htmlFor="EditingFinalContent" className="my-4">
                  Edit Content for final Email Body
                </Label>
                <Textarea
                  name="EditingFinalContent"
                  className="w-full border rounded p-2"
                  placeholder="Generated Email Content will appear here..."
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                />
                <div className="flex justify-between mt-4">
                  <Button onClick={handleBackStep}>Back</Button>
                  <div>
                    <Button className="mr-4" onClick={handleSubmit}>
                      Retry
                    </Button>
                    <Button onClick={handleStartMailing}>Start Mailing</Button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <Progress
                  value={mailingProgressBar}
                  className="w-[90%] mx-auto"
                  max={100}
                />
                <div className="text-center mt-4 text-gray-500 text-lg">{`Sending email to ${sendingTo}`}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EmailWorkflow;
