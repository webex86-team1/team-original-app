import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@remix-run/react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import {
  doc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import "../styles/auth/map.css";

// ---- ここからコンポーネント ----
function Home() {
  const navigate = useNavigate();

  // 地図の中心（東京駅）
  const [center, setCenter] = useState({ lat: 35.681236, lng: 139.767125 });
  const defaultZoom = 15;

  // 検索欄（Places用）
  const [address, setAddress] = useState("");
  const inputRef = useRef(null);        // Autocompleteをアタッチ
  const autocompleteRef = useRef(null); // Autocompleteインスタンス保持

  // Mapインスタンス
  const mapRef = useRef(null);

  // ピン（クリック保存）関連
  const [clickPoints, setClickPoints] = useState([]); // 自分のピン一覧
  const [selectedMarker, setSelectedMarker] = useState(null); // InfoWindow用

  // 認証（初回currentUserはnullのため購読で取得）
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // === 認証状態の購読 ===
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, [auth]);

  // === 自分のピン（uid一致のみ）をFirestoreから取得 ===
  useEffect(() => {
    if (!authReady || !user) return;
    (async () => {
      const qRef = query(collection(db, "markers"), where("uid", "==", user.uid));
      const snap = await getDocs(qRef);
      const markers = snap.docs.map((d) => ({
        id: d.id,
        location: d.data().location,
      }));
      setClickPoints(markers);
    })();
  }, [authReady, user]);

  // === Autocomplete を検索ボックスにアタッチ ===
  useEffect(() => {
    if (!window.google?.maps?.places) return;
    if (!inputRef.current) return;
    if (autocompleteRef.current) return; // 二重初期化防止

    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "jp" },
      fields: ["geometry", "name", "formatted_address", "place_id"],
    });
    autocompleteRef.current = ac;

    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      const pt = placeToLatLng(place);
      if (!pt) {
        alert("場所の詳細を取得できませんでした。候補から選択してください。");
        return;
      }
      setAddress(place.formatted_address || place.name || "");
      moveMapTo(pt);
    });
  }, []);

  // === LatLng の取り出し（lat()/lng() と 値 の両対応） ===
  const extractLatLng = (latLngObj) => {
    if (!latLngObj) return null;
    const lat = typeof latLngObj.lat === "function" ? latLngObj.lat() : latLngObj.lat;
    const lng = typeof latLngObj.lng === "function" ? latLngObj.lng() : latLngObj.lng;
    if (typeof lat !== "number" || typeof lng !== "number") return null;
    return { lat, lng };
  };

  // === place → {lat,lng} ===
  const placeToLatLng = (place) => {
    const loc = place?.geometry?.location;
    if (!loc) return null;
    return extractLatLng(loc);
  };

  // === 地図移動 + ズーム ===
  const moveMapTo = ({ lat, lng }) => {
    setCenter({ lat, lng });
    mapRef.current?.panTo({ lat, lng });
    mapRef.current?.setZoom(defaultZoom);
  };

  // === Places Text Search（検索ボタン用） ===
  const handlePlacesTextSearch = () => {
    if (!address) {
      alert("地名・住所を入力してください。");
      return;
    }
    if (!window.google?.maps?.places) {
      alert("Google Maps Places APIがまだロードされていません。");
      return;
    }
    if (!mapRef.current) {
      alert("マップの初期化を待っています。");
      return;
    }

    const service = new window.google.maps.places.PlacesService(mapRef.current);
    service.textSearch({ query: address }, (results, status) => {
      const OK = window.google.maps.places.PlacesServiceStatus.OK;
      const ZERO = window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS;
      if (status === OK && results?.length) {
        const pt = placeToLatLng(results[0]);
        if (pt) moveMapTo(pt);
        else alert("座標情報が見つかりませんでした。別のワードでお試しください。");
      } else if (status === ZERO) {
        alert("該当する場所が見つかりませんでした。");
      } else {
        alert("検索エラー: " + status);
      }
    });
  };

  // === ★ ピン打ち（クリック→保存→配列に追加）：前の形に戻す ===
  const handleMapClick = async (e) => {
    if (!authReady) {
      alert("認証を初期化中です。少し待ってもう一度お試しください。");
      return;
    }
    if (!user) {
      alert("ログインが必要です。");
      return;
    }

    // ここは以前の「e.detail.latLng.lat / lng」に相当
    // 内部で lat()/lng()にも対応するように extractLatLng を挟むだけ
    const pt = extractLatLng(e?.detail?.latLng);
    if (!pt) {
      console.warn("クリック座標を取得できませんでした:", e?.detail);
      return;
    }

    setCenter(pt); // 中心更新（以前の setCenter({lat,lng}) と同じ）
    const newPoint = { location: pt, uid: user.uid };

    // Firestore に保存（IDは自動採番）
    const docRef = await addDoc(collection(db, "markers"), newPoint);

    // 配列に追加（以前のスプレッドと同じ動き）
    setClickPoints((cur) => [...cur, { id: docRef.id, ...newPoint }]);
    console.log("保存が完了しました");
  };

  // === マーカークリック → 中心移動 & InfoWindow ===
  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    mapRef.current?.panTo(marker.location);
    mapRef.current?.setZoom(defaultZoom);
  };

  // === 削除 ===
  const handleDelete = async () => {
    if (!selectedMarker) return;
    await deleteDoc(doc(db, "markers", selectedMarker.id));
    setClickPoints((cur) => cur.filter((m) => m.id !== selectedMarker.id));
    setSelectedMarker(null);
  };

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={["places"]} // ← 検索はPlaces APIのまま
      onLoad={() => console.log("Maps + Places API loaded")}
    >
      <div className="mapzentai">
        <h1>旅行した場所にピンを打てるよ📍</h1>

        {/* 検索UI（Autocomplete + Text Search） */}
        <div className="search-container">
          <input
            ref={inputRef}
            type="text"
            placeholder="地名を入力(例：東京駅)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="address-input"
            autoComplete="off"
          />
          <button onClick={handlePlacesTextSearch} className="search-button">
            検索
          </button>
        </div>

        <Map
          style={{ height: "100vh" }}
          defaultZoom={defaultZoom}
          defaultCenter={center}
          mapId="b284e80cecc7aeaae7fd7fe9"
          onClick={handleMapClick}
          onTilesLoaded={(e) => {
            // vis.gl の Map インスタンスを保持
            mapRef.current = e.map;
          }}
        >
          {/* 自分のピンを描画 */}
          {clickPoints.map((p) => (
            <AdvancedMarker
              key={p.id}
              position={p.location}
              onClick={() => handleMarkerClick(p)}
            />
          ))}

          {/* マーカーの操作メニュー */}
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
      </div>
    </APIProvider>
  );
}

export default Home;
