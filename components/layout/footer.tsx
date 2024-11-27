import Link from "next/link"
import { Link as CustomRedirect } from "@/components/ui/link"
import { Brain, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full border-t"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
              BrainGames
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Train your cognitive skills with our scientifically designed games.
            Challenge yourself and compete globally!
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-purple-600 transition-colors">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-purple-600 transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-purple-600 transition-colors">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-600">Games</h3>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Aim Trainer", path: "/games/aim-trainer" },
              { name: "Number Memory Test", path: "/games/number-memory" },
              { name: "Typing Test", path: "/games/typing-test" },
              { name: "Visual Memory Test", path: "/games/visual-memory" }
            ].map((game) => (
              <li key={game.name} className="transition-transform hover:translate-x-1">
                <CustomRedirect href={game.path} className="text-muted-foreground hover:text-purple-600 transition-colors">
                  {game.name}
                </CustomRedirect>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-600">Management</h3>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Leaderboard", path: "/leaderboard" },
              { name: "Profile", path: "/settings" }
            ].map((resource) => (
              <li key={resource.name} className="transition-transform hover:translate-x-1">
                <CustomRedirect href={resource.path} className="text-muted-foreground hover:text-purple-600 transition-colors">
                  {resource.name}
                </CustomRedirect>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-600">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-purple-600" />
              <span>support@braingames.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-purple-600" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              <span>123 Cognitive St, Mind City, 54321</span>
            </li>
          </ul>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 pt-8 border-t border-purple-100"
      >
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} BrainGames. All rights reserved.
        </p>
      </motion.div>
    </motion.footer>
  )
}

