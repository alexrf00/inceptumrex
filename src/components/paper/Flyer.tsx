"use client"

import { useState, type FormEvent } from "react"
import { person } from "@/content/work"

// The contact flyer. The form still posts to the same Basin endpoint with the
// same field names and order as the old service form; only its purpose moved
// from repair requests to work inquiries. The tear-off tabs copy the email.

const ENDPOINT = "https://usebasin.com/f/188b999b80b6"

type State = "idle" | "sending" | "sent" | "error"

export function Flyer() {
  const [state, setState] = useState<State>("idle")
  const [torn, setTorn] = useState<number[]>([])
  const [copied, setCopied] = useState("")

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setState("sending")
    try {
      const response = await fetch(ENDPOINT, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      if (!response.ok) throw new Error(String(response.status))
      form.reset()
      setState("sent")
    } catch {
      setState("error")
    }
  }

  async function tear(i: number) {
    try {
      await navigator.clipboard.writeText(person.email)
      setCopied(`Copied ${person.email}`)
    } catch {
      setCopied(`Opening your email app for ${person.email}`)
      window.location.href = `mailto:${person.email}`
    }
    setTorn((t) => (t.includes(i) ? t : [...t, i]))
  }

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="flyer">
        <h2 id="contact-title" className="flyer__title">
          Work inquiries
        </h2>
        <p className="flyer__line">Games, web apps and fiscal systems. Tell me what you are building.</p>

        {state === "sent" ? (
          <div className="flyer__done" role="status">
            <p className="flyer__done-title">Sent.</p>
            <p>Your message is in my inbox. I will reply to the email you gave.</p>
            <button type="button" className="flyer__button flyer__button--quiet" onClick={() => setState("idle")}>
              Send another
            </button>
          </div>
        ) : (
          <form className="flyer__form" onSubmit={submit}>
            <input type="hidden" name="_captcha" value="false" />
            <div className="field">
              <label htmlFor="f-name">Name</label>
              <input id="f-name" name="name" type="text" autoComplete="name" required />
            </div>
            <div className="field">
              <label htmlFor="f-phone">
                Phone <span className="field__opt">(optional)</span>
              </label>
              <input id="f-phone" name="phone" type="tel" autoComplete="tel" />
            </div>
            <div className="field field--wide">
              <label htmlFor="f-email">Email</label>
              <input id="f-email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="field field--wide">
              <label htmlFor="f-message">What are you building?</label>
              <textarea id="f-message" name="message" rows={5} required />
            </div>
            {state === "error" && (
              <p className="flyer__error" role="alert">
                The message did not go through. Try again, or write to {person.email}.
              </p>
            )}
            <button type="submit" className="flyer__button" disabled={state === "sending"}>
              {state === "sending" ? "Sending" : "Send inquiry"}
            </button>
          </form>
        )}

        <div className="tabs">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              className={`tabs__tab${torn.includes(i) ? " is-torn" : ""}`}
              onClick={() => tear(i)}
              aria-label={`Copy the email address ${person.email}`}
            >
              <span>{person.email}</span>
            </button>
          ))}
        </div>
        <p className="tabs__status" role="status" aria-live="polite">
          {copied}
        </p>
      </div>
    </section>
  )
}
