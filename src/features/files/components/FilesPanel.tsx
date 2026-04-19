import React, { useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/imports/Shadcn_imports";
import {
  FileUp,
  Plus,
  Trash2,
  Download,
  Image as ImageIcon,
  FileText,
  Video,
  File,
  ExternalLink,
  Link,
  LayoutGrid,
  List,
} from "lucide-react";
import { FileI, FileType } from "@/features/files/types";
import { formatBytes } from "@/lib/utils";
import { mockFiles } from "@/mock/file.mock";
import Image from "next/image";

const FilesPanel = () => {
  const [files, setFiles] = useState<FileI[]>(mockFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlFileName, setUrlFileName] = useState("");
  const [urlError, setUrlError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) handleFileUpload(e.target.files);
  };

  const handleFileUpload = (fileList: FileList) => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        const newFiles: FileI[] = Array.from(fileList).map((file, index) => ({
          id: Date.now() + index,
          originalFileName: file.name,
          gcsFileName: `files/${file.name.replace(/\s+/g, "-")}-${Date.now()}`,
          publicUrl: URL.createObjectURL(file),
          contentType: file.type,
          size: file.size,
          bucketName: "my-bucket",
          fileType: getFileType(file.type),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        setFiles([...newFiles, ...files]);
        setIsUploading(false);
        setUploadProgress(0);
      }
    }, 300);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError("");
    if (!urlInput) { setUrlError("Please enter a URL"); return; }
    if (!urlFileName) { setUrlError("Please enter a file name"); return; }
    const ext = getFileExtensionFromUrl(urlInput);
    const newFile: FileI = {
      id: Date.now(),
      originalFileName: urlFileName + (ext ? `.${ext}` : ""),
      gcsFileName: `files/${urlFileName.replace(/\s+/g, "-")}-${Date.now()}`,
      publicUrl: urlInput,
      contentType: getContentTypeFromExtension(ext),
      size: 0,
      bucketName: "external-resource",
      fileType: getFileTypeFromExtension(ext),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFiles([newFile, ...files]);
    setUrlInput("");
    setUrlFileName("");
  };

  const getFileExtensionFromUrl = (url: string): string => {
    try {
      const pathname = new URL(url).pathname;
      const i = pathname.lastIndexOf(".");
      return i !== -1 ? pathname.slice(i + 1).toLowerCase() : "";
    } catch { return ""; }
  };

  const getContentTypeFromExtension = (ext: string): string => {
    const map: Record<string, string> = {
      jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif",
      pdf: "application/pdf", doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      mp4: "video/mp4", mov: "video/quicktime", avi: "video/x-msvideo",
    };
    return map[ext] || "application/octet-stream";
  };

  const getFileTypeFromExtension = (ext: string): FileType => {
    if (["jpg","jpeg","png","gif","webp","bmp"].includes(ext)) return FileType.IMAGE;
    if (["mp4","mov","avi","webm","mkv"].includes(ext)) return FileType.VIDEO;
    if (["pdf","doc","docx","txt","csv","xls","xlsx","ppt","pptx"].includes(ext)) return FileType.DOCUMENT;
    return FileType.UNKNOWN;
  };

  const getFileType = (mimeType: string): FileType => {
    if (mimeType.startsWith("image/")) return FileType.IMAGE;
    if (mimeType.startsWith("video/")) return FileType.VIDEO;
    if (mimeType === "application/pdf" || mimeType.includes("document") || mimeType.includes("text/")) return FileType.DOCUMENT;
    return FileType.UNKNOWN;
  };

  const getFileIcon = (fileType: FileType, size = "md") => {
    const s = size === "sm" ? "h-5 w-5" : "h-8 w-8";
    switch (fileType) {
      case FileType.IMAGE: return <ImageIcon className={`${s} text-blue-500 dark:text-blue-400`} />;
      case FileType.VIDEO: return <Video className={`${s} text-violet-500 dark:text-violet-400`} />;
      case FileType.DOCUMENT: return <FileText className={`${s} text-amber-500 dark:text-amber-400`} />;
      default: return <File className={`${s} text-gray-400 dark:text-gray-500`} />;
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const handleDeleteFile = (id: number) => {
    if (confirm("Are you sure you want to delete this file?")) {
      setFiles(files.filter((f) => f.id !== id));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length > 0) handleFileUpload(e.dataTransfer.files);
  };

  const FileDetailDialog = ({ file }: { file: FileI }) => (
    <DialogContent className="sm:max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/60 dark:border-white/[0.08]">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{file.originalFileName}</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Uploaded {formatDate(file.createdAt)}</p>
        </div>
        {file.fileType === FileType.IMAGE && (
          <Image src={file.publicUrl} alt={file.originalFileName} width={400} height={400} className="w-full rounded-xl object-cover" />
        )}
        <div className="rounded-xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
          {[
            ["Type", file.contentType],
            ["Size", formatBytes(file.size)],
            ["Uploaded", formatDate(file.createdAt)],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between px-4 py-2.5 border-b last:border-0 border-gray-100/60 dark:border-white/[0.04] text-sm">
              <span className="text-gray-400 dark:text-gray-500">{label}</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">{val}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs border-white/60 dark:border-white/[0.08] bg-white/40 dark:bg-white/[0.04]" onClick={() => window.open(file.publicUrl, "_blank")}>
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Open
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs border-white/60 dark:border-white/[0.08] bg-white/40 dark:bg-white/[0.04]" onClick={() => window.open(file.publicUrl, "_blank")}>
            <Download className="h-3.5 w-3.5 mr-1.5" /> Download
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Files</h1>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/50 dark:bg-white/[0.04] backdrop-blur-sm border border-white/70 dark:border-white/[0.08]">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === "grid"
                ? "bg-violet-500/90 text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Grid
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === "table"
                ? "bg-violet-500/90 text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <List className="h-3.5 w-3.5" /> Table
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Panel */}
        <div className="lg:col-span-1 bg-white/50 backdrop-blur-md border border-white/70 dark:bg-white/[0.04] dark:border-white/[0.08] shadow-xl shadow-black/[0.06] dark:shadow-black/25 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100/60 dark:border-white/[0.06]">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Add Files</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Upload files or add from URL</p>
          </div>
          <div className="p-5">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-white/50 dark:bg-white/[0.04] border border-white/60 dark:border-white/[0.08] rounded-xl p-1 h-auto">
                <TabsTrigger value="upload" className="rounded-lg text-xs data-[state=active]:bg-violet-500/90 data-[state=active]:text-white data-[state=active]:shadow-sm py-1.5">
                  Upload Files
                </TabsTrigger>
                <TabsTrigger value="url" className="rounded-lg text-xs data-[state=active]:bg-violet-500/90 data-[state=active]:text-white data-[state=active]:shadow-sm py-1.5">
                  Add from URL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                    dragActive
                      ? "border-violet-400 bg-violet-500/5 dark:border-violet-400/40 dark:bg-violet-500/[0.05]"
                      : "border-gray-200/80 dark:border-white/[0.08] hover:border-violet-300 dark:hover:border-violet-400/30 hover:bg-violet-500/[0.03]"
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileInputChange} />
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 dark:bg-violet-400/10 flex items-center justify-center mx-auto mb-3">
                    <FileUp className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Drag & drop files here
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">or click to browse</p>
                  <p className="text-xs text-gray-300 dark:text-gray-700 mt-2">Images, documents, videos</p>
                </div>

                {isUploading && (
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-violet-500 dark:bg-violet-400 h-full rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="url">
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">File URL</label>
                    <Input
                      type="url"
                      placeholder="https://example.com/file.pdf"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="bg-white/50 dark:bg-white/[0.04] border-white/70 dark:border-white/[0.08] text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">File Name</label>
                    <Input
                      type="text"
                      placeholder="Enter a name for this file"
                      value={urlFileName}
                      onChange={(e) => setUrlFileName(e.target.value)}
                      className="bg-white/50 dark:bg-white/[0.04] border-white/70 dark:border-white/[0.08] text-sm"
                    />
                    <p className="text-xs text-gray-400 dark:text-gray-600">Extension is detected from the URL</p>
                  </div>
                  {urlError && <p className="text-xs text-red-500 dark:text-red-400">{urlError}</p>}
                  <Button type="submit" className="w-full bg-violet-500/90 hover:bg-violet-600/90 dark:bg-violet-500/25 dark:hover:bg-violet-500/35 dark:text-violet-300 text-white border border-violet-400/30 dark:border-violet-400/20 text-sm">
                    <Link className="h-4 w-4 mr-2" /> Add from URL
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Files Display */}
        <div className="lg:col-span-2 bg-white/50 backdrop-blur-md border border-white/70 dark:bg-white/[0.04] dark:border-white/[0.08] shadow-xl shadow-black/[0.06] dark:shadow-black/25 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100/60 dark:border-white/[0.06] flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Your Files</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Manage your uploaded files</p>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-white/[0.04] px-2 py-0.5 rounded-full">
              {files.length} files
            </span>
          </div>

          <div className="p-5">
            {files.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center mb-3">
                  <File className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No files yet</p>
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Upload your first file to get started</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                  <div key={file.id} className="group rounded-xl bg-white/60 dark:bg-white/[0.04] border border-white/70 dark:border-white/[0.07] overflow-hidden hover:shadow-lg hover:shadow-black/[0.06] dark:hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-200">
                    {/* Preview */}
                    {file.fileType === FileType.IMAGE ? (
                      <Image src={file.publicUrl} alt={file.originalFileName} width={400} height={128} className="w-full h-32 object-cover" />
                    ) : (
                      <div className="w-full h-32 flex items-center justify-center bg-gray-50/80 dark:bg-white/[0.02]">
                        {getFileIcon(file.fileType)}
                      </div>
                    )}
                    {/* Info */}
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate" title={file.originalFileName}>
                        {file.originalFileName}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-400 dark:text-gray-600">{formatBytes(file.size)}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-600">{formatDate(file.createdAt)}</span>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="px-3 pb-3 flex justify-end gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all">
                            <FileText className="h-3.5 w-3.5" />
                          </button>
                        </DialogTrigger>
                        <FileDetailDialog file={file} />
                      </Dialog>
                      <button
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all"
                        onClick={() => window.open(file.publicUrl, "_blank")}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100/60 dark:border-white/[0.06] hover:bg-transparent">
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">Name</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">Type</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">Size</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">Date</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id} className="border-b border-gray-100/40 dark:border-white/[0.04] hover:bg-white/40 dark:hover:bg-white/[0.03] transition-colors">
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2.5">
                          {getFileIcon(file.fileType, "sm")}
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[160px]">{file.originalFileName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-gray-400 dark:text-gray-500 py-3">{file.contentType}</TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400 py-3">{formatBytes(file.size)}</TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400 py-3">{formatDate(file.createdAt)}</TableCell>
                      <TableCell className="py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="h-7 px-2.5 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-500/10 transition-all">View</button>
                            </DialogTrigger>
                            <FileDetailDialog file={file} />
                          </Dialog>
                          <button className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all" onClick={() => window.open(file.publicUrl, "_blank")}>
                            <Download className="h-3.5 w-3.5" />
                          </button>
                          <button className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all" onClick={() => handleDeleteFile(file.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilesPanel;
