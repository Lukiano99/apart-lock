import { HydrateClient } from "@/trpc/server";
import styles from "./index.module.css";

export default async function Home() {
  return (
    <HydrateClient>
      <main className={styles.main}></main>
    </HydrateClient>
  );
}
