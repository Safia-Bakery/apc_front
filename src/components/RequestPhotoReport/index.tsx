import UploadComponent, { FileItem } from "@/components/FileUpload";
import { uploadFileMutation } from "@/hooks/mutation/uploadFile";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import { useRef } from "react";
import { reportImgSelector, uploadReport } from "reducers/selects";
import Card from "../Card";
import Header from "../Header";
import { useTranslation } from "react-i18next";
import useOrder from "@/hooks/useOrder";
import { useParams } from "react-router-dom";

const RequestPhotoReport = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const upladedFiles = useAppSelector(reportImgSelector);
  const { mutate } = uploadFileMutation();
  const dispatch = useAppDispatch();
  const inputRef = useRef<any>(null);

  const { refetch: orderRefetch } = useOrder({
    id: Number(id),
    enabled: false,
  });

  const handleFilesSelected = (data: FileItem[]) =>
    dispatch(uploadReport(data));

  const handlerSubmitFile = () => {
    if (upladedFiles?.length)
      mutate(
        {
          request_id: Number(id),
          files: upladedFiles,
        },
        {
          onSuccess: () => {
            orderRefetch();
            dispatch(uploadReport([]));
            inputRef.current.value = null;
            successToast("Сохранено");
          },
          onError: (e) => errorToast(e.message),
        }
      );
  };
  return (
    <div>
      <Card className="overflow-hidden !min-h-min">
        <Header title={"add_photo_report"} />
        <div className="m-3">
          <UploadComponent
            onFilesSelected={handleFilesSelected}
            inputRef={inputRef}
          />
          {!!upladedFiles?.length && (
            <button
              onClick={handlerSubmitFile}
              type="button"
              id={"save_report"}
              className="btn btn-success float-end my-3"
            >
              {t("save")}
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RequestPhotoReport;
