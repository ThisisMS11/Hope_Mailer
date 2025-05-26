import React, { useState, useRef } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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

  // Function to handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  // Function to handle file upload
  const handleFileUpload = (fileList: FileList) => {
    setIsUploading(true);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);

        // Create new file objects from the uploaded files
        const newFiles: FileI[] = Array.from(fileList).map((file, index) => {
          const fileType = getFileType(file.type);
          return {
            id: Date.now() + index,
            originalFileName: file.name,
            gcsFileName: `files/${file.name.replace(/\s+/g, "-")}-${Date.now()}`,
            publicUrl: URL.createObjectURL(file), // Temporary URL for demo
            contentType: file.type,
            size: file.size,
            bucketName: "my-bucket",
            fileType: fileType,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });

        // Add new files to the state
        setFiles([...newFiles, ...files]);
        setIsUploading(false);
        setUploadProgress(0);
      }
    }, 300);
  };

  // Function to handle URL submission
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError("");

    if (!urlInput) {
      setUrlError("Please enter a URL");
      return;
    }

    if (!urlFileName) {
      setUrlError("Please enter a file name");
      return;
    }

    // Create a new file object from the URL
    const fileExtension = getFileExtensionFromUrl(urlInput);
    const contentType = getContentTypeFromExtension(fileExtension);
    const fileType = getFileTypeFromExtension(fileExtension);

    const newFile: FileI = {
      id: Date.now(),
      originalFileName:
        urlFileName + (fileExtension ? `.${fileExtension}` : ""),
      gcsFileName: `files/${urlFileName.replace(/\s+/g, "-")}-${Date.now()}`,
      publicUrl: urlInput,
      contentType: contentType,
      size: 0, // Size unknown for URL resources
      bucketName: "external-resource",
      fileType: fileType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add a new file to the state
    setFiles([newFile, ...files]);

    // Reset form
    setUrlInput("");
    setUrlFileName("");
  };

  // Helper function to get file extension from URL
  const getFileExtensionFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const lastDotIndex = pathname.lastIndexOf(".");

      if (lastDotIndex !== -1) {
        return pathname.slice(lastDotIndex + 1).toLowerCase();
      }
      return "";
    } catch (e) {
      return "";
    }
  };

  // Helper function to get content type from extension
  const getContentTypeFromExtension = (extension: string): string => {
    const contentTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      mp4: "video/mp4",
      mov: "video/quicktime",
      avi: "video/x-msvideo",
    };

    return contentTypes[extension] || "application/octet-stream";
  };

  // Helper function to get a file type from extension
  const getFileTypeFromExtension = (extension: string): FileType => {
    const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "bmp"];
    const videoExts = ["mp4", "mov", "avi", "webm", "mkv"];
    const docExts = [
      "pdf",
      "doc",
      "docx",
      "txt",
      "csv",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
    ];

    if (imageExts.includes(extension)) {
      return FileType.IMAGE;
    } else if (videoExts.includes(extension)) {
      return FileType.VIDEO;
    } else if (docExts.includes(extension)) {
      return FileType.DOCUMENT;
    }

    return FileType.UNKNOWN;
  };

  // Function to determine a file type based on mime type
  const getFileType = (mimeType: string): FileType => {
    if (mimeType.startsWith("image/")) {
      return FileType.IMAGE;
    } else if (mimeType.startsWith("video/")) {
      return FileType.VIDEO;
    } else if (
      mimeType === "application/pdf" ||
      mimeType.includes("document") ||
      mimeType.includes("text/")
    ) {
      return FileType.DOCUMENT;
    }
    return FileType.UNKNOWN;
  };

  // Function to get file icon based on a file type
  const getFileIcon = (fileType: FileType, contentType: string) => {
    switch (fileType) {
      case FileType.IMAGE:
        return <ImageIcon className="h-8 w-8 text-blue-500" />;
      case FileType.VIDEO:
        return <Video className="h-8 w-8 text-purple-500" />;
      case FileType.DOCUMENT:
        return <FileText className="h-8 w-8 text-amber-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  // Function to format file date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Function to handle file deletion
  const handleDeleteFile = (id: number) => {
    if (confirm("Are you sure you want to delete this file?")) {
      setFiles(files.filter((file) => file.id !== id));
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Function to trigger file input click
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Function to get file preview
  const getFilePreview = (file: FileI) => {
    if (file.fileType === FileType.IMAGE) {
      return (
        <Image
          src={file.publicUrl}
          alt={file.originalFileName}
          width={400}
          height={400}
          className="w-full h-32 object-cover rounded-t-md"
        />
      );
    } else {
      return (
        <div className="w-full h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-t-md">
          {getFileIcon(file.fileType, file.contentType)}
        </div>
      );
    }
  };

  return (
    <div>
      {/* Heading */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Files</h1>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            Table View
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File Upload Card with Tabs */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Add Files</CardTitle>
            <CardDescription>Upload files or add from URL</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="upload">Upload Files</TabsTrigger>
                <TabsTrigger value="url">Add from URL</TabsTrigger>
              </TabsList>

              {/* Upload Tab Content */}
              <TabsContent value="upload">
                <div
                  className={`border-2 border-dashed rounded-md p-6 text-center ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <Input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                  <FileUp className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm font-medium">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Supports images, documents, and videos
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={handleFileInputClick}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Select Files
                  </Button>
                </div>

                {isUploading && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Uploading...</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1">{uploadProgress}%</p>
                  </div>
                )}
              </TabsContent>

              {/* URL Tab Content */}
              <TabsContent value="url">
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="url-input" className="text-sm font-medium">
                      File URL
                    </label>
                    <Input
                      id="url-input"
                      type="url"
                      placeholder="https://example.com/file.pdf"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="file-name" className="text-sm font-medium">
                      File Name
                    </label>
                    <Input
                      id="file-name"
                      type="text"
                      placeholder="Enter a name for this file"
                      value={urlFileName}
                      onChange={(e) => setUrlFileName(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      The file extension will be detected from the URL
                    </p>
                  </div>

                  {urlError && (
                    <div className="text-sm text-destructive">{urlError}</div>
                  )}

                  <Button type="submit" className="w-full">
                    <Link className="h-4 w-4 mr-2" />
                    Add from URL
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Files Display Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Files</CardTitle>
            <CardDescription>Manage your uploaded files</CardDescription>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No files yet. Upload your first file.
              </div>
            ) : viewMode === "grid" ? (
              // Grid View
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                  <Card key={file.id} className="overflow-hidden">
                    {getFilePreview(file)}
                    <CardContent className="p-3">
                      <h3
                        className="font-medium text-sm truncate"
                        title={file.originalFileName}
                      >
                        {file.originalFileName}
                      </h3>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500">
                          {formatBytes(file.size)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(file.createdAt)}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="p-2 pt-0 flex justify-end gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {file.originalFileName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Uploaded: {formatDate(file.createdAt)}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-medium">File Details</h4>
                              <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Type:
                                  </span>
                                  <span>{file.contentType}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Size:
                                  </span>
                                  <span>{formatBytes(file.size)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Uploaded:
                                  </span>
                                  <span>{formatDate(file.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            {file.fileType === FileType.IMAGE && (
                              <div className="mt-4">
                                <img
                                  src={file.publicUrl}
                                  alt={file.originalFileName}
                                  className="w-full rounded-md"
                                />
                              </div>
                            )}
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(file.publicUrl, "_blank")
                                }
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(file.publicUrl, "_blank")
                                }
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => window.open(file.publicUrl, "_blank")}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              // Table View
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {files.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getFileIcon(file.fileType, file.contentType)}
                            <span className="truncate max-w-[200px]">
                              {file.originalFileName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{file.contentType}</TableCell>
                        <TableCell>{formatBytes(file.size)}</TableCell>
                        <TableCell>{formatDate(file.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="text-lg font-semibold">
                                      {file.originalFileName}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      Uploaded: {formatDate(file.createdAt)}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <h4 className="font-medium">
                                      File Details
                                    </h4>
                                    <div className="text-sm space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Type:
                                        </span>
                                        <span>{file.contentType}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Size:
                                        </span>
                                        <span>{formatBytes(file.size)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Uploaded:
                                        </span>
                                        <span>
                                          {formatDate(file.createdAt)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  {file.fileType === FileType.IMAGE && (
                                    <div className="mt-4">
                                      <Image
                                        src={file.publicUrl}
                                        alt={file.originalFileName}
                                        className="w-full rounded-md"
                                        width={400}
                                        height={400}
                                      />
                                    </div>
                                  )}
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        window.open(file.publicUrl, "_blank")
                                      }
                                    >
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      Open
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        window.open(file.publicUrl, "_blank")
                                      }
                                    >
                                      <Download className="h-4 w-4 mr-2" />
                                      Download
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(file.publicUrl, "_blank")
                              }
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFile(file.id)}
                              className="text-destructive hover:text-destructive/90"
                            >
                              <Trash2 className="h-4 w-4" />
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
      </div>
    </div>
  );
};

export default FilesPanel;
