"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
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
import { useEmailRecords } from "@/features/emails/hooks/useEmailRecords";
import CustomLoader from "@/components/CustomLoader";

const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  const styles: Record<string, string> = {
    sent: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-400/15",
    scheduled: "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 border border-blue-500/20 dark:border-blue-400/15",
    failed: "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400 border border-red-500/20 dark:border-red-400/15",
    draft: "bg-gray-500/10 text-gray-600 dark:bg-gray-400/10 dark:text-gray-400 border border-gray-500/20 dark:border-gray-400/15",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[s] ?? "bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const EmailRecordsPanel = () => {
  const [emailRecords, setEmailRecords] = useState<EmailList>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecords, setFilteredRecords] = useState<EmailList>([]);

  const { data: EmailList, isLoading, isError, error } = useEmailRecords();

  useEffect(() => {
    if (EmailList?.data) {
      setEmailRecords(EmailList.data);
      setFilteredRecords(EmailList.data);
    }
  }, [EmailList]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRecords(emailRecords);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredRecords(
        emailRecords.filter(
          (r) =>
            r.subject.toLowerCase().includes(query) ||
            r.body.toLowerCase().includes(query) ||
            r.status.toLowerCase().includes(query),
        ),
      );
    }
  }, [searchQuery, emailRecords]);

  const formatDate = (timestamp: number) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(timestamp));

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium mb-2">Something went wrong</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{error?.message || "Failed to load records"}</p>
        </div>
      </div>
    );
  }

  if (isLoading) return <CustomLoader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Email Records</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search emails..."
            className="pl-9 pr-4 h-9 w-[220px] rounded-xl text-sm bg-white/50 dark:bg-white/[0.04] backdrop-blur-sm border border-white/70 dark:border-white/[0.08] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-400/15 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Panel */}
      <div className="bg-white/50 backdrop-blur-md border border-white/70 dark:bg-white/[0.04] dark:border-white/[0.08] shadow-xl shadow-black/[0.06] dark:shadow-black/25 rounded-2xl overflow-hidden">
        {/* Panel Header */}
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100/60 dark:border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 dark:bg-violet-400/10 flex items-center justify-center">
            <Inbox className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Your Email Records</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">All sent and scheduled campaigns</p>
          </div>
          <span className="ml-auto text-xs text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-white/[0.04] px-2 py-0.5 rounded-full">
            {filteredRecords.length} records
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center mb-3">
              <Inbox className="h-5 w-5 text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No email records found</p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Records will appear here after you send campaigns</p>
          </div>
        ) : (
          <div className="overflow-y-auto invisible-scrollbar max-h-[calc(100vh-280px)]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100/60 dark:border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600 pl-6 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">Subject</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">Scheduled Time</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">Attachments</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600 pr-6 text-right sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow
                  key={record.id}
                  className="border-b border-gray-100/40 dark:border-white/[0.04] hover:bg-white/40 dark:hover:bg-white/[0.03] transition-colors"
                >
                  <TableCell className="pl-6 py-3.5 font-medium text-sm text-gray-800 dark:text-gray-200 max-w-[280px] truncate">
                    {record.subject}
                  </TableCell>
                  <TableCell className="py-3.5">
                    <StatusBadge status={record.status} />
                  </TableCell>
                  <TableCell className="py-3.5 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(record.scheduledTime)}
                  </TableCell>
                  <TableCell className="py-3.5">
                    {record.attachmentsList.length > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/[0.04] px-2 py-0.5 rounded-full border border-gray-200/60 dark:border-white/[0.06]">
                        <FileIcon className="h-3 w-3" />
                        {record.attachmentsList.length} {record.attachmentsList.length === 1 ? "file" : "files"}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300 dark:text-gray-700">—</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 pr-6 text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-500/10 dark:hover:bg-violet-400/10 transition-all"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1.5" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/60 dark:border-white/[0.08]">
                        <div className="space-y-5">
                          <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{record.subject}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <StatusBadge status={record.status} />
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                {formatDate(record.scheduledTime)}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">Email Body</h4>
                            <div className="rounded-xl p-4 bg-gray-50/80 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed">
                              {record.body}
                            </div>
                          </div>

                          {record.attachmentsList.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">Attachments</h4>
                              <div className="rounded-xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
                                {record.attachmentsList.map((attachment) => (
                                  <div key={attachment.id} className="flex items-center justify-between px-4 py-2.5 border-b last:border-0 border-gray-100/60 dark:border-white/[0.04] hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                                    <div className="flex items-center gap-2">
                                      <FileIcon className="h-3.5 w-3.5 text-gray-400" />
                                      <span className="text-sm text-gray-700 dark:text-gray-300">{attachment.originalFilename}</span>
                                    </div>
                                    <span className="text-xs text-gray-400 dark:text-gray-600">
                                      {(attachment.size / 1024).toFixed(0)} KB
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-600 pt-1 border-t border-gray-100 dark:border-white/[0.06]">
                            <span>Created: {new Date(record.createdAt).toLocaleString()}</span>
                            <span>Updated: {new Date(record.updatedAt).toLocaleString()}</span>
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
      </div>
    </div>
  );
};

export default EmailRecordsPanel;
