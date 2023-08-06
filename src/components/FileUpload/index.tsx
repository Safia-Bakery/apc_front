import { ChangeEvent, FC, useState } from "react";

export interface FileItem {
  file: File;
  id: number | string;
}
interface FileUploaderProps {
  onFilesSelected: (formData: FileItem[]) => void;
}

const UploadComponent: FC<FileUploaderProps> = ({ onFilesSelected }) => {
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [fileIdCounter, setFileIdCounter] = useState(0);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const updatedFileList: FileItem[] = [...fileList];
      for (let i = 0; i < files.length; i++) {
        const newFileItem: FileItem = {
          file: files[i],
          id: fileIdCounter + i,
        };
        updatedFileList.push(newFileItem);
      }
      onFilesSelected(updatedFileList);
      setFileList(updatedFileList);
      setFileIdCounter(fileIdCounter + files.length);
    }
  };

  const handleFileDelete = (id: number | string) => {
    const updatedFileList = fileList.filter((item) => item.id !== id);
    setFileList(updatedFileList);
    onFilesSelected(updatedFileList);
  };

  return (
    <div>
      <input
        className="form-control"
        type="file"
        multiple
        onChange={handleFileUpload}
      />
      <div className="file-list">
        {fileList.map((item) => (
          <div key={item.id} className="file-item">
            <span>{item.file.name}</span>
            <button onClick={() => handleFileDelete(item.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadComponent;
