'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    name: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...errors }

    if (!formData.email) {
      newErrors.email = 'Email is required'
      valid = false
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
      valid = false
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
      valid = false
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      valid = false
    }

    if (!isLogin && !formData.name) {
      newErrors.name = 'Name is required'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      let url = `/api/auth/${isLogin ? 'login' : 'signup'}`
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();
      console.log(data)
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Continue with ${provider}`)
    // Add your social login logic here
  }

  return (
    <div className="min-h-screen pt-20 bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black border border-white/20 rounded-lg overflow-hidden">
          {/* Toggle tabs */}
          <div className="flex border-b border-white/20">
            <button
              className={`flex-1 py-4 font-medium ${isLogin ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 font-medium ${!isLogin ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-black border ${errors.name ? 'border-red-500' : 'border-white/20'} rounded-md focus:outline-none focus:ring-1 focus:ring-white/50`}
                  placeholder="pollmaster"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-black border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-md focus:outline-none focus:ring-1 focus:ring-white/50`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-black border ${errors.password ? 'border-red-500' : 'border-white/20'} rounded-md focus:outline-none focus:ring-1 focus:ring-white/50`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            {isLogin && (
              <div className="flex justify-between items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 border-white/20 rounded bg-black focus:ring-white/50"
                  />
                  <span className="ml-2 text-sm">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-white/60 hover:text-white">
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 px-4 bg-white text-black font-medium rounded-md hover:bg-white/90 transition-colors"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>

            {/* Divider with "or" text */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-white/60">or continue with</span>
              </div>
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-black border border-white/20 rounded-md hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('GitHub')}
                className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-black border border-white/20 rounded-md hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fill="currentColor"/>
                </svg>
                GitHub
              </button>
            </div>

            {isLogin ? (
              <p className="text-center text-sm text-white/60">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-white hover:underline"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-center text-sm text-white/60">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-white hover:underline"
                >
                  Login
                </button>
              </p>
            )}
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-white/60">
          <p>By continuing, you agree to our Terms and Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage