'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

type PollForm = {
    question: string
    options: string[]
    duration: number
    maxVotes: number | null
}

export default function AddPollPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [poll, setPoll] = useState<PollForm>({
        question: '',
        options: ['', ''],
        duration: 24,
        maxVotes: null
    });

    const { id: projectID } = useParams();

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

    const validatePoll = () => {
        return (
            poll.question.trim() !== '' &&
            poll.options.filter(o => o.trim() !== '').length >= 2 &&
            new Set(poll.options.map(o => o.trim().toLowerCase())).size === poll.options.length
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validatePoll()) {
            toast.error('Please provide a question and at least 2 unique options')
            return
        }

        setIsSubmitting(true)
        try {
            const response = await fetch(`/api/user/actions/projects/add-poll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    projectId: projectID,
                    question: poll.question,
                    options: poll.options.filter(o => o.trim() !== ''),
                    duration: poll.duration,
                    maxVotes: poll.maxVotes
                })
            })

            if (!response.ok) {
                throw new Error(await response.text())
            }

            const data = await response.json()
            toast.success('Poll created successfully!')
            router.push(`/dashboard/projects/${projectID}`)
        } catch (error) {
            console.error('Poll creation failed:', error)
            toast.error('Failed to create poll. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Add New Poll</h1>
                    <Link
                        href={`/projects/${projectID}`}
                        className="text-sm text-white/60 hover:text-white"
                    >
                        Back to Project
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-lg font-medium">Poll Question*</label>
                        <input
                            type="text"
                            value={poll.question}
                            onChange={(e) => setPoll({ ...poll, question: e.target.value })}
                            placeholder="Ask your question here..."
                            className="w-full px-4 py-3 bg-black border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50"
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="block text-lg font-medium">Options*</label>
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
                                        required
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                            <label className="block">Duration (hours)</label>
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
                                onChange={(e) => setPoll({
                                    ...poll,
                                    maxVotes: e.target.value ? Number(e.target.value) : null
                                })}
                                placeholder="No limit"
                                min="1"
                                className="w-full px-4 py-2 bg-black border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                        <Link
                            href={`/dashboard/projects/${projectID}`}
                            className="px-6 py-3 border border-white/20 rounded-md hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={!validatePoll() || isSubmitting}
                            className={`px-6 py-3 rounded-md font-medium ${validatePoll() ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white/10 text-white/40 cursor-not-allowed'
                                } ${isSubmitting ? 'opacity-70' : ''} transition-colors`}
                        >
                            {isSubmitting ? 'Creating...' : 'Add Poll'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}