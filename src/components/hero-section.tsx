import { Button } from "@/components/ui/button"
import { Phone, Mail, Monitor } from "lucide-react"

export function HeroSection() {
  return (
    <section className="pt-24 pb-16 px-4 bg-white dark:bg-black">
      <div className="container mx-auto text-center">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 bg-black dark:bg-white rounded-full flex items-center justify-center">
            <Monitor className="h-16 w-16 text-white dark:text-black" />
          </div>
        </div>
        <section>
          <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white">
            InceptumRex
          </h1>
        </section>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Professional Computer Repair, Configuration & Diagnostic Services. We fix what's broken and optimize what's
          working.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black"
            asChild
          >
            <a href="tel:+17186752831" className="flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              Call Now
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
            asChild
          >
            <a href="#contact">
              <Mail className="mr-2 h-5 w-5" />
              Get Quote
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
