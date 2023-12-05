import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Home() {
  const [listID, setListID] = useState("");
  useEffect(() => {
    setListID(crypto.randomUUID());
  }, []);
  return (
    <>
      <h1>Hinder</h1>

      <Link to={`/add#${listID}`}>New List</Link>
    </>
  );
}
