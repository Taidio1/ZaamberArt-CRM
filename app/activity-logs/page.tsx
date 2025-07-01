"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import {
  Activity,
  User,
  Calendar,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react"

import { getActivityLogs, getActivityLogsCount, ActivityLog } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

const ITEMS_PER_PAGE = 20

const ACTION_TYPES = {
  'login': { label: 'Logowanie', color: 'bg-green-100 text-green-800' },
  'logout': { label: 'Wylogowanie', color: 'bg-orange-100 text-orange-800' },
  'create_user': { label: 'Utworzenie użytkownika', color: 'bg-blue-100 text-blue-800' },
  'update_user': { label: 'Aktualizacja użytkownika', color: 'bg-yellow-100 text-yellow-800' },
  'delete_user': { label: 'Usunięcie użytkownika', color: 'bg-red-100 text-red-800' },
  'create_session': { label: 'Rozpoczęcie sesji', color: 'bg-purple-100 text-purple-800' },
  'end_session': { label: 'Zakończenie sesji', color: 'bg-indigo-100 text-indigo-800' },
  'view_dashboard': { label: 'Wyświetlenie dashboard', color: 'bg-gray-100 text-gray-800' },
  'export_data': { label: 'Eksport danych', color: 'bg-teal-100 text-teal-800' },
  'system_error': { label: 'Błąd systemu', color: 'bg-red-100 text-red-800' },
}

const ROLE_LABELS = {
  'boss': 'Właściciel',
  'manager': 'Manager',
  'therapist': 'Terapeuta',
  'junior_therapist': 'Junior Terapeuta',
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      searchTerm === "" ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.user?.first_name + " " + log.user?.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesAction = actionFilter === "all" || log.action === actionFilter
    
    return matchesSearch && matchesAction
  })

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const loadLogs = async () => {
    setLoading(true)
    try {
      const [logsData, count] = await Promise.all([
        getActivityLogs(ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE),
        getActivityLogsCount()
      ])
      setLogs(logsData)
      setTotalCount(count)
    } catch (error) {
      console.error("Error loading activity logs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [currentPage])

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy, HH:mm:ss", { locale: pl })
  }

  const getActionBadge = (action: string) => {
    const actionType = ACTION_TYPES[action as keyof typeof ACTION_TYPES] || {
      label: action,
      color: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <Badge className={actionType.color} variant="secondary">
        {actionType.label}
      </Badge>
    )
  }

  const formatDetails = (details: any) => {
    if (!details) return "Brak szczegółów"
    if (typeof details === 'string') return details
    return JSON.stringify(details, null, 2)
  }

  const handleRefresh = () => {
    setCurrentPage(1)
    loadLogs()
  }

  const handleExport = () => {
    // Implementacja eksportu CSV
    const csvContent = [
      ["Data", "Użytkownik", "Akcja", "Szczegóły", "IP", "User Agent"].join(","),
      ...filteredLogs.map(log => [
        formatDate(log.created_at),
        log.user ? `${log.user.first_name} ${log.user.last_name}` : "System",
        log.action,
        formatDetails(log.details).replace(/,/g, ";"),
        log.ip_address || "",
        log.user_agent?.replace(/,/g, ";") || ""
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `activity_logs_${format(new Date(), "yyyy-MM-dd")}.csv`
    link.click()
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            Logi Aktywności
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitorowanie wszystkich działań w systemie
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Odśwież
          </Button>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Eksportuj CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Łączna liczba logów</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Wszystkie zarejestrowane działania
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dzisiaj</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter(log => 
                format(new Date(log.created_at), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Działania z dzisiaj
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unikalni użytkownicy</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(logs.filter(log => log.user_id).map(log => log.user_id)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Aktywni użytkownicy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Szukaj po akcji, użytkowniku lub emailu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtruj po akcji" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie akcje</SelectItem>
                  {Object.entries(ACTION_TYPES).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-64" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Użytkownik</TableHead>
                  <TableHead>Akcja</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Szczegóły</TableHead>
                  <TableHead className="w-[100px]">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Brak logów do wyświetlenia
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {formatDate(log.created_at)}
                      </TableCell>
                      <TableCell>
                        {log.user ? (
                          <div>
                            <div className="font-medium">
                              {log.user.first_name} {log.user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {ROLE_LABELS[log.user.role as keyof typeof ROLE_LABELS] || log.user.role}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500 italic">System</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getActionBadge(log.action)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.ip_address || "-"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {formatDetails(log.details)}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedLog(log)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Szczegóły logu aktywności</DialogTitle>
                            </DialogHeader>
                            {selectedLog && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Data</label>
                                    <p className="text-sm text-gray-600 font-mono">
                                      {formatDate(selectedLog.created_at)}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Akcja</label>
                                    <div className="mt-1">
                                      {getActionBadge(selectedLog.action)}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Użytkownik</label>
                                    <p className="text-sm text-gray-600">
                                      {selectedLog.user 
                                        ? `${selectedLog.user.first_name} ${selectedLog.user.last_name} (${selectedLog.user.email})`
                                        : "System"
                                      }
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">IP Address</label>
                                    <p className="text-sm text-gray-600 font-mono">
                                      {selectedLog.ip_address || "Brak"}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">User Agent</label>
                                  <p className="text-sm text-gray-600 font-mono break-all">
                                    {selectedLog.user_agent || "Brak"}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Szczegóły</label>
                                  <pre className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md overflow-x-auto">
                                    {formatDetails(selectedLog.details)}
                                  </pre>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Wyświetlanie {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} z {totalCount} logów
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Poprzednia
            </Button>
            <span className="text-sm font-medium">
              Strona {currentPage} z {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Następna
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 