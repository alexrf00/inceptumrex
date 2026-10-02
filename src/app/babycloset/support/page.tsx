import type { Metadata } from "next"

const title = "Baby Closet Support"
const description =
  "Help with Baby Closet: adding clothes, building outfits, planning on the calendar, closets, and deleting your data."
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
        closets, or open <strong>Manage Closets</strong> to create, rename, reorder or delete them.
      </p>

      <h2>Baby Closet Premium</h2>
      <h3>What's free and what's Premium?</h3>
      <p>
        The free plan includes one closet with up to 10 garments, outfits and the calendar. Premium adds
        unlimited garments, up to 20 closets, Next Style suggestions and sync across your devices. Garments
        you mark as outgrown don&apos;t count toward the free limit.
      </p>
      <h3>How does the free trial work?</h3>
      <p>
        The yearly plan starts with a 14-day free trial for new subscribers. Cancel at least 24 hours before it
        ends if you don&apos;t want to continue; otherwise it becomes a paid yearly subscription.
      </p>
      <h3>How do I cancel or change my plan?</h3>
      <p>
        Open Settings in Baby Closet and tap <strong>Manage Subscription</strong>, or go to the Settings app,
        tap your name, then <strong>Subscriptions</strong>. Premium stays active until the end of the period
        you&apos;ve paid for.
      </p>
      <h3>I bought Premium on another device. How do I get it here?</h3>
      <p>
        Sign in to the App Store with the same Apple Account, then tap <strong>Restore Purchases</strong> in
        Baby Closet&apos;s Settings.
      </p>
      <h3>How do I get a refund?</h3>
      <p>
        Purchases go through Apple, so refunds are requested from Apple at{" "}
        <a href="https://reportaproblem.apple.com">reportaproblem.apple.com</a>.
      </p>

      <h2>Outgrown clothes</h2>
      <p>
        When something no longer fits, open it and tap <strong>Doesn&apos;t Fit Anymore</strong>. It moves to
        the closet&apos;s <strong>Outgrown</strong> list, out of outfits and suggestions. Open it there and tap{" "}
        <strong>Fits Again</strong> to bring it back.
      </p>

      <h2>Accounts, sync and privacy</h2>
      <h3>Do I need an account?</h3>
      <p>
        No. Without an account, everything stays on your iPhone. With Premium, sign in with Apple or Google
        to back up your closets and sync them between your devices.
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
