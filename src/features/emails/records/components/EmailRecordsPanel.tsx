"use client";
import React, { useState, useEffect } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/imports/Shadcn_imports";
import { Eye, FileIcon, Inbox, Search } from "lucide-react";
import { EmailList } from "@/features/emails/types";
// import { mockEmailRecords } from "@/mock/emailrecords.mock";
import { useEmailRecords } from "@/features/emails/hooks/useEmailRecords";
import CustomLoader from "@/components/CustomLoader";

const EmailRecordsPanel = () => {
  const [emailRecords, setEmailRecords] = useState<EmailList>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecords, setFilteredRecords] = useState<EmailList>([]);

  const { data: EmailList, isLoading, isError, error } = useEmailRecords();

  useEffect(() => {
    if (EmailList && EmailList.data) {
      setEmailRecords(EmailList.data);
      setFilteredRecords(EmailList.data);
    }
  }, [EmailList]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRecords(emailRecords);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = emailRecords.filter(
        (record) =>
          record.subject.toLowerCase().includes(query) ||
          record.body.toLowerCase().includes(query) ||
          record.status.toLowerCase().includes(query),
      );
      setFilteredRecords(filtered);
    }
  }, [searchQuery, emailRecords]);

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent":
        return <Badge variant="default">Sent</Badge>;
      case "scheduled":
        return <Badge variant="secondary">Scheduled</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get file icon based on a file type
  const getFileIcon = (fileType: string) => {
    return <FileIcon className="h-4 w-4 mr-1" />;
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium mb-2">
            Oops! Something went wrong
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {error?.message || "Failed to load contacts"}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <CustomLoader />;
  }

  return (
    <div>
      {/* Heading */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Email Records</h1>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search emails..."
            className="pl-8 h-9 w-[250px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Email Records Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Inbox className="h-5 w-5 mr-2" />
            Your Email Records
          </CardTitle>
          <CardDescription>
            View all your sent and scheduled emails
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No email records found.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled Time</TableHead>
                    <TableHead>Attachments</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium max-w-[250px] truncate">
                        {record.subject}
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>{formatDate(record.scheduledTime)}</TableCell>
                      <TableCell>
                        {record.attachmentsList.length > 0 ? (
                          <div className="flex items-center">
                            <span className="text-sm">
                              {record.attachmentsList.length}{" "}
                              {record.attachmentsList.length === 1
                                ? "file"
                                : "files"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            None
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <div className="space-y-4">
                              <div>
                                <h3 className="text-lg font-semibold">
                                  {record.subject}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  {getStatusBadge(record.status)}
                                  <span className="text-sm text-muted-foreground">
                                    Scheduled:{" "}
                                    {formatDate(record.scheduledTime)}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <h4 className="font-medium">Email Body</h4>
                                <div className="border rounded-md p-3 whitespace-pre-wrap text-sm">
                                  {record.body}
                                </div>
                              </div>

                              {record.attachmentsList.length > 0 && (
                                <div className="space-y-1">
                                  <h4 className="font-medium">Attachments</h4>
                                  <div className="border rounded-md p-2 space-y-1">
                                    {record.attachmentsList.map(
                                      (attachment) => (
                                        <div
                                          key={attachment.id}
                                          className="flex items-center justify-between p-2 border-b last:border-0"
                                        >
                                          <div className="flex items-center">
                                            {getFileIcon(attachment.fileType)}
                                            <span className="text-sm">
                                              {attachment.originalFilename}
                                            </span>
                                          </div>
                                          <div className="flex items-center text-xs text-muted-foreground">
                                            {(attachment.size / 1024).toFixed(
                                              0,
                                            )}{" "}
                                            KB
                                          </div>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className="flex justify-between text-xs text-muted-foreground pt-2">
                                <div>
                                  Created:{" "}
                                  {new Date(record.createdAt).toLocaleString()}
                                </div>
                                <div>
                                  Updated:{" "}
                                  {new Date(record.updatedAt).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailRecordsPanel;
