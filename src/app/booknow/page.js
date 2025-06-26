// app/booknow/page.js
import dynamic from "next/dynamic";
const BookNowContent = dynamic(() => import("./BookNowContent"), { ssr: false });

export default function Page() {
  return <BookNowContent />;
}
