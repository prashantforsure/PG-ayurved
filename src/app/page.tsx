'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Brain, Stethoscope, BookOpen, Microscope, GraduationCap, Users, Star, Clock, CheckCircle, ArrowRight, MessageCircle, Award } from 'lucide-react'
import Navbar from '@/components/Navbar'

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Cardiologist",
    content: "This platform revolutionized my medical education. The interactive content and expert instructors made complex topics easy to understand.",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    name: "James Lee",
    role: "Medical Student",
    content: "The exam preparation resources are top-notch. I felt fully prepared for my boards thanks to the comprehensive materials and practice questions.",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    name: "Dr. Emily Chen",
    role: "Pediatrician",
    content: "The clinical case studies were invaluable in bridging the gap between theory and practice. It's a must-have resource for any medical professional.",
    avatar: "/placeholder.svg?height=40&width=40"
  }
]

const courseCategories = [
  { name: "Anatomy", icon: Brain },
  { name: "Physiology", icon: Stethoscope },
  { name: "Pathology", icon: Microscope },
  { name: "Clinical Skills", icon: BookOpen }
]

const features = [
  { title: "Expert Instruction", description: "Learn from world-renowned medical professionals" },
  { title: "Quality Content", description: "Comprehensive, up-to-date medical curriculum" },
  { title: "Interactive Learning", description: "Engage with 3D models, quizzes, and case studies" },
  { title: "Community Support", description: "Connect with peers and mentors in our forums" }
]

const steps = [
  { title: "Choose your course", description: "Browse our extensive catalog of medical courses" },
  { title: "Flexible payment options", description: "Select a payment plan that works for you" },
  { title: "Start learning", description: "Dive into interactive lessons and expert-led lectures" },
  { title: "Track progress", description: "Monitor your advancement with detailed analytics" },
  { title: "Earn certificate", description: "Receive a recognized certification upon completion" }
]

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  const handleExplore = () => {
    router.push('/courses')
  }

  const handleViewCatalog = () => {
    router.push('/catalog')
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
   
    console.log('Subscribed:', email)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Navbar />
      <section className="relative h-screen flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-foreground opacity-10"></div>
        <div className="z-10 max-w-4xl mx-auto px-4">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Transforming Medical Education
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8"
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
            <Button size="lg" onClick={handleExplore}>Explore Courses</Button>
            <Button size="lg" variant="outline" onClick={handleViewCatalog}>View Course Catalog</Button>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-8">
          <div className="text-center">
            <p className="text-3xl font-bold">100,000+</p>
            <p className="text-sm">Students</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">95%</p>
            <p className="text-sm">Success Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">50+</p>
            <p className="text-sm">Partner Institutions</p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Comprehensive Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Interactive content</li>
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Expert instructors</li>
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Practice questions</li>
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Progress tracking</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Flexible Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Self-paced courses</li>
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Mobile accessibility</li>
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Lifetime access</li>
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Downloadable resources</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Career Advancement</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Industry-recognized certificates</li>
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Exam preparation</li>
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Clinical case studies</li>
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Performance analytics</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Community Support</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Discussion forums</li>
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Peer-to-peer learning</li>
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Mentorship opportunities</li>
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Networking events</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{testimonial.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Course Categories Showcase */}
      <section className="py-16 bg-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Course Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {courseCategories.map((category, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <category.icon className="h-12 w-12 mx-auto mb-4" />
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                <CardFooter>
                  <Button variant="link" className="mx-auto" onClick={() => router.push(`/courses/${category.name.toLowerCase()}`)}>
                    Explore <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Breakdown */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-4">
                  {index + 1}
                </div>
                <Card className="flex-grow">
                  <CardHeader>
                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Flexible Pricing Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>For individual learners</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold mb-4">$29/month</p>
                <ul className="space-y-2">
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Access to all courses</li>
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Practice questions</li>
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Community support</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Free Trial</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For serious medical students</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold mb-4">$59/month</p>
                <ul className="space-y-2">
                  <li className="flex  items-center"><CheckCircle className="mr-2 h-4 w-4" /> All Basic features</li>
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Exam preparation materials</li>
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> 1-on-1 mentoring sessions</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Free Trial</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Institution</CardTitle>
                <CardDescription>For medical schools and hospitals</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold mb-4">Custom</p>
                <ul className="space-y-2">
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> All Pro features</li>
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Custom course creation</li>
                  <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Analytics and reporting</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Contact Sales</Button>
              </CardFooter>
            </Card>
          </div>
          <p className="text-center mt-8">All plans come with a 30-day money-back guarantee</p>
        </div>
      </section>

      {/* Trust & Credibility */}
      <section className="py-16 bg-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by Medical Professionals Worldwide</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <GraduationCap className="h-12 w-12 mx-auto mb-4" />
                <p className="font-bold">Accredited Courses</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <p className="font-bold">50+ Partner Institutions</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Star className="h-12 w-12 mx-auto mb-4" />
                <p className="font-bold">Featured in Top Medical Journals</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Award className="h-12 w-12 mx-auto mb-4" />
                <p className="font-bold">Industry Recognition</p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center">
            <p className="text-lg mb-4">As featured in:</p>
            <div className="flex justify-center space-x-8">
              <img src="/placeholder.svg?height=30&width=100" alt="Medical Journal Logo" className="h-8" />
              <img src="/placeholder.svg?height=30&width=100" alt="Healthcare Magazine Logo" className="h-8" />
              <img src="/placeholder.svg?height=30&width=100" alt="Medical Association Logo" className="h-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Sections */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Medical Education?</h2>
          <p className="text-xl mb-8">Join thousands of successful medical professionals who have advanced their careers with our platform.</p>
          <Button size="lg" onClick={handleExplore}>Start Your Free Trial Today</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Button variant="link">Home</Button></li>
                <li><Button variant="link">Courses</Button></li>
                <li><Button variant="link">About Us</Button></li>
                <li><Button variant="link">Contact</Button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Button variant="link">Blog</Button></li>
                <li><Button variant="link">Webinars</Button></li>
                <li><Button variant="link">Podcast</Button></li>
                <li><Button variant="link">Free Resources</Button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Button variant="link">FAQs</Button></li>
                <li><Button variant="link">Help Center</Button></li>
                <li><Button variant="link">Terms of Service</Button></li>
                <li><Button variant="link">Privacy Policy</Button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Connect With Us</h3>
              <ul className="space-y-2">
                <li><Button variant="link">Facebook</Button></li>
                <li><Button variant="link">Twitter</Button></li>
                <li><Button variant="link">LinkedIn</Button></li>
                <li><Button variant="link">Instagram</Button></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8">
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <h3 className="font-bold mb-4 text-center">Subscribe to Our Newsletter</h3>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow mr-2"
                  required
                />
                <Button type="submit">Subscribe</Button>
              </div>
            </form>
          </div>
          <p className="text-center mt-8">&copy; 2023 Medical Education Platform. All rights reserved.</p>
        </div>
      </footer>

      {/* Additional Elements */}
      <div className="fixed bottom-4 right-4">
        <Button size="icon" variant="secondary">
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}