
"use client"
import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Stethoscope,
  BookOpen,
  Microscope,
  GraduationCap,
  Users,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Play,
  ChevronRight,
  Globe,
  Zap,
  Award,
  Youtube,
  PlusCircle,
  Menu
} from 'lucide-react'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { UserAccountNav } from '@/components/UserAccountNav'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { Session } from 'next-auth'


//@ts-expect-error there is sometype error
const AnimatedNumber = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: any
    const start = 0
    const end = parseInt(value)
    
    const step = (timestamp: any) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * (end - start) + start))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    
    window.requestAnimationFrame(step)
  }, [value, duration])

  return <span>{count.toLocaleString()}</span>
}

const features = [
  {
    icon: GraduationCap,
    title: "Expert-Led Education",
    description: "Learn from Top medical professionals with decade of experience."
  },
  {
    icon: Globe,
    title: "Community",
    description: "Join a network of medical students and professionals."
  },
  {
    icon: Zap,
    title: "Interactive Learning",
    description: "Engage with Live classes, case studies, and easy to remember tricks."
  },
  {
    icon: Award,
    title: "Accredited Courses",
    description: "Earn recognized certifications from leading medical institutions."
  }
]

const courses = [
  {
    title: "Clinical Anatomy Masterclass",
    category: "Anatomy",
    duration: "12 weeks",
    rating: 4.9,
    students: 2840,
    image: "/placeholder.svg?height=600&width=800"
  },
  {
    title: "Advanced Pathophysiology",
    category: "Pathology",
    duration: "10 weeks",
    rating: 4.8,
    students: 2100,
    image: "/placeholder.svg?height=600&width=800"
  },
  {
    title: "Medical Diagnostics",
    category: "Clinical Skills",
    duration: "8 weeks",
    rating: 4.9,
    students: 1950,
    image: "/placeholder.svg?height=600&width=800"
  }
]

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
    name: "Dr. Dhrub Sutariya",
    role: "AIR 13 (AIAPGET)",
    content: "This platform revolutionized my medical education. The interactive content and expert instructors made complex topics easy to understand.",
    avatar: "/placeholder.svg?height=80&width=80"
  },
  {
    name: "Dr. Krishna Thummar",
    role: "AIR 28 (AIAPGET)",
    content: "The exam preparation resources are top-notch. I felt fully prepared for my boards thanks to the comprehensive materials and practice questions.",
    avatar: "/placeholder.svg?height=80&width=80"
  },
  {
    name: "Dr. Akshar Patel",
    role: "AIR 54 (AIAPGET)",
    content: "The clinical case studies were invaluable in bridging the gap between theory and practice. It's a must-have resource for any medical professional.",
    avatar: "/placeholder.svg?height=80&width=80"
  }
]

interface HomePageProps {
    initialSession: Session | null
  }

export default  function HomePage({ initialSession }: HomePageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [email, setEmail] = useState('')
  const { scrollY } = useScroll()
  
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.8])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
 
    console.log('Subscribed:', email)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-white">
     
     <motion.nav
      style={{ opacity: headerOpacity }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
        
          <div className="flex items-center">
        
            <div className="md:hidden mr-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link href="/courses">
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-6 py-2 text-sm hover:text-[#A259FF] transition-colors"
                      >
                        Courses
                      </Button>
                    </Link>
                    <Link href='/about'>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-6 py-2 text-sm hover:text-[#A259FF] transition-colors"
                    >
                      About
                    </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-6 py-2 text-sm hover:text-[#A259FF] transition-colors"
                    >
                      Contact
                    </Button>
                    <Link href="https://play.google.com/store/apps/details?id=co.jarvis.pgap">
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-6 py-2 text-sm hover:text-[#A259FF] transition-colors"
                      >
                        Mobile App
                      </Button>
                    </Link>
                    
                    {initialSession?.user.isAdmin && (
                      <>
                        <div className="border-t border-gray-200 my-4" />
                        <Link href="/admin">
                          <Button
                            variant="ghost"
                            className="w-full justify-start px-6 py-2 text-sm hover:text-[#A259FF] transition-colors"
                          >
                            Admin Dashboard
                          </Button>
                        </Link>
                     
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex items-center space-x-8">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                <Link href="/">PG Ayurved.</Link>
              </span>
              <div className="hidden md:flex space-x-6">
                <Button variant="ghost">
                  <Link href="/courses">Courses</Link>
                </Button>
                <Button variant="ghost">About</Button>
                <Button variant="ghost">Contact</Button>
                <Button variant="ghost">
                  <Link href="https://play.google.com/store/apps/details?id=co.jarvis.pgap">
                    Mobile App
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {initialSession ? (
              <>
               
                {initialSession.user.isAdmin && (
                  <div className="hidden md:flex items-center gap-4">
                    <Link href="/admin">
                      <Button
                        variant="ghost"
                        className="px-6 py-2 text-sm hover:text-[#A259FF] transition-colors text-black border border-slate-900"
                      >
                        Admin Dashboard
                      </Button>
                    </Link>
                  </div>
                )}

                <UserAccountNav
                  user={{
                    ...initialSession.user,
                    image: initialSession.user.image ?? "",
                    name: initialSession.user.name ?? "",
                    email: initialSession.user.email ?? ""
                  }}
                />
              </>
            ) : (
              
              <Link href="/auth/signin">
                <Button
                  variant="ghost"
                  className="px-6 py-2 text-white bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 transition-all duration-300 ease-in-out hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:-translate-y-0.5"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <motion.div 
          style={{ scale: heroScale }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Badge className="bg-blue-100 text-blue-700 mb-4">
                    Revolutionizing Medical Education
                  </Badge>
                  <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                    Master Medicine with 
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {" "}Expert Guidance
                    </span>
                  </h1>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl text-gray-600"
                >
                  Join over 15,000 medical students and professionals learning from top-class educators.
                </motion.p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                >
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link href='https://play.google.com/store/apps/details?id=co.jarvis.pgap'><Button 
                  size="lg" 
                  variant="outline"
                  className="flex items-center"
                >
                  <Play className="ml-2 h-4 w-4" />
                  Watch Demo
                </Button></Link>
              </motion.div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    <AnimatedNumber value="15000" />+
                  </div>
                  <p className="text-gray-600">Active Students</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    <AnimatedNumber value="2" />
                  </div>
                  <p className="text-gray-600">Expert Instructors</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    <AnimatedNumber value="45" />%
                  </div>
                  <p className="text-gray-600">Success Rate</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative z-10"
              >
                <img 
                  src="/images/frontpageimg.jpg" 
                  alt="Medical Education" 
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="font-bold">4.6/5</span>
                    <span className="text-gray-500">(2.5k+ reviews)</span>
                  </div>
                </div>
              </motion.div>
              <div className="absolute -z-10 top-8 -right-8 w-full h-full bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl"></div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-blue-100 text-blue-700 mb-4">
              Why Choose Us
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Transform Your Medical Career
            </h2>
            <p className="text-xl text-gray-600">
              Experience a revolutionary approach to medical education with our comprehensive platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="relative h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white mb-4">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <Badge className="bg-blue-100 text-blue-700 mb-4">
                Featured Courses
              </Badge>
              <h2 className="text-4xl font-bold">Popular Medical Courses</h2>
            </div>
            <Link href="/courses">
            <Button variant="outline">
              View All Courses 
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-white">
                      {course.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}
                      </span>
                      <span className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-400" />
                        {course.rating}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {course.students}
                      </span>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      Enroll Now
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

   <section className='py-24 bg-gray-50'>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className=' justify-between items-end mb-12'>
    <div className='mb-5'>
              <Badge className="bg-blue-100 text-blue-700 mb-4">
                About Educators
              </Badge>
              <h2 className="text-4xl font-bold">Top Ayurved Expertise</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
                <AnimatedCard >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center">
                        <img src='' alt="Dr. R.K. Patel" className="w-16 h-16 rounded-full mr-4" />
                        <div>
                          <CardTitle className="text-lg font-semibold">Dr. R.K. Patel</CardTitle>
                          <CardDescription>MD - Panchkarma, PhD - Scholar, M.P. Govt. Medical Officer</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">1st, 2nd, 3rd & 4th years subject preparation</p>
                    </CardContent>
                  </Card>
                </AnimatedCard>
                
                <AnimatedCard >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center">
                        <img src='' alt="Dr. Abhilasha Patel" className="w-16 h-16 rounded-full mr-4" />
                        <div>
                          <CardTitle className="text-lg font-semibold">Dr. Abhilasha Patel</CardTitle>
                          <CardDescription>MD - Panchkarma, M.P. Govt. Medical Officer</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">बृहद त्रयी & लघु त्रयी Samhita Preparation</p>
                    </CardContent>
                  </Card>
                </AnimatedCard>
            </div>

    </div>
    </div>
   </section>

   <section className="py-24">
          <div className="max-w-6xl mx-auto px-4">
          <div>
              <Badge className="bg-blue-100 text-blue-700 mb-4">
                Featured Courses
              </Badge>
              <h2 className="text-4xl font-bold mb-8">What Our Students Say</h2>
            </div>
            
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

     
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About PG Ayurved Prayojnam.</h3>
              <p className="text-gray-600">Taking medical Education to the next level with great expertise.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href='/courses' className="text-gray-600 hover:text-blue-600">Courses</Link> </li>
                <li><Link href='/about' className="text-gray-600 hover:text-blue-600">About Us</Link> </li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">FAQs</a></li>
              </ul>
            </div>
         
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <Link href="https://www.instagram.com/pgayurvedprayojanam/" className="text-gray-600 hover:text-blue-600">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600">&copy; 2024 PG Ayurved Prayojnam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}