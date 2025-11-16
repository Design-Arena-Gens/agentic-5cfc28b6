'use client'

import { useState } from 'react'
import { Plus, Search, Calendar, Clock, Users, BookOpen, Trash2, Edit2 } from 'lucide-react'

type Activity = {
  id: string
  title: string
  class: string
  type: string
  description: string
  date: string
  time: string
  instructor: string
  location: string
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
}

const classes = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']
const activityTypes = ['Sports', 'Arts', 'Music', 'Science', 'Field Trip', 'Workshop', 'Assembly', 'Club Meeting', 'Competition', 'Other']
const statuses = ['scheduled', 'ongoing', 'completed', 'cancelled'] as const

export default function Dashboard() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      title: 'Soccer Practice',
      class: 'Grade 9',
      type: 'Sports',
      description: 'Weekly soccer practice session',
      date: '2025-11-20',
      time: '15:00',
      instructor: 'Coach Smith',
      location: 'Sports Field',
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Science Fair Preparation',
      class: 'Grade 10',
      type: 'Science',
      description: 'Students working on their science fair projects',
      date: '2025-11-18',
      time: '14:00',
      instructor: 'Ms. Johnson',
      location: 'Lab 2',
      status: 'ongoing'
    },
    {
      id: '3',
      title: 'Art Exhibition',
      class: 'Grade 11',
      type: 'Arts',
      description: 'Student artwork showcase',
      date: '2025-11-15',
      time: '10:00',
      instructor: 'Mr. Davis',
      location: 'Art Gallery',
      status: 'completed'
    }
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterClass, setFilterClass] = useState('All Classes')
  const [filterType, setFilterType] = useState('All Types')
  const [filterStatus, setFilterStatus] = useState('All Statuses')

  const [formData, setFormData] = useState<{
    title: string
    class: string
    type: string
    description: string
    date: string
    time: string
    instructor: string
    location: string
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  }>({
    title: '',
    class: '',
    type: '',
    description: '',
    date: '',
    time: '',
    instructor: '',
    location: '',
    status: 'scheduled'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      setActivities(activities.map(activity =>
        activity.id === editingId
          ? { ...formData, id: editingId }
          : activity
      ))
      setEditingId(null)
    } else {
      const newActivity: Activity = {
        ...formData,
        id: Date.now().toString()
      }
      setActivities([...activities, newActivity])
    }

    setFormData({
      title: '',
      class: '',
      type: '',
      description: '',
      date: '',
      time: '',
      instructor: '',
      location: '',
      status: 'scheduled'
    })
    setShowModal(false)
  }

  const handleEdit = (activity: Activity) => {
    setFormData(activity)
    setEditingId(activity.id)
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id))
  }

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = filterClass === 'All Classes' || activity.class === filterClass
    const matchesType = filterType === 'All Types' || activity.type === filterType
    const matchesStatus = filterStatus === 'All Statuses' || activity.status === filterStatus

    return matchesSearch && matchesClass && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'ongoing': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="text-indigo-600" />
                School Activities Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Track and manage all school activities</p>
            </div>
            <button
              onClick={() => {
                setFormData({
                  title: '',
                  class: '',
                  type: '',
                  description: '',
                  date: '',
                  time: '',
                  instructor: '',
                  location: '',
                  status: 'scheduled'
                })
                setEditingId(null)
                setShowModal(true)
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md"
            >
              <Plus size={20} />
              Add Activity
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option>All Classes</option>
              {classes.map(cls => (
                <option key={cls}>{cls}</option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option>All Types</option>
              {activityTypes.map(type => (
                <option key={type}>{type}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option>All Statuses</option>
              {statuses.map(status => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Activities</p>
                <p className="text-3xl font-bold text-gray-900">{activities.length}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <BookOpen className="text-indigo-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Scheduled</p>
                <p className="text-3xl font-bold text-blue-600">
                  {activities.filter(a => a.status === 'scheduled').length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Ongoing</p>
                <p className="text-3xl font-bold text-green-600">
                  {activities.filter(a => a.status === 'ongoing').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-gray-600">
                  {activities.filter(a => a.status === 'completed').length}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <Users className="text-gray-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Activities ({filteredActivities.length})
            </h2>
          </div>

          {filteredActivities.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 text-lg">No activities found</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters or add a new activity</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredActivities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                          <div className="text-sm text-gray-500">{activity.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.class}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-gray-400" />
                          {activity.date}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock size={14} className="text-gray-400" />
                          {activity.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.instructor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(activity)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(activity.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingId ? 'Edit Activity' : 'Add New Activity'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class *
                    </label>
                    <select
                      required
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select Class</option>
                      {classes.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select Type</option>
                      {activityTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructor *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingId(null)
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    {editingId ? 'Update' : 'Add'} Activity
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
