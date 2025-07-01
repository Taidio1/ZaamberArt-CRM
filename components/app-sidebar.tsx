"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bot,
  Calendar,
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  Activity,
  Settings,
  LogOut,
  Building2,
  BookOpen,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"

// Types for navigation
interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<any>
}

interface NavGroup {
  title: string
  items: NavItem[]
}

type UserRole = 'boss' | 'project_manager' | 'junior_manager' | 'therapist' | 'junior_therapist'

// Navigation items for different user roles
const navigationItems: Record<UserRole, NavGroup[]> = {
  boss: [
    {
      title: "Główne",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Zarządzanie Użytkownikami",
          url: "/users",
          icon: Users,
        },
        {
          title: "Bot AI",
          url: "/ai-bot",
          icon: Bot,
        },
        {
          title: "Logi Aktywności",
          url: "/activity-logs",
          icon: Activity,
        },
      ],
    },
    {
      title: "Operacje",
      items: [
        {
          title: "Podopieczni",
          url: "/clients",
          icon: UserCheck,
        },
        {
          title: "Kalendarz",
          url: "/calendar",
          icon: Calendar,
        },
        {
          title: "Szkolenia",
          url: "/courses",
          icon: BookOpen,
        },
      ],
    },
  ],
  project_manager: [
    {
      title: "Główne",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Podopieczni",
          url: "/clients",
          icon: UserCheck,
        },
        {
          title: "Kalendarz",
          url: "/calendar",
          icon: Calendar,
        },
      ],
    },
    {
      title: "Operacje",
      items: [
        {
          title: "Szkolenia",
          url: "/courses",
          icon: BookOpen,
        },
      ],
    },
  ],
  junior_manager: [
    {
      title: "Główne",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Podopieczni",
          url: "/clients",
          icon: UserCheck,
        },
        {
          title: "Kalendarz",
          url: "/calendar",
          icon: Calendar,
        },
      ],
    },
  ],
  therapist: [
    {
      title: "Główne",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Podopieczni",
          url: "/clients",
          icon: UserCheck,
        },
        {
          title: "Kalendarz",
          url: "/calendar",
          icon: Calendar,
        },
      ],
    },
  ],
  junior_therapist: [
    {
      title: "Główne",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Kalendarz",
          url: "/calendar",
          icon: Calendar,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const { userProfile, signOut } = useAuth()
  
  const userRole: UserRole = userProfile?.role || 'therapist'
  const navItems = navigationItems[userRole] || []

  // Function to check if a path is active
  const isPathActive = (url: string) => {
    if (url === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(url)
  }

  // Handle user sign out
  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userProfile) return 'U'
    const firstInitial = userProfile.first_name?.charAt(0).toUpperCase() || ''
    const lastInitial = userProfile.last_name?.charAt(0).toUpperCase() || ''
    return firstInitial + lastInitial || 'U'
  }

  // Get display role
  const getDisplayRole = () => {
    switch (userRole) {
      case 'boss': return 'Szef'
      case 'project_manager': return 'Manager Projektów'
      case 'junior_manager': return 'Junior Manager'
      case 'therapist': return 'Terapeuta'
      case 'junior_therapist': return 'Junior Terapeuta'
      default: return 'Użytkownik'
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
            <Building2 className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-gray-900">HipnoTerapia</span>
            <span className="truncate text-xs text-gray-600">Centrum Zarządzania</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-gray-700 font-medium">{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isPathActive(item.url)}
                      className="hover:bg-blue-50 hover:text-blue-700 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-800"
                    >
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt={`${userProfile?.first_name} ${userProfile?.last_name}`} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-gray-900">
                  {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'Użytkownik'}
                </span>
                <span className="truncate text-xs text-gray-600">
                  {getDisplayRole()}
                </span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              className="hover:bg-gray-100"
              isActive={isPathActive("/settings")}
            >
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="size-4" />
                <span>Ustawienia</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleSignOut}
              className="hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="size-4" />
              <span>Wyloguj</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
