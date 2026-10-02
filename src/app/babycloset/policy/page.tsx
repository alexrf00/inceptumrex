import type { Metadata } from "next"

const title = "Baby Closet Privacy Policy"
const description =
  "How Baby Closet handles your data: photos are analyzed on your iPhone, nothing about your baby is asked for, and an account is optional."
const contact = "inceptumrex+babycloset@gmail.com"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/babycloset/policy" },
  openGraph: { type: "article", url: "/babycloset/policy", title, description, siteName: "InceptumRex" },
}

// The privacy policy linked from the App Store listing and the app's Settings.
// Keep it in step with the app's PrivacyInfo.xcprivacy and the App Privacy answers.
export default function BabyClosetPolicy() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="bc__dek">Baby Closet, an iPhone app by Alex M. Rodriguez (InceptumRex)</p>
      <p className="bc__meta">Effective October 2, 2026</p>

      <p>
        Baby Closet helps parents photograph their baby's clothes, plan outfits on a calendar and get outfit
        suggestions. It was designed to work without knowing anything about your baby: it never asks for your
        baby's name, birthday, age, size or photos, and there is no place in the app or its database to store
        them.
      </p>

      <h2>The short version</h2>
      <ul>
        <li>Photos are analyzed on your iPhone. The original photo is never kept or uploaded.</li>
        <li>Photos that show a person or a face are rejected before anything is saved.</li>
        <li>Without an account, everything stays on your iPhone.</li>
        <li>With an account, your closet syncs to your own private account so you can use it on your other
          devices. Nothing is shared with other users.</li>
        <li>No ads, no tracking, no analytics, and we never sell your data.</li>
        <li>You can delete everything, or your whole account, from Settings in the app.</li>
      </ul>

      <h2>What stays on your iPhone</h2>
      <p>
        When you add clothes, Baby Closet uses Apple's Vision framework on your iPhone to find each garment in
        the photo, cut it out, suggest its type and detect its color. If the photo contains a person or a face,
        it's rejected. Only the cut-out of each garment is saved, re-encoded so the photo's location and other
        metadata are removed. Photos are chosen with the system photo picker, so Baby Closet never has access
        to your photo library.
      </p>
      <p>
        The optional stylist note on the Next Style screen is written by Apple Intelligence on your iPhone.
        Nothing is sent to us or to anyone else to write it.
      </p>

      <h2>If you create an account</h2>
      <p>
        An account is optional. You can sign in with Apple or with Google to sync your closet across your
        devices. When you do, the following is stored with your account:
      </p>
      <ul>
        <li><strong>Account details:</strong> your email address and an account ID. Sign in with Apple only
          shares your email (you can choose Apple's Hide My Email). If you sign in with Google, Google also
          shares your name and profile picture with our sign-in provider; Baby Closet doesn't use them.</li>
        <li><strong>Your closet:</strong> the garment cut-out images; each garment's type, color, seasons,
          favorite and layering settings; your saved outfits; your calendar plans (date, occasion and optional
          time of day); and your closets' names, emoji and colors.</li>
      </ul>
      <p>
        Occasions are picked from a fixed list rather than typed, so personal notes don't end up in the
        database. Closet names are free text: we suggest naming closets by place or purpose, not by your
        baby's name.
      </p>

      <h2>Purchases</h2>
      <p>
        Baby Closet Premium is bought through Apple. Apple processes the payment and we never receive your
        payment details. The app checks whether your subscription is active using Apple&apos;s StoreKit on your
        iPhone; we don&apos;t store your purchase history on our servers. See the{" "}
        <a href="/babycloset/terms">Terms of Use</a> for subscription terms.
      </p>

      <h2>Who processes your data</h2>
      <ul>
        <li><strong>Supabase</strong> hosts the database, image storage and sign-in for accounts. Data is
          encrypted in transit, and database rules ensure only you can read it.</li>
        <li><strong>Apple</strong> and <strong>Google</strong> handle sign-in when you choose them, and Apple handles
          subscription payments.</li>
      </ul>
      <p>We don't use advertising or analytics services, and we don't sell or rent your data to anyone.</p>

      <h2>Keeping and deleting your data</h2>
      <ul>
        <li><strong>Delete All Data</strong> in Settings removes your closets from your iPhone.</li>
        <li><strong>Delete Account</strong> in Settings permanently deletes your account, your images and
          everything synced to it.</li>
        <li>Deleting the app removes everything stored on your iPhone.</li>
      </ul>
      <p>We keep account data only while your account exists.</p>

      <h2>Children</h2>
      <p>
        Baby Closet is made for parents and isn't directed at children. It's built not to collect information
        about babies or children, rejects photos of people, and we don't knowingly collect personal information
        from children under 13. If you believe a child has created an account, contact us and we'll delete it.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live (for example under the GDPR or California law), you may have the right to
        access, correct, export or delete your personal data, and to object to how it's used. Most of this you
        can do in the app; for anything else, email us and we'll respond within 30 days.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes, we'll update the date above, and tell you in the app if the change is
        significant.
      </p>

      <h2>Contact</h2>
      <p>
        Alex M. Rodriguez (InceptumRex)
        <br />
        <a href={`mailto:${contact}`}>{contact}</a>
      </p>
    </>
  )
}
