import React, { useCallback } from 'react';
import { Upload, FileText, File as FileIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile: (file: File) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  selectedFiles,
  onRemoveFile,
  isProcessing
}) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type === 'application/pdf' || file.type === 'text/plain'
    );
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(file => 
        file.type === 'application/pdf' || file.type === 'text/plain'
      );
      if (files.length > 0) {
        onFilesSelected(files);
      }
    }
  }, [onFilesSelected]);

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition-colors"
      >
        <input
          type="file"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          multiple
          accept=".pdf,.txt"
        />
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <Upload className="w-8 h-8 text-white/60" />
          <div className="text-white/80">
            <span className="font-medium">Click to upload</span> or drag and drop
          </div>
          <p className="text-sm text-white/60">
            PDF and TXT files only
          </p>
        </label>
      </div>

      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {selectedFiles.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="flex items-center gap-2 bg-white/10 p-2 rounded-lg group"
              >
                <div className="p-2 bg-white/10 rounded">
                  {file.type.includes('pdf') ? (
                    <FileText className="w-4 h-4 text-white/60" />
                  ) : (
                    <FileIcon className="w-4 h-4 text-white/60" />
                  )}
                </div>
                <span className="flex-1 text-sm text-white/80 truncate">
                  {file.name}
                </span>
                <button
                  onClick={() => onRemoveFile(file)}
                  className="p-1 rounded-full hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isProcessing}
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};