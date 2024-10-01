import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import roleMutation from "@/hooks/mutation/roleMutation";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import useRoles from "@/hooks/useRoles";
import useRolePermission from "@/hooks/useRolePermission";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import { useTranslation } from "react-i18next";
import tgLinkMutation from "@/hooks/mutation/tgLink";
import useTgLinks from "@/hooks/useTgLinks";
import Loading from "@/components/Loader";

const EditAddTgLink = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate("/tg-link-it");
  const { refetch: linksRefetch } = useTgLinks({ enabled: false });
  const { mutate: postTgLink, isPending } = tgLinkMutation();

  const { data } = useTgLinks({ id: Number(id), enabled: !!id });
  const tgLink = data?.items?.[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onSubmit = () => {
    const { name, chat_id } = getValues();
    postTgLink(
      { name, chat_id, ...(!!id && { id: +id }) },
      {
        onSuccess: () => {
          successToast(!id ? "link created" : "link updated");
          navigate("/tg-link-it");
          linksRefetch();
          // if (!!id) linksRefetch();
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  useEffect(() => {
    if (id && tgLink?.name) {
      reset({
        name: tgLink.name,
        chat_id: tgLink.chat_id,
      });
    }
  }, [tgLink, id]);

  return (
    <Card>
      {isPending && <Loading />}
      <Header title={!id ? t("add") : `${t("edit_link")} №${id}`}>
        <button className="btn btn-success" onClick={goBack}>
          {t("back")}
        </button>
      </Header>

      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
        <BaseInputs label="name_in_table" error={errors.name}>
          <MainInput
            register={register("name", { required: t("required_field") })}
          />
        </BaseInputs>
        <BaseInputs label="chat_id" error={errors.chat_id}>
          <MainInput
            register={register("chat_id", { required: t("required_field") })}
          />
        </BaseInputs>

        <button type="submit" className="btn btn-success">
          {t("save")}
        </button>
      </form>
    </Card>
  );
};

export default EditAddTgLink;
