'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

export default function AccountPage() {
  const router = useRouter()
  
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('login')
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [signupData, setSignupData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check if user is already logged in on component mount
  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn')
    if (loginStatus === 'true') {
      setIsLoggedIn(true)
    }
  }, [])

  // Handle login form input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData(prev => ({ ...prev, [name]: value }))
  }

  // Handle signup form input changes
  const handleSignupChange = (e) => {
    const { name, value } = e.target
    setSignupData(prev => ({ ...prev, [name]: value }))
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('currentUser')
    setIsLoggedIn(false)
  }

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Get stored users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      // Find user with matching email
      const user = users.find(user => user.email === loginData.email)
      
      // Check if user exists and password matches
      if (user && user.password === loginData.password) {
        // Login successful
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('currentUser', JSON.stringify({ 
          name: user.name, 
          email: user.email 
        }))
        setIsLoggedIn(true)
      } else {
        // Login failed
        setError('Invalid email or password')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Failed to login. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle signup submission
  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      // Get existing users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      // Check if email already exists
      if (users.some(user => user.email === signupData.email)) {
        setError('Email already in use')
        setLoading(false)
        return
      }
      
      // Add new user
      const newUser = {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password
      }
      
      users.push(newUser)
      
      // Save updated users array
      localStorage.setItem('users', JSON.stringify(users))
      
      // Log in the new user
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('currentUser', JSON.stringify({ 
        name: newUser.name, 
        email: newUser.email 
      }))
      setIsLoggedIn(true)
      
    } catch (error) {
      console.error('Signup error:', error)
      setError('Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-center mb-8">My Account</h1>
        
        {isLoggedIn ? (
          <div className="space-y-6 text-center">
            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <h2 className="text-xl font-medium text-green-800 mb-2">Already Logged In</h2>
              <p className="text-green-700">You are currently logged in to your account.</p>
              {localStorage.getItem('currentUser') && (
                <p className="mt-2 text-green-700">
                  Welcome, {JSON.parse(localStorage.getItem('currentUser')).name}!
                </p>
              )}
            </div>
            <Button 
              onClick={handleLogout} 
              className="w-full bg-red-500 hover:bg-red-600"
            >
              Log Out
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={loginData.email}
                    onChange={handleLoginChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={loginData.password}
                    onChange={handleLoginChange}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
              
              <p className="text-sm text-center">
                <a href="#" className="text-blue-600 hover:underline">
                  Forgot your password?
                </a>
              </p>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={signupData.name}
                    onChange={handleSignupChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-sm font-medium">Email</label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    required
                    value={signupData.email}
                    onChange={handleSignupChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-sm font-medium">Password</label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    required
                    value={signupData.password}
                    onChange={handleSignupChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</label>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </main>
      <Footer />
    </>
  )
} 