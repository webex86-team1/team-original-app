import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@remix-run/react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";

import { getAuth } from "firebase/auth";

import { db } from "../firebase";
import {
  doc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { query, where } from "firebase/firestore";
// import Header from "../components/header.jsx";

//住所と地図の中心の初期設定
function Home() {
  // const auth = getAuth();
  // const user = auth.currentUser;
  const navigate = useNavigate();
  const [center, setCenter] = useState({
    lat: 35.681236,
    lng: 139.767125,
  });

  const defaultZoom = 15;
  const [address, setAddress] = useState("");
  //クリックされた地点のリスト
  const [clickPoints, setClickPoints] = useState([]);
  //クリックしたマーカー
  const [selectedMarker, setSelectedMarker] = useState(null);
  const mapRef = useRef(null);
  const auth = getAuth();
  const user = auth.currentUser;
  //画面表示後、Firestoreに保存されたマーカーを表示する非同期処理
  useEffect(() => {
    const fetchMarkers = async () => {
      if (!user) return;
      const q = query(collection(db, "markers"), where("uid", "==", user.uid));
      const querySnapShot = await getDocs(q);
      const markers = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        location: doc.data().location,
      }));
      setClickPoints(markers);
    };
    fetchMarkers();
  }, [user]);

  const handleGeocode = () => {
    console.log("address:", address);
    if (!address) {
      alert("住所を入力してください。");
      return;
    }
    if (!window.google || !window.google.maps) {
      alert("Google Maps APIがまだロードされていません。");
      return;
    }

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address }, (results, status) => {
      console.log("geocode結果", results, status);
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        setCenter({ lat, lng });
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(defaultZoom);
          console.log("地図を移動しました。");
        }
      } else {
        alert("住所が見つかりませんでした。");
      }
    });
  };

  //Mapクリック→中心が更新されマーカーが追加される
  const handleMapClick = async (e) => {
    const lat = e.detail.latLng.lat;
    const lng = e.detail.latLng.lng;
    setCenter({ lat, lng });

    // クリックした地点のオブジェクト作成
    const newPoint = {
      location: { lat, lng },
      uid: user.uid,
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
      libraries={["places"]}
      onLoad={() => console.log("Maps API has loaded")}
    >
      {/* <Header /> */}
      <h1>フェレットラベル</h1>
      <input
        type="text"
        placeholder="地名を入力(例：東京駅)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={handleGeocode}>検索</button>
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
              <button className="button" onClick={() => navigate("/postsView")}>
                閲覧
              </button>
              <button className="button" onClick={() => navigate("/post")}>
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
