import Card from "../Card";
import Header from "../Header";
import { useParams } from "react-router-dom";
import useOrder from "@/hooks/useOrder";
import { detectFileType } from "@/utils/helpers";
import { useNavigateParams } from "custom/useCustomNavigate";
import { FileType, ModalTypes } from "@/utils/types";
import { baseURL } from "@/main";
import cl from "classnames";
import { useTranslation } from "react-i18next";

const column = [
  { name: "№" },
  { name: "name_in_table" },
  { name: "quantity" },
  { name: "photo" },
];

const AddedProductsIT = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigateParams = useNavigateParams();

  const handleShowPhoto = (file: string) => () => {
    if (detectFileType(file) === FileType.other) return window.open(file);
    else {
      navigateParams({ modal: ModalTypes.showPhoto, photo: file });
    }
  };

  const { data: order } = useOrder({ id: Number(id) });

  return (
    <Card>
      <Header title="products" />

      <div className="content table-responsive table-full-width overflow-hidden">
        <table className="table table-hover">
          <thead>
            <tr>
              {column.map(({ name }) => {
                return (
                  <th className={"bg-primary text-white"} key={name}>
                    {name}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {order?.request_orpr?.map((item, idx) => (
              <tr className="bg-blue" key={item.id}>
                <td width="40">{idx + 1}</td>
                <td>{item?.orpr_product.name}</td>
                <td>{item?.amount}</td>
                <td>
                  {!!item?.orpr_product?.image && (
                    <div
                      className={cl(
                        "text-link cursor-pointer max-w-[150px] w-full text-truncate"
                      )}
                      onClick={handleShowPhoto(
                        `${baseURL}/${item?.orpr_product?.image}`
                      )}
                    >
                      {t("file")}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
      </div>
    </Card>
  );
};

export default AddedProductsIT;
