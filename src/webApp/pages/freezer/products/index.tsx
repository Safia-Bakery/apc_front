import WebAppContainer from "@/webApp/components/WebAppContainer";
import useDebounce from "@/hooks/custom/useDebounce";
import InvInput from "@/webApp/components/InvInput";
import ToolCard from "@/webApp/components/ToolCard";
import Loading from "@/components/Loader";
import EmptyList from "@/components/EmptyList";
import useQueryString from "@/hooks/custom/useQueryString";
import InvPagination from "@/webApp/components/InvPagination";
import InvButton, { InvBtnType } from "@/webApp/components/InvButton";
import { cartSelector } from "@/store/reducers/webInventory";
import { useAppSelector } from "@/store/utils/types";
import { useNavigate } from "react-router-dom";
import useBranch from "@/hooks/useBranch";
import { freezerState } from "@/store/reducers/auth";
import InvHeader from "@/webApp/components/InvHeader";
import { Empty, Flex, Table, Typography } from "antd";
import { CloseOutlined, FolderOutlined } from "@ant-design/icons";
import AntdTable from "@/components/AntdTable";
import { BtnTypes } from "@/Types/common/btnTypes";
import { useMemo, useState } from "react";
import useToolsIerarch from "@/hooks/useToolsIerarch";
import { InventoryTools, ToolsFolderType } from "@/utils/types";
import { ColumnsType } from "antd/es/table";
import FreezerItem from "@/webApp/components/FreezerItem";

interface LocalFolderType {
  name: string;
  id: string;
}

const FreezerProducts = () => {
  const [toolsSearch, $toolsSearch] = useDebounce("");
  const [folderStack, $folderStack] = useState<LocalFolderType[]>([]);
  const navigate = useNavigate();
  const cart = useAppSelector(cartSelector);

  const { data: searchedItems, isLoading } = useToolsIerarch({
    parent_id: folderStack?.at(-1)?.id,
    ...(toolsSearch && { name: toolsSearch }),
  });

  const handleFolder = (item: ToolsFolderType) => {
    $folderStack((prev) => [...prev, { name: item.name, id: item.id }]);
  };

  const handleBack = () => $folderStack((prev) => prev.slice(0, -1));

  const folderColumns = useMemo<ColumnsType<ToolsFolderType>>(
    () => [
      {
        dataIndex: "name",
        className: "!p-0",
        render: (_, record) => (
          <InvButton
            btnType={InvBtnType.primary}
            onClick={() => handleFolder(record)}
            className={
              "w-full !p-2 !h-max justify-start !items-start !text-start mb-1"
            }
          >
            <FolderOutlined /> {record.name}
          </InvButton>
        ),
      },
    ],
    []
  );

  const prodsColumns = useMemo<ColumnsType<InventoryTools>>(
    () => [
      {
        dataIndex: "name",
        className: "!bg-red !p-1",
        render: (_, record) => <ToolCard tool={record} />,
      },
    ],
    []
  );

  const renderList = useMemo(() => {
    return (
      <>
        <AntdTable
          sticky
          className="tg-table pt-3"
          loading={isLoading}
          rootClassName="!bg-transparent"
          scroll={{ y: 250 }}
          rowClassName={"!bg-transparent"}
          columns={folderColumns}
          data={searchedItems?.folders}
          locale={{ emptyText: "" }}
          summary={() =>
            !!folderStack?.length && (
              <Table.Summary fixed={"top"}>
                <Table.Summary.Row>
                  <td>
                    <InvButton className="w-full" btnType={InvBtnType.primary}>
                      Выбрано: {folderStack?.at(-1)?.name}
                    </InvButton>
                  </td>
                </Table.Summary.Row>
              </Table.Summary>
            )
          }
        />

        <AntdTable
          className="tg-table pt-3"
          loading={isLoading}
          scroll={{ y: 250 }}
          rowClassName={"!bg-transparent pt-2"}
          columns={prodsColumns}
          data={searchedItems?.tools}
          showHeader={false}
          locale={{
            emptyText: () => (
              <>
                <Empty className={"p-2"} description={"Список пуст"} />
              </>
            ),
          }}
        />
      </>
    );
  }, [searchedItems, folderStack, isLoading]);

  return (
    <>
      <InvHeader sticky title={"Создать заказ"} />

      <WebAppContainer className="h-full overflow-y-auto pb-10">
        <InvInput
          placeholder="Поиск товаров"
          wrapperClassName="bg-white mb-5"
          onChange={(e) => $toolsSearch(e.target?.value)}
        />

        <Flex align={"center"} gap={10}>
          {!!folderStack.length && (
            <InvButton
              className={"!min-w-9"}
              onClick={handleBack}
              btnType={InvBtnType.tgSelected}
              children={
                <img
                  src="/icons/arrow.svg"
                  className="-rotate-90"
                  alt="go-back"
                  height={24}
                  width={24}
                />
              }
            />
          )}
          <Typography>Выбрать продукт</Typography>
        </Flex>

        {renderList}

        <div className="fixed bottom-0 left-0 right-0 bg-white py-2 px-5 z-[105]">
          <InvButton
            btnType={InvBtnType.primary}
            disabled={!Object.values(cart).length}
            className="w-full !h-11"
            onClick={() => navigate("/tg/collector/cart")}
          >
            Корзина ({Object.values(cart).length})
          </InvButton>
        </div>
      </WebAppContainer>
    </>
  );
};

export default FreezerProducts;
