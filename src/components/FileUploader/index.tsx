import React, { useRef, useState } from "react";

interface FileUploaderProps {
  onFilesSelected: (formData: FormData) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      setFiles(fileList);
      const formData = new FormData();
      Array.from(fileList).forEach((file) => {
        formData.append("files", file, file.name);
      });
      setSelectedFiles(Array.from(fileList));
      onFilesSelected(formData);
    }
  };

  const handleDelete = (index: number) => {
    return () => {
      if (files) {
        const updatedFiles = Array.from(files);
        updatedFiles.splice(index, 1);
        const updatedFileList = createFileList(updatedFiles);
        setFiles(updatedFileList);
        setSelectedFiles(updatedFiles);
        onFilesSelected(createFormData(updatedFiles));
        delete fileRef?.current?.files?.[index];
      }
    };
  };

  const createFileList = (files: File[]): FileList => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => {
      dataTransfer.items.add(file);
    });
    return dataTransfer.files;
  };

  const createFormData = (files: File[]): FormData => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file, file.name);
    });
    return formData;
  };
  console.log(fileRef.current?.files);
  return (
    <div>
      <input type="file" ref={fileRef} multiple onChange={handleFileChange} />
      {selectedFiles.length > 0 && (
        <div>
          <h4>Selected Files:</h4>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>
                <p>{file.name}</p>
                <div onClick={handleDelete(index)}>x</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
