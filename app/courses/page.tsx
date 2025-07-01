'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Eye, Edit, MoreHorizontal, Users, BookOpen, TrendingUp, DollarSign } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { 
  Course, 
  CourseStats, 
  CourseEnrollment,
  getAllCourses, 
  getCourseStats,
  getCourseEnrollments,
  updateCourse,
  deleteCourse,
  enrollClientInCourse
} from '@/lib/supabase'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [stats, setStats] = useState<CourseStats | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [coursesData, statsData] = await Promise.all([
        getAllCourses(),
        getCourseStats()
      ])
      setCourses(coursesData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Błąd",
        description: "Nie udało się załadować danych o kursach",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && course.is_active) ||
                         (statusFilter === 'inactive' && !course.is_active)
    return matchesSearch && matchesStatus
  })

  const handleToggleStatus = async (courseId: string, isActive: boolean) => {
    try {
      const updated = await updateCourse(courseId, { is_active: !isActive })
      if (updated) {
        setCourses(prev => prev.map(c => c.id === courseId ? updated : c))
        toast({
          title: "Sukces",
          description: `Status kursu został ${!isActive ? 'aktywowany' : 'dezaktywowany'}`
        })
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zmienić statusu kursu",
        variant: "destructive"
      })
    }
  }

  const handleViewCourse = async (course: Course) => {
    setSelectedCourse(course)
    try {
      const enrollmentsData = await getCourseEnrollments(course.id)
      setEnrollments(enrollmentsData)
    } catch (error) {
      console.error('Error loading enrollments:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(amount)
  }

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "default" : "secondary"}>
        {isActive ? 'Aktywny' : 'Nieaktywny'}
      </Badge>
    )
  }

  const getLevelBadge = (level?: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800', 
      advanced: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800'
    }
    
    if (!level) return null
    
    return (
      <Badge className={colors[level as keyof typeof colors] || ''}>
        {level === 'beginner' && 'Początkujący'}
        {level === 'intermediate' && 'Średniozaawansowany'}
        {level === 'advanced' && 'Zaawansowany'} 
        {level === 'expert' && 'Ekspert'}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex-1 w-full max-w-full overflow-x-hidden">
        <div className="space-y-6 p-4 md:p-6 lg:p-8">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-0 pb-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mt-2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full max-w-full overflow-x-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Szkolenia</h1>
            <p className="text-muted-foreground text-sm md:text-base dark:text-gray-400">
              Zarządzaj kursami hipnoterapii i zapisami uczestników
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Dodaj nowy kurs</span>
            <span className="sm:hidden">Dodaj kurs</span>
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Liczba kursów</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_courses}</div>
              <p className="text-xs text-muted-foreground">
                {stats.active_courses} aktywnych
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Łączna sprzedaż</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.total_revenue)}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total_enrollments} zapisów
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Średnia cena</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.average_price)}</div>
              <p className="text-xs text-muted-foreground">
                za kurs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top kurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold truncate">
                {stats.top_courses[0]?.title || 'Brak danych'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.top_courses[0]?.enrollments || 0} zapisów
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sales Chart */}
      {stats && stats.monthly_sales.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sprzedaż w ostatnich miesiącach</CardTitle>
            <CardDescription>Przychody z zapisów na kursy</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthly_sales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Przychód']}
                  labelFormatter={(label) => `Miesiąc: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj kursów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtruj status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie</SelectItem>
              <SelectItem value="active">Aktywne</SelectItem>
              <SelectItem value="inactive">Nieaktywne</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Courses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista kursów</CardTitle>
            <CardDescription>
              {filteredCourses.length} z {courses.length} kursów
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nazwa kursu</TableHead>
                <TableHead>Cena</TableHead>
                <TableHead>Data utworzenia</TableHead>
                <TableHead>Liczba zapisanych</TableHead>
                <TableHead>Poziom</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                                      <TableCell className="min-w-[200px]">
                      <div>
                        <div className="font-medium">{course.title}</div>
                        {course.short_description && (
                          <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                            {course.short_description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                                      <TableCell className="min-w-[100px]">{formatCurrency(course.price)}</TableCell>
                    <TableCell className="min-w-[120px]">
                      {format(new Date(course.created_at), 'dd MMM yyyy', { locale: pl })}
                    </TableCell>
                    <TableCell className="min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {course.enrollments?.length || 0}
                        {course.max_participants && (
                          <span className="text-muted-foreground">
                            / {course.max_participants}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[120px]">{getLevelBadge(course.level)}</TableCell>
                    <TableCell className="min-w-[100px]">{getStatusBadge(course.is_active)}</TableCell>
                    <TableCell className="text-right min-w-[140px]">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewCourse(course)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(course.id, course.is_active)}
                      >
                        {course.is_active ? 'Dezaktywuj' : 'Aktywuj'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Course Details Dialog */}
        <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
          <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedCourse && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">{selectedCourse.title}</DialogTitle>
                  <DialogDescription className="text-sm">
                    Szczegóły kursu i lista uczestników
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-6">
                  {/* Course Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informacje podstawowe</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Cena:</strong> {formatCurrency(selectedCourse.price)}</div>
                      <div><strong>Poziom:</strong> {selectedCourse.level}</div>
                      <div><strong>Kategoria:</strong> {selectedCourse.category}</div>
                      <div><strong>Czas trwania:</strong> {selectedCourse.duration_hours}h</div>
                      {selectedCourse.max_participants && (
                        <div><strong>Max uczestników:</strong> {selectedCourse.max_participants}</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Daty</h4>
                    <div className="space-y-2 text-sm">
                      {selectedCourse.start_date && (
                        <div><strong>Rozpoczęcie:</strong> {format(new Date(selectedCourse.start_date), 'dd MMM yyyy', { locale: pl })}</div>
                      )}
                      {selectedCourse.end_date && (
                        <div><strong>Zakończenie:</strong> {format(new Date(selectedCourse.end_date), 'dd MMM yyyy', { locale: pl })}</div>
                      )}
                      <div><strong>Utworzony:</strong> {format(new Date(selectedCourse.created_at), 'dd MMM yyyy', { locale: pl })}</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedCourse.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Opis</h4>
                    <p className="text-sm text-muted-foreground">{selectedCourse.description}</p>
                  </div>
                )}

                  {/* Enrollments */}
                  <div>
                    <h4 className="font-semibold mb-4">Uczestnicy ({enrollments.length})</h4>
                    {enrollments.length > 0 ? (
                      <div className="overflow-x-auto">
                        <div className="min-w-[600px]">
                          <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Uczestnik</TableHead>
                          <TableHead>Data zapisu</TableHead>
                          <TableHead>Status płatności</TableHead>
                          <TableHead>Kwota</TableHead>
                          <TableHead>Postęp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {enrollments.map((enrollment) => (
                          <TableRow key={enrollment.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {enrollment.client?.first_name} {enrollment.client?.last_name}
                                </div>
                                {enrollment.client?.email && (
                                  <div className="text-sm text-muted-foreground">
                                    {enrollment.client.email}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(new Date(enrollment.enrolled_at), 'dd MMM yyyy', { locale: pl })}
                            </TableCell>
                            <TableCell>
                              <Badge variant={enrollment.payment_status === 'paid' ? 'default' : 'secondary'}>
                                {enrollment.payment_status === 'paid' && 'Opłacone'}
                                {enrollment.payment_status === 'pending' && 'Oczekuje'}
                                {enrollment.payment_status === 'partial' && 'Częściowe'}
                                {enrollment.payment_status === 'overdue' && 'Przeterminowane'}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatCurrency(enrollment.paid_amount)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${enrollment.progress_percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm">{enrollment.progress_percentage}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                                                  </TableBody>
                            </Table>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Brak uczestników zapisanych na ten kurs.</p>
                      )}
                    </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
} 