import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Upload, 
  FileText, 
  Image, 
  X, 
  Check,
  AlertCircle,
  Trash2,
  Eye
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  acceptedTypes: string[];
  maxFiles?: number;
  onUploadComplete?: (files: UploadedFile[]) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
  uploadProgress: number;
  status: 'uploading' | 'completed' | 'error';
}

export default function FileUploadModal({ 
  isOpen, 
  onClose, 
  title, 
  description,
  acceptedTypes,
  maxFiles = 5,
  onUploadComplete 
}: FileUploadModalProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    if (files.length + newFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const processedFiles: UploadedFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      uploadProgress: 0,
      status: 'uploading'
    }));

    setFiles(prev => [...prev, ...processedFiles]);

    // Simulate upload progress
    processedFiles.forEach(file => {
      simulateUpload(file.id);
    });
  };

  const simulateUpload = async (fileId: string) => {
    const updateProgress = (progress: number, status?: 'uploading' | 'completed' | 'error') => {
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, uploadProgress: progress, status: status || file.status }
          : file
      ));
    };

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        updateProgress(progress);
      }
      
      // Random chance of error for demo
      if (Math.random() < 0.1) {
        updateProgress(0, 'error');
        toast.error('Upload failed');
      } else {
        updateProgress(100, 'completed');
      }
    } catch (error) {
      updateProgress(0, 'error');
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleComplete = () => {
    const completedFiles = files.filter(file => file.status === 'completed');
    if (completedFiles.length === 0) {
      toast.error('No files uploaded successfully');
      return;
    }
    
    onUploadComplete?.(completedFiles);
    toast.success(`${completedFiles.length} file(s) uploaded successfully`);
    onClose();
    setFiles([]);
  };

  const allCompleted = files.length > 0 && files.every(file => file.status === 'completed');
  const hasErrors = files.some(file => file.status === 'error');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <p className="text-sm text-muted-foreground">{description}</p>

          {/* Upload Area */}
          <motion.div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <div className="space-y-2">
              <div className="text-lg font-medium">
                Drag and drop files here, or{' '}
                <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                  browse
                  <input
                    type="file"
                    multiple
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="text-sm text-muted-foreground">
                Accepted: {acceptedTypes.join(', ')} • Max {maxFiles} files
              </div>
            </div>
          </motion.div>

          {/* File List */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 max-h-64 overflow-y-auto"
              >
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-white"
                  >
                    {/* File Preview/Icon */}
                    <div className="flex-shrink-0">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          {getFileIcon(file.type)}
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{file.name}</span>
                        <Badge variant="outline" size="sm">
                          {formatFileSize(file.size)}
                        </Badge>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Progress 
                            value={file.uploadProgress} 
                            className="flex-1 h-2"
                          />
                          <span className="text-xs text-muted-foreground">
                            {file.uploadProgress}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-2">
                      {file.status === 'completed' && (
                        <div className="text-green-600">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                      {file.status === 'error' && (
                        <div className="text-red-600">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                      )}
                      {file.status === 'uploading' && (
                        <motion.div
                          className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        />
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-muted-foreground">
              {files.length} / {maxFiles} files
              {hasErrors && (
                <span className="text-red-600 ml-2">
                  • Some uploads failed
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleComplete}
                disabled={!allCompleted}
              >
                Complete Upload
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}