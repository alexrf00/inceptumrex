import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Church, Building, Store, GraduationCap } from "lucide-react"

const clients = [
  {
    name: "St Fortunata Church",
    description: "Complete System Configuration, Hardware Upgrades and Diagnostic Services for church operations.",
    icon: Church,
  }
]

const clientTypes = ["Churches & Non-Profits", "Small Businesses", "Professional Services", "Educational Institutions"]

export function ClientsSection() {
  return (
    <section id="clients" className="py-16 px-4 bg-white dark:bg-black">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-black dark:text-white">Our Valued Clients</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          InceptumRex is proud to serve a diverse range of clients, from local businesses to community organizations.
          Here are some of the organizations that trust us with their technology needs.
        </p>

        <div
          className={`${clients.length === 1 ? "flex justify-center" : "grid md:grid-cols-2 lg:grid-cols-4"
            } gap-8`}
        >
          {clients.map((client, index) => (
            <Card
              key={index}
              className="p-8 text-center border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-0">
                <client.icon className="h-16 w-16 mx-auto mb-4 text-black dark:text-white" />
                <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">{client.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{client.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>


        <div className="mt-12 text-center">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">Join Our Growing Client Family</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              From small businesses to community organizations, we provide reliable IT solutions tailored to your
              specific needs. Our clients choose us for our expertise, reliability, and commitment to exceptional
              service.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {clientTypes.map((type, index) => (
                <Badge key={index} variant="secondary" className="bg-black text-white dark:bg-white dark:text-black">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
