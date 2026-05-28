import { useEffect, useState } from 'react'
import { getAllUsersAPI, toggleUserStatusAPI } from '../../api/adminAPI.js'
import Navbar from '../../components/Navbar.jsx'
import Spinner from '../../components/Spinner.jsx'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function ManageUsers() {
  const [users,    setUsers]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('all')
  const [search,   setSearch]   = useState('')
  const [actionId, setActionId] = useState(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filter !== 'all') params.role = filter
      const res = await getAllUsersAPI(params)
      setUsers(res.data.users || [])
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [filter])

  const handleToggle = async (id, name, isActive) => {
    const action = isActive ? 'deactivate' : 'activate'
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${name}?`)) return
    setActionId(id)
    try {
      await toggleUserStatusAPI(id)
      toast.success(`User ${action}d successfully`)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action}`)
    } finally {
      setActionId(null)
    }
  }

  const roleBadge = {
    patient: 'bg-blue-100 text-blue-700',
    doctor:  'bg-purple-100 text-purple-700',
    admin:   'bg-red-100 text-red-700',
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-slate-800 mb-6">
          Manage Users
        </h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="input flex-1"
          />
          <div className="flex gap-2">
            {['all', 'patient', 'doctor', 'admin'].map(r => (
              <button
                key={r}
                onClick={() => setFilter(r)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                  filter === r
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* User count */}
        <p className="text-sm text-slate-500 mb-4">
          {filtered.length} user(s) found
        </p>

        {/* Users list */}
        {loading ? <Spinner /> : filtered.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-slate-500">No users found</p>
          </div>
        ) : (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">User</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Joined</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(user => (
                    <tr
                      key={user._id}
                      className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                    >
                      {/* User info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-primary-700 font-semibold text-sm">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${roleBadge[user.role]}`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Joined date */}
                      <td className="py-3 px-4 text-slate-500">
                        {user.createdAt
                          ? format(new Date(user.createdAt), 'dd MMM yyyy')
                          : 'N/A'
                        }
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          user.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Toggle action */}
                      <td className="py-3 px-4">
                        {user.role !== 'admin' ? (
                          <button
                            onClick={() => handleToggle(user._id, user.name, user.isActive)}
                            disabled={actionId === user._id}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                              user.isActive
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}
                          >
                            {actionId === user._id
                              ? '...'
                              : user.isActive ? 'Deactivate' : 'Activate'
                            }
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}