import WebAppContainer from "@/webApp/components/WebAppContainer";
import useDebounce from "@/hooks/custom/useDebounce";
import InvInput from "@/webApp/components/InvInput";

import InvButton, { InvBtnType } from "@/webApp/components/InvButton";
import { cartSelector } from "@/store/reducers/webInventory";
import { useAppSelector } from "@/store/utils/types";
import { useNavigate } from "react-router-dom";
import InvHeader from "@/webApp/components/InvHeader";
import { Empty, Typography } from "antd";
import { FolderOutlined } from "@ant-design/icons";
import AntdTable from "@/components/AntdTable";
import { useMemo, useState } from "react";
import { useToolsIerarch } from "@/hooks/useToolsIerarch";
import { InventoryTools, ToolsFolderType } from "@/utils/types";
import { ColumnsType } from "antd/es/table";
import FreezerClientItem from "@/webApp/components/FreezerClientItem";
import { screenSize } from "@/utils/helpers";
import FreezerItem from "@/webApp/components/FreezerItem";
import { TelegramApp } from "@/utils/tgHelpers";

interface LocalFolderType {
  name: string;
  id: string;
}

interface Props {
  freezer?: boolean;
}

const FreezerProducts = ({ freezer }: Props) => {
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
        render: (_, record) =>
          freezer ? (
            <FreezerItem tool={record} add_limit={freezer} />
          ) : (
            <FreezerClientItem tool={record} />
          ),
      },
    ],
    []
  );

  const renderList = useMemo(() => {
    return (
      <>
        {!!searchedItems?.folders?.length && (
          <AntdTable
            sticky
            className="tg-table"
            loading={isLoading}
            rootClassName="!bg-transparent"
            scroll={{ y: screenSize(25) }}
            rowClassName={"!bg-transparent"}
            columns={folderColumns}
            data={searchedItems?.folders}
            locale={{ emptyText: "" }}
          />
        )}

        <AntdTable
          className="tg-table pt-3 mb-10"
          loading={isLoading}
          scroll={{ y: screenSize(65) }}
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
      <InvHeader
        sticky
        title={folderStack?.at(-1)?.name || "Создать заказ"}
        customBack={handleBack}
        goBack
      />

      <WebAppContainer className="h-full overflow-y-auto pb-2">
        <InvInput
          placeholder="Поиск товаров"
          wrapperClassName="bg-white mb-5"
          onChange={(e) => $toolsSearch(e.target?.value)}
        />
        <Typography className="font-bold">Выбрать продукт</Typography>
      </WebAppContainer>
      {renderList}

      <div className="fixed bottom-0 left-0 right-0 bg-white py-2 px-5 z-[105]">
        {freezer ? (
          <InvButton
            btnType={InvBtnType.primary}
            // disabled={!Object.values(cart).length}
            className="w-full !h-11"
            onClick={() => TelegramApp.toMainScreen()}
          >
            Закрыть
          </InvButton>
        ) : (
          <InvButton
            btnType={InvBtnType.primary}
            disabled={!Object.values(cart).length}
            className="w-full !h-11"
            onClick={() => navigate("/tg/collector/cart")}
          >
            Корзина ({Object.values(cart).length})
          </InvButton>
        )}
      </div>
    </>
  );
};

export default FreezerProducts;
