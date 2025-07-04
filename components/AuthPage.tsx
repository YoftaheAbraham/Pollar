'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    username: ''
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

    if (!isLogin && !formData.username) {
      newErrors.username = 'Username is required'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Handle authentication logic here
      console.log('Form submitted:', formData)
    }
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
                <label htmlFor="username" className="block text-sm font-medium mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-black border ${errors.username ? 'border-red-500' : 'border-white/20'} rounded-md focus:outline-none focus:ring-1 focus:ring-white/50`}
                  placeholder="pollmaster"
                />
                {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
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