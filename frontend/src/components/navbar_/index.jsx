import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { GlobalContext } from "../../context";

import styles from "./header.module.css";

export default function Header() {
  const { searchParam, setSearchParam, handleSubmit } =
    useContext(GlobalContext);
  console.log(searchParam);
  return (
    <header className={styles.header}>
      <NavLink to={"/"} className="logo">
        Ofa&apos;a
      </NavLink>
      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          type="text"
          name="search"
          placeholder="Search..."
          className="search_form"
          value={searchParam}
          onChange={(event) => setSearchParam(event.target.value)}
        />
      </form>
      <nav className={styles.navbar}>
        <div className="links">
          <NavLink to={"/"} className="navlink">
            Home
          </NavLink>
          <NavLink to={"/favorites"} className="navlink">
            Hackatons
          </NavLink>
        </div>
      </nav>
      <div className="icons">
        <div className="icon bx bx-grid-alt"></div>
        <div className="icon bx bx-search"></div>
        <div className="icon bx bx-moon"></div>
      </div>
    </header>
  );
}
