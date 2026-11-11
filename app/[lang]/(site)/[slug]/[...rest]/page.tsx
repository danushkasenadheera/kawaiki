import { notFound } from "next/navigation";

// Any deeper unknown URL (e.g. /foo/bar/) is a 404 rendered with the site layout.
export default function CatchAll() {
  notFound();
}
