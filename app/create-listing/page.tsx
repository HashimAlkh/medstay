import { redirect } from "next/navigation";

export default function CreateListingRedirect() {
  redirect("/create-listing/form");
}