import { DataContext } from "@lib/context";
import { useContext, useState } from "react";
import styles from "./Header.module.scss";
export interface HeaderProps {}
export const Header = ({}: HeaderProps) => {
  const { data, setData } = useContext(DataContext);
  const [dropdown, setDropDown] = useState("");

  const saveAs = () => {
    window.dispatchEvent(new CustomEvent('save-as'));
  }

  return (
    <header className={styles.root} onMouseLeave={e => setDropDown("")}>
      
      <div className={styles.dropdown} onMouseEnter={e => setDropDown("file")}>
        <button className={styles.dropdownButton} >File</button>
        { 
          dropdown === 'file' ? 
          <div className={styles.dropdownContent}>
            <button onClick={() => alert('check todo file')}>New</button>
            <button onClick={() => saveAs()}>Save as</button>
          </div>
          :
          ""
        }
      </div>

      <div className={styles.dropdown} onMouseEnter={e => setDropDown("test")}>
        <button className={styles.dropdownButton} >Test</button>
        { 
          dropdown === "test" ? 
          <div className={styles.dropdownContent}>
            <button>test1</button>
            <button>test2</button>
          </div>
          :
          ""
        }
      </div>
    </header>
  );
};
