'use client';

import { useRouter } from "next/navigation";
import styles from "./HomeButton.module.css";

type Props = {
  top?: string;
  right?: string;
};

export function HomeButton({ top = "20px", right = "20px" }: Props) {
  const router = useRouter();

  return (
    <button
      className={styles.homeButton}
      style={{ top, right }}
      onClick={() => router.push("/")}
    >
      Home
    </button>
  );
}
