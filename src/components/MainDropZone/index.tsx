import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import { useTranslation } from "react-i18next";
import { baseURL } from "@/store/baseUrl";
import { useAppSelector } from "@/store/utils/types";
import { tokenSelector } from "@/store/reducers/auth";
import Loading from "../Loader";
import { useState } from "react";

const { Dragger } = Upload;

interface Props {
  forwardedRef?: any;
}

const MainDropZone = ({ forwardedRef }: Props) => {
  const { t } = useTranslation();
  const token = useAppSelector(tokenSelector);
  const [fileUrls, $fileUrls] = useState();

  const props: UploadProps = {
    name: "files",
    openFileDialogOnClick: true,
    action: `${baseURL}/file/upload`,
    headers: { Authorization: `Bearer ${token}` },

    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        <Loading />;
      }
      if (status === "done") {
        forwardedRef?.current?.push(info?.file?.response?.[0]);
        message.success(`${info?.file?.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info?.file?.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer?.files);
    },
  };
  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">{t("upload_files")}</p>
      <p className="ant-upload-hint">{t("file_upload_descr")}</p>
    </Dragger>
  );
};

export default MainDropZone;
