import type { Metadata } from "next"

const title = "Baby Closet Terms of Use"
const description = "The terms for using Baby Closet and Baby Closet Premium, including subscriptions, free trials and price changes."
const contact = "inceptumrex+babycloset@gmail.com"
const appleEULA = "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/babycloset/terms" },
  openGraph: { type: "article", url: "/babycloset/terms", title, description, siteName: "InceptumRex" },
}

// The Terms of Use linked from the paywall, Settings and the App Store description.
export default function BabyClosetTerms() {
  return (
    <>
      <h1>Terms of Use</h1>
      <p className="bc__dek">Baby Closet, an iPhone app by Alex M. Rodriguez (InceptumRex)</p>
      <p className="bc__meta">Effective October 2, 2026</p>

      <p>
        These terms apply when you download or use Baby Closet (the &quot;app&quot;) and when you subscribe to
        Baby Closet Premium. By using the app you agree to them. Apple&apos;s{" "}
        <a href={appleEULA}>Licensed Application End User License Agreement</a> also applies; if the two
        conflict on how the app is licensed through the App Store, Apple&apos;s agreement governs. Our{" "}
        <a href="/babycloset/policy">Privacy Policy</a> explains how data is handled.
      </p>

      <h2>The app</h2>
      <p>
        Baby Closet helps parents photograph and organize their baby&apos;s clothes, build outfits and plan
        them on a calendar. It&apos;s meant for adults. You&apos;re responsible for the photos and details you add,
        and you agree not to add photos of people or anything you don&apos;t have the right to use.
      </p>

      <h2>Free plan and Premium</h2>
      <p>
        The free plan includes one closet with up to 10 garments, up to 5 saved outfits, and planning up to 7
        days ahead with one outfit a day. Baby Closet Premium removes those limits and adds up to 20 closets,
        Next Style suggestions and sync across devices.
        The features included in each plan may change over time.
      </p>

      <h2>Subscriptions</h2>
      <ul>
        <li>Premium is an auto-renewable subscription, offered yearly or monthly. The current price for your
          country is shown in the app before you buy.</li>
        <li>Payment is charged to your Apple Account when you confirm the purchase. Apple processes all
          payments; we never see your payment details.</li>
        <li>The subscription renews automatically for the same period unless you cancel it at least 24
          hours before the end of the current period. Your account is charged for the renewal within the 24
          hours before the period ends.</li>
        <li>You can manage or cancel your subscription anytime in the Settings app under your name, then
          Subscriptions, or from Settings in Baby Closet. Canceling stops future renewals; Premium stays
          active until the end of the period you&apos;ve paid for.</li>
      </ul>

      <h2>Free trial</h2>
      <p>
        The yearly plan includes a 14-day free trial for eligible new subscribers. Unless you cancel at least
        24 hours before the trial ends, it converts automatically into a paid yearly subscription at the
        price shown when you started the trial. If you buy a subscription during a trial, any unused part of
        the trial ends.
      </p>

      <h2>Price changes</h2>
      <p>
        We may change the price of Baby Closet Premium, the plans we offer and the features they include, at
        any time and at our discretion. A price change never applies to a period you&apos;ve already paid for; it
        takes effect from your next renewal after the change. You&apos;ll be told about price increases in
        advance, through Apple and as required by Apple&apos;s rules and applicable law. Where Apple or the law
        requires your consent to a price increase, your subscription won&apos;t renew at the new price unless
        you agree. If you don&apos;t want to pay a new price, you can cancel before it takes effect.
      </p>

      <h2>Refunds</h2>
      <p>
        Purchases are made through Apple, so refunds are handled by Apple under its policies. You can request
        one at <a href="https://reportaproblem.apple.com">reportaproblem.apple.com</a>.
      </p>

      <h2>Your content and accounts</h2>
      <p>
        The garment photos and details you add stay yours. An account is optional; if you create one,
        you&apos;re responsible for keeping access to it. You can delete your data or your account anytime in the
        app&apos;s Settings.
      </p>

      <h2>Availability and changes</h2>
      <p>
        We work to keep Baby Closet running well, but the app is provided &quot;as is&quot; and we can&apos;t promise it
        will always be available or free of errors. We may update, change or discontinue features. If we
        change these terms, we&apos;ll update the date above, and significant changes will be shown in the app.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent the law allows, we&apos;re not liable for indirect or consequential losses, or for any loss
        of data, arising from your use of the app. Nothing in these terms limits rights you have under
        consumer protection laws that can&apos;t be waived.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of the State of New York, USA, except where the consumer
        protection laws of your country of residence require otherwise.
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
