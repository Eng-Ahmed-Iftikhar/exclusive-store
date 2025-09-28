import React, { useState, useRef } from 'react';
import { useUploadFileMutation } from '@/apis/services/fileApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Note: Card, Progress, and Alert components will be created or replaced with alternatives
import { FiUpload, FiX, FiImage, FiFile } from 'react-icons/fi';
import { File as FileType } from '@/apis/services/fileApi';

interface FileUploadProps {
  onFileUploaded?: (file: FileType) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploaded,
  accept = 'image/*',
  maxSize = 10,
  className = '',
}) => {
  const [uploadFile, { isLoading, error }] = useUploadFileMutation();
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(
    null
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const result = await uploadFile(formData).unwrap();
      onFileUploaded?.(result.file);
      setSelectedFile(null);
      setPreview(null);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (file: globalThis.File) => {
    if (file.type.startsWith('image/')) {
      return <FiImage className="w-8 h-8 text-blue-500 dark:text-blue-400" />;
    }
    return <FiFile className="w-8 h-8 text-gray-500 dark:text-gray-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label
          htmlFor="file-upload"
          className="text-sm font-medium text-gray-700 dark:text-slate-100"
        >
          Upload File
        </Label>
        <div className="mt-2">
          <Input
            id="file-upload"
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept={accept}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
            disabled={isLoading}
          >
            <FiUpload className="w-4 h-4 mr-2" />
            Choose File
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
          Max size: {maxSize}MB
        </p>
      </div>

      {selectedFile && (
        <div className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/20">
          <div className="flex items-center space-x-4">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded border border-gray-200 dark:border-slate-600"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded flex items-center justify-center border border-gray-200 dark:border-slate-600">
                {getFileIcon(selectedFile)}
              </div>
            )}
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-900 dark:text-slate-100">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              disabled={isLoading}
            >
              <FiX className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {selectedFile && (
        <div className="space-y-2">
          <Button
            onClick={handleUpload}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Uploading...' : 'Upload File'}
          </Button>
          {isLoading && (
            <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 shadow-sm dark:shadow-slate-900/20">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
            Upload failed. Please try again.
          </p>
        </div>
      )}
    </div>
  );
};
