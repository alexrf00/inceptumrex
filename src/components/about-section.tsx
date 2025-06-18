import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Award, CheckCircle, Shield } from "lucide-react"

const features = [
  { name: "Fast Turnaround", icon: Clock, description: "Most repairs completed within 24-48 hours" },
  { name: "Expert Technicians", icon: Award, description: "Certified professionals with years of experience" },
  { name: "Quality Guarantee", icon: CheckCircle, description: "All work backed by our satisfaction guarantee" },
  { name: "Competitive Pricing", icon: Shield, description: "Fair, transparent pricing with no hidden fees" },
]

export function AboutSection() {
  return (
    <section id="about" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-black dark:text-white">About InceptumRex</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              InceptumRex is your trusted local computer repair and configuration specialist. With years of experience
              in the industry, we provide comprehensive solutions for all your computer needs, from simple repairs to
              complex system configurations.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our mission is to keep your technology running smoothly and efficiently. Whether you're dealing with a
              slow computer, hardware failure, or need a complete system setup, our expert technicians are here to help.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-black text-white dark:bg-white dark:text-black">
                Same-Day Service
              </Badge>
              <Badge variant="secondary" className="bg-black text-white dark:bg-white dark:text-black">
                Local Business
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 text-center border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-black dark:text-white" />
                <h3 className="font-semibold mb-2 text-black dark:text-white">{feature.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
