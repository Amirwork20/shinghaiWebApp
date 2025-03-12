'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

export default function AccountPage() {
  const router = useRouter()
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

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Make API call to login endpoint
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(loginData)
      // })
      
      // Simulate successful login for now
      // if (response.ok) {
      //   const data = await response.json()
      //   localStorage.setItem('auth_token', data.token)
      // }
      
      // For demonstration, we'll simulate success
      localStorage.setItem('isLoggedIn', 'true')
      
      // Redirect to previous page if available, otherwise to homepage
      const previousLocation = localStorage.getItem('previousLocation')
      if (previousLocation) {
        localStorage.removeItem('previousLocation')
        router.push(previousLocation)
      } else {
        router.push('/')
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
      // Make API call to signup endpoint
      // const response = await fetch('/api/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(signupData)
      // })
      
      // Simulate successful signup for now
      // if (response.ok) {
      //   const data = await response.json()
      //   localStorage.setItem('auth_token', data.token)
      // }
      
      // For demonstration, we'll simulate success
      localStorage.setItem('isLoggedIn', 'true')
      
      // Redirect to previous page if available, otherwise to homepage
      const previousLocation = localStorage.getItem('previousLocation')
      if (previousLocation) {
        localStorage.removeItem('previousLocation')
        router.push(previousLocation)
      } else {
        router.push('/')
      }
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
      </main>
      <Footer />
    </>
  )
} 