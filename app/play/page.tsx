import type { Metadata } from "next";
import GolfGame from "./golf-game";

export const metadata: Metadata = {
  title: "Putt-Putt Challenge",
  description: "A hidden mini-golf putting game.",
  robots: { index: false, follow: false },
};

export default function PlayPage() {
  return <GolfGame />;
}
