import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import Chat from "./components/Chat";
import "./App.css";

function App() {
  const [user] = useAuthState(auth);

  return <div className="App">{user ? <Chat /> : <Login />}</div>;
}

export default App;
