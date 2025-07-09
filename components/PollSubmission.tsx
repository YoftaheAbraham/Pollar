"use client"
import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { FiCheckCircle, FiBarChart2, FiClock, FiUsers } from 'react-icons/fi'
import { toast } from 'sonner'
import { setCookie, getCookie, deleteCookie } from 'cookies-next'

interface PollOption {
  id: string
  text: string
  votes?: number
}

interface PollData {
  id: string
  question: string
  duration: number
  respondents: number
  isActive: boolean
  options: PollOption[]
  creator?: string
}

const PollSubmission = () => {
  const { id: pollID } = useParams()
  const [poll, setPoll] = useState<PollData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Simplified storage keys for debugging
  const STORAGE_KEY = `poll_${pollID}`
  const COOKIE_KEY = `poll_vote_${pollID}`

  useEffect(() => {
    const checkVotingStatus = () => {
      try {
        const localStorageVote = localStorage.getItem(STORAGE_KEY)
        const cookieVote = getCookie(COOKIE_KEY)
        
        if (localStorageVote || cookieVote) {
          setHasVoted(true)
        }
      } catch (e) {
        console.error('Error checking voting status:', e)
      }
    }

    const fetchPoll = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/poll?pollId=${pollID}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch poll')
        }

        setPoll(data.data)
        checkVotingStatus()
      } catch (err) {
        console.error('Fetch poll error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load poll')
      } finally {
        setLoading(false)
      }
    }

    fetchPoll()
  }, [pollID])

  const handleVote = async () => {
    if (!selectedOption || !poll) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/poll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          optionId: selectedOption,
          pollId: pollID
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || 'Failed to submit vote')
      }

      // Store vote confirmation
      const voteToken = `voted_${Date.now()}`
      localStorage.setItem(STORAGE_KEY, voteToken)
      setCookie(COOKIE_KEY, voteToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })

      // Update UI state
      setPoll({
        ...poll,
        options: poll.options.map(opt => 
          opt.id === selectedOption 
            ? { ...opt, votes: (opt.votes || 0) + 1 } 
            : opt
        ),
        respondents: poll.respondents + 1
      })

      setHasVoted(true)
      
      toast.success('Vote recorded successfully!', {
        position: 'top-center',
        duration: 4000
      })

    } catch (err) {
      console.error('Vote submission error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Vote submission failed'
      
      toast.error('Failed to submit vote', {
        description: errorMessage,
        position: 'top-center'
      })
      
      // Clean up storage on error
      localStorage.removeItem(STORAGE_KEY)
      deleteCookie(COOKIE_KEY)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center theme">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading poll...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !poll) {
    return (
      <div className="min-h-screen flex items-center justify-center theme">
        <div className="max-w-md p-8 theme-lighter rounded-sm border border-gray-700 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Poll Not Found</h2>
          <p className="text-gray-400 mb-6">
            {error || 'The poll you are looking for does not exist or may have been removed.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Closed poll state
  if (!poll.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center theme">
        <div className="max-w-md p-8 theme-lighter rounded-sm border border-gray-700 text-center">
          <div className="w-16 h-16 theme-lighter rounded-full flex items-center justify-center mx-auto mb-4">
            <FiClock className="text-green-500 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Poll Closed</h2>
          <p className="text-gray-400 mb-6">
            This poll is no longer accepting responses. It received {poll.respondents} total votes.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 theme-lighter text-white rounded-sm hover:bg-gray-700 transition-colors border border-gray-700"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + (option.votes || 0), 0)

  return (
    <div className="min-h-screen theme flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="theme-lighter border border-gray-700 rounded-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-green-900/20">
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-2xl font-bold text-white mb-2">{poll.question}</h1>
              <span className="text-xs theme-lighter text-green-400 px-2 py-1 rounded">
                POLLAR
              </span>
            </div>
            
            {poll.creator && (
              <p className="text-sm text-gray-400 mb-2">Created by: {poll.creator}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
              <span className="flex items-center gap-1">
                <FiUsers className="text-green-500" />
                {poll.respondents} responses
              </span>
              <span className="flex items-center gap-1">
                <FiClock className="text-green-500" />
                Closes in {poll.duration} hours
              </span>
            </div>

            <div className="space-y-3 mb-6">
              {poll.options.map((option) => (
                <div 
                  key={option.id}
                  className={`relative border rounded-sm p-4 transition-all duration-200 cursor-pointer
                    ${selectedOption === option.id 
                      ? 'border-green-500 theme-lighter' 
                      : 'border-gray-700 hover:border-green-400 hover:theme-lighter'}
                    ${hasVoted ? 'cursor-default' : ''}
                  `}
                  onClick={() => !hasVoted && setSelectedOption(option.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{option.text}</span>
                    {selectedOption === option.id && !hasVoted && (
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <FiCheckCircle className="text-white text-xs" />
                      </div>
                    )}
                  </div>

                  {hasVoted && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{option.votes} votes</span>
                        <span>{totalVotes > 0 ? Math.round((option.votes || 0) / totalVotes * 100) : 0}%</span>
                      </div>
                      <div className="w-full theme-lighter rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${totalVotes > 0 ? (option.votes || 0) / totalVotes * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!hasVoted ? (
              <button
                onClick={handleVote}
                disabled={!selectedOption || isSubmitting}
                className={`w-full py-3 px-4 rounded-sm font-medium text-white transition-all
                  ${selectedOption 
                    ? 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-green-900/30' 
                    : 'bg-gray-700 cursor-not-allowed text-gray-400'}
                  ${isSubmitting ? 'opacity-70' : ''}
                `}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </span>
                ) : (
                  'Submit Vote'
                )}
              </button>
            ) : (
              <div className="theme-lighter px-6 py-4 border-t border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-400">
                  <FiBarChart2 />
                  <span className="text-sm">Total votes: {totalVotes}</span>
                </div>
               
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PollSubmission