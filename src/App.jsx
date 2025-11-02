import { useState } from "react";
import Header from "./components/Header";
import "./App.css";

export default function App () {
  const [category, setCategory] = useState("technology");

  return (
    <div className="container">
      <Header active={category} onChange={setCategory} />
      <p>Kategori aktif: <b>{category}</b></p>
    </div>
  );
}
