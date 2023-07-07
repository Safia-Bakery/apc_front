import { useState, FC, useRef } from "react";
import {
  YMaps,
  Map,
  Placemark,
  GeolocationControl,
  SearchControl,
  YMapsApi,
} from "react-yandex-maps";
import styles from "./index.module.scss";

const YandexMap: FC = () => {
  const ymaps = useRef<any>();
  const map = useRef<any>();
  const [markerCoords, setMarkerCoords] = useState<number[]>([
    41.30524669891599, 69.24100608330389,
  ]);

  const addSearchControlEvents = () => {
    const searchControl = new ymaps.current.control.SearchControl({
      options: {
        float: "left",
        floatIndex: 300,
        provider: "yandex#search",
        geoObjectStandardPreset: "islands#blueDotIcon",
        placeholderContent: "Поиск мест и адресов",
        maxWidth: 320,
        size: "large",
      },
    });
    map.current?.controls.add(searchControl);

    searchControl.events.add("resultselect", function (e: any) {
      const searchCoords =
        searchControl.getResponseMetaData().SearchResponse.Point.coordinates;
      const display: string =
        searchControl.getResponseMetaData().SearchResponse.display;

      if (display && display === "multiple") {
        map.current.setCenter([searchCoords[1], searchCoords[0]], 11);
      }
    });
  };

  return (
    <YMaps
      query={{ lang: "en_RU", apikey: "8b56a857-f05f-4dc6-a91b-bc58f302ff21" }}
    >
      <div className={styles.mapBlock}>
        <Map
          defaultState={{
            center: [41.30524669891599, 69.24100608330389],
            zoom: 12,
          }}
          width={"100%"}
          height={"100vh"}
          modules={["control.SearchControl"]}
          onLoad={(ymapsInstance: YMapsApi) => {
            ymaps.current = ymapsInstance;
            addSearchControlEvents();
          }}
        >
          <Placemark geometry={markerCoords} />

          <GeolocationControl options={{ float: "left" }} />
          <SearchControl
            options={{
              float: "left",
              position: {
                top: 30,
                left: 100,
              },
            }}
          />
        </Map>
      </div>
    </YMaps>
  );
};

export default YandexMap;
