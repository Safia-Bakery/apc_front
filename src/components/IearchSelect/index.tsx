import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import cl from "classnames";
import { useState } from "react";

const data = [
  {
    id: "1b55d7e1-6946-4bbc-bf93-542bfdb2b584",
    name: "Стройматериал",
    code: "7885",
    firstchildi: [
      {
        id: "f5f89885-1f09-4f9a-b83d-05c9ebb2cc57",
        name: "Сантехника",
        code: "1254121",
        secondchildi: [],
      },
      {
        id: "87006c5e-f058-456f-a57f-b1247cc1a0fd",
        name: "Электротовары",
        code: "1254122",
        secondchildi: [],
      },
      {
        id: "8197f761-8152-4123-9218-a031f891f568",
        name: "Вентиляция",
        code: "1254123",
        secondchildi: [],
      },
      {
        id: "75c428e8-315d-4ba2-8cf1-02efc7a3f5f5",
        name: "Общестроительные материалы и и",
        code: "1254125",
        secondchildi: [],
      },
      {
        id: "b9ea9660-4bc8-423e-a739-c5590643c362",
        name: "Кафель/Керамогранит",
        code: "1254124",
        secondchildi: [],
      },
      {
        id: "20a1e92b-9b1b-4ecb-a467-e1ce0b36e2fc",
        name: "Мебель фурнитура",
        code: "1254140",
        secondchildi: [],
      },
      {
        id: "6fe3e935-cbdc-41a8-9848-f44f2332be54",
        name: "Оборудование запчасти",
        code: "1254139",
        secondchildi: [],
      },
    ],
  },
  {
    id: "09be831f-1201-4b78-9cad-7c94c3363276",
    name: "Инвентарь",
    code: "2280",
    firstchildi: [
      {
        id: "d7c83cd4-fedf-4dcb-b41b-a2a80173b329",
        name: "Фабрика инвентарь",
        code: "1246987",
        secondchildi: [
          {
            id: "679513c8-c7cb-4fdb-acb2-e2970830d69e",
            name: "медикаменты",
            code: "1247590",
            thirdchildi: [
              {
                id: "058d991b-539e-4a4e-be05-a0f32400005f",
                name: "Инвентар",
                code: "1247592",
                fourthchildi: [],
              },
            ],
          },
        ],
      },
      {
        id: "029bff0b-aab0-413a-9842-c08a41513c47",
        name: "мебель",
        code: "1252831",
        secondchildi: [],
      },
      {
        id: "018aa849-af2a-45db-bde5-b8a23b9a4538",
        name: "Холодильники и морозильники",
        code: "2518",
        secondchildi: [],
      },
      {
        id: "aeb32990-f5f4-477f-b8c7-20af1fe2aa17",
        name: "Металлические конструкция",
        code: "1249751",
        secondchildi: [
          {
            id: "d41be108-a937-49ff-90a7-67c6e5ec0017",
            name: "Металлические конструкция",
            code: "1249752",
            thirdchildi: [],
          },
        ],
      },
      {
        id: "0eda8c3f-6e89-4047-bf40-c39fdf8bca35",
        name: "мебел",
        code: "1252831",
        secondchildi: [],
      },
      {
        id: "0c08af77-e941-4278-b58b-e1dc9705e2b0",
        name: "Инвентарь Фабрика",
        code: "1252918",
        secondchildi: [
          {
            id: "2892ef58-4844-44ef-9ed5-88e60d9cd8ec",
            name: "Измерительнее приборы фабрика",
            code: "1252937",
            thirdchildi: [],
          },
          {
            id: "8b718a6b-5430-4239-8645-23d476cf44cc",
            name: "Инструменты фабрика",
            code: "1253231",
            thirdchildi: [],
          },
          {
            id: "492f51c1-ea57-4f4f-8cab-b6cea787d068",
            name: "Формы и выемки",
            code: "1249782",
            thirdchildi: [],
          },
          {
            id: "59094f5c-49de-42b1-b41c-8a0383f21692",
            name: "Декоративные товары фабрика",
            code: "1252927",
            thirdchildi: [],
          },
          {
            id: "783bdfdb-ff79-455a-9aec-402c2537611c",
            name: "Прочие расходы фабрика",
            code: "1252928",
            thirdchildi: [],
          },
          {
            id: "b6799930-34e3-42f4-9eb2-2fc5ae35e704",
            name: "Автомобили и автозапчасти",
            code: "1247574",
            thirdchildi: [],
          },
          {
            id: "f908b21a-b929-4583-bf87-b52270335cb2",
            name: "Мебель Фабрика",
            code: "1252919",
            thirdchildi: [],
          },
          {
            id: "afb0d29a-95fd-46e9-9a2d-a04d59dd37f7",
            name: "Кондиционеры фабрика",
            code: "1253422",
            thirdchildi: [],
          },
          {
            id: "d89b20af-8087-4896-b6bc-84c477de5be4",
            name: "Оборудование для цеха фабрика",
            code: "1252920",
            thirdchildi: [],
          },
          {
            id: "00b02a2d-8daa-414f-be90-302f9b30432d",
            name: "Прочие товары фабрика",
            code: "1252926",
            thirdchildi: [],
          },
          {
            id: "216b46a8-9bb9-47cb-94fe-315aefd5a3f4",
            name: "Медикаменты",
            code: "1247591",
            thirdchildi: [
              {
                id: "45927eb3-396a-4a7d-baaf-a79512b6ff0c",
                name: "Металлические конструкция",
                code: "1249751",
                fourthchildi: [
                  {
                    id: "21dbc699-f782-43e0-97da-8be628dd4a64",
                    name: "Инвентарь",
                    code: "1249754",
                  },
                  {
                    id: "0a571976-c97f-446e-9745-fc3a6d05dde5",
                    name: "Инвентарь",
                    code: "1249753",
                  },
                ],
              },
            ],
          },
          {
            id: "8ce72852-9251-44b0-9f90-06577a59e0f2",
            name: "Канцтовары фабрика",
            code: "1253171",
            thirdchildi: [],
          },
          {
            id: "cfeb2d09-2f0f-4b1f-8f77-80ad11627eea",
            name: "Посуда товары фабрика",
            code: "1253167",
            thirdchildi: [],
          },
          {
            id: "49ebad5d-3fd1-4d1d-9daa-6502ddb60f70",
            name: "Холодильник, морозилка фабрика",
            code: "1253166",
            thirdchildi: [],
          },
          {
            id: "bfcb34ab-9f60-4a6a-a2c2-584c165681eb",
            name: "Оргтехника фабрика",
            code: "1253168",
            thirdchildi: [],
          },
          {
            id: "a45bbf03-d8bb-44c2-96cb-f0ecbe16e921",
            name: "Метал конструкция фабрика",
            code: "1252925",
            thirdchildi: [],
          },
          {
            id: "5f2d4c13-380f-47a4-99ec-415a50dde276",
            name: "Форма и посуда из Турции",
            code: "3751",
            thirdchildi: [],
          },
        ],
      },
      {
        id: "e0f0ec34-9581-4446-b668-63d886489158",
        name: "Канцтовары",
        code: "1252180",
        secondchildi: [],
      },
      {
        id: "da54031d-16c6-49ba-8fcd-3271c940fb3a",
        name: "Магазин инвентар",
        code: "1246986",
        secondchildi: [],
      },
      {
        id: "0207149c-8f63-4d0d-9dbd-56c7c787eba5",
        name: "Декоративные предметы",
        code: "2679",
        secondchildi: [],
      },
      {
        id: "f7b44e02-4769-485b-b58a-1209f1c59c37",
        name: "Прочий инвентарь",
        code: "2641",
        secondchildi: [],
      },
      {
        id: "a5bb98ae-42e7-4e3e-8969-bab140489870",
        name: "Измерительные приборы",
        code: "1247589",
        secondchildi: [],
      },
      {
        id: "203a26b5-a458-4c45-b85d-ad961b5345f2",
        name: "Компьютеры и связь",
        code: "2524",
        secondchildi: [
          {
            id: "935f4eaa-a709-45e7-a3c0-569da3c2a364",
            name: "Кухня оборудования",
            code: "2583",
            thirdchildi: [],
          },
        ],
      },
      {
        id: "95a4484b-fd62-4859-b11b-af978973c04c",
        name: "Кондиционеры",
        code: "2521",
        secondchildi: [
          {
            id: "99b552e0-27ed-442c-a900-e76aa14c2ba0",
            name: "Кухня оборудования",
            code: "2583",
            thirdchildi: [],
          },
        ],
      },
      {
        id: "a634fc2a-ecf1-47dd-8eb6-5ef80a1b5182",
        name: "Оборудования для бара",
        code: "2618",
        secondchildi: [],
      },
      {
        id: "17c0af57-d616-4c06-9281-97e1555944d8",
        name: "Оборудования кухня",
        code: "2591",
        secondchildi: [],
      },
      {
        id: "d166762f-7040-48ba-9fe9-0ad11954598f",
        name: "Оборудование для бара",
        code: "1248837",
        secondchildi: [],
      },
      {
        id: "b0191ee9-b614-45c4-88db-02bd0047ceef",
        name: "Оборудования для цех",
        code: "2661",
        secondchildi: [],
      },
      {
        id: "568415be-b2c0-4f47-bcda-d305f8cd6b39",
        name: "Униформа",
        code: "1247635",
        secondchildi: [],
      },
      {
        id: "7a24dbd9-f821-4fab-8a6b-88b78b1a9e05",
        name: "123",
        code: "2590",
        secondchildi: [],
      },
      {
        id: "75d14cda-3f2b-4d0e-936b-6f2b4db9afe6",
        name: "Посуда и прочие",
        code: "2283",
        secondchildi: [],
      },
      {
        id: "fdd06b6c-dbaa-41a9-a89e-850a161be120",
        name: "Металлические конструкции",
        code: "1249753",
        secondchildi: [
          {
            id: "8b764b6a-f982-4ead-a93d-5f2926b8ec7f",
            name: "Инвентарь фабрика",
            code: "1252966",
            thirdchildi: [],
          },
        ],
      },
      {
        id: "9aae3a33-588e-4b43-94c6-a72ca04052c3",
        name: "Инструменты",
        code: "3703",
        secondchildi: [],
      },
      {
        id: "63d7424e-c0dd-4958-af4f-58da3dec3da5",
        name: "Металлические конструкция",
        code: "1249753",
        secondchildi: [],
      },
      {
        id: "0a5d4d15-53cb-4425-b76b-202f79e87e2c",
        name: "Оборудования для кухни и цеха",
        code: "2584",
        secondchildi: [],
      },
      {
        id: "dfbb7c11-d02d-42d8-a630-5604d67f7719",
        name: "Мебель",
        code: "2753",
        secondchildi: [],
      },
      {
        id: "a76a6e4e-c801-43f2-a63f-6757fb826d36",
        name: "Кухня оборудования",
        code: "2608",
        secondchildi: [],
      },
    ],
  },
];

const DropDownSub = () => {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleItemClick = (itemId: string) => {
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter((id) => id !== itemId));
    } else {
      setExpandedItems([...expandedItems, itemId]);
    }
  };

  const isItemExpanded = (itemId: string) => expandedItems.includes(itemId);

  return (
    <div className={styles.drop}>
      <div className="popover-title">
        <button className="close">x</button>
        Выберите товар
      </div>
      <div className="bs-searchbox">
        <input
          type="text"
          className="form-control"
          role="textbox"
          aria-label="Search"
        />
      </div>
      <ul className={styles.list}>
        {data?.length &&
          data.map((item) => (
            <ul key={item.id} className="list-group">
              <li
                onClick={() => handleItemClick(item.id)}
                className={cl("list-group-item position-relative", {
                  [styles.expanded]: isItemExpanded(item.id),
                })}
              >
                {item.name}
                {!!item?.firstchildi?.length && (
                  <img
                    src="/assets/icons/arrow.svg"
                    alt="arrow"
                    className={styles.arrow}
                  />
                )}
              </li>
              {isItemExpanded(item.id) && (
                <ul>
                  {item?.firstchildi?.map((first) => (
                    <ul key={first.id}>
                      <li
                        className="list-group-item"
                        onClick={() => handleItemClick(first.id)}
                      >
                        {first?.name}
                        {!!first?.secondchildi?.length && (
                          <img
                            src="/assets/icons/arrow.svg"
                            alt="arrow"
                            className={styles.arrow}
                          />
                        )}
                      </li>
                      {isItemExpanded(first.id) && (
                        <ul>
                          {first?.secondchildi.map((second) => (
                            <ul key={second.id}>
                              <li key={second.id} className="list-group-item">
                                {second?.name}kk
                                {!!second?.thirdchildi?.length && (
                                  <img
                                    src="/assets/icons/arrow.svg"
                                    alt="arrow"
                                    className={styles.arrow}
                                  />
                                )}
                              </li>
                              {isItemExpanded(second.id) && (
                                <ul>
                                  {second?.thirdchildi?.map((third) => (
                                    <ul>
                                      <li
                                        key={third.id}
                                        className="list-group-item"
                                      >
                                        {third?.name}ll
                                        {!!third?.fourthchildi?.length && (
                                          <img
                                            src="/assets/icons/arrow.svg"
                                            alt="arrow"
                                            className={styles.arrow}
                                          />
                                        )}
                                      </li>
                                      {isItemExpanded(third.id) && (
                                        <ul>
                                          {third.fourthchildi?.map((fourth) => (
                                            <li
                                              key={fourth.id}
                                              className="list-group-item"
                                            >
                                              {fourth.name}
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </ul>
                                  ))}
                                </ul>
                              )}
                            </ul>
                          ))}
                        </ul>
                      )}
                    </ul>
                  ))}
                </ul>
              )}
            </ul>
          ))}
      </ul>
    </div>
  );
};

export default DropDownSub;
