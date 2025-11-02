import { useState } from "react";
import Header from "./components/Header";
import SearchForm from "./components/SearchForm";
import "./App.css";

export default function App() {
  const [category, setCategory] = useState("technology");
  const [keyword, setKeyword] = useState("");

  return (
    <div className="container">
      <Header active={category} onChange={setCategory} />
      <SearchForm defaultQ={keyword} onSubmit={({ q }) => setKeyword(q)} />
      <p>Preview query → kategori: <b>{category}</b>, keyword: <b>{keyword || "(kosong)"}</b></p>
    </div>
  );
}
