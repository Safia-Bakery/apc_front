import Card from "@/components/Card";
import Header from "@/components/Header";
import Loading from "@/components/Loader";
import useToolsIerarch from "@/hooks/useToolsIerarch";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";
import useQueryString from "@/hooks/custom/useQueryString";
import EmptyList from "@/components/EmptyList";

const ToolsIerarch = () => {
  const navigate = useNavigate();
  const navigateParams = useNavigateParams();

  const parent_id = useQueryString("parent_id");
  const parent_name = useQueryString("parent_name");
  const { data, isLoading, isFetching } = useToolsIerarch({
    ...(!!parent_id && { parent_id }),
  });

  const handleParentId = (id: string, name: string) => () =>
    navigateParams({ parent_id: id, parent_name: name });

  if (isLoading) return <Loading absolute />;

  return (
    <Card className="pb-4">
      <Header title={!parent_name ? "Инвентарь / Товары" : parent_name}>
        <button
          className="btn btn-primary btn-fill"
          onClick={() => navigate(-1)}
        >
          Назад
        </button>
      </Header>

      <ul>
        {data?.folders?.map((folder) => (
          <li
            className={styles.folder}
            onClick={handleParentId(folder.id, folder.name)}
            key={folder.id}
          >
            <img src="/assets/icons/folder.svg" alt="folder" />
            <span className="bg-gray-300">{folder.name}</span>
          </li>
        ))}
        <hr />
        {!!data?.tools?.length &&
          data?.tools?.map((tool) => (
            <li className={styles.tool} key={tool.id}>
              <span>{tool.name}</span>
            </li>
          ))}
      </ul>
      {!data?.folders.length && !data?.tools.length && <EmptyList />}
      {!isLoading && isFetching && <Loading absolute />}
    </Card>
  );
};

export default ToolsIerarch;
