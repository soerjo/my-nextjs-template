'use client';

import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { FileText, FileSpreadsheet, FileCode, File, Upload, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { queryKeys } from '@/lib';
import { cn } from '@/utils';

export interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['pdf', 'txt', 'doc', 'docx'].includes(ext || '')) return <FileText className="size-5 text-primary" />;
  if (['xls', 'xlsx', 'csv'].includes(ext || '')) return <FileSpreadsheet className="size-5 text-primary/70" />;
  if (['ts', 'tsx', 'js', 'json', 'html', 'css'].includes(ext || ''))
    return <FileCode className="size-5 text-muted-foreground" />;
  return <File className="size-5 text-muted-foreground" />;
}

export function ExampleUploadView() {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);

  const uploadMutation = useMutation({
    mutationKey: queryKeys.examples.upload(),
    mutationFn: async (fileId: string) => {
      // Simulate progress upload over 2 seconds
      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: 'uploading', progress: 0 } : f)));

      for (let p = 20; p <= 100; p += 20) {
        await new Promise((res) => setTimeout(res, 300));
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress: p } : f)));
      }

      // 10% chance of simulated failure for testing error toast
      if (Math.random() < 0.1) {
        throw new Error('Upload failed: Server rejected file format');
      }

      return fileId;
    },
    onSuccess: (fileId) => {
      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: 'success', progress: 100 } : f)));
      const file = files.find((f) => f.id === fileId);
      toast.success(`Successfully uploaded ${file?.name || 'file'}`);
    },
    onError: (err, fileId) => {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: 'error', errorMessage: msg } : f)));
      toast.error(msg);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newItems: UploadedFileItem[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'idle',
      }));

      setFiles((prev) => [...prev, ...newItems]);

      // Automatically start upload for newly dropped files
      newItems.forEach((item) => {
        uploadMutation.mutate(item.id);
      });
    },
    [uploadMutation],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">File Upload Example</h1>
        <p className="text-sm text-muted-foreground">
          Drag and drop files to simulate uploads with progress tracking and notifications.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dropzone Area</CardTitle>
          <CardDescription>Upload any file up to 10MB.</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition-colors cursor-pointer',
              isDragActive ? 'border-primary bg-primary/5' : 'border-border bg-muted/20 hover:bg-muted/40',
            )}
          >
            <input {...getInputProps()} />
            <div className="flex size-12 items-center justify-center rounded-full bg-background shadow-sm border border-border mb-4">
              <Upload className="size-6 text-muted-foreground" />
            </div>
            {isDragActive ? (
              <p className="text-sm font-medium text-primary">Drop the files here...</p>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Drag &apos;n&apos; drop files here, or click to select files
                </p>
                <p className="text-xs text-muted-foreground">Supports documents, spreadsheets, code files</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files ({files.length})</CardTitle>
            <CardDescription>Manage and monitor upload progress.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-lg border border-border p-4 bg-background shadow-xs"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {getFileIcon(item.name)}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(item.size)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {item.status === 'success' && (
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-4" /> Uploaded
                      </span>
                    )}
                    {item.status === 'error' && (
                      <span className="flex items-center gap-1 text-xs font-medium text-destructive">
                        <AlertCircle className="size-4" /> Failed
                      </span>
                    )}
                    {item.status === 'uploading' && (
                      <span className="text-xs font-medium text-muted-foreground">{item.progress}%</span>
                    )}
                    <Button aria-label="Remove file" size="icon-sm" variant="ghost" onClick={() => removeFile(item.id)}>
                      <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </div>

                {item.status === 'uploading' && <Progress value={item.progress} className="h-1.5" />}
                {item.status === 'error' && <p className="text-xs text-destructive">{item.errorMessage}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
