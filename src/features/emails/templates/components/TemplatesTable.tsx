"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import React from "react";
import { EmailTemplateList } from "@/features/emails/templates/types";
import useEmailTemplatesMutations from "@/features/emails/templates/hooks/useEmailTemplatesMutations";

interface TemplateTableProps {
  templates: EmailTemplateList;
  openEditModal: (template: EmailTemplateList[number]) => void;
  deleteTemplate: (id: number) => void;
}

const TemplatesTable: React.FC<TemplateTableProps> = ({
  templates,
  openEditModal,
  deleteTemplate,
}) => {
  const { requestDeleteEmailTemplate } = useEmailTemplatesMutations();

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Your Templates</CardTitle>
        <CardDescription>Manage your email templates</CardDescription>
      </CardHeader>
      <CardContent>
        {templates.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No templates yet. Create your first template.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">
                      {template.name}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {template.subject}
                    </TableCell>
                    <TableCell>{formatDate(template.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>{template.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Created: {formatDate(template.createdAt)}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-medium">Subject</h4>
                                <p>{template.subject}</p>
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-medium">Body</h4>
                                <div className="border rounded-md p-3 whitespace-pre-wrap">
                                  {template.body}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(template)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTemplate(template.id)}
                          className="text-destructive hover:text-destructive/90"
                          disabled={requestDeleteEmailTemplate.isPending}
                        >
                          {requestDeleteEmailTemplate.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TemplatesTable;
