"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import {
  Users,
  UserCheck,
  DollarSign,
  Calendar,
  TrendingUp,
  Eye,
  Edit2,
  UserX,
  Trash2,
  Phone,
  MessageCircle,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  ArrowUpDown,
  ChevronRight,
  Home,
} from "lucide-react"

import {
  getAllUsers,
  getAllClients,
  getAllTransactions,
  getUpcomingSessions,
  getAllTherapistStats,
  getClientsByTherapist,
  getTransactionsByTherapist,
  getSessionsByTherapist,
  createClientRecord,
  updateClient,
  deleteClient,
  type User,
  type Client,
  type Transaction,
  type Session,
  type TherapistStats
} from "@/lib/supabase"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function ClientsPage() {
  const [therapists, setTherapists] = useState<User[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [therapistStats, setTherapistStats] = useState<TherapistStats[]>([])
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTherapist, setSelectedTherapist] = useState<User | null>(null)
  const [selectedTherapistClients, setSelectedTherapistClients] = useState<Client[]>([])
  const [selectedTherapistTransactions, setSelectedTherapistTransactions] = useState<Transaction[]>([])
  const [selectedTherapistSessions, setSelectedTherapistSessions] = useState<Session[]>([])
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const { toast } = useToast()

  // Client form state
  const [clientForm, setClientForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    notes: '',
    assigned_therapist_id: '',
    is_active: true
  })

  const loadData = async () => {
    setLoading(true)
    try {
      const [
        therapistsData,
        clientsData,
        transactionsData,
        statsData,
        sessionsData
      ] = await Promise.all([
        getAllUsers(),
        getAllClients(),
        getAllTransactions(),
        getAllTherapistStats(),
        getUpcomingSessions()
      ])

      // Filter only therapists
      const therapistUsers = therapistsData.filter(user => 
        ['therapist', 'junior_therapist'].includes(user.role) && user.is_active
      )

      setTherapists(therapistUsers)
      setClients(clientsData)
      setTransactions(transactionsData)
      setTherapistStats(statsData)
      setUpcomingSessions(sessionsData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Błąd",
        description: "Nie udało się załadować danych",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleViewTherapist = async (therapist: User) => {
    setSelectedTherapist(therapist)
    setLoading(true)
    
    try {
      const [clientsData, transactionsData, sessionsData] = await Promise.all([
        getClientsByTherapist(therapist.id),
        getTransactionsByTherapist(therapist.id),
        getSessionsByTherapist(therapist.id)
      ])

      setSelectedTherapistClients(clientsData)
      setSelectedTherapistTransactions(transactionsData)
      setSelectedTherapistSessions(sessionsData)
      setIsDetailsDialogOpen(true)
    } catch (error) {
      console.error('Error loading therapist details:', error)
      toast({
        title: "Błąd",
        description: "Nie udało się załadować szczegółów terapeuty",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingClient) {
        const updated = await updateClient(editingClient.id, clientForm)
        if (updated) {
          toast({
            title: "Sukces",
            description: "Klient został zaktualizowany"
          })
          loadData()
        }
      } else {
        const created = await createClientRecord(clientForm)
        if (created) {
          toast({
            title: "Sukces",
            description: "Nowy klient został utworzony"
          })
          loadData()
        }
      }
      
      setIsClientDialogOpen(false)
      resetClientForm()
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać klienta",
        variant: "destructive"
      })
    }
  }

  const resetClientForm = () => {
    setClientForm({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      address: '',
      notes: '',
      assigned_therapist_id: '',
      is_active: true
    })
    setEditingClient(null)
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setClientForm({
      first_name: client.first_name,
      last_name: client.last_name,
      email: client.email || '',
      phone: client.phone || '',
      date_of_birth: client.date_of_birth || '',
      address: client.address || '',
      notes: client.notes || '',
      assigned_therapist_id: client.assigned_therapist_id || '',
      is_active: client.is_active
    })
    setIsClientDialogOpen(true)
  }

  const handleDeleteClient = async (clientId: string) => {
    if (confirm('Czy na pewno chcesz usunąć tego klienta?')) {
      const success = await deleteClient(clientId)
      if (success) {
        toast({
          title: "Sukces",
          description: "Klient został usunięty"
        })
        loadData()
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się usunąć klienta",
          variant: "destructive"
        })
      }
    }
  }

  // Calculate overall statistics
  const overallStats = {
    totalTherapists: therapists.length,
    totalClients: clients.filter(c => c.is_active).length,
    totalEarnings: transactions.reduce((sum, t) => sum + t.amount, 0),
    totalCommission: transactions.reduce((sum, t) => sum + t.commission_amount, 0),
    upcomingSessionsCount: upcomingSessions.length
  }

  const filteredTherapists = therapists.filter(therapist => {
    const fullName = `${therapist.first_name} ${therapist.last_name}`.toLowerCase()
    const email = therapist.email.toLowerCase()
    return searchTerm === '' || 
           fullName.includes(searchTerm.toLowerCase()) ||
           email.includes(searchTerm.toLowerCase())
  })

  const getTherapistStatsById = (therapistId: string) => {
    return therapistStats.find(stat => stat.therapist_id === therapistId) || {
      therapist_id: therapistId,
      client_count: 0,
      total_sessions: 0,
      total_earnings: 0,
      commission_amount: 0,
      average_session_price: 0,
      sessions_this_month: 0,
      last_session_date: undefined
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', { 
      style: 'currency', 
      currency: 'PLN' 
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy", { locale: pl })
  }

  const getAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    const age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1
    }
    return age
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <ChevronRight className="h-4 w-4 text-gray-500" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-gray-900 dark:text-gray-100">Podopieczni</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6 space-y-6">
        {/* Page Title and Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Zarządzanie Podopiecznymi</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Monitoruj hipnoterapeutów i ich klientów</p>
          </div>
          
          <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={resetClientForm}>
                <Plus className="h-4 w-4 mr-2" />
                Dodaj Klienta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingClient ? 'Edytuj Klienta' : 'Dodaj Nowego Klienta'}
                </DialogTitle>
                <DialogDescription>
                  Wypełnij poniższe pola aby {editingClient ? 'zaktualizować' : 'utworzyć'} klienta.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleClientSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">Imię</Label>
                    <Input
                      id="first_name"
                      value={clientForm.first_name}
                      onChange={(e) => setClientForm({...clientForm, first_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Nazwisko</Label>
                    <Input
                      id="last_name"
                      value={clientForm.last_name}
                      onChange={(e) => setClientForm({...clientForm, last_name: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={clientForm.email}
                      onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={clientForm.phone}
                      onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date_of_birth">Data urodzenia</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={clientForm.date_of_birth}
                      onChange={(e) => setClientForm({...clientForm, date_of_birth: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="assigned_therapist">Przypisany terapeuta</Label>
                    <Select 
                      value={clientForm.assigned_therapist_id} 
                      onValueChange={(value) => setClientForm({...clientForm, assigned_therapist_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz terapeutę" />
                      </SelectTrigger>
                      <SelectContent>
                        {therapists.map((therapist) => (
                          <SelectItem key={therapist.id} value={therapist.id}>
                            {therapist.first_name} {therapist.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Adres</Label>
                  <Input
                    id="address"
                    value={clientForm.address}
                    onChange={(e) => setClientForm({...clientForm, address: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notatki</Label>
                  <Textarea
                    id="notes"
                    value={clientForm.notes}
                    onChange={(e) => setClientForm({...clientForm, notes: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsClientDialogOpen(false)}>
                    Anuluj
                  </Button>
                  <Button type="submit">
                    {editingClient ? 'Zaktualizuj' : 'Utwórz'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Hipnoterapeuci</CardTitle>
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{overallStats.totalTherapists}</div>
              <p className="text-xs text-blue-700 dark:text-blue-300">Aktywni terapeuci</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">Klienci</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{overallStats.totalClients}</div>
              <p className="text-xs text-green-700 dark:text-green-300">Aktywni klienci</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300">Całkowite Obroty</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {formatCurrency(overallStats.totalEarnings)}
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300">Łączne przychody</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-300">Prowizja Szefa</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {formatCurrency(overallStats.totalCommission)}
              </div>
              <p className="text-xs text-orange-700 dark:text-orange-300">20% z obrotów</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Nadchodzące Sesje</CardTitle>
              <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{overallStats.upcomingSessionsCount}</div>
              <p className="text-xs text-indigo-700 dark:text-indigo-300">Zaplanowane sesje</p>
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
                    placeholder="Szukaj po nazwisku, emailu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Therapists Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Lista Hipnoterapeutów
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Ładowanie danych...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Terapeuta</TableHead>
                    <TableHead>Liczba Klientów</TableHead>
                    <TableHead>Ostatnia Sesja</TableHead>
                    <TableHead>Suma Transakcji</TableHead>
                    <TableHead>Prowizja Szefa (20%)</TableHead>
                    <TableHead>Średnia Cena Sesji</TableHead>
                    <TableHead className="text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTherapists.map((therapist) => {
                    const stats = getTherapistStatsById(therapist.id)
                    return (
                      <TableRow key={therapist.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://avatar.vercel.sh/${therapist.email}`} />
                              <AvatarFallback>{therapist.first_name[0]}{therapist.last_name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{therapist.first_name} {therapist.last_name}</div>
                              <div className="text-sm text-gray-500">{therapist.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <UserCheck className="h-4 w-4 text-blue-500 mr-1" />
                            <span>{stats.client_count}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {stats.last_session_date 
                            ? formatDate(stats.last_session_date)
                            : <span className="text-gray-400">Brak sesji</span>
                          }
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(stats.total_earnings)}
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {formatCurrency(stats.commission_amount)}
                        </TableCell>
                        <TableCell>
                          {stats.average_session_price > 0 
                            ? formatCurrency(stats.average_session_price)
                            : <span className="text-gray-400">-</span>
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewTherapist(therapist)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Podgląd
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edytuj
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <UserX className="mr-2 h-4 w-4" />
                                Zablokuj
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Therapist Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://avatar.vercel.sh/${selectedTherapist?.email}`} />
                  <AvatarFallback>
                    {selectedTherapist?.first_name[0]}{selectedTherapist?.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                {selectedTherapist?.first_name} {selectedTherapist?.last_name}
              </DialogTitle>
              <DialogDescription>
                Szczegółowy podgląd terapeuty i jego klientów
              </DialogDescription>
            </DialogHeader>

            {selectedTherapist && (
              <Tabs defaultValue="clients" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="clients">Klienci ({selectedTherapistClients.length})</TabsTrigger>
                  <TabsTrigger value="sessions">Sesje ({selectedTherapistSessions.length})</TabsTrigger>
                  <TabsTrigger value="transactions">Transakcje ({selectedTherapistTransactions.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="clients" className="space-y-4">
                  <div className="grid gap-4">
                    {selectedTherapistClients.map((client) => (
                      <Card key={client.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{client.first_name[0]}{client.last_name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">{client.first_name} {client.last_name}</h4>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  {client.date_of_birth && (
                                    <span>{getAge(client.date_of_birth)} lat</span>
                                  )}
                                  <span>Od {formatDate(client.created_at)}</span>
                                  <Badge variant={client.is_active ? "default" : "secondary"}>
                                    {client.is_active ? "Aktywny" : "Nieaktywny"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            {client.notes && (
                              <p className="text-sm text-gray-600 mb-2">{client.notes}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {client.phone && (
                              <Button size="sm" variant="outline">
                                <Phone className="h-4 w-4 mr-1" />
                                Zadzwoń
                              </Button>
                            )}
                            {client.email && (
                              <Button size="sm" variant="outline">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Napisz
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleEditClient(client)}>
                                  <Edit2 className="mr-2 h-4 w-4" />
                                  Edytuj
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <ArrowUpDown className="mr-2 h-4 w-4" />
                                  Przenieś
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteClient(client.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Usuń
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="sessions" className="space-y-4">
                  <div className="space-y-2">
                    {selectedTherapistSessions.map((session) => (
                      <Card key={session.id} className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">
                              {session.client?.first_name} {session.client?.last_name}
                            </h4>
                            <p className="text-sm text-gray-600">{session.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <span>{formatDate(session.start_time)}</span>
                              {session.duration_minutes && (
                                <span>{session.duration_minutes} min</span>
                              )}
                              {session.price && (
                                <span className="font-semibold">{formatCurrency(session.price)}</span>
                              )}
                            </div>
                          </div>
                          <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                            {session.status === 'completed' ? 'Zakończona' : 'Zaplanowana'}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="transactions" className="space-y-4">
                  <div className="space-y-2">
                    {selectedTherapistTransactions.map((transaction) => (
                      <Card key={transaction.id} className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">
                              {transaction.client?.first_name} {transaction.client?.last_name}
                            </h4>
                            <p className="text-sm text-gray-600">{transaction.description}</p>
                            <div className="text-sm text-gray-500 mt-1">
                              {transaction.payment_date && formatDate(transaction.payment_date)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg">
                              {formatCurrency(transaction.amount)}
                            </div>
                            <div className="text-sm text-green-600">
                              Prowizja: {formatCurrency(transaction.commission_amount)}
                            </div>
                            <Badge variant={transaction.payment_status === 'completed' ? 'default' : 'secondary'}>
                              {transaction.payment_status === 'completed' ? 'Opłacone' : 'Oczekuje'}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 