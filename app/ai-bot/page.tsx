"use client"

import { useState } from "react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Bot,
  MessageCircle,
  Filter,
  Search,
  Pause,
  Eye,
  UserPlus,
  ArrowRight,
  ChevronRight,
  Home,
  Facebook,
  Instagram,
  MessageSquare,
  Zap,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal
} from "lucide-react"

// Mock data types
interface Conversation {
  id: string
  client_name: string
  client_email: string
  platform: 'Facebook' | 'Instagram' | 'Inne'
  last_message: string
  last_activity: string
  status: 'Aktywna' | 'Zakończona' | 'Przejęta'
  handled_by: 'Bot' | 'Człowiek'
  handler_name?: string
  created_at: string
  messages_count: number
}

interface BotStats {
  conversations_today: number
  avg_response_time: string
  interrupted_conversations: number
  taken_over_conversations: number
  successful_conversations: number
}

// Mock data
const mockStats: BotStats = {
  conversations_today: 17,
  avg_response_time: "3.2s",
  interrupted_conversations: 5,
  taken_over_conversations: 3,
  successful_conversations: 9
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    client_name: "Anna Kowalska",
    client_email: "anna.kowalska@email.com",
    platform: "Facebook",
    last_message: "Czy mogę umówić się na sesję w przyszłym tygodniu?",
    last_activity: "2 minuty temu",
    status: "Aktywna",
    handled_by: "Bot",
    created_at: "2024-01-15T10:30:00Z",
    messages_count: 8
  },
  {
    id: "2",
    client_name: "Piotr Nowak",
    client_email: "piotr.nowak@email.com",
    platform: "Instagram",
    last_message: "Dziękuję za informacje, skontaktuję się jutro.",
    last_activity: "15 minut temu",
    status: "Przejęta",
    handled_by: "Człowiek",
    handler_name: "Dr. Maria Wiśniewska",
    created_at: "2024-01-15T09:45:00Z",
    messages_count: 15
  },
  {
    id: "3",
    client_name: "Katarzyna Zielińska",
    client_email: "k.zielinska@email.com",
    platform: "Facebook",
    last_message: "To nie jest dla mnie, dziękuję.",
    last_activity: "1 godzinę temu",
    status: "Zakończona",
    handled_by: "Bot",
    created_at: "2024-01-15T08:20:00Z",
    messages_count: 5
  },
  {
    id: "4",
    client_name: "Michał Krawczyk",
    client_email: "michal.k@email.com",
    platform: "Instagram",
    last_message: "Ile kosztuje pierwsza konsultacja?",
    last_activity: "5 minut temu",
    status: "Aktywna",
    handled_by: "Bot",
    created_at: "2024-01-15T11:15:00Z",
    messages_count: 3
  },
  {
    id: "5",
    client_name: "Joanna Białas",
    client_email: "j.bialas@email.com",
    platform: "Inne",
    last_message: "Proszę o kontakt telefoniczny.",
    last_activity: "30 minut temu",
    status: "Przejęta",
    handled_by: "Człowiek",
    handler_name: "Asystent Jan",
    created_at: "2024-01-15T10:00:00Z",
    messages_count: 12
  }
]

const mockMessages = [
  { id: "1", sender: "bot", content: "Witaj! Jestem asystentem AI Centrum HipnoTerapii. Jak mogę Ci pomóc?", timestamp: "10:30" },
  { id: "2", sender: "user", content: "Chciałbym dowiedzieć się więcej o hipnoterapii.", timestamp: "10:31" },
  { id: "3", sender: "bot", content: "Oczywiście! Hipnoterapia to bezpieczna i skuteczna metoda terapeutyczna. Czy masz jakieś konkretne pytania?", timestamp: "10:31" },
  { id: "4", sender: "user", content: "Czy mogę umówić się na sesję w przyszłym tygodniu?", timestamp: "10:35" }
]

export default function BotAIPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [isConversationOpen, setIsConversationOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPlatform, setFilterPlatform] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [notes, setNotes] = useState("")

  // Mock user role - in real app this would come from auth context
  const userRole = "boss" // boss, assistant, employee, therapist, client

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesStatus = filterStatus === "all" || conv.status === filterStatus
    const matchesPlatform = filterPlatform === "all" || conv.platform === filterPlatform
    const matchesSearch = searchQuery === "" || 
      conv.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.client_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.last_message.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesPlatform && matchesSearch
  })

  const getStatusBadgeVariant = (status: Conversation['status']) => {
    switch (status) {
      case 'Aktywna': return 'default'
      case 'Przejęta': return 'secondary'
      case 'Zakończona': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: Conversation['status']) => {
    switch (status) {
      case 'Aktywna': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'Przejęta': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'Zakończona': return <XCircle className="h-4 w-4 text-gray-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getPlatformIcon = (platform: Conversation['platform']) => {
    switch (platform) {
      case 'Facebook': return <Facebook className="h-4 w-4 text-blue-600" />
      case 'Instagram': return <Instagram className="h-4 w-4 text-pink-600" />
      default: return <MessageSquare className="h-4 w-4 text-gray-600" />
    }
  }

  const handleTakeOver = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, status: 'Przejęta', handled_by: 'Człowiek', handler_name: 'Ty' }
        : conv
    ))
  }

  const handleInterrupt = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, status: 'Zakończona' }
        : conv
    ))
  }

  const canInterrupt = userRole === 'boss' || userRole === 'assistant'
  const canTakeOver = userRole === 'boss' || userRole === 'assistant' || userRole === 'employee'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 md:px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <ChevronRight className="h-4 w-4 text-gray-500" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                <span className="hidden md:inline">Bot AI / Wiadomości</span>
                <span className="md:hidden">Bot AI</span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-3 md:p-6 space-y-4 md:space-y-6">
        {/* Page Title */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 md:gap-3">
              <Bot className="h-6 w-6 md:h-8 md:w-8 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Bot AI / Wiadomości</span>
              <span className="sm:hidden">Bot AI</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">Zarządzaj konwersacjami z klientami i monitoruj aktywność bota</p>
          </div>
        </div>

        {/* Bot Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Konwersacje Dzisiaj</CardTitle>
              <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{mockStats.conversations_today}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">Średni Czas Odpowiedzi</CardTitle>
              <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{mockStats.avg_response_time}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800 dark:text-red-300">Przerwane Rozmowy</CardTitle>
              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900 dark:text-red-100">{mockStats.interrupted_conversations}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Przejęte Rozmowy</CardTitle>
              <Users className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{mockStats.taken_over_conversations}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300">Zakończone Sukcesem</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{mockStats.successful_conversations}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Search className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <Input
                  placeholder="Szukaj po nazwie, emailu lub treści..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 sm:w-48 lg:w-64"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-32 lg:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Wszystkie</SelectItem>
                      <SelectItem value="Aktywna">Aktywna</SelectItem>
                      <SelectItem value="Przejęta">Przejęta</SelectItem>
                      <SelectItem value="Zakończona">Zakończona</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                  <SelectTrigger className="w-full sm:w-32 lg:w-40">
                    <SelectValue placeholder="Platforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Inne">Inne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MessageCircle className="h-5 w-5 mr-2" />
              Lista Konwersacji ({filteredConversations.length})
            </CardTitle>
            <CardDescription>
              Wszystkie aktywne i zakończone konwersacje z klientami
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[140px]">Klient</TableHead>
                  <TableHead className="min-w-[70px]">Platforma</TableHead>
                  <TableHead className="min-w-[120px]">Wiadomość</TableHead>
                  <TableHead className="min-w-[90px]">Czas</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="min-w-[80px]">Prowadzi</TableHead>
                  <TableHead className="text-right min-w-[120px]">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConversations.map((conversation) => (
                  <TableRow key={conversation.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2 lg:space-x-3">
                        <Avatar className="h-6 w-6 lg:h-8 lg:w-8 flex-shrink-0">
                          <AvatarImage src={`https://avatar.vercel.sh/${conversation.client_email}`} />
                          <AvatarFallback className="text-xs">{conversation.client_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{conversation.client_name}</div>
                          <div className="text-xs lg:text-sm text-gray-500 truncate">{conversation.client_email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 lg:gap-2">
                        {getPlatformIcon(conversation.platform)}
                        <span className="hidden sm:inline">{conversation.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[100px] lg:max-w-[150px] truncate" title={conversation.last_message}>
                        {conversation.last_message}
                      </div>
                      <div className="text-xs text-gray-500">{conversation.messages_count}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs lg:text-sm truncate" title={conversation.last_activity}>
                        {conversation.last_activity.replace(' temu', '')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(conversation.status)}
                        <span className="hidden sm:inline">
                          <Badge variant={getStatusBadgeVariant(conversation.status)} className="text-xs">
                            {conversation.status}
                          </Badge>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {conversation.handled_by === 'Bot' ? (
                          <Bot className="h-3 w-3 lg:h-4 lg:w-4 text-blue-500" />
                        ) : (
                          <Users className="h-3 w-3 lg:h-4 lg:w-4 text-green-500" />
                        )}
                        <div className="hidden sm:block">
                          <div className="text-xs lg:text-sm font-medium">{conversation.handled_by}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Otwórz menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <Dialog open={isConversationOpen && selectedConversation?.id === conversation.id} 
                                  onOpenChange={(open) => {
                                    setIsConversationOpen(open)
                                    if (!open) setSelectedConversation(null)
                                  }}>
                            <DialogTrigger asChild>
                              <DropdownMenuItem 
                                onSelect={(e) => {
                                  e.preventDefault()
                                  setSelectedConversation(conversation)
                                  setIsConversationOpen(true)
                                }}
                                className="cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Otwórz konwersację
                              </DropdownMenuItem>
                            </DialogTrigger>
                          </Dialog>
                          
                          {canTakeOver && conversation.status === 'Aktywna' && conversation.handled_by === 'Bot' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleTakeOver(conversation.id)}
                                className="cursor-pointer"
                              >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Przejmij konwersację
                              </DropdownMenuItem>
                            </>
                          )}
                          
                          {canInterrupt && conversation.status === 'Aktywna' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleInterrupt(conversation.id)}
                                className="cursor-pointer text-red-600"
                              >
                                <Pause className="mr-2 h-4 w-4" />
                                Przerwij konwersację
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Conversation Dialog */}
        <Dialog open={isConversationOpen} onOpenChange={(open) => {
          setIsConversationOpen(open)
          if (!open) {
            setSelectedConversation(null)
            setNotes("")
          }
        }}>
          <DialogContent className="max-w-[95vw] lg:max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="h-5 w-5" />
                <span className="truncate">Konwersacja z {selectedConversation?.client_name}</span>
              </DialogTitle>
              <DialogDescription>
                {selectedConversation?.platform} • {selectedConversation?.messages_count} wiadomości
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4">
              {/* Chat Messages */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto border rounded-lg p-3 lg:p-4 bg-gray-50 space-y-3 lg:space-y-4">
                  {mockMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[280px] sm:max-w-xs lg:max-w-md px-3 lg:px-4 py-2 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border shadow-sm'
                      }`}>
                        {message.sender === 'bot' && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                            <Bot className="h-3 w-3" />
                            AI
                          </div>
                        )}
                        <div className="text-sm break-words">{message.content}</div>
                        <div className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Message Input */}
                {canTakeOver && (
                  <div className="mt-4 flex gap-2">
                    <Input placeholder="Napisz wiadomość..." className="flex-1" />
                    <Button>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Side Panel */}
              <div className="w-full lg:w-80 lg:flex-shrink-0 space-y-4">
                {/* Client Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Informacje o kliencie</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-xs text-gray-500">Imię i nazwisko</Label>
                      <div className="font-medium">{selectedConversation?.client_name}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Email</Label>
                      <div className="text-sm">{selectedConversation?.client_email}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Status</Label>
                      <div className="flex items-center gap-2">
                        {selectedConversation && getStatusIcon(selectedConversation.status)}
                        <Badge variant={selectedConversation ? getStatusBadgeVariant(selectedConversation.status) : 'outline'}>
                          {selectedConversation?.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Internal Notes */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Notatki wewnętrzne</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Textarea
                      placeholder="Dodaj notatkę dla zespołu..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                    />
                    <Button size="sm" className="w-full">
                      Zapisz notatkę
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Akcje</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Przypisz do terapeuty
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Przenieś do działu
                    </Button>
                    {canInterrupt && (
                      <Button variant="destructive" size="sm" className="w-full">
                        <Pause className="h-4 w-4 mr-2" />
                        Przerwij konwersację
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 