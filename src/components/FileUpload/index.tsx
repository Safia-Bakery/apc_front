import { ChangeEvent, FC, useEffect, useState } from "react";
import { reportImgSelector } from "reducers/selects";
import { useAppSelector } from "@/store/utils/types";
import cl from "classnames";
import { useTranslation } from "react-i18next";

export interface FileItem {
  file: File;
  id: number | string;
}
interface FileUploaderProps {
  onFilesSelected: (formData: FileItem[]) => void;
  inputRef?: any;
  tableHead?: string;
}

const UploadComponent: FC<FileUploaderProps> = ({
  onFilesSelected,
  inputRef,
  tableHead,
}) => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [fileIdCounter, setFileIdCounter] = useState(0);
  const upladedFiles = useAppSelector(reportImgSelector);

  useEffect(() => {
    if (!upladedFiles) setFileList([]);
  }, [upladedFiles]);

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
        id="fileUploader"
        type="file"
        ref={inputRef}
        multiple
        onChange={handleFileUpload}
      />

      {!!fileList?.length && (
        <table className="table table-hover mt-3 w-full">
          <thead>
            <tr>
              <th className={cl("bg-primary py-3 border", tableHead)}>
                {t("uploaded_files")}
              </th>
              <th className={cl("bg-primary py-3 border", tableHead)}></th>
            </tr>
          </thead>

          <tbody>
            {fileList.map((item) => (
              <tr className="bg-blue border" key={item.id}>
                <td className="text-black border">{item.file.name}</td>
                <td width={50}>
                  <div
                    className="flex justify-content-center pointer"
                    onClick={() => handleFileDelete(item.id)}
                  >
                    <img src="/icons/delete.svg" alt="delete" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UploadComponent;
