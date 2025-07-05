import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Clock, Activity } from "lucide-react"

export default function StatusPage() {
  const services = [
    {
      name: "API",
      status: "operational",
      uptime: "99.9%",
      responseTime: "120ms",
    },
    {
      name: "Link Redirects",
      status: "operational",
      uptime: "99.95%",
      responseTime: "45ms",
    },
    {
      name: "Dashboard",
      status: "operational",
      uptime: "99.8%",
      responseTime: "200ms",
    },
    {
      name: "Analytics",
      status: "degraded",
      uptime: "98.5%",
      responseTime: "350ms",
    },
  ]

  const incidents = [
    {
      date: "2024-01-15",
      title: "Increased API Response Times",
      status: "investigating",
      description: "We're investigating reports of slower API response times.",
    },
    {
      date: "2024-01-12",
      title: "Brief Dashboard Outage",
      status: "resolved",
      description: "Dashboard was unavailable for 5 minutes due to deployment issues.",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-600"
      case "degraded":
        return "text-yellow-600"
      case "outage":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "degraded":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "outage":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">System Status</h1>
            <p className="text-xl text-gray-600">Current status of TempLink services and infrastructure</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-600 font-semibold">All Systems Operational</span>
            </div>
          </div>

          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Service Status
                </CardTitle>
                <CardDescription>Real-time status of our core services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(service.status)}
                        <div>
                          <h3 className="font-semibold">{service.name}</h3>
                          <p className={`text-sm capitalize ${getStatusColor(service.status)}`}>{service.status}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div>Uptime: {service.uptime}</div>
                        <div>Response: {service.responseTime}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Incidents</CardTitle>
                <CardDescription>Latest updates on service incidents and maintenance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incidents.map((incident, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{incident.title}</h3>
                        <Badge variant={incident.status === "resolved" ? "default" : "secondary"}>
                          {incident.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{incident.description}</p>
                      <p className="text-xs text-gray-500">{incident.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>30-day performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                    <div className="text-sm text-gray-600">Overall Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">150ms</div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">2.1M</div>
                    <div className="text-sm text-gray-600">Links Processed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Subscribe to status updates and get notified of incidents</p>
            <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe to Updates
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
