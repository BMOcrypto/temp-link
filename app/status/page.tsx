import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"

export default function StatusPage() {
  const services = [
    {
      name: "Link Creation",
      status: "operational",
      uptime: "99.9%",
      responseTime: "45ms",
    },
    {
      name: "Link Redirects",
      status: "operational",
      uptime: "99.95%",
      responseTime: "12ms",
    },
    {
      name: "Analytics API",
      status: "operational",
      uptime: "99.8%",
      responseTime: "120ms",
    },
    {
      name: "Dashboard",
      status: "operational",
      uptime: "99.9%",
      responseTime: "200ms",
    },
  ]

  const incidents = [
    {
      date: "2024-01-10",
      title: "Brief API slowdown",
      status: "resolved",
      description: "API response times were elevated for 15 minutes due to increased traffic.",
    },
    {
      date: "2024-01-05",
      title: "Scheduled maintenance",
      status: "completed",
      description: "Database optimization and security updates completed successfully.",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "degraded":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "down":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-100 text-green-800">Operational</Badge>
      case "degraded":
        return <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>
      case "down":
        return <Badge className="bg-red-100 text-red-800">Down</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">System Status</h1>
          <p className="text-xl text-gray-600">Current status of TempLink services and infrastructure</p>
          <div className="mt-6">
            <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
              <CheckCircle className="w-5 h-5 mr-2" />
              All Systems Operational
            </Badge>
          </div>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-gray-600">
                          Uptime: {service.uptime} • Response: {service.responseTime}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(service.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidents.map((incident, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{incident.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{incident.status}</Badge>
                        <span className="text-sm text-gray-500">{incident.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{incident.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                  <p className="text-gray-600">Overall Uptime</p>
                  <p className="text-sm text-gray-500">Last 30 days</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">25ms</div>
                  <p className="text-gray-600">Avg Response Time</p>
                  <p className="text-sm text-gray-500">Global average</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">1.2M</div>
                  <p className="text-gray-600">Links Processed</p>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">Subscribe to status updates and get notified of any incidents.</p>
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Subscribe to Updates
          </button>
        </div>
      </div>
    </div>
  )
}
