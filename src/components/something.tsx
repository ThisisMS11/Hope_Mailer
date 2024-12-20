import { useState } from "react";
import { Button, Textarea, Label, Input } from '@/imports/Shadcn_imports'
import { CircleX } from 'lucide-react'

const EmailWorkflow = ({ isModalOpen, setIsModalOpen }: { isModalOpen: Boolean, setIsModalOpen: any }) => {
    const [currentStep, setCurrentStep] = useState(0); // 0: Initial, 1: Job Desc, 2: Resume, 3: Template
    const [selectedOption, setSelectedOption] = useState<"referral" | "followup" | null>(null);

    // State variables for collecting input
    const [jobDescription, setJobDescription] = useState("");
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [emailTemplate, setEmailTemplate] = useState("");

    const handleStart = () => setIsModalOpen(true);
    const handleOptionSelect = (option: "referral" | "followup") => {
        setSelectedOption(option);
        setCurrentStep(1);
    };

    const handleNextStep = () => setCurrentStep((prev) => prev + 1);
    const handleBackStep = () => setCurrentStep((prev) => prev - 1);

    const handleSubmit = () => {
        console.log("Selected Option:", selectedOption);
        console.log("Job Description:", jobDescription);
        console.log("Resume File:", resumeFile);
        console.log("Email Template:", emailTemplate);
        alert("Check console for collected data!");
        setIsModalOpen(false);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    }

    return (
        <>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <CircleX className="text-gray-500 mb-4 cursor-pointer" onClick={handleModalClose} />
                        {/* Step-Based Rendering */}
                        {currentStep === 0 && (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Select an Option</h2>

                                <div className="flex flex-col space-y-4">
                                    <Button onClick={() => handleOptionSelect("referral")}>Ask for Referral</Button>
                                    <Button onClick={() => handleOptionSelect("followup")}>Follow-up with Manager</Button>
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Enter Job Description</h2>
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
                                <Label htmlFor="picture" className="mb-2">Resume</Label>
                                <Input
                                    id="picture"
                                    type="file"
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
                                <h2 className="text-xl font-bold mb-4">Provide Email Template</h2>
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
                    </div>
                </div>
            )}
        </>
    );
};

export default EmailWorkflow;
