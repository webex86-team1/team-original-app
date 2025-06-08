import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = {
  height: "80vh",
  width: "100%",
};

const center = {
  lat: 35.681236,
  lng: 139.767125,
};

const Mycomponent = () => {
  const [address, setAddress] = useState("");
  return (
    <>
      <h1>ホーム画面</h1>
      <input
        type="text"
        placeholder="地名を入力(例：東京駅)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      {/* <button onClick={handleSearch}>検索</button> */}
      <LoadScript googleMapsApiKey="AIzaSyCZc2iOVsW8UZHjbfrRrTkE3XBnAEGGdJg">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={17}
        ></GoogleMap>
      </LoadScript>
    </>
  );
};

export default Mycomponent;
