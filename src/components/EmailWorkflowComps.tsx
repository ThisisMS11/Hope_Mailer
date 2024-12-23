import {
  Textarea,
  Button,
  Label,
  Input,
  Progress,
} from "@/imports/Shadcn_imports";
import { useWorkflow } from "@/context/EmailWorkflow";
import { defaultEmailTemplate, steps } from "@/utils/UtilFunctions";

export const StepSelectOption = () => {
  const { updateState } = useWorkflow();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Select an Option</h2>
      <div className="flex flex-col space-y-4">
        <Button
          onClick={() =>
            updateState({
              currentStep: steps.custom.steps.pasteAndMark.key,
            })
          }
        >
          Custom
        </Button>
        <Button
          onClick={() =>
            updateState({
              currentStep: steps.aiGenerated.steps.emailContext.key,
            })
          }
        >
          AI Generated
        </Button>
      </div>
    </div>
  );
};

export const StepEmailContext = () => {
  const { updateState } = useWorkflow();
  const handleOptionSelect = (
    option: "Asking for referral" | "followup with HR",
  ) => {
    updateState({
      emailContext: option,
      currentStep: steps.aiGenerated.steps.jobDescription.key,
    })
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Select an Option</h2>
      <div className="flex flex-col space-y-4">
        <Button onClick={() => handleOptionSelect("Asking for referral")}>
          Ask for Referral
        </Button>
        <Button onClick={() => handleOptionSelect("followup with HR")}>
          Follow-up with HR
        </Button>
      </div>
    </div>
  );
};

export const StepJobDescription = () => {
  const { state, updateState } = useWorkflow();
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Enter Job Description</h2>
      <Textarea
        className="w-full border rounded p-2"
        placeholder="Paste job description here..."
        value={state.jobDescription}
        onChange={(e) =>
          updateState({
            jobDescription: e.target.value
          })
        }
      />
      <div className="flex justify-between mt-4">
        <Button
          onClick={() => {
            updateState({
              currentStep: steps.aiGenerated.steps.emailContext.key,
            })
          }}
        >
          Back
        </Button>

        <Button
          onClick={() => {
            updateState({
              currentStep: steps.aiGenerated.steps.chooseResume.key,
            })
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export const StepUploadResume = () => {
  const { updateState } = useWorkflow();
  return (
    <div>
      <Label htmlFor="resume" className="mb-2">
        Resume
      </Label>
      <Input
        id="resume"
        type="file"
        accept=".pdf"
        onChange={(e) =>
          updateState({
            resumeFile: e.target.files?.[0] || null,
          })
        }
      />
      <div className="flex justify-between mt-4">
        <Button
          onClick={() => {
            updateState({
              currentStep: steps.aiGenerated.steps.jobDescription.key,
            })
          }}
        >
          Back
        </Button>
        <Button
          onClick={() => {
            updateState({
              currentStep: steps.aiGenerated.steps.referenceTemplate.key,
            })
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export const StepProvideEmailTemplate = ({ fetchGeneratedContent }: any) => {
  const { state, updateState } = useWorkflow();
  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Provide Email Template</h2>
        <Button
          onClick={() => {
            updateState({
              emailTemplate: defaultEmailTemplate,
            })
          }}
        >
          Use Default
        </Button>
      </div>
      <Textarea
        className="w-full border rounded p-2"
        placeholder="Paste Email Template here..."
        value={state.emailTemplate}
        onChange={(e) =>
          updateState({
            emailTemplate: e.target.value
          })
        }

      />
      <div className="flex justify-between mt-4">
        <Button
          onClick={() => {
            updateState({
              currentStep: steps.aiGenerated.steps.chooseResume.key,
            })
          }}
        >
          Back
        </Button>
        <Button onClick={fetchGeneratedContent}>Generate</Button>
      </div>
    </div>
  );
};

export const StepEditContent = ({
  fetchGeneratedContent,
  handleStartMailing,
}: any) => {
  const { state, updateState } = useWorkflow();
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Mark Your Variables</h2>
      <Label htmlFor="finalSubject" className="mb-2">
        Subject
      </Label>
      <Input
        id="finalSubject"
        name="finalSubject"
        type="text"
        value={state.finalSubject}
        onChange={(e) =>
          updateState({
            finalSubject: e.target.value
          })
        }
      />

      <Label htmlFor="EditingFinalContent" className="my-4">
        Edit Content for final Email Body
      </Label>
      <Textarea
        name="EditingFinalContent"
        className="w-full border rounded p-2"
        placeholder="Generated Email Content will appear here..."
        value={state.emailContent}
        onChange={(e) =>
          updateState({
            emailContent: e.target.value
          })
        }
      />
      <div className="flex justify-between mt-4">
        <Button
          onClick={() => {
            updateState({
              currentStep:
                state.currentStep !== "pasteAndMark"
                  ? steps.aiGenerated.steps.referenceTemplate.key
                  : steps.selectOption.key,
            })
          }}
        >
          Back
        </Button>
        <div>
          {state.currentStep !== "pasteAndMark" && (
            <Button className="mr-4" onClick={fetchGeneratedContent}>
              Retry
            </Button>
          )}
          <Button onClick={handleStartMailing}>Start Mailing</Button>
        </div>
      </div>
    </div>
  );
};

export const FinalMailing = ({ mailingProgressBar, sendingTo }: any) => {
  return (
    <div>
      <Progress
        value={mailingProgressBar}
        className="w-[90%] mx-auto"
        max={100}
      />
      <div className="text-center mt-4 text-gray-500 text-lg">{`Sending email to ${sendingTo}`}</div>
    </div>
  );
};

/*
0. Select Between Custom and AI Generated
1.Custom
    1.1  Paste your template and Mark Variables
2. AI Generated
    2.1. Job description
    2.2. Choose Resume
    2.3. Reference Email Template
    2.4. Edit and Mark Variables
We can see the show the same component in (1.1) and (2.4) Now to manage these steps now ?
*/
