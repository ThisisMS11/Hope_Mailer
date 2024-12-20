import { useState } from "react";
import { Button, Textarea, Label, Input } from "@/imports/Shadcn_imports"; // Assuming Spinner is available in the imports
import { CircleX, Loader } from "lucide-react";
import axios from "axios";

const EmailWorkflow = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: Boolean;
  setIsModalOpen: any;
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

  const handleStart = () => setIsModalOpen(true);

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

      setEmailContent(response.data.data); // Populate the textarea
      setCurrentStep(4); // Move to step 4 after fetching
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
                <h2 className="text-xl font-bold mb-4">
                  Provide Email Template
                </h2>
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
                <h2 className="text-xl font-bold mb-4">
                  Generated Email Content
                </h2>
                <Textarea
                  className="w-full border rounded p-2"
                  placeholder="Generated Email Content will appear here..."
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                />
                <div className="flex justify-between mt-4">
                  <Button onClick={handleBackStep}>Back</Button>
                  <Button onClick={handleSubmit}>Retry</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EmailWorkflow;
