import { ActivityIcon, CheckCircleIcon, ClockIcon, SendIcon, Share2Icon, TrendingUpIcon } from "lucide-react"
import { useEffect, useState } from "react"
import api from "../api/axios"

interface Activity {
  _id: string
  description: string
  createdAt: string
}

function Dashboard() {

  const [stats, setStats] = useState({ scheduled: 0, published: 0, connectedAccounts: 0 })
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [postRes, accountsRes, activityRes] = await Promise.all([
          api.get("/api/posts"),
          api.get("/api/accounts"),
          api.get("/api/activity")
        ])
        const posts = postRes.data
        const activitiesData = activityRes.data

        const publishedFromPosts = posts.filter((p: any) => p.status === 'published').length
        const publishedFromActivities = activitiesData.filter((a: any) =>
          a.actionType === 'POST_PUBLISHED' || a.description?.toLowerCase().includes('published')
        ).length

        setStats({
          scheduled: posts.filter((p: any) => p.status === 'scheduled').length,
          published: Math.max(publishedFromPosts, publishedFromActivities),
          connectedAccounts: accountsRes.data.filter((a: any) => a.status === 'connected').length,
        })

        setActivities(activitiesData)

      } catch (error: any) {
        console.log("Error fetching the dashboard data", error);
      }
    }

    fetchDashboardData()
  }, [])

  const statsCard = [
    {
      label: "Scheduled Posts",
      value: stats.scheduled,
      icon: ClockIcon,
      trend: "+2 Today"
    },
    {
      label: "Published Posts",
      value: stats.published,
      icon: CheckCircleIcon,
      trend: "All time"
    },
    {
      label: "Connected Accounts",
      value: stats.connectedAccounts,
      icon: Share2Icon,
      trend: "Active"
    },
  ]

  return (
    <div className='space-y-8'>
      {/* Welcome Bar */}
      <div>
        <h2 className='text-2xl text-slate-900'>Good Morning!</h2>
        <p className='text-slate-500 text-sm mt-0.5'>Here's what's happening with your social accounts today</p>
      </div>

      {/* Stats Card */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCard.map((card) => (
          <div key={card.label} className="bg-white relative border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all card-hover cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-medium text-slate-800 tabular-nums">{card.value}</div>
              <div className="text-xs absolute right-4 top-4 text-indigo-600 font-medium flex items-center gap-1">
                <TrendingUpIcon className="size-3" />
                {card.trend}
              </div>
            </div>

            <p className="text-sm text-slate-500 mt-1">{card.label}</p>

          </div>
        ))}

      </div>

      {/* Activity Feed */}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-slate-900 font-medium">Recent Activity</h2>
          <span className="text-sm text-slate-500">{activities.length} events</span>
        </div>

        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="size-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-3">
              <ActivityIcon className="size-6 text-indigo-600" />
            </div>
            <p className="text-slate-700 font-medium">No activity yet</p>
            <p className="text-slate-500 text-sm mt-1">Connect accounts and schedule posts to see events here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {activities.map((activity) => (
              <div key={activity._id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors">
                <div className="size-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-indigo-50 text-indigo-600">
                  <SendIcon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">

                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium border border-indigo-100/60">Published</span>
                    <span className="text-xs text-slate-500 shrink-0">{new Date(activity.createdAt).toLocaleString()}</span>
                  </div>

                  <p className="text-sm text-slate-600">{activity.description}</p>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard