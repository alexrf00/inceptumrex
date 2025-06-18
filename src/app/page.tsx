import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { WhyUsSection } from "@/components/why-us-section"
import { ClientsSection } from "@/components/clients-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function InceptumRexBusiness() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WhyUsSection />
      <ClientsSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
