'use client'
import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain, Stethoscope, BookOpen, Microscope, GraduationCap, Users, Star, Clock, CheckCircle, ArrowRight, MessageCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'


const GradientBackground = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-[#635BFF] to-[#7A73FF] overflow-hidden">
    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-soft-light"></div>
  </div>
)
//@ts-expect-error there is some type error 
const FloatingElement = ({ children, className }) => (
  <motion.div
    className={`absolute ${className}`}
    animate={{
      y: [0, 20, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      repeatType: "reverse",
    }}
  >
    {children}
  </motion.div>
)
//@ts-expect-error there is some type error 

const ParallaxSection = ({ children, speed = 0.5 }) => {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1], [0, speed * 100])

  return (
    <motion.div style={{ y }} className="relative">
      {children}
    </motion.div>
  )
}
//@ts-expect-error there is some type error 
const AnimatedCard = ({ children }) => (
  <motion.div
    whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
)

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Cardiologist",
    content: "This platform revolutionized my medical education. The interactive content and expert instructors made complex topics easy to understand.",
    avatar: "/placeholder.svg?height=80&width=80"
  },
  {
    name: "James Lee",
    role: "Medical Student",
    content: "The exam preparation resources are top-notch. I felt fully prepared for my boards thanks to the comprehensive materials and practice questions.",
    avatar: "/placeholder.svg?height=80&width=80"
  },
  {
    name: "Dr. Emily Chen",
    role: "Pediatrician",
    content: "The clinical case studies were invaluable in bridging the gap between theory and practice. It's a must-have resource for any medical professional.",
    avatar: "/placeholder.svg?height=80&width=80"
  }
]

const courseCategories = [
  { name: "Anatomy", icon: Brain },
  { name: "Physiology", icon: Stethoscope },
  { name: "Pathology", icon: Microscope },
  { name: "Clinical Skills", icon: BookOpen }
]

const features = [
  { title: "Expert Instruction", description: "Learn from world-renowned medical professionals", icon: GraduationCap },
  { title: "Quality Content", description: "Comprehensive, up-to-date medical curriculum", icon: BookOpen },
  { title: "Interactive Learning", description: "Engage with 3D models, quizzes, and case studies", icon: Users },
  { title: "Community Support", description: "Connect with peers and mentors in our forums", icon: MessageCircle }
]

const steps = [
  { title: "Choose your course", description: "Browse our extensive catalog of medical courses" },
  { title: "Flexible payment options", description: "Select a payment plan that works for you" },
  { title: "Start learning", description: "Dive into interactive lessons and expert-led lectures" },
  { title: "Track progress", description: "Monitor your advancement with detailed analytics" },
  { title: "Earn certificate", description: "Receive a recognized certification upon completion" }
]

export default function EnhancedHomePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleExplore = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push('/courses')
      setIsLoading(false)
    }, 1000)
  }

  const handleViewCatalog = () => {
    router.push('/catalog')
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Subscribed:', email)
    setEmail('')
  }

  useEffect(() => {
    const cursor = document.createElement('div')
    cursor.className = 'custom-cursor'
    document.body.appendChild(cursor)

    const moveCursor = (e: any) => {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
    }

    document.addEventListener('mousemove', moveCursor)

    return () => {
      document.removeEventListener('mousemove', moveCursor)
      document.body.removeChild(cursor)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white text-[#0A2540] overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap');

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .custom-cursor {
          width: 20px;
          height: 20px;
          border: 2px solid #635BFF;
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transition: all 0.1s ease;
        }

        .gradient-text {
          background: linear-gradient(45deg, #635BFF, #7A73FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
       
      {/* Hero Section */}
      <Navbar />
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <GradientBackground /> 
        
        <FloatingElement className="top-1/4 left-1/4">
          <Brain className="text-white opacity-20 w-24 h-24" />
        </FloatingElement>
        <FloatingElement className="bottom-1/4 right-1/4">
          <Stethoscope className="text-white opacity-20 w-24 h-24" />
        </FloatingElement>
        <div className="z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-extrabold mb-4 text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Transform Your Medical Education
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-white opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Expert-led courses for aspiring medical professionals
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              size="lg"
              onClick={handleExplore}
              className="bg-white text-[#635BFF] hover:bg-opacity-90 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  className="h-5 w-5 border-t-2 border-[#635BFF] rounded-full animate-spin"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                "Explore Courses"
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleViewCatalog}
              className="border-white text-white hover:bg-white hover:text-[#635BFF] transition-all duration-200"
            >
              View Course Catalog
            </Button>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-8 text-white">
          <div className="text-center">
            <p className="text-3xl font-bold">20,000+</p>
            <p className="text-sm opacity-80">Students</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">95%</p>
            <p className="text-sm opacity-80">Success Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">50+</p>
            <p className="text-sm opacity-80">Partner Institutions</p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <ParallaxSection>
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <AnimatedCard key={index}>
                  <Card className="h-full">
                    <CardHeader>
                      <feature.icon className="h-12 w-12 mb-4 text-[#635BFF]" />
                      <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* Social Proof Section */}
      <ParallaxSection speed={0.2}>
        <section className="py-24 bg-gradient-to-br from-[#F4F4FF] to-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 gradient-text">What Our Students Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <AnimatedCard key={index}>
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center">
                        <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full mr-4" />
                        <div>
                          <CardTitle className="text-lg font-semibold">{testimonial.name}</CardTitle>
                          <CardDescription>{testimonial.role}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{testimonial.content}</p>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* Course Categories Showcase */}
      <ParallaxSection>
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Popular Course Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {courseCategories.map((category, index) => (
                <AnimatedCard key={index}>
                  <Card className="text-center h-full">
                    <CardHeader>
                      <category.icon className="h-16 w-16 mx-auto mb-4 text-[#635BFF]" />
                      <CardTitle className="text-xl font-semibold">{category.name}</CardTitle>
                    </CardHeader>
                    <CardFooter>
                      <Button
                        variant="link"
                        className="mx-auto text-[#635BFF] hover:text-[#7A73FF] transition-colors duration-200"
                        onClick={() => router.push(`/courses/${category.name.toLowerCase()}`)}
                      >
                        Explore <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* How It Works Section */}
      <ParallaxSection speed={0.3}>
        <section className="py-24 bg-gradient-to-br from-[#F4F4FF] to-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 gradient-text">How It Works</h2>
            <div className="space-y-8">
              {steps.map((step, index) => (
                <AnimatedCard key={index}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#635BFF] text-white flex items-center justify-center mr-6 text-xl font-bold">
                      {index + 1}
                    </div>
                    <Card className="flex-grow">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold">{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{step.description}</p>
                      
                      </CardContent>
                    </Card>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* Call-to-Action Section */}
      <ParallaxSection>
        <section className="py-24 bg-[#635BFF] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Medical Education?</h2>
            <p className="text-xl mb-8 opacity-90">Join thousands of successful medical professionals who have advanced their careers with our platform.</p>
            <Button
              size="lg"
              onClick={handleExplore}
              className="bg-white text-[#635BFF] hover:bg-opacity-90 transition-all duration-200"
            >
              Start Your Free Trial Today
            </Button>
          </div>
        </section>
      </ParallaxSection>

      {/* Footer */}
      <footer className="bg-[#0A2540] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-2">
                <li><Button variant="link" className="text-white p-0 hover:text-[#635BFF] transition-colors duration-200">Home</Button></li>
                <li><Button variant="link" className="text-white p-0 hover:text-[#635BFF] transition-colors duration-200">Courses</Button></li>
                <li><Button variant="link" className="text-white p-0 hover:text-[#635BFF] transition-colors duration-200">About Us</Button></li>
                <li><Button variant="link" className="text-white p-0 hover:text-[#635BFF] transition-colors duration-200">Contact</Button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Resources</h3>
              <ul className="space-y-2">
                <li><Button variant="link" className="text-white p-0 hover:text-[#635BFF] transition-colors duration-200">Blog</Button></li>
                <li><Button variant="link" className="text-white p-0 hover:text-[#635BFF] transition-colors duration-200">Webinars</Button></li>
                <li><Button variant="link" className="text-white p-0 hover:text-[#635BFF] transition-colors duration-200">Podcast</Button></li>
                <li><Button variant="link" className="text-white p-0 hover:text-[#635BFF] transition-colors duration-200">Free Resources</Button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Support</h3>
              <ul className="space-y-2">
                <li><Button variant="link" className="text-white p-0 hover:text-[#635BFF] transition-colors duration-200">FAQs</Button></li>
                <li><Button variant="link" className="text-white p-0 hover:text-[#635BFF] transition-colors duration-200">Help Center</Button></li>
                <li><Button variant="link" className="text-white p-0 hover:text-[#635BFF] transition-colors duration-200">Terms of Service</Button></li>
                <li><Button variant="link" className="text-white p-0 hover:text-[#635BFF] transition-colors duration-200">Privacy Policy</Button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Connect With Us</h3>
              <ul className="space-y-2">
                <li><Button variant="link" className="text-white p-0 hover:text-[#635BFF] transition-colors duration-200">Facebook</Button></li>
                <li><Button variant="link" className="text-white p-0 hover:text-[#635BFF] transition-colors duration-200">Twitter</Button></li>
                <li><Button variant="link" className="text-white p-0 hover:text-[#635BFF] transition-colors duration-200">LinkedIn</Button></li>
                <li><Button variant="link" className="text-white p-0 hover:text-[#635BFF] transition-colors duration-200">Instagram</Button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8">
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <h3 className="font-bold mb-4 text-center text-lg">Subscribe to Our Newsletter</h3>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow mr-2 bg-white/10 border-white/20 text-white placeholder-white/50"
                  required
                />
                <Button type="submit" className="bg-[#635BFF] hover:bg-[#7A73FF] transition-colors duration-200">Subscribe</Button>
              </div>
            </form>
          </div>
          <p className="text-center mt-8 text-sm opacity-60">&copy; 2023 Medical Education Platform. All rights reserved.</p>
        </div>
      </footer>

      {/* Chat Support Button */}
      <div className="fixed bottom-4 right-4">
        <Button size="icon" className="bg-[#635BFF] hover:bg-[#7A73FF] text-white rounded-full w-12 h-12 shadow-lg transition-all duration-200 hover:scale-110">
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}