"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  User,
  Shield,
  Bell,
  Database,
  Calendar,
  Mail,
  Phone,
  Save,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronRight,
  Home,
  Palette,
  Globe,
  Lock,
  Sun,
  Moon,
  Monitor
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // User settings state
  const [userSettings, setUserSettings] = useState({
    firstName: "Admin",
    lastName: "Administrator",
    email: "admin@hypnoterapia.pl",
    phone: "+48 123 456 789",
    bio: "Właściciel centrum HipnoTerapii",
    timezone: "Europe/Warsaw",
    language: "pl",
    avatar: ""
  })

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    companyName: "HipnoTerapia",
    companyAddress: "ul. Przykładowa 123, 00-000 Warszawa",
    companyPhone: "+48 123 456 789",
    companyEmail: "kontakt@hypnoterapia.pl",
    currency: "PLN",
    timeFormat: "24h",
    dateFormat: "DD/MM/YYYY",
    defaultSessionDuration: 60,
    autoBackup: true,
    maintenanceMode: false
  })

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 480,
    passwordComplexity: true,
    allowRemoteAccess: true
  })

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    desktopNotifications: true,
    appointmentReminders: true,
    systemAlerts: true,
    marketingEmails: false,
    weeklyReports: true,
    monthlyReports: true
  })

  // Theme settings state (excluding theme which is handled by useTheme)
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: "blue",
    sidebarCollapsed: false,
    compactMode: false,
    animations: true
  })

  const handleSave = async (section: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Sukces",
        description: `Ustawienia ${section} zostały zapisane`
      })
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać ustawień",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    toast({
      title: "Motyw zmieniony",
      description: `Przełączono na motyw: ${newTheme === 'light' ? 'jasny' : newTheme === 'dark' ? 'ciemny' : 'systemowy'}`
    })
  }

  const handleExportData = () => {
    toast({
      title: "Eksport danych",
      description: "Przygotowywanie pliku do pobrania..."
    })
  }

  const handleImportData = () => {
    toast({
      title: "Import danych",
      description: "Funkcja importu zostanie wkrótce dodana"
    })
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
              <BreadcrumbPage className="font-semibold text-gray-900">Ustawienia</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6 space-y-6">
        {/* Page Title */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ustawienia</h1>
            <p className="text-gray-600 mt-1">Zarządzaj ustawieniami systemu, profilu i bezpieczeństwa</p>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="w-full">
                      <TabsList className="grid w-full grid-cols-6 bg-white dark:bg-gray-800 border">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Bezpieczeństwo
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Powiadomienia
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Wygląd
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Dane
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Ustawienia Profilu
                </CardTitle>
                <CardDescription>
                  Zarządzaj swoimi danymi osobowymi i preferencjami
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="text-lg">AD</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className="mr-2">
                      Zmień zdjęcie
                    </Button>
                    <Button variant="ghost" size="sm">
                      Usuń
                    </Button>
                    <p className="text-sm text-gray-500 mt-1">
                      Rekomendowany rozmiar: 400x400px
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Imię</Label>
                    <Input
                      id="firstName"
                      value={userSettings.firstName}
                      onChange={(e) => setUserSettings({...userSettings, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nazwisko</Label>
                    <Input
                      id="lastName"
                      value={userSettings.lastName}
                      onChange={(e) => setUserSettings({...userSettings, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userSettings.email}
                      onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={userSettings.phone}
                      onChange={(e) => setUserSettings({...userSettings, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Opis / Bio</Label>
                  <Textarea
                    id="bio"
                    value={userSettings.bio}
                    onChange={(e) => setUserSettings({...userSettings, bio: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timezone">Strefa czasowa</Label>
                    <Select value={userSettings.timezone} onValueChange={(value) => setUserSettings({...userSettings, timezone: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Warsaw">Europa/Warszawa</SelectItem>
                        <SelectItem value="Europe/London">Europa/Londyn</SelectItem>
                        <SelectItem value="America/New_York">Ameryka/Nowy Jork</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Język</Label>
                    <Select value={userSettings.language} onValueChange={(value) => setUserSettings({...userSettings, language: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pl">Polski</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave("profilu")} disabled={loading}>
                    {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                    <Save className="h-4 w-4 mr-2" />
                    Zapisz zmiany
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Ustawienia Systemu
                </CardTitle>
                <CardDescription>
                  Konfiguracja ogólnych ustawień aplikacji i firmy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Company Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informacje o firmie</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="companyName">Nazwa firmy</Label>
                      <Input
                        id="companyName"
                        value={systemSettings.companyName}
                        onChange={(e) => setSystemSettings({...systemSettings, companyName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyAddress">Adres</Label>
                      <Textarea
                        id="companyAddress"
                        value={systemSettings.companyAddress}
                        onChange={(e) => setSystemSettings({...systemSettings, companyAddress: e.target.value})}
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyEmail">Email firmowy</Label>
                        <Input
                          id="companyEmail"
                          type="email"
                          value={systemSettings.companyEmail}
                          onChange={(e) => setSystemSettings({...systemSettings, companyEmail: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="companyPhone">Telefon firmowy</Label>
                        <Input
                          id="companyPhone"
                          value={systemSettings.companyPhone}
                          onChange={(e) => setSystemSettings({...systemSettings, companyPhone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Regional Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Ustawienia regionalne</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="currency">Waluta</Label>
                      <Select value={systemSettings.currency} onValueChange={(value) => setSystemSettings({...systemSettings, currency: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PLN">PLN (złoty)</SelectItem>
                          <SelectItem value="EUR">EUR (euro)</SelectItem>
                          <SelectItem value="USD">USD (dolar)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timeFormat">Format czasu</Label>
                      <Select value={systemSettings.timeFormat} onValueChange={(value) => setSystemSettings({...systemSettings, timeFormat: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24h">24-godzinny</SelectItem>
                          <SelectItem value="12h">12-godzinny</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dateFormat">Format daty</Label>
                      <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings({...systemSettings, dateFormat: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* System Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Ustawienia systemowe</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="defaultSessionDuration">Domyślny czas sesji (minuty)</Label>
                      <Input
                        id="defaultSessionDuration"
                        type="number"
                        value={systemSettings.defaultSessionDuration}
                        onChange={(e) => setSystemSettings({...systemSettings, defaultSessionDuration: Number(e.target.value)})}
                        min="15"
                        max="180"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Automatyczne kopie zapasowe</Label>
                        <p className="text-sm text-gray-500">Twórz codzienne kopie zapasowe danych</p>
                      </div>
                      <Switch
                        checked={systemSettings.autoBackup}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoBackup: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Tryb konserwacji</Label>
                        <p className="text-sm text-gray-500">Ogranicza dostęp do systemu</p>
                      </div>
                      <Switch
                        checked={systemSettings.maintenanceMode}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave("systemu")} disabled={loading}>
                    {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                    <Save className="h-4 w-4 mr-2" />
                    Zapisz zmiany
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Ustawienia Bezpieczeństwa
                </CardTitle>
                <CardDescription>
                  Zarządzaj hasłem, uwierzytelnianiem dwuskładnikowym i bezpieczeństwem konta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Password Change */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Zmiana hasła</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Aktualne hasło</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={securitySettings.currentPassword}
                          onChange={(e) => setSecuritySettings({...securitySettings, currentPassword: e.target.value})}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="newPassword">Nowe hasło</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={securitySettings.newPassword}
                          onChange={(e) => setSecuritySettings({...securitySettings, newPassword: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Potwierdź nowe hasło</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={securitySettings.confirmPassword}
                          onChange={(e) => setSecuritySettings({...securitySettings, confirmPassword: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Security Options */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Opcje bezpieczeństwa</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Uwierzytelnianie dwuskładnikowe (2FA)</Label>
                        <p className="text-sm text-gray-500">Dodatkowa warstwa bezpieczeństwa dla Twojego konta</p>
                      </div>
                      <Switch
                        checked={securitySettings.twoFactorEnabled}
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorEnabled: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Powiadomienia o logowaniu</Label>
                        <p className="text-sm text-gray-500">Otrzymuj email po każdym logowaniu</p>
                      </div>
                      <Switch
                        checked={securitySettings.loginNotifications}
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, loginNotifications: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Złożoność hasła</Label>
                        <p className="text-sm text-gray-500">Wymagaj silnych haseł z dużymi literami, cyframi i znakami specjalnymi</p>
                      </div>
                      <Switch
                        checked={securitySettings.passwordComplexity}
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, passwordComplexity: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Zdalny dostęp</Label>
                        <p className="text-sm text-gray-500">Zezwalaj na dostęp z urządzeń spoza sieci lokalnej</p>
                      </div>
                      <Switch
                        checked={securitySettings.allowRemoteAccess}
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, allowRemoteAccess: checked})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sessionTimeout">Limit czasu sesji (minuty)</Label>
                      <Select 
                        value={securitySettings.sessionTimeout.toString()} 
                        onValueChange={(value) => setSecuritySettings({...securitySettings, sessionTimeout: Number(value)})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minut</SelectItem>
                          <SelectItem value="60">1 godzina</SelectItem>
                          <SelectItem value="120">2 godziny</SelectItem>
                          <SelectItem value="240">4 godziny</SelectItem>
                          <SelectItem value="480">8 godzin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave("bezpieczeństwa")} disabled={loading}>
                    {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                    <Lock className="h-4 w-4 mr-2" />
                    Zapisz zmiany
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Ustawienia Powiadomień
                </CardTitle>
                <CardDescription>
                  Skonfiguruj sposób otrzymywania powiadomień i alertów
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* General Notifications */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Ogólne powiadomienia</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-blue-600" />
                        <div>
                          <Label>Powiadomienia email</Label>
                          <p className="text-sm text-gray-500">Otrzymuj ważne informacje na email</p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-green-600" />
                        <div>
                          <Label>Powiadomienia SMS</Label>
                          <p className="text-sm text-gray-500">Otrzymuj pilne powiadomienia na telefon</p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 mr-2 text-purple-600" />
                        <div>
                          <Label>Powiadomienia systemowe</Label>
                          <p className="text-sm text-gray-500">Powiadomienia w przeglądarce</p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationSettings.desktopNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, desktopNotifications: checked})}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Specific Notifications */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Konkretne powiadomienia</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-orange-600" />
                        <div>
                          <Label>Przypomnienia o wizytach</Label>
                          <p className="text-sm text-gray-500">Powiadomienia o nadchodzących sesjach</p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationSettings.appointmentReminders}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, appointmentReminders: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Alerty systemowe</Label>
                        <p className="text-sm text-gray-500">Powiadomienia o błędach i problemach</p>
                      </div>
                      <Switch
                        checked={notificationSettings.systemAlerts}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, systemAlerts: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email marketingowy</Label>
                        <p className="text-sm text-gray-500">Informacje o nowościach i promocjach</p>
                      </div>
                      <Switch
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, marketingEmails: checked})}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Reports */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Raporty</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Raporty tygodniowe</Label>
                        <p className="text-sm text-gray-500">Podsumowanie aktywności z tygodnia</p>
                      </div>
                      <Switch
                        checked={notificationSettings.weeklyReports}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weeklyReports: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Raporty miesięczne</Label>
                        <p className="text-sm text-gray-500">Szczegółowe podsumowanie miesięczne</p>
                      </div>
                      <Switch
                        checked={notificationSettings.monthlyReports}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, monthlyReports: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave("powiadomień")} disabled={loading}>
                    {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                    <Save className="h-4 w-4 mr-2" />
                    Zapisz zmiany
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme Settings */}
          <TabsContent value="theme" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Ustawienia Wyglądu
                </CardTitle>
                <CardDescription>
                  Dostosuj wygląd aplikacji do swoich preferencji
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="theme">Motyw</Label>
                    {mounted ? (
                      <>
                        <Select value={theme} onValueChange={handleThemeChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz motyw" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">
                              <div className="flex items-center gap-2">
                                <Sun className="h-4 w-4" />
                                Jasny
                              </div>
                            </SelectItem>
                            <SelectItem value="dark">
                              <div className="flex items-center gap-2">
                                <Moon className="h-4 w-4" />
                                Ciemny
                              </div>
                            </SelectItem>
                            <SelectItem value="system">
                              <div className="flex items-center gap-2">
                                <Monitor className="h-4 w-4" />
                                Systemowy
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {theme === 'light' && <><Sun className="h-4 w-4" /> Aktualnie: Jasny motyw</>}
                          {theme === 'dark' && <><Moon className="h-4 w-4" /> Aktualnie: Ciemny motyw</>}
                          {theme === 'system' && <><Monitor className="h-4 w-4" /> Aktualnie: Motyw systemowy</>}
                        </div>
                      </>
                    ) : (
                      <div className="h-10 bg-gray-100 animate-pulse rounded-md"></div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="primaryColor">Kolor główny</Label>
                    <Select value={themeSettings.primaryColor} onValueChange={(value) => setThemeSettings({...themeSettings, primaryColor: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Niebieski</SelectItem>
                        <SelectItem value="green">Zielony</SelectItem>
                        <SelectItem value="purple">Fioletowy</SelectItem>
                        <SelectItem value="orange">Pomarańczowy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Zwinięty sidebar</Label>
                      <p className="text-sm text-gray-500">Domyślnie minimalizuj panel boczny</p>
                    </div>
                    <Switch
                      checked={themeSettings.sidebarCollapsed}
                      onCheckedChange={(checked) => setThemeSettings({...themeSettings, sidebarCollapsed: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Tryb kompaktowy</Label>
                      <p className="text-sm text-gray-500">Zmniejsz odstępy między elementami</p>
                    </div>
                    <Switch
                      checked={themeSettings.compactMode}
                      onCheckedChange={(checked) => setThemeSettings({...themeSettings, compactMode: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Animacje</Label>
                      <p className="text-sm text-gray-500">Włącz płynne animacje interfejsu</p>
                    </div>
                    <Switch
                      checked={themeSettings.animations}
                      onCheckedChange={(checked) => setThemeSettings({...themeSettings, animations: checked})}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave("wyglądu")} disabled={loading}>
                    {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                    <Save className="h-4 w-4 mr-2" />
                    Zapisz zmiany
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Zarządzanie Danymi
                </CardTitle>
                <CardDescription>
                  Eksportuj, importuj i zarządzaj kopiami zapasowymi danych
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Data Export */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Eksport danych</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center space-x-3">
                        <Download className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium">Pełny eksport</h4>
                          <p className="text-sm text-gray-500">Wszystkie dane w formacie JSON</p>
                        </div>
                      </div>
                      <Button className="w-full mt-3" onClick={handleExportData}>
                        Pobierz eksport
                      </Button>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center space-x-3">
                        <Download className="h-8 w-8 text-green-600" />
                        <div>
                          <h4 className="font-medium">Raport CSV</h4>
                          <p className="text-sm text-gray-500">Dane w formacie arkusza</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-3" onClick={handleExportData}>
                        Pobierz CSV
                      </Button>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Data Import */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Import danych</h3>
                  <Card className="p-4">
                    <div className="flex items-center space-x-3">
                      <Upload className="h-8 w-8 text-purple-600" />
                      <div>
                        <h4 className="font-medium">Importuj dane</h4>
                        <p className="text-sm text-gray-500">Wczytaj dane z pliku backup</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-3" onClick={handleImportData}>
                      Wybierz plik
                    </Button>
                  </Card>
                </div>

                <Separator />

                {/* Backup Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informacje o kopiach zapasowych</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Ostatnia kopia zapasowa</p>
                        <p className="text-sm text-gray-500">2024-01-07 03:00:00</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Sukces
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Następna kopia zapasowa</p>
                        <p className="text-sm text-gray-500">2024-01-08 03:00:00</p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Zaplanowana
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    Utwórz kopię zapasową
                  </Button>
                  <Button onClick={() => handleSave("danych")} disabled={loading}>
                    {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                    <Save className="h-4 w-4 mr-2" />
                    Zapisz zmiany
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 