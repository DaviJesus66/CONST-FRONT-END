import type { ReactNode } from "react";
import styles from "./styles.module.css";

type ContainerProps = {
  children: ReactNode;
};

// 2. Componente: Desestruturamos o children e aplicamos a estrutura base
export function Container({ children }: ContainerProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}