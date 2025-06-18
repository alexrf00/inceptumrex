import { CheckCircle } from "lucide-react"

const benefits = [
  {
    title: "Expert Diagnosis",
    description: "Our certified technicians quickly identify issues and provide honest assessments.",
  },
  {
    title: "Transparent Pricing",
    description: "No hidden fees or surprise charges. You'll know the cost upfront before we start any work.",
  },
  {
    title: "Quality Parts",
    description: "We use only high-quality, genuine parts and components for all repairs and upgrades.",
  },
  {
    title: "Fast Service",
    description: "Most repairs completed within 24-48 hours. Emergency services available for critical issues.",
  },
  {
    title: "Warranty Protection",
    description: "All repairs come with our comprehensive warranty for your peace of mind.",
  },
  {
    title: "Local Support",
    description: "Supporting our local community with personalized service and ongoing technical support.",
  },
]

export function WhyUsSection() {
  return (
    <section id="why-us" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-black dark:text-white">Why Choose InceptumRex?</h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="h-6 w-6 mr-4 mt-1 text-black dark:text-white flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2 text-black dark:text-white">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
