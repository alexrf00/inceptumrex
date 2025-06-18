import { Monitor } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-8 px-4 bg-black dark:bg-white text-white dark:text-black">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center mb-4">
          <Monitor className="mr-2 h-6 w-6" />
          <span className="text-xl font-bold">InceptumRex</span>
        </div>
        <p className="text-gray-400 dark:text-gray-600">
          © {new Date().getFullYear()} InceptumRex. Professional Computer Repair & Configuration Services.
        </p>
      </div>
    </footer>
  )
}
