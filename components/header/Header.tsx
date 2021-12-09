import { DataContext } from "@lib/context";
import { useContext } from "react";
import styles from "./Header.module.scss";
export interface HeaderProps {}

export const Header = ({}: HeaderProps) => {
  const { data, setData } = useContext(DataContext);

  return (
    <header className={styles.root}>
      <a
        download={"my-pretty-image.png"}
        href={data.replace("image/png", "image/octet-stream")}
        className={styles.download}
      >
        download
      </a>
    </header>
  );
};
