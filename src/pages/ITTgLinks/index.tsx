import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { MainPermissions } from "@/utils/types";
import Loading from "@/components/Loader";
import TableHead from "@/components/TableHead";
import TableViewBtn from "@/components/TableViewBtn";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import EmptyList from "@/components/EmptyList";
import { useTranslation } from "react-i18next";
import useTgLinks from "@/hooks/useTgLinks";

const column = [
  { name: "№", key: "" },
  { name: "name", key: "name" },
  { name: "chat_id", key: "chat_id" },
  { name: "", key: "" },
];

const ITTgLinks = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigate = (route: string) => () => navigate(route);
  const permission = useAppSelector(permissionSelector);

  const { data: links, isLoading: orderLoading } = useTgLinks({});
  if (orderLoading) return <Loading />;

  return (
    <Card>
      <Header title={"tg_links"}>
        {permission?.[MainPermissions.add_tg_link] && (
          <button className="btn btn-success" onClick={handleNavigate("add")}>
            {t("add")}
          </button>
        )}
      </Header>

      <div className="table-responsive grid-view content">
        <table className="table table-hover">
          <TableHead column={column} />

          {!!links?.items?.length && (
            <tbody>
              {links.items?.map((role, idx) => (
                <tr className="bg-blue" key={role.id}>
                  <td width="40">{idx + 1}</td>
                  <td>{role?.name}</td>
                  <td>{role?.chat_id}</td>
                  <td width={40}>
                    {permission?.[MainPermissions.edit_tg_link] && (
                      <TableViewBtn onClick={handleNavigate(`${role.id}`)} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {!links?.items?.length && !orderLoading && <EmptyList />}
      </div>
    </Card>
  );
};

export default ITTgLinks;
