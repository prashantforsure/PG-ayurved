
import React from 'react'


import { Button } from "@/components/ui/button"

import {

  PlusCircle,
  Menu
} from 'lucide-react'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { UserAccountNav } from '@/components/UserAccountNav'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'


const Navbr = async () => {
    const session = await getServerSession(authOptions)

  return (
    <div>
         
       <div
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                <Link href="/">PG Ayurved.</Link>
              </span>
              <div className="hidden md:flex space-x-6">
                <Button variant="ghost"><Link href="/courses">Courses</Link>  
                </Button>
                <Button variant="ghost">About</Button>
                <Button variant="ghost">Community</Button>
                <Button variant="ghost">Resources</Button>
              </div>
            </div>
          
             <div className='flex items-center gap-4'>
          {session?.user.isAdmin ? (
            <>
              <div className="hidden md:flex items-center gap-4">
                <Link href='/admin'>
                  <Button 
                    variant="ghost" 
                    className=' px-6 py-2 text-sm hover:text-[#A259FF] transition-colors text-black border border-slate-900'
                  >
                    Dashboard
                  </Button>
                </Link>
               
              </div>
              <div className="md:hidden hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <nav className="flex flex-col gap-4">
                      <Link href='/dashboard'>
                        <Button 
                          variant="ghost" 
                          className='w-full justify-start rounded-full px-6 py-2 text-sm hover:text-[#A259FF] transition-colors text-black border border-slate-900'
                        >
                          Dashboard
                        </Button>
                      </Link>
                      <Link href='/groups'>
                        <Button 
                          variant="ghost" 
                          className='w-full justify-start  px-6 py-2 text-sm hover:text-[#1ABCFE] transition-colors text-black border border-slate-900 flex items-center gap-2'
                        >
                          <PlusCircle className="h-4 w-4" />
                          Create Group
                        </Button>
                      </Link>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
              <UserAccountNav user={{
                ...session.user,
                image: session.user.image ?? "",
                name: session.user.name ?? "",   
                email: session.user.email ?? "" 
              }} />
            </>
          ) : (
            <Link href='/auth/signin'>
              <Button 
                variant="ghost" 
                className=' px-6 py-2 text-white bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 transition-all duration-300 ease-in-out hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:-translate-y-0.5'
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbr