"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Bot,
  MessageSquare,
  UserCheck,
  Clock,
  ArrowUpRight,
  Zap,
} from "lucide-react"

export function DashboardBoss() {
  // Mock data - in real app this would come from API
  const dashboardData = {
    totalClients: 247,
    clientsGrowth: 12,
    activeSessions: 18,
    sessionsToday: 5,
    monthlyRevenue: 45680,
    revenueGrowth: 8.5,
    monthlyCommissions: 12340,
    commissionsGrowth: 15.2,
    botConversations: 156,
    botInterruptions: 23,
    botResponseRate: 94.2,
  }

  const recentSessions = [
    { id: 1, client: "Anna Kowalska", therapist: "Dr. Maria Nowak", time: "14:00", status: "active" },
    { id: 2, client: "Jan Wiśniewski", therapist: "Dr. Piotr Zieliński", time: "15:30", status: "scheduled" },
    { id: 3, client: "Katarzyna Dąbrowska", therapist: "Dr. Maria Nowak", time: "16:00", status: "completed" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Remove the header section - it's now in the main layout */}

      {/* Main Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Clients */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Liczba Klientów</CardTitle>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{dashboardData.totalClients}</div>
            <div className="flex items-center text-xs text-blue-700 dark:text-blue-300 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />+{dashboardData.clientsGrowth} w tym miesiącu
            </div>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">Aktywne Sesje</CardTitle>
            <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{dashboardData.activeSessions}</div>
            <div className="flex items-center text-xs text-green-700 dark:text-green-300 mt-1">
              <Clock className="h-3 w-3 mr-1" />
              {dashboardData.sessionsToday} dzisiaj
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300">Przychody Miesiąc</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {dashboardData.monthlyRevenue.toLocaleString("pl-PL")} zł
            </div>
            <div className="flex items-center text-xs text-purple-700 dark:text-purple-300 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />+{dashboardData.revenueGrowth}% vs poprzedni miesiąc
            </div>
          </CardContent>
        </Card>

        {/* Monthly Commissions */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-300">Prowizje Miesiąc</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {dashboardData.monthlyCommissions.toLocaleString("pl-PL")} zł
            </div>
            <div className="flex items-center text-xs text-orange-700 dark:text-orange-300 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />+{dashboardData.commissionsGrowth}% wzrost
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Bot Activity Section */}
      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-700">
        <CardHeader>
          <CardTitle className="flex items-center text-indigo-900 dark:text-indigo-100">
            <Bot className="h-5 w-5 mr-2" />
            Aktywność Bota AI
          </CardTitle>
          <CardDescription className="text-indigo-700 dark:text-indigo-300">Statystyki automatycznych rozmów z klientami</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Rozmowy</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{dashboardData.botConversations}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Przerwania</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{dashboardData.botInterruptions}</p>
                </div>
                <UserCheck className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Skuteczność</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{dashboardData.botResponseRate}%</p>
                </div>
                <Zap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Ostatnie Sesje</CardTitle>
            <CardDescription>Przegląd najnowszych sesji terapeutycznych</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{session.client}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{session.therapist}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{session.time}</p>
                    <Badge
                      variant={
                        session.status === "active"
                          ? "default"
                          : session.status === "completed"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {session.status === "active"
                        ? "Aktywna"
                        : session.status === "completed"
                          ? "Zakończona"
                          : "Zaplanowana"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              Zobacz wszystkie sesje
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Szybkie Akcje</CardTitle>
            <CardDescription>Najczęściej używane funkcje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-16 flex-col bg-blue-600 hover:bg-blue-700">
                <Users className="h-5 w-5 mb-1" />
                <span className="text-xs">Zarządzaj Użytkownikami</span>
              </Button>
              <Button className="h-16 flex-col bg-green-600 hover:bg-green-700">
                <Calendar className="h-5 w-5 mb-1" />
                <span className="text-xs">Kalendarz</span>
              </Button>
              <Button className="h-16 flex-col bg-purple-600 hover:bg-purple-700">
                <Bot className="h-5 w-5 mb-1" />
                <span className="text-xs">Bot AI</span>
              </Button>
              <Button className="h-16 flex-col bg-orange-600 hover:bg-orange-700">
                <TrendingUp className="h-5 w-5 mb-1" />
                <span className="text-xs">Szkolenia</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
