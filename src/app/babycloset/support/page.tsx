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
        Tap <strong>+</strong> in the Closet tab, then take a photo or choose up to 10 at once. Baby Closet finds
        each garment in the photos, cuts it out and suggests its type and color. Check each piece, change anything
        that's off (tap the color wheel to fix a color), and save. For the best results, lay clothes flat on a plain
        surface with some space between them.
      </p>
      <h3>Why does it say a garment is already in my closet?</h3>
      <p>
        When a new garment looks like one you&apos;ve already added (or like another piece in the same photos),
        Baby Closet shows the look-alike so you don&apos;t add it twice. Tap <strong>Don&apos;t Add</strong> to skip
        it, or keep it if it&apos;s a different piece. The comparison happens on your iPhone.
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

      <h2>Apple Intelligence and weather</h2>
      <h3>How does Baby Closet recognize clothes?</h3>
      <p>
        On iPhones with Apple Intelligence (iPhone 15 Pro and newer, on iOS 27), Apple&apos;s on-device model looks at
        each garment you add and suggests its type, a name like &quot;Striped bodysuit&quot;, its pattern and how warm
        it is. You can change anything before saving. On other iPhones, Apple&apos;s Vision framework suggests the type.
        Either way, it all happens on your iPhone.
      </p>
      <h3>How does Next Style use the weather?</h3>
      <p>
        Tap <strong>Match Ideas to the Forecast</strong> in Next Style and allow approximate location. Ideas then
        match the forecast for the chosen day: warmer layers when it&apos;s cold, light clothes in the heat, rain boots
        or a raincoat when rain is likely. With Apple Intelligence, the stylist also picks its favorite idea for the day
        and says why. Weather comes from Apple Weather.
      </p>

      <h2>Closets</h2>
      <p>
        You can keep up to 20 closets, for example one at home, one at Grandma's and one for daycare. Each has
        its own garments, outfits and calendar. Tap the round badge at the top left of any tab to switch
        closets, or open <strong>Manage Closets</strong> to create, rename, reorder or delete them. To move a
        garment, open it and tap <strong>Move to Another Closet</strong>; its photo goes with it.
      </p>

      <h2>Baby Closet Premium</h2>
      <h3>What's free and what's Premium?</h3>
      <p>
        The free plan includes one closet with up to 10 garments, up to 5 saved outfits, and planning up to 7
        days ahead with one outfit a day. Premium removes those limits and adds up to 20 closets, Next Style
        suggestions and sync across your devices. Garments you mark as outgrown don&apos;t count toward the
        free limit.
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

      <h2>Reminders</h2>
      <p>
        Baby Closet can remind you of tomorrow&apos;s outfit the evening before (and, if you like, that
        morning), nudge you on Sunday to plan the week, suggest a closet check every four weeks, mark the start
        of each season, and let you know two days before a free trial ends. Turn each one on or off, and set the
        times, in Settings → <strong>Reminders</strong>. If you&apos;ve turned on the forecast in Next Style,
        outfit reminders also mention the weather, like rain on the way or a chilly morning. Reminders are
        scheduled on your iPhone; nothing is sent to a server.
      </p>

      <h2>Siri and Shortcuts</h2>
      <p>
        Ask Siri &quot;What&apos;s today&apos;s outfit in Baby Closet?&quot; or &quot;What&apos;s tomorrow&apos;s outfit in
        Baby Closet?&quot; to hear what&apos;s planned, say &quot;Mark today&apos;s outfit as worn in Baby Closet&quot;
        after getting dressed, or &quot;Give me an outfit idea in Baby Closet&quot; to open Next Style. The same
        actions are in the Shortcuts app and in Spotlight, with nothing to set up.
      </p>

      <h2>Laundry</h2>
      <p>
        When something goes in the hamper, open it and tap <strong>Put in the Wash</strong>, or use{" "}
        <strong>Put in the Wash</strong> on a planned or saved outfit to send every piece at once (handy right after
        marking an outfit as worn). Pieces in the wash show a small washer badge, and Next Style leaves them out of
        today&apos;s and tomorrow&apos;s ideas. If a planned outfit for today or tomorrow includes something in the wash, the
        plan shows a heads-up with the best clean swap: tap <strong>Swap</strong>, or <strong>It&apos;s Clean</strong> if
        it came back in time. Swapping a saved outfit only changes that day. The evening reminder mentions it too.
        When the laundry is done, open <strong>In the Wash</strong> under the closet and tap <strong>All Clean</strong>.
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
