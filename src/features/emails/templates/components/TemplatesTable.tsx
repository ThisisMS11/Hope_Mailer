"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/UtilFunctions";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Pencil, BookDashed, Trash2 } from "lucide-react";
import React from "react";
import { EmailTemplateList } from "@/features/emails/templates/types";
import useEmailTemplatesMutations from "@/features/emails/templates/hooks/useEmailTemplatesMutations";
import { Label } from "@/components/ui/label";

interface TemplateTableProps {
  templates: EmailTemplateList;
  openEditModal: (__template: EmailTemplateList[number]) => void;
  deleteTemplate: (__id: number) => void;
}

const TemplatesTable: React.FC<TemplateTableProps> = ({
  templates,
  openEditModal,
  deleteTemplate,
}) => {
  const { requestDeleteEmailTemplate } = useEmailTemplatesMutations();

  return (
    <div className="lg:col-span-2 bg-white/50 backdrop-blur-md border border-white/70 dark:bg-white/[0.04] dark:border-white/[0.08] shadow-xl shadow-black/[0.06] dark:shadow-black/25 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100/60 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 dark:bg-violet-400/10 flex items-center justify-center">
            <BookDashed className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Your Templates</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Manage your email templates</p>
          </div>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-white/[0.04] px-2 py-0.5 rounded-full">
          {templates.length} templates
        </span>
      </div>

      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center mb-3">
            <BookDashed className="h-5 w-5 text-gray-400 dark:text-gray-600" />
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No templates yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Create your first template to get started</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100/60 dark:border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600 pl-5">Name</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">Subject</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">Updated</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600 pr-5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((template) => (
              <TableRow
                key={template.id}
                className="border-b border-gray-100/40 dark:border-white/[0.04] hover:bg-white/40 dark:hover:bg-white/[0.03] transition-colors"
              >
                <TableCell className="pl-5 py-3.5 font-medium text-sm text-gray-800 dark:text-gray-200">
                  {template.name}
                </TableCell>
                <TableCell className="py-3.5 text-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                  {template.subject}
                </TableCell>
                <TableCell className="py-3.5 text-sm text-gray-400 dark:text-gray-500">
                  {formatDate(template.updatedAt)}
                </TableCell>
                <TableCell className="py-3.5 pr-5 text-right">
                  <div className="flex justify-end gap-1">
                    {/* View */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="h-7 px-2.5 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-500/10 dark:hover:bg-violet-400/10 transition-all">
                          View
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/60 dark:border-white/[0.08]">
                        <div className="space-y-5">
                          <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{template.name}</h3>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Created {formatDate(template.createdAt)}</p>
                          </div>
                          <div className="rounded-xl bg-gray-50/80 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] p-5 space-y-4">
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">Subject</Label>
                              <div className="text-sm pl-3 border-l-2 border-violet-400/40 text-gray-700 dark:text-gray-300">
                                {template.subject}
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">Body</Label>
                              <div
                                className="prose prose-sm max-w-none pl-3 border-l-2 border-violet-400/40 max-h-52 text-sm invisible-scrollbar overflow-y-auto text-gray-700 dark:text-gray-300"
                                dangerouslySetInnerHTML={{ __html: template.body }}
                              />
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(template)}
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      disabled={requestDeleteEmailTemplate.isPending}
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all disabled:opacity-50"
                    >
                      {requestDeleteEmailTemplate.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TemplatesTable;
