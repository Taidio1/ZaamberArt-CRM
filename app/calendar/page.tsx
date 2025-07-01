"use client"

import { useState, useEffect, useCallback } from "react"
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import {
  Calendar as CalendarIcon,
  Filter,
  Plus,
  Settings,
  Users,
  Eye,
  Edit2,
  Trash2,
  Clock,
  MapPin,
  User as UserIcon,
  Phone,
  MessageCircle,
  ChevronRight,
  Home,
  ChevronLeft,
  ChevronDown,
} from "lucide-react"

import {
  getCalendarEvents,
  getEventTypes,
  getAllUsers,
  getUserCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  getEventParticipants,
  addEventParticipant,
  getAllClients,
  type CalendarEvent,
  type EventType,
  type User,
  type Client,
} from "@/lib/supabase"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

// Setup localizer for react-big-calendar
moment.locale('pl')
const localizer = momentLocalizer(moment)

// Custom event component
const EventComponent = ({ event }: { event: any }) => {
  const eventType = event.event_type
  const backgroundColor = event.color_override || eventType?.color || '#6b7280'
  
  return (
    <div
      className="text-xs p-1 rounded"
      style={{ backgroundColor, color: 'white' }}
    >
      <div className="font-semibold truncate">{event.title}</div>
      {event.client && (
        <div className="truncate opacity-90">
          {event.client.first_name} {event.client.last_name}
        </div>
      )}
      {event.location && (
        <div className="truncate opacity-75">📍 {event.location}</div>
      )}
    </div>
  )
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>(Views.MONTH)
  const [date, setDate] = useState(new Date())
  const [selectedUser, setSelectedUser] = useState<string>("all")
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const { toast } = useToast()

  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_type_id: '',
    start_time: '',
    end_time: '',
    all_day: false,
    location: '',
    assigned_to: '',
    client_id: '',
    is_private: false,
    reminder_minutes: 30,
  })

  const loadData = async () => {
    setLoading(true)
    try {
      const [eventTypesData, usersData, clientsData] = await Promise.all([
        getEventTypes(),
        getAllUsers(),
        getAllClients(),
      ])

      setEventTypes(eventTypesData)
      setUsers(usersData)
      setClients(clientsData)

      // Initialize selectedEventTypes with all event types
      if (selectedEventTypes.length === 0 && eventTypesData.length > 0) {
        setSelectedEventTypes(eventTypesData.map(et => et.id))
      }
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

  const loadEvents = useCallback(async () => {
    try {
      // Calculate date range based on current view
      const startDate = moment(date).startOf(view === Views.MONTH ? 'month' : view === Views.WEEK ? 'week' : 'day').toISOString()
      const endDate = moment(date).endOf(view === Views.MONTH ? 'month' : view === Views.WEEK ? 'week' : 'day').toISOString()

      let eventsData: CalendarEvent[]
      
      if (selectedUser === "all") {
        eventsData = await getCalendarEvents(startDate, endDate, undefined, selectedEventTypes)
      } else {
        eventsData = await getUserCalendarEvents(selectedUser, startDate, endDate)
      }

      // Filter by selected event types if not viewing all users
      if (selectedUser !== "all" && selectedEventTypes.length > 0) {
        eventsData = eventsData.filter(event => 
          !event.event_type_id || selectedEventTypes.includes(event.event_type_id)
        )
      }

      setEvents(eventsData)
    } catch (error) {
      console.error('Error loading events:', error)
      toast({
        title: "Błąd",
        description: "Nie udało się załadować wydarzeń",
        variant: "destructive"
      })
    }
  }, [date, view, selectedUser, selectedEventTypes, toast])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (eventTypes.length > 0) {
      loadEvents()
    }
  }, [loadEvents, eventTypes.length])

  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    setEditingEvent(null)
    setEventForm({
      title: '',
      description: '',
      event_type_id: eventTypes[0]?.id || '',
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      all_day: false,
      location: '',
      assigned_to: '',
      client_id: '',
      is_private: false,
      reminder_minutes: 30,
    })
    setIsEventDialogOpen(true)
  }, [eventTypes])

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsDetailsDialogOpen(true)
  }, [])

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event)
    setEventForm({
      title: event.title,
      description: event.description || '',
      event_type_id: event.event_type_id || '',
      start_time: event.start_time,
      end_time: event.end_time,
      all_day: event.all_day,
      location: event.location || '',
      assigned_to: event.assigned_to || '',
      client_id: event.client_id || '',
      is_private: event.is_private,
      reminder_minutes: event.reminder_minutes,
    })
    setIsEventDialogOpen(true)
    setIsDetailsDialogOpen(false)
  }

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingEvent) {
        const updated = await updateCalendarEvent(editingEvent.id, {
          ...eventForm,
          created_by: editingEvent.created_by
        })
        if (updated) {
          toast({
            title: "Sukces",
            description: "Wydarzenie zostało zaktualizowane"
          })
          loadEvents()
        }
      } else {
        const created = await createCalendarEvent({
          ...eventForm,
          created_by: 'admin-user-id', // W prawdziwej app z auth context
          status: 'scheduled',
          is_recurring: false,
        })
        if (created) {
          toast({
            title: "Sukces",
            description: "Nowe wydarzenie zostało utworzone"
          })
          loadEvents()
        }
      }
      
      setIsEventDialogOpen(false)
      resetEventForm()
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać wydarzenia",
        variant: "destructive"
      })
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Czy na pewno chcesz usunąć to wydarzenie?')) {
      const success = await deleteCalendarEvent(eventId)
      if (success) {
        toast({
          title: "Sukces",
          description: "Wydarzenie zostało usunięte"
        })
        loadEvents()
        setIsDetailsDialogOpen(false)
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się usunąć wydarzenia",
          variant: "destructive"
        })
      }
    }
  }

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      event_type_id: '',
      start_time: '',
      end_time: '',
      all_day: false,
      location: '',
      assigned_to: '',
      client_id: '',
      is_private: false,
      reminder_minutes: 30,
    })
    setEditingEvent(null)
  }

  const toggleEventType = (eventTypeId: string) => {
    if (selectedEventTypes.includes(eventTypeId)) {
      setSelectedEventTypes(prev => prev.filter(id => id !== eventTypeId))
    } else {
      setSelectedEventTypes(prev => [...prev, eventTypeId])
    }
  }

  const handleNavigate = (newDate: Date, view: View, action: string) => {
    setDate(newDate)
  }

  const handleViewChange = (newView: View) => {
    setView(newView)
  }

  // Transform events for react-big-calendar
  const calendarEvents = events.map(event => ({
    ...event,
    start: new Date(event.start_time),
    end: new Date(event.end_time),
    resource: event,
  }))

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: pl })
  }

  const getEventTypeById = (id: string) => {
    return eventTypes.find(et => et.id === id)
  }

  const getUserById = (id: string) => {
    return users.find(u => u.id === id)
  }

  const getClientById = (id: string) => {
    return clients.find(c => c.id === id)
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
              <BreadcrumbPage className="font-semibold text-gray-900 dark:text-gray-100">Kalendarz</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6 space-y-6">
        {/* Header and Controls */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <CalendarIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              Kalendarz
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Zarządzaj wydarzeniami i sesjami terapeutycznymi</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setDate(new Date())}>
              Dziś
            </Button>
            <Button variant="outline" onClick={() => {
              setSelectedEventTypes(eventTypes.map(et => et.id))
              setSelectedUser("all")
            }}>
              Reset
            </Button>
            <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={resetEventForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Dodaj Wydarzenie
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Wybierz użytkownika</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszyscy użytkownicy</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.first_name} {user.last_name} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Event Types Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Typy wydarzeń</Label>
                <div className="flex flex-wrap gap-2">
                  {eventTypes.map((eventType) => (
                    <div key={eventType.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={eventType.id}
                        checked={selectedEventTypes.includes(eventType.id)}
                        onCheckedChange={() => toggleEventType(eventType.id)}
                      />
                      <Label
                        htmlFor={eventType.id}
                        className="text-sm flex items-center gap-2 cursor-pointer"
                      >
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: eventType.color }}
                        />
                        {eventType.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* View Controls */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Widok</Label>
                <div className="flex gap-2">
                  <Button
                    variant={view === Views.DAY ? "default" : "outline"}
                    size="sm"
                    onClick={() => setView(Views.DAY)}
                  >
                    Dzień
                  </Button>
                  <Button
                    variant={view === Views.WEEK ? "default" : "outline"}
                    size="sm"
                    onClick={() => setView(Views.WEEK)}
                  >
                    Tydzień
                  </Button>
                  <Button
                    variant={view === Views.MONTH ? "default" : "outline"}
                    size="sm"
                    onClick={() => setView(Views.MONTH)}
                  >
                    Miesiąc
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Ładowanie kalendarza...</p>
              </div>
            ) : (
              <div style={{ height: view === Views.MONTH ? '600px' : '500px' }}>
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  view={view}
                  date={date}
                  onNavigate={handleNavigate}
                  onView={handleViewChange}
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  selectable
                  popup
                  components={{
                    event: EventComponent,
                  }}
                  messages={{
                    allDay: 'Cały dzień',
                    previous: 'Poprzedni',
                    next: 'Następny',
                    today: 'Dziś',
                    month: 'Miesiąc',
                    week: 'Tydzień',
                    day: 'Dzień',
                    agenda: 'Agenda',
                    date: 'Data',
                    time: 'Czas',
                    event: 'Wydarzenie',
                    noEventsInRange: 'Brak wydarzeń w tym okresie',
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Event Dialog */}
        <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Edytuj Wydarzenie' : 'Dodaj Nowe Wydarzenie'}
              </DialogTitle>
              <DialogDescription>
                Wypełnij poniższe pola aby {editingEvent ? 'zaktualizować' : 'utworzyć'} wydarzenie.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmitEvent} className="space-y-4">
              <div>
                <Label htmlFor="title">Tytuł</Label>
                <Input
                  id="title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Opis</Label>
                <Textarea
                  id="description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event_type">Typ wydarzenia</Label>
                  <Select 
                    value={eventForm.event_type_id} 
                    onValueChange={(value) => setEventForm({...eventForm, event_type_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz typ" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((eventType) => (
                        <SelectItem key={eventType.id} value={eventType.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: eventType.color }}
                            />
                            {eventType.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="assigned_to">Przypisz do</Label>
                  <Select 
                    value={eventForm.assigned_to} 
                    onValueChange={(value) => setEventForm({...eventForm, assigned_to: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz użytkownika" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Brak przypisania</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.first_name} {user.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_time">Data i czas rozpoczęcia</Label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    value={eventForm.start_time ? moment(eventForm.start_time).format('YYYY-MM-DDTHH:mm') : ''}
                    onChange={(e) => setEventForm({...eventForm, start_time: new Date(e.target.value).toISOString()})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="end_time">Data i czas zakończenia</Label>
                  <Input
                    id="end_time"
                    type="datetime-local"
                    value={eventForm.end_time ? moment(eventForm.end_time).format('YYYY-MM-DDTHH:mm') : ''}
                    onChange={(e) => setEventForm({...eventForm, end_time: new Date(e.target.value).toISOString()})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Lokalizacja</Label>
                  <Input
                    id="location"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="client">Klient (opcjonalnie)</Label>
                  <Select 
                    value={eventForm.client_id} 
                    onValueChange={(value) => setEventForm({...eventForm, client_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz klienta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Brak klienta</SelectItem>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.first_name} {client.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="all_day"
                    checked={eventForm.all_day}
                    onCheckedChange={(checked) => setEventForm({...eventForm, all_day: checked})}
                  />
                  <Label htmlFor="all_day">Cały dzień</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_private"
                    checked={eventForm.is_private}
                    onCheckedChange={(checked) => setEventForm({...eventForm, is_private: checked})}
                  />
                  <Label htmlFor="is_private">Prywatne</Label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                  Anuluj
                </Button>
                <Button type="submit">
                  {editingEvent ? 'Zaktualizuj' : 'Utwórz'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Event Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Szczegóły Wydarzenia
              </DialogTitle>
            </DialogHeader>

            {selectedEvent && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {selectedEvent.event_type && (
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: selectedEvent.event_type.color }}
                    />
                  )}
                  <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                  <Badge variant={selectedEvent.status === 'completed' ? 'default' : 'secondary'}>
                    {selectedEvent.status === 'completed' ? 'Zakończone' : 'Zaplanowane'}
                  </Badge>
                </div>

                {selectedEvent.description && (
                  <p className="text-gray-600">{selectedEvent.description}</p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{formatDateTime(selectedEvent.start_time)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{formatDateTime(selectedEvent.end_time)}</span>
                  </div>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}

                {selectedEvent.assignee && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>
                      {selectedEvent.assignee.first_name} {selectedEvent.assignee.last_name}
                    </span>
                  </div>
                )}

                {selectedEvent.client && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>
                      {selectedEvent.client.first_name} {selectedEvent.client.last_name}
                    </span>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => handleEditEvent(selectedEvent)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edytuj
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Usuń
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 