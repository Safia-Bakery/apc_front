import React, { useState } from "react";
import {
  YMaps,
  Map,
  Placemark,
  GeolocationControl,
  SearchControl,
} from "react-yandex-maps";

const YandexMap: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [markerCoords, setMarkerCoords] = useState<number[]>([
    55.751574, 37.573856,
  ]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchValue.trim() !== "") {
      // Use the Yandex Maps API geocoder to get coordinates for the searched address
      const geocoder = new window.ymaps.geocode(searchValue);
      geocoder.then((res: any) => {
        const coordinates = res.geoObjects.get(0).geometry.getCoordinates();
        setMarkerCoords(coordinates);
      });
    }
  };

  return (
    <YMaps>
      <div style={{ width: "100%", height: "100%" }}>
        <Map
          defaultState={{
            center: [55.751574, 37.573856],
            zoom: 9,
          }}
          width={"100%"}
          height={"100vh"}
        >
          <Placemark geometry={markerCoords} />

          <GeolocationControl options={{ float: "left" }} />
          <SearchControl options={{ float: "right" }} />

          {/* <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search address"
              value={searchValue}
              onChange={handleSearchChange}
            />
            <button type="submit">Search</button>
          </form> */}
        </Map>
      </div>
    </YMaps>
  );
};

export default YandexMap;
