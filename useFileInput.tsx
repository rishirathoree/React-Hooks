import { useState, useRef } from "react";

interface UseFileInputOptions {
    accept?: string;
    maxSize?: number;
}

export function useFileInput({ accept, maxSize }: UseFileInputOptions) {
    const [fileName, setFileName] = useState<string>("");
    const [error, setError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileSize, setFileSize] = useState<number>(0);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        validateAndSetFile(file);
    };

    const validateAndSetFile = (file: File | undefined) => {
        setError("");

        if (file) {
            if (maxSize && file.size > maxSize * 1024 * 1024) {
                setError(`File size must be less than ${maxSize}MB`);
                return;
            }

            if (
                accept &&
                !file.type.match(accept.replace("/*", "/"))
            ) {
                setError(`File type must be ${accept}`);
                return;
            }

            setFileSize(file.size);
            setFileName(file.name);
        }
    };

    const clearFile = () => {
        setFileName("");
        setError("");
        setFileSize(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return {
        fileName,
        error,
        fileInputRef,
        handleFileSelect,
        validateAndSetFile,
        clearFile,
        fileSize,
    };
}


// Use This In UI
import { useFileInput } from "@/components/hooks/use-file-input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BasicExample() {
  const { 
    fileName, 
    error, 
    fileInputRef, 
    handleFileSelect,
    clearFile 
  } = useFileInput({
    maxSize: 2
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic File Upload</h3>
      <div className="flex gap-4 items-center">
        <Button 
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
        >
          Select File
        </Button>
        {fileName && (
          <Button 
            onClick={clearFile}
            variant="ghost"
            size="sm"
          >
            Clear
          </Button>
        )}
      </div>
      
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
      
      {fileName && (
        <p className="text-sm text-muted-foreground">
          Selected: {fileName}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-500">
          Error: {error}
        </p>
      )}
    </div>
  )
}

export function ImageUploader() {
  const { 
    fileName, 
    error, 
    fileInputRef, 
    handleFileSelect,
    fileSize,
    clearFile 
  } = useFileInput({
    accept: "image/*",
    maxSize: 5
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Image Upload</h3>
      <div className="flex gap-4 items-center">
        <Button 
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
        >
          Select Image
        </Button>
        {fileName && (
          <Button 
            onClick={clearFile}
            variant="ghost"
            size="sm"
          >
            Clear
          </Button>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
      
      {fileName && (
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Selected: {fileName}
          </p>
          <p className="text-sm text-muted-foreground">
            Size: {(fileSize / (1024 * 1024)).toFixed(2)}MB
          </p>
        </div>
      )}
      {error && (
        <p className="text-sm text-red-500">
          Error: {error}
        </p>
      )}
    </div>
  )
}

export function DocumentUploader() {
  const { 
    fileName, 
    error, 
    fileInputRef, 
    handleFileSelect,
    clearFile 
  } = useFileInput({
    accept: ".pdf,.doc,.docx",
    maxSize: 10
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Document Upload</h3>
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center",
          "hover:border-brand/50 transition-colors cursor-pointer",
          error && "border-red-500"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        {fileName ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">{fileName}</p>
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              variant="ghost"
              size="sm"
            >
              Remove
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click to upload or drag and drop<br />
            PDF, DOC up to 10MB
          </p>
        )}
      </div>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
      
      {error && (
        <p className="text-sm text-red-500">
          Error: {error}
        </p>
      )}
    </div>
  )
}
