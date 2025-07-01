"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Plus,
  Edit2,
  Clock,
  DollarSign,
  Calendar,
  Trash2,
  UserCheck,
  UserX,
  ChevronRight,
  Home
} from "lucide-react"
import { getAllUsers, createUser, updateUser, deleteUser, getUserStats, type User, type WorkStats } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [userStats, setUserStats] = useState<Record<string, WorkStats>>({})
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'therapist' as User['role'],
    phone: '',
    hire_date: new Date().toISOString().split('T')[0],
    hourly_rate: 0,
    is_active: true
  })

  // Load users and their statistics
  const loadUsers = async () => {
    setLoading(true)
    try {
      const usersData = await getAllUsers()
      setUsers(usersData)

      // Load statistics for each user
      const statsPromises = usersData.map(async (user) => {
        const stats = await getUserStats(user.id)
        return { userId: user.id, stats }
      })

      const statsResults = await Promise.all(statsPromises)
      const statsMap: Record<string, WorkStats> = {}
      
      statsResults.forEach(({ userId, stats }) => {
        if (stats) {
          statsMap[userId] = stats
        }
      })

      setUserStats(statsMap)
    } catch {
      toast({
        title: "Błąd",
        description: "Nie udało się załadować danych użytkowników",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset form
  const resetForm = () => {
    setFormData({
      email: '',
      first_name: '',
      last_name: '',
      role: 'therapist',
      phone: '',
      hire_date: new Date().toISOString().split('T')[0],
      hourly_rate: 0,
      is_active: true
    })
    setEditingUser(null)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingUser) {
        // Update existing user
        const updated = await updateUser(editingUser.id, formData)
        if (updated) {
          toast({
            title: "Sukces",
            description: "Użytkownik został zaktualizowany"
          })
          loadUsers()
        }
      } else {
        // Create new user
        const created = await createUser(formData)
        if (created) {
          toast({
            title: "Sukces",
            description: "Nowy użytkownik został utworzony"
          })
          loadUsers()
        }
      }
      
      setIsDialogOpen(false)
      resetForm()
    } catch {
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać użytkownika",
        variant: "destructive"
      })
    }
  }

  // Handle edit
  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      phone: user.phone || '',
      hire_date: user.hire_date.split('T')[0],
      hourly_rate: user.hourly_rate,
      is_active: user.is_active
    })
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async (userId: string) => {
    if (confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
      const success = await deleteUser(userId)
      if (success) {
        toast({
          title: "Sukces",
          description: "Użytkownik został usunięty"
        })
        loadUsers()
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się usunąć użytkownika",
          variant: "destructive"
        })
      }
    }
  }

  // Calculate team statistics
  const teamStats = users.reduce((acc, user) => {
    const stats = userStats[user.id]
    if (stats) {
      acc.totalHours += stats.total_hours_this_month
      acc.totalEarnings += stats.total_earnings_this_month
      acc.totalSessions += stats.total_sessions_count
    }
    return acc
  }, { totalHours: 0, totalEarnings: 0, totalSessions: 0 })

  const getRoleBadgeVariant = (role: User['role']) => {
    switch (role) {
      case 'boss': return 'default'
      case 'manager': return 'secondary'
      case 'therapist': return 'outline'
      case 'junior_therapist': return 'secondary'
      default: return 'outline'
    }
  }

  const getRoleDisplayName = (role: User['role']) => {
    switch (role) {
      case 'boss': return 'Właściciel'
      case 'manager': return 'Kierownik'
      case 'therapist': return 'Terapeuta'
      case 'junior_therapist': return 'Junior Terapeuta'
      default: return role
    }
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
              <BreadcrumbPage className="font-semibold text-gray-900 dark:text-gray-100">Zarządzanie Użytkownikami</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6 space-y-6">
        {/* Page Title and Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Zarządzanie Użytkownikami</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Zarządzaj zespołem, monitoruj godziny pracy i wyniki</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Dodaj Użytkownika
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? 'Edytuj Użytkownika' : 'Dodaj Nowego Użytkownika'}
                </DialogTitle>
                <DialogDescription>
                  Wypełnij poniższe pola aby {editingUser ? 'zaktualizować' : 'utworzyć'} użytkownika.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">Imię</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Nazwisko</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Rola</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value as User['role']})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boss">Właściciel</SelectItem>
                        <SelectItem value="manager">Kierownik</SelectItem>
                        <SelectItem value="therapist">Terapeuta</SelectItem>
                        <SelectItem value="junior_therapist">Junior Terapeuta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="hourly_rate">Stawka godzinowa (zł)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      value={formData.hourly_rate}
                      onChange={(e) => setFormData({...formData, hourly_rate: Number(e.target.value)})}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="hire_date">Data zatrudnienia</Label>
                  <Input
                    id="hire_date"
                    type="date"
                    value={formData.hire_date}
                    onChange={(e) => setFormData({...formData, hire_date: e.target.value})}
                    required
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Anuluj
                  </Button>
                  <Button type="submit">
                    {editingUser ? 'Zaktualizuj' : 'Utwórz'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Team Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Wszyscy Pracownicy</CardTitle>
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{users.length}</div>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {users.filter(u => u.is_active).length} aktywnych
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">Godziny Ten Miesiąc</CardTitle>
              <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{teamStats.totalHours.toFixed(1)}h</div>
              <p className="text-xs text-green-700 dark:text-green-300">
                Średnio {(teamStats.totalHours / Math.max(users.length, 1)).toFixed(1)}h na osobę
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300">Zarobki Ten Miesiąc</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {teamStats.totalEarnings.toLocaleString('pl-PL')} zł
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                Łączne wynagrodzenia zespołu
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-300">Wszystkie Sesje</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{teamStats.totalSessions}</div>
              <p className="text-xs text-orange-700 dark:text-orange-300">
                Przeprowadzone sesje terapeutyczne
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Lista Pracowników
            </CardTitle>
            <CardDescription>
              Zarządzaj pracownikami, monitoruj ich wyniki i godziny pracy
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Ładowanie danych...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pracownik</TableHead>
                    <TableHead>Rola</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Godziny Ten Miesiąc</TableHead>
                    <TableHead>Stawka/h</TableHead>
                    <TableHead>Zarobki Ten Miesiąc</TableHead>
                    <TableHead>Średni czas sesji</TableHead>
                    <TableHead className="text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const stats = userStats[user.id]
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
                              <AvatarFallback>{user.first_name[0]}{user.last_name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.first_name} {user.last_name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {getRoleDisplayName(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {user.is_active ? (
                              <>
                                <UserCheck className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-700">Aktywny</span>
                              </>
                            ) : (
                              <>
                                <UserX className="h-4 w-4 text-red-500 mr-1" />
                                <span className="text-red-700">Nieaktywny</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {stats ? `${stats.total_hours_this_month.toFixed(1)}h` : '-'}
                          </div>
                          {stats && (
                            <div className="text-sm text-gray-500">
                              {stats.total_sessions_count} sesji
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{user.hourly_rate} zł</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {stats ? `${stats.total_earnings_this_month.toLocaleString('pl-PL')} zł` : '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {stats ? `${stats.average_session_duration.toFixed(0)} min` : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
            
            {!loading && users.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Brak użytkowników</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Rozpocznij od dodania pierwszego pracownika do systemu.</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Dodaj Pierwszego Użytkownika
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}