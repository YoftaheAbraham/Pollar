'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const CreatePollPage = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [poll, setPoll] = useState({
    question: '',
    options: ['', ''],
    isPublic: true,
    duration: 24, // hours
    maxVotes: null as number | null
  })

  const addOption = () => {
    if (poll.options.length < 6) {
      setPoll({ ...poll, options: [...poll.options, ''] })
    }
  }

  const removeOption = (index: number) => {
    if (poll.options.length > 2) {
      const newOptions = [...poll.options]
      newOptions.splice(index, 1)
      setPoll({ ...poll, options: newOptions })
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...poll.options]
    newOptions[index] = value
    setPoll({ ...poll, options: newOptions })
  }

  const validateStep1 = () => {
    return poll.question.trim() !== '' && 
           poll.options.filter(o => o.trim() !== '').length >= 2
  }

  const handlePublish = () => {
    // Submit logic here
    console.log('Poll published:', poll)
    setStep(3)
  }

  return (
    <div className="min-h-screen bg-black text-white pt-14">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-12 relative">
          {/* Progress line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -z-10"></div>
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-white transition-all duration-300 -z-10"
            style={{ width: `${(step - 1) * 50}%` }}
          ></div>
          
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <button
                onClick={() => stepNumber < step && setStep(stepNumber as 1 | 2 | 3)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step === stepNumber ? 'bg-white text-black' : step > stepNumber ? 'bg-white/20' : 'bg-white/10'} transition-colors`}
                disabled={stepNumber > step}
              >
                {stepNumber}
              </button>
              <span className={`mt-2 text-sm ${step >= stepNumber ? 'text-white' : 'text-white/40'}`}>
                {stepNumber === 1 ? 'Setup' : stepNumber === 2 ? 'Review' : 'Publish'}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Poll Creation */}
        {step === 1 && (
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="block text-lg font-medium">Poll Question</label>
              <input
                type="text"
                value={poll.question}
                onChange={(e) => setPoll({ ...poll, question: e.target.value })}
                placeholder="Ask your question here..."
                className="w-full px-4 py-3 bg-black border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-lg font-medium">Options</label>
                <span className="text-sm text-white/60">{poll.options.length}/6</span>
              </div>
              
              {poll.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="w-full px-4 py-2 bg-black border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50"
                    />
                    {poll.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {poll.options.length < 6 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="w-full py-2 border border-dashed border-white/30 rounded-md hover:bg-white/10 transition flex items-center justify-center space-x-2"
                >
                  <span>+</span>
                  <span>Add Option</span>
                </button>
              )}
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={() => validateStep1() && setStep(2)}
                disabled={!validateStep1()}
                className={`px-6 py-3 rounded-md font-medium ${validateStep1() ? 'bg-white text-black hover:bg-white/90' : 'bg-white/10 text-white/40 cursor-not-allowed'} transition-colors`}
              >
                Next: Settings
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Settings & Preview */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="border border-white/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">{poll.question || "Your poll question"}</h2>
              
              <div className="space-y-3">
                {poll.options.filter(o => o.trim()).map((option, index) => (
                  <div key={index} className="relative">
                    <div className="w-full px-4 py-3 border border-white/20 rounded-md text-left">
                      {option || `Option ${index + 1}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Poll Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block">Visibility</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={poll.isPublic}
                        onChange={() => setPoll({ ...poll, isPublic: true })}
                        className="h-4 w-4 border-white/20 rounded-full bg-black focus:ring-white/50"
                      />
                      <span>Public</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={!poll.isPublic}
                        onChange={() => setPoll({ ...poll, isPublic: false })}
                        className="h-4 w-4 border-white/20 rounded-full bg-black focus:ring-white/50"
                      />
                      <span>Private</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block">Duration</label>
                  <select
                    value={poll.duration}
                    onChange={(e) => setPoll({ ...poll, duration: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-black border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50"
                  >
                    <option value="1">1 hour</option>
                    <option value="6">6 hours</option>
                    <option value="24">1 day</option>
                    <option value="72">3 days</option>
                    <option value="168">1 week</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-1">
                    <span>Maximum votes</span>
                    <span className="text-white/50">(optional)</span>
                  </label>
                  <input
                    type="number"
                    value={poll.maxVotes || ''}
                    onChange={(e) => setPoll({ ...poll, maxVotes: e.target.value ? Number(e.target.value) : null })}
                    placeholder="No limit"
                    className="w-full px-4 py-2 bg-black border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-white/20 rounded-md hover:bg-white/10 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="px-6 py-3 bg-white text-black rounded-md font-medium hover:bg-white/90 transition-colors"
              >
                Publish Poll
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="text-center py-12">
            <div className="mx-auto w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Poll Published!</h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              Your poll is now live and ready to share with your audience.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <button className="px-6 py-3 bg-white text-black rounded-md font-medium hover:bg-white/90 transition-colors">
                Copy Poll Link
              </button>
              <button className="px-6 py-3 border border-white/20 rounded-md hover:bg-white/10 transition-colors">
                View Poll
              </button>
            </div>
            
            <Link 
              href="/create" 
              className="text-white/60 hover:text-white underline underline-offset-4"
              onClick={() => setStep(1)}
            >
              Create another poll
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

export default CreatePollPage