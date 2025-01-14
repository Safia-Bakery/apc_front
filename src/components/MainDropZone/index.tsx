import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, Flex, Image, message, Modal, Upload } from "antd";
import { useTranslation } from "react-i18next";
import { baseURL } from "@/store/baseUrl";
import { useAppSelector } from "@/store/utils/types";
import { tokenSelector } from "@/store/reducers/auth";
import Loading from "../Loader";
import { SetStateAction, useState } from "react";

const { Dragger } = Upload;

interface Props extends UploadProps {
  setData: (value: SetStateAction<string[]>) => void;
  defaultFiles?: string[];
  btnLabel?: string;
}

const MainDropZone = ({
  setData,
  defaultFiles,
  name = "files",
  btnLabel = "Загрузить файлы",
  listType = "picture",
  ...others
}: Props) => {
  const { t } = useTranslation();
  const token = useAppSelector(tokenSelector);
  const [open, $open] = useState(false);
  const [localData, $localData] = useState<string[]>([]);

  const toggleModal = () => $open((prev) => !prev);

  const onOk = () => {
    setData(localData);
    toggleModal();
  };

  const handleRemove = (image: string) =>
    setData((prev) => prev.filter((item) => item !== image));

  const handleLocalRemove = (image: string) =>
    $localData((prev) => prev.filter((item) => item !== image));

  const props: UploadProps = {
    name,
    openFileDialogOnClick: true,
    action: `${baseURL}/file/upload`,
    headers: { Authorization: `Bearer ${token}` },
    listType,

    onChange(info) {
      const { status } = info?.file;
      if (status !== "uploading") {
        <Loading />;
      }
      if (status === "done") {
        $localData((prev) => [...prev, info?.file?.response?.files?.[0]]);
        message.success(`${info?.file?.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info?.file?.name} file upload failed.`);
      }
    },
    onRemove(info) {
      handleLocalRemove(info?.response?.files?.[0]);
    },
    ...others,
  };
  return (
    <>
      <Flex gap={20} wrap={"wrap"} className="mt-4">
        {defaultFiles?.map((image) => (
          <div className="relative w-min" key={image}>
            <button
              onClick={() => handleRemove(image)}
              className="absolute top-1 right-1 z-10 bg-white rounded-full p-1"
            >
              <img
                src="/icons/delete.svg"
                height={20}
                width={20}
                alt="delete"
              />
            </button>
            <Image
              src={`${baseURL}/${image}`}
              height={80}
              width={80}
              className="rounded-lg"
            />
          </div>
        ))}
      </Flex>
      <Button type="primary" onClick={toggleModal} className="w-60">
        {btnLabel}
      </Button>
      <Modal
        onCancel={toggleModal}
        closable
        onOk={onOk}
        okButtonProps={{ disabled: !localData?.length }}
        open={open}
        classNames={{ body: "!pt-6" }}
      >
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{t("upload_files")}</p>
          <p className="ant-upload-hint">{t("file_upload_descr")}</p>
        </Dragger>
      </Modal>
    </>
  );
};

export default MainDropZone;
