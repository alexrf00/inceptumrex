import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wrench, Settings, Cpu, Monitor, Wifi, HardDrive, Code, ExternalLink } from "lucide-react"

const services = [
  {
    title: "Computer Repair",
    description: "Expert diagnosis and repair of hardware and software issues for desktops and laptops.",
    icon: Wrench,
    available: true,
  },
  {
    title: "System Configuration",
    description: "Professional setup and optimization of operating systems, software, and network configurations.",
    icon: Settings,
    available: true,
  },
  {
    title: "Hardware Upgrades",
    description: "Memory, storage, and component upgrades to boost your computer's performance and longevity.",
    icon: Cpu,
    available: true,
  },
  {
    title: "Diagnostic Services",
    description: "Comprehensive system analysis to identify performance issues and potential problems.",
    icon: Monitor,
    available: true,
  },
  {
    title: "Network Setup",
    description: "Home and office network configuration, Wi-Fi setup, and connectivity troubleshooting.",
    icon: Wifi,
    available: true,
  },
  {
    title: "Data Recovery",
    description: "Professional data recovery services for damaged or corrupted storage devices.",
    icon: HardDrive,
    available: true,
  },
  {
    title: "Application Development",
    description: "Custom software solutions and applications tailored to your business needs.",
    icon: Code,
    available: false,
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-16 px-4 bg-white dark:bg-black">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-black dark:text-white">Our Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${
                !service.available ? "opacity-75" : ""
              }`}
            >
              <CardContent className="p-0">
                <div className="flex items-start justify-between mb-4">
                  <service.icon className="h-12 w-12 text-black dark:text-white" />
                  {!service.available && (
                    <Badge
                      variant="secondary"
                      className="bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    >
                      Coming Soon
                    </Badge>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                {service.available ? (
                  <Button
                    variant="ghost"
                    className="p-0 h-auto text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                  >
                    Learn More <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    This service will be available soon. Contact us for updates.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
