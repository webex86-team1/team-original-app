// 必要な関数を import
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1Jk4rHK5lvInx4xUexyQ-Mm041PBvqfY",
  authDomain: "ferrettrio-team-original-app.firebaseapp.com",
  projectId: "ferrettrio-team-original-app",
  storageBucket: "ferrettrio-team-original-app.firebasestorage.app",
  messagingSenderId: "391332858731",
  appId: "1:391332858731:web:87e6db3899ff980cf3da2e",
  measurementId: "G-6GDXG5HYEQ"
};

// Firebaseアプリオブジェクトを初期化
const app = initializeApp(firebaseConfig);
// Firestoreを読み込み、db(databaseの略)として export
const db = getFirestore(app,"ferret-database");
const auth = getAuth(app);
const storage = getStorage(app);


export { db, auth,storage, GoogleAuthProvider, signInWithPopup };
