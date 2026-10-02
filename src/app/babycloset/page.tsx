import { redirect } from "next/navigation"

// /babycloset on its own goes to the support page, the app's front door on the web.
export default function BabyClosetIndex() {
  redirect("/babycloset/support")
}
