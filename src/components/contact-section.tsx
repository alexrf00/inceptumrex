"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Clock, Globe, CheckCircle, AlertCircle, X } from "lucide-react"

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      // const response = await fetch("https://formsubmit.co/04b6b8b0410f1290bbb7e95d396c6743", {
      const response = await fetch("https://usebasin.com/f/188b999b80b6", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      setSubmitted(true)
      form.reset()
    } catch (error) {
      setError("We couldn't send your message right now. Please try again or call us directly.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setError(null)
  }

  return (
    <section id="contact" className="py-16 px-4 bg-white dark:bg-black">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-black dark:text-white">Contact InceptumRex</h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-black dark:text-white">Get Your Computer Fixed Today</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Ready to get your computer running like new? Contact InceptumRex for fast, reliable, and affordable
                computer repair services. We're here to solve your technology problems.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-black dark:text-white" />
                  <span className="text-gray-700 dark:text-gray-300">+1 (718) 675-2831</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-black dark:text-white" />
                  <span className="text-gray-700 dark:text-gray-300">inceptumrex@gmail.com</span>
                </div>
                {/* <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-black dark:text-white" />
                  <span className="text-gray-700 dark:text-gray-300">Your Business Address</span>
                </div> */}
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-black dark:text-white" />
                  <span className="text-gray-700 dark:text-gray-300">Mon-Fri: 9AM-6PM, Sat: 10AM-4PM</span>
                </div>
              </div>
              {/* <div className="flex space-x-4 mt-8">
                <Button
                  size="icon"
                  variant="outline"
                  className="border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
                >
                  <Globe className="h-5 w-5" />
                </Button>
              </div> */}
            </div>

            <Card className="p-8 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-0">
                <h4 className="text-xl font-semibold mb-4 text-black dark:text-white">Request Service</h4>

                {/* Success Message */}
                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <h5 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                          Message Sent Successfully!
                        </h5>
                        <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                          Thank you for contacting InceptumRex. We've received your service request and will get back to
                          you within 24 hours.
                        </p>
                        <Button
                          onClick={resetForm}
                          variant="outline"
                          size="sm"
                          className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-black"
                        >
                          Send Another Message
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <h5 className="font-semibold text-red-800 dark:text-red-200 mb-1">Message Not Sent</h5>
                        <p className="text-sm text-red-700 dark:text-red-300 mb-3">{error}</p>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setError(null)}
                            variant="outline"
                            size="sm"
                            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-black"
                          >
                            Try Again
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-black"
                          >
                            <a href="tel:+17186752831">Call Us Instead</a>
                          </Button>
                        </div>
                      </div>
                      <Button
                        onClick={() => setError(null)}
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Form */}
                {!submitted && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="hidden" name="_captcha" value="false" />

                    <div>
                      <label className="block text-sm font-medium mb-2 text-black dark:text-white">Name</label>
                      <input
                        type="text"
                        name="name"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Your Name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-black dark:text-white">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Your Phone Number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                        Issue Description
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Describe your computer problem..."
                        required
                      ></textarea>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Request Service"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
