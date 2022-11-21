import { useState } from "react";
import NavBar from "./NavBar";
import MainPage from "./MainPage";

export default function App() {
  const [accounts, setAccounts] = useState([]);

  return (
    // <div className="overlay">
    <div>
      <NavBar accounts={accounts} setAccounts={setAccounts}></NavBar>
      <MainPage accounts={accounts} setAccounts={setAccounts}></MainPage>
    </div>
    // </div>
  );
}
