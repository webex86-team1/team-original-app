import { useState, useMemo, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

import { db } from "../firebase";
import {
  doc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

//住所と地図の中心の初期設定
function Home() {
  //geocodingLib が変わった時（＝計算結果が変わった時）にだけ、Geocoderインスタンスを再生成する
  const geocodingLib = useMapsLibrary("geocoding");
  useMemo(() => geocodingLib && new geocodingLib.Geocoder(), [geocodingLib]);
  // const [address, setAddress] = useState("");
  const [center, setCenter] = useState({
    lat: 35.681236,
    lng: 139.767125,
  });

  const defaultZoom = 15;
  //クリックされた地点のリスト
  const [clickPoints, setClickPoints] = useState([]);
  //クリックしたマーカー
  const [selectedMarker, setSelectedMarker] = useState(null);

  const mapRef = useRef(null);
  //画面表示後、Firestoreに保存されたマーカーを表示する非同期処理
  useEffect(() => {
    const fetchMarkers = async () => {
      const querySnapShot = await getDocs(collection(db, "markers"));
      const markers = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        // name: doc.data().name,
        location: doc.data().location,
      }));
      setClickPoints(markers);
    };
    fetchMarkers();
  }, []);

  // //geocodeを使った、地名や住所からの緯度経度の取得
  // const handleGeocode = () => {
  //   if (!address || !geocoder) return;
  //   geocoder.geocode({ address }, (result, status) => {
  //     if (status === "OK") {
  //       const location = result[0].geometry.location;

  //       setCenter({
  //         lat: location.lat(),
  //         lng: location.lng(),
  //       });
  //     } else {
  //       alert("位置情報を取得できませんでした");
  //     }
  //   });
  // };

  //Mapクリック→中心が更新されマーカーが追加される
  const handleMapClick = async (e) => {
    const lat = e.detail.latLng.lat;
    const lng = e.detail.latLng.lng;
    setCenter({ lat, lng });

    // クリックした地点のオブジェクト作成
    const newPoint = {
      // name: address || "Unnamed",
      location: { lat, lng },
    };
    // markersという名前でnewPointの情報をfirebaseに保存する(FirestoreによってIDは自動的に生成される)
    const docRef = await addDoc(collection(db, "markers"), newPoint);

    // スプレッド構文を用いて作成したオブジェクトを用意した配列に追加
    setClickPoints((current) => [...current, { id: docRef.id, ...newPoint }]);
    console.log("保存が完了しました");
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);

    //クリックしたマーカーの位置にズームし中心を移動する
    if (mapRef.current) {
      mapRef.current.panTo(marker.location);
      mapRef.current.setZoom(defaultZoom);
    }
  };

  const handleDelete = async () => {
    if (!selectedMarker) return;
    await deleteDoc(doc(db, "markers", selectedMarker.id));
    // ClickPointsからも削除し、ClickPoints（地点の一覧）を更新する
    setClickPoints((current) =>
      current.filter((marker) => marker.id !== selectedMarker.id)
    );
    // InfoWindowを閉じる
    setSelectedMarker(null);
  };
  return (
    <APIProvider
      apiKey={"AIzaSyBBvIY4EhTo4X1Kcw4meN-S33PZfhxTn40"}
      onLoad={() => console.log("Maps API has loaded")}
    >
      <h1>フェレットラベル</h1>

      {/* 入力フォーム
      <input
        type="text"
        placeholder="地名を入力(例：東京駅)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (!geocoder) {
              alert(
                "現在地図ライブラリを読み込み中です。少し待ってから再試行してください。"
              );
              return;
            }
            handleGeocode();
          }
        }} */}
      {/* /> */}
      <Map
        style={{ height: "70vh", width: "80%" }}
        defaultZoom={defaultZoom}
        defaultCenter={center}
        mapId="b284e80cecc7aeaae7fd7fe9"
        onClick={handleMapClick}
        onTilesLoaded={(e) => {
          mapRef.current = e.map;
        }}
      >
        {clickPoints.map((clickPoint) => (
          <AdvancedMarker
            key={clickPoint.id}
            position={clickPoint.location}
            onClick={() => handleMarkerClick(clickPoint)}
          ></AdvancedMarker>
        ))}
        {/* 情報ウィンドウを表示 */}
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.location}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div>
              <h3>どうする？</h3>
              <button className="button" onClick={handleDelete}>
                削除
              </button>
              <button className="button" onClick={handleDelete}>
                閲覧
              </button>
              <button className="button" onClick={handleDelete}>
                作成
              </button>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}
export default Home;
