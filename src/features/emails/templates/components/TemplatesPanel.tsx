import React, { useEffect, useState } from "react";
import { EmailTemplateI } from "@/features/emails/templates/types";
import useEmailTemplates from "@/features/emails/templates/hooks/useEmailTemplates";
import useEmailTemplatesMutations from "@/features/emails/templates/hooks/useEmailTemplatesMutations";
import EditTemplateModal from "@/features/emails/templates/components/EditTemplateModal";
import TemplatesTable from "@/features/emails/templates/components/TemplatesTable";
import CreateTemplateForm from "@/features/emails/templates/components/CreateTemplateForm";

const TemplatesPanel = () => {
  // Add form state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplateI | null>(
    null,
  );

  const {
    data: emailTemplates,
    isError,
    isLoading,
    error,
  } = useEmailTemplates();

  const { requestCreateEmailTemplate, requestDeleteEmailTemplate } =
    useEmailTemplatesMutations();

  // Create a separate form for editing
  const { emailTemplateFormData: editEmailTemplateFormData } =
    useEmailTemplatesMutations();

  const [templates, setTemplates] = useState<EmailTemplateI[]>([]);

  const openEditModal = (template: EmailTemplateI) => {
    setEditingTemplate(template);
    editEmailTemplateFormData.reset();
    editEmailTemplateFormData.setValue("name", template.name);
    editEmailTemplateFormData.setValue("subject", template.subject);
    editEmailTemplateFormData.setValue("body", template.body);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTemplate(null);
    editEmailTemplateFormData.reset();
  };

  // Function to delete a template
  const deleteTemplate = (id: number) => {
    if (confirm("Are you sure you want to delete this template?")) {
      setTemplates(templates.filter((template) => template.id != id));
      requestDeleteEmailTemplate.mutate(id);
    }
  };

  useEffect(() => {
    if (emailTemplates && emailTemplates.data) {
      setTemplates(emailTemplates.data);
    }
  }, [emailTemplates, requestCreateEmailTemplate]);

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium mb-2">
            Oops! Something went wrong
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {error?.message || "Failed to load templates"}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  return (
    <div>
      {/* heading - fixed height */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Email Templates</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Template Form Card */}
        <CreateTemplateForm />

        {/* Templates Table Card */}
        <TemplatesTable
          templates={templates}
          openEditModal={openEditModal}
          deleteTemplate={deleteTemplate}
        />
      </div>

      {/* Edit Template Modal */}
      <EditTemplateModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        editEmailTemplateFormData={editEmailTemplateFormData}
        closeEditModal={closeEditModal}
        editingTemplate={editingTemplate}
      />
    </div>
  );
};

export default TemplatesPanel;
