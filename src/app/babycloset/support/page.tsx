import type { Metadata } from "next"

const title = "Baby Closet Support"
const description =
  "Help with Baby Closet: adding clothes, building outfits, planning on the calendar, sharing closets, and deleting your data."
const contact = "inceptumrex+babycloset@gmail.com"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/babycloset/support" },
  openGraph: { type: "article", url: "/babycloset/support", title, description, siteName: "InceptumRex" },
}

// The support page linked from the App Store listing.
export default function BabyClosetSupport() {
  return (
    <>
      <h1>Baby Closet Support</h1>
      <p className="bc__dek">Photograph your baby's clothes, build outfits and plan them on a calendar.</p>

      <p>
        Questions, problems or ideas? Email <a href={`mailto:${contact}`}>{contact}</a> and we'll get back to
        you, usually within two business days. Please include your iPhone model and iOS version if something
        isn't working.
      </p>

      <h2>Getting started</h2>
      <h3>How do I add clothes?</h3>
      <p>
        Tap <strong>+</strong> in the Closet tab, then take a photo or choose one. Baby Closet finds each garment
        in the photo, cuts it out and suggests its type and color. Check each piece, change anything that's off
        (tap the color wheel to fix a color), and save. For the best results, lay clothes flat on a plain
        surface with some space between them.
      </p>
      <h3>Why was my photo rejected?</h3>
      <p>
        Photos that show a person or a face are rejected on purpose, to keep your family out of the app. Take
        the photo again with only the clothes in frame.
      </p>
      <h3>How do I build an outfit?</h3>
      <p>
        Drag one garment onto another in the Closet tab, then keep dragging more pieces onto the pile. You can
        also use <strong>Build an Outfit</strong> in the Outfits view, or <strong>Build Your Own</strong> when
        planning a day. Pieces of the same type swap with each other, unless one is marked as a layering piece
        (like a vest over a shirt).
      </p>
      <h3>How do I plan outfits on the calendar?</h3>
      <p>
        Open the Calendar tab, pick a day and tap <strong>Plan a Style</strong>. You can add a time of day
        (morning, afternoon, evening or night) when there's more than one outfit that day, and mark plans as
        worn. The Next Style tab suggests outfits for the next open day based on color, season and what hasn't
        been worn lately.
      </p>

      <h2>Closets</h2>
      <p>
        You can keep up to 20 closets, for example one at home, one at Grandma's and one for daycare. Each has
        its own garments, outfits and calendar. Tap the round badge at the top left of any tab to switch
        closets, share the current one, or open <strong>Manage Closets</strong> to create, rename, reorder or
        delete them.
      </p>

      <h2>Sharing a closet</h2>
      <h3>How do I share?</h3>
      <p>
        Sign in from Settings first; sharing needs an account. Then tap the closet badge and choose{" "}
        <strong>Share</strong> (or touch and hold a closet in Manage Closets). Choose <strong>Permanent</strong>{" "}
        or <strong>7 days</strong>, then <strong>Invite to Edit</strong> or <strong>Invite to View Only</strong>,
        and send the invite.
      </p>
      <h3>How does the other person join?</h3>
      <p>
        They need Baby Closet and an account. They can open the invite link, or tap the closet badge, choose{" "}
        <strong>Manage Closets</strong>, then <strong>Join with a Code</strong> and type the 12-character code.
        Each invite works once and must be used within 7 days.
      </p>
      <h3>What can they do?</h3>
      <ul>
        <li><strong>Can edit:</strong> add garments, build outfits and plan on the calendar.</li>
        <li><strong>View only:</strong> see the garments, outfits and calendar without changing anything.</li>
      </ul>
      <p>Changes show up on everyone's iPhone within seconds.</p>
      <h3>How do I remove someone?</h3>
      <p>
        Open the closet's share screen and swipe left on the person, or tap <strong>…</strong> and choose{" "}
        <strong>Revoke Access</strong>. <strong>Stop Sharing</strong> removes everyone at once. The same menu
        lets you switch someone between can edit and view only, make their access permanent, or give them 7
        more days. People with 7-day access lose it automatically when the time is up.
      </p>
      <h3>How do I leave a closet someone shared with me?</h3>
      <p>
        Open its share screen and tap <strong>Leave Closet</strong>. It's removed from your iPhone; anything you
        added stays in the owner's closet.
      </p>

      <h2>Accounts, sync and privacy</h2>
      <h3>Do I need an account?</h3>
      <p>
        No. Without an account, everything stays on your iPhone. Sign in with Apple or Google only if you want
        to sync between devices or share closets.
      </p>
      <h3>What does Baby Closet know about my baby?</h3>
      <p>
        Nothing. It never asks for your baby's name, birthday, age, size or photos. Read the{" "}
        <a href="/babycloset/policy">privacy policy</a> for the details.
      </p>
      <h3>How do I delete my data or my account?</h3>
      <p>
        In Settings, <strong>Delete All Data</strong> clears your closets from your iPhone, and{" "}
        <strong>Delete Account</strong> permanently deletes your account and everything synced to it.
      </p>
    </>
  )
}
