import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import { useTranslation } from "react-i18next";
import { baseURL } from "@/store/baseUrl";
import { useAppSelector } from "@/store/utils/types";
import { tokenSelector } from "@/store/reducers/auth";
import Loading from "../Loader";
import { SetStateAction } from "react";

const { Dragger } = Upload;

interface Props extends UploadProps {
  setData: (value: SetStateAction<string[]>) => void;
}

const MainDropZone = ({ setData, ...others }: Props) => {
  const { t } = useTranslation();
  const token = useAppSelector(tokenSelector);

  const props: UploadProps = {
    name: "files",
    openFileDialogOnClick: true,
    action: `${baseURL}/file/upload`,
    headers: { Authorization: `Bearer ${token}` },
    listType: "picture",

    onChange(info) {
      const { status } = info?.file;
      if (status !== "uploading") {
        <Loading />;
      }
      if (status === "done") {
        setData((prev) => [...prev, info?.file?.response?.files?.[0]]);
        message.success(`${info?.file?.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info?.file?.name} file upload failed.`);
      }
    },
    onRemove(info) {
      setData((prev) =>
        prev.filter((item) => item !== info?.response?.files?.[0])
      );
    },
    ...others,
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
