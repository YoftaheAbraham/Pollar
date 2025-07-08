'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner' 

type Poll = {
  id: string;
  question: string;
  options: string[];
  duration: number;
  maxVotes: number | null;
}

type Project = {
  id: string;
  owner: string;
  title: string;
  description: string;
  polls: Poll[];
}

const CreateProjectPage = () => {
  const router = useRouter()
  const [step, setStep] = useState<'project' | 'polls' | 'publish'>('project')
  const [activePollIndex, setActivePollIndex] = useState<number | null>(null)
  const [project, setProject] = useState<Project>({
    id: '',
    owner: '',
    title: '',
    description: '',
    polls: []
  })
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Poll management functions
  const addOption = () => {
    if (currentPoll && currentPoll.options.length < 6) {
      setCurrentPoll({ ...currentPoll, options: [...currentPoll.options, ''] })
    }
  }

  const removeOption = (index: number) => {
    if (currentPoll && currentPoll.options.length > 2) {
      const newOptions = [...currentPoll.options]
      newOptions.splice(index, 1)
      setCurrentPoll({ ...currentPoll, options: newOptions })
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    if (currentPoll) {
      const newOptions = [...currentPoll.options]
      newOptions[index] = value
      setCurrentPoll({ ...currentPoll, options: newOptions })
    }
  }

  const editPoll = (index: number) => {
    setCurrentPoll(project.polls[index])
    setActivePollIndex(index)
    setStep('polls')
  }

  const startNewPoll = () => {
    setCurrentPoll({
      id: Date.now().toString(),
      question: '',
      options: ['', ''],
      duration: 24,
      maxVotes: null
    })
    setActivePollIndex(null)
    setStep('polls')
  }

  const removePoll = (index: number) => {
    const newPolls = [...project.polls]
    newPolls.splice(index, 1)
    setProject({ ...project, polls: newPolls })
  }

  const validatePoll = () => {
    return currentPoll?.question.trim() !== '' &&
      currentPoll?.options.filter(o => o.trim() !== '').length! >= 2
  }

  const validateProject = () => {
    return project.title.trim() !== '' && project.polls.length > 0
  }

  const saveProjectDetails = () => {
    if (project.title.trim() === '') {
      toast.error('Project title is required')
      return
    }
    setStep('polls')
  }

  const savePoll = () => {
    if (!currentPoll || !validatePoll()) {
      toast.error('Poll question and at least 2 options are required')
      return
    }

    const updatedPolls = [...project.polls]
    if (activePollIndex !== null) {
      updatedPolls[activePollIndex] = currentPoll
    } else {
      updatedPolls.push(currentPoll)
    }

    setProject({
      ...project,
      polls: updatedPolls
    })

    setCurrentPoll(null)
    setStep('polls')
  }

  const handlePublish = async () => {
    if (!validateProject()) {
      toast.error('Project must have a title and at least one poll')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/user/actions/create-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: project.title,
          owner:project.owner,
          description: project.description,
          polls: project.polls.map(poll => ({
            question: poll.question,
            options: poll.options,
            duration: poll.duration,
            maxVotes: poll.maxVotes
          }))
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      setProject(prev => ({
        ...prev,
        id: data.data.projectId
      }))
      setStep('publish')
      toast.success('Project published successfully!')
    } catch (error) {
      console.error('Publish failed:', error)
      toast.error('Failed to publish project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyProjectLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/projects/${project.id}`
      )
      toast.success('Project link copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -z-10"></div>
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-white transition-all duration-300 -z-10"
            style={{
              width: step === 'project' ? '0%' : step === 'polls' ? '50%' : '100%'
            }}
          ></div>
          
          {['project', 'polls', 'publish'].map((stepName, index) => (
            <div key={stepName} className="flex flex-col items-center">
              <button
                onClick={() => {
                  if (stepName === 'project') setStep('project')
                  if (stepName === 'polls' && step !== 'project') setStep('polls')
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === stepName ? 'bg-white text-black' :
                  (step === 'publish' && index < 2) || (step === 'polls' && index < 1) ? 'bg-white/20' : 'bg-white/10'
                } transition-colors`}
                disabled={
                  (stepName === 'polls' && step === 'project') ||
                  (stepName === 'publish' && step !== 'publish')
                }
              >
                {index + 1}
              </button>
              <span className={`mt-2 text-sm ${
                step === stepName || 
                (step === 'publish' && index < 2) || 
                (step === 'polls' && index < 1) ? 'text-white' : 'text-white/40'
              }`}>
                {stepName === 'project' ? 'Project' : stepName === 'polls' ? 'Polls' : 'Publish'}
              </span>
            </div>
          ))}
        </div>

        {step === 'project' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Create New Project</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-lg font-medium">Project Owner*</label>
                <input
                  type="text"
                  value={project.owner}
                  onChange={(e) => setProject({ ...project, owner: e.target.value })}
                  placeholder="Project owner name"
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-lg font-medium">Project Title*</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => setProject({ ...project, title: e.target.value })}
                  placeholder="Name your project"
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-lg font-medium">Description (optional)</label>
                <textarea
                  value={project.description}
                  onChange={(e) => setProject({ ...project, description: e.target.value })}
                  placeholder="Describe your project..."
                  rows={3}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50"
                />
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Link
                href={'/dashboard'}
                className="px-6 py-3 border border-white/20 rounded-md hover:bg-white/10 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={saveProjectDetails}
                disabled={project.title.trim() === ''}
                className={`px-6 py-3 rounded-md font-medium ${
                  project.title.trim() !== '' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white/10 text-white/40 cursor-not-allowed'
                } transition-colors`}
              >
                Continue to Polls
              </button>
            </div>
          </div>
        )}
        {step === 'polls' && (
          <div className="space-y-8">
            {currentPoll ? (
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">
                    {activePollIndex !== null ? `Edit Poll #${activePollIndex + 1}` : 'Add New Poll'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPoll(null)
                      setActivePollIndex(null)
                    }}
                    className="text-sm text-white/60 hover:text-white"
                  >
                    Back to project
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-lg font-medium">Poll Question*</label>
                  <input
                    type="text"
                    value={currentPoll.question}
                    onChange={(e) => setCurrentPoll({ ...currentPoll, question: e.target.value })}
                    placeholder="Ask your question here..."
                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-lg font-medium">Options*</label>
                    <span className="text-sm text-white/60">{currentPoll.options.length}/6</span>
                  </div>

                  {currentPoll.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="w-full px-4 py-2 bg-black border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50"
                        />
                        {currentPoll.options.length > 2 && (
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

                  {currentPoll.options.length < 6 && (
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
                      value={currentPoll.duration}
                      onChange={(e) => setCurrentPoll({ ...currentPoll, duration: Number(e.target.value) })}
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
                      value={currentPoll.maxVotes || ''}
                      onChange={(e) => setCurrentPoll({
                        ...currentPoll,
                        maxVotes: e.target.value ? Number(e.target.value) : null
                      })}
                      placeholder="No limit"
                      className="w-full px-4 py-2 bg-black border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPoll(null)
                      setActivePollIndex(null)
                    }}
                    className="px-6 py-3 border border-white/20 rounded-md hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={savePoll}
                    disabled={!validatePoll()}
                    className={`px-6 py-3 rounded-md font-medium ${
                      validatePoll() ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white/10 text-white/40 cursor-not-allowed'
                    } transition-colors`}
                  >
                    {activePollIndex !== null ? 'Update Poll' : 'Add Poll'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">{project.title}</h2>
                  {project.description && (
                    <p className="text-white/80">{project.description}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                      Polls ({project.polls.length})
                      <span className="text-sm font-normal text-white/60 ml-2">
                        {project.polls.length === 0 ? '(At least 1 required)' : ''}
                      </span>
                    </h3>
                    <button
                      onClick={startNewPoll}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                    >
                      + Add Poll
                    </button>
                  </div>

                  {project.polls.length === 0 ? (
                    <div className="border border-dashed border-white/20 rounded-lg p-8 text-center">
                      <p className="text-white/60 mb-4">No polls added yet</p>
                      <button
                        onClick={startNewPoll}
                        className="px-4 py-2 bg-white text-black rounded-md hover:bg-white/90"
                      >
                        Create First Poll
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {project.polls.map((poll, index) => (
                        <div key={poll.id} className="border border-white/20 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{poll.question || `Poll #${index + 1}`}</h4>
                              <p className="text-sm text-white/60">
                                {poll.options.filter(o => o.trim()).length} options • {poll.duration} hours
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => editPoll(index)}
                                className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removePoll(index)}
                                className="px-3 py-1 text-sm bg-red-500/10 hover:bg-red-500/20 rounded"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={() => setStep('project')}
                    className="px-6 py-3 border border-white/20 rounded-md hover:bg-white/10 transition-colors"
                  >
                    Back to Project
                  </button>
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={!validateProject() || isSubmitting}
                    className={`px-6 py-3 rounded-md font-medium ${
                      validateProject() ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white/10 text-white/40 cursor-not-allowed'
                    } ${isSubmitting ? 'opacity-70' : ''} transition-colors`}
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Project'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {step === 'publish' && (
          <div className="text-center py-12">
            <div className="mx-auto w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Project Published!</h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              Your project "{project.title}" is now live with {project.polls.length} poll{project.polls.length !== 1 ? 's' : ''}.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <button
                onClick={copyProjectLink}
                className="px-6 py-3 bg-white text-black rounded-md font-medium hover:bg-white/90 transition-colors"
              >
                Copy Project Link
              </button>
              <button
                onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                className="px-6 py-3 border border-white/20 rounded-md hover:bg-white/10 transition-colors"
              >
                View Project
              </button>
            </div>

            <Link
              href="/dashboard/projects/new"
              className="text-white/60 hover:text-white underline underline-offset-4"
              onClick={() => {
                setStep('project')
                setProject({
                  id: Date.now().toString(),
                  owner: '',
                  title: '',
                  description: '',
                  polls: []
                })
              }}
            >
              Create another project
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

export default CreateProjectPage