import { createClient } from '@supabase/supabase-js'

// Database types
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: 'boss' | 'project_manager' | 'junior_manager' | 'therapist' | 'junior_therapist'
  phone?: string
  hire_date: string
  hourly_rate: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WorkSession {
  id: string
  user_id: string
  start_time: string
  end_time?: string
  description?: string
  client_id?: string
  duration_minutes?: number
  created_at: string
}

export interface ActivityLog {
  id: string
  user_id?: string
  action: string
  details?: any
  ip_address?: string
  user_agent?: string
  created_at: string
  user?: {
    first_name: string
    last_name: string
    email: string
    role: string
  }
}

export interface WorkStats {
  user_id: string
  total_hours_today: number
  total_hours_this_week: number
  total_hours_this_month: number
  total_sessions_count: number
  average_session_duration: number
  total_earnings_this_month: number
}

export interface Client {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  date_of_birth?: string
  address?: string
  notes?: string
  assigned_therapist_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
  therapist?: {
    first_name: string
    last_name: string
    email: string
  }
}

export interface Transaction {
  id: string
  therapist_id: string
  client_id: string
  session_id?: string
  amount: number
  commission_rate: number
  commission_amount: number
  payment_status: 'pending' | 'completed' | 'cancelled'
  payment_date?: string
  description?: string
  created_at: string
  client?: {
    first_name: string
    last_name: string
  }
  therapist?: {
    first_name: string
    last_name: string
  }
}

export interface Session {
  id: string
  user_id: string
  client_id?: string
  start_time: string
  end_time?: string
  duration_minutes?: number
  description?: string
  price?: number
  status: 'scheduled' | 'completed' | 'cancelled'
  created_at: string
  client?: {
    first_name: string
    last_name: string
  }
  therapist?: {
    first_name: string
    last_name: string
  }
}

export interface TherapistStats {
  therapist_id: string
  client_count: number
  total_sessions: number
  total_earnings: number
  commission_amount: number
  average_session_price: number
  sessions_this_month: number
  last_session_date?: string
}

export interface EventType {
  id: string
  name: string
  color: string
  description?: string
  created_at: string
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  event_type_id?: string
  start_time: string
  end_time: string
  all_day: boolean
  location?: string
  created_by?: string
  assigned_to?: string
  client_id?: string
  session_id?: string
  google_event_id?: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  is_recurring: boolean
  recurrence_rule?: string
  reminder_minutes: number
  is_private: boolean
  color_override?: string
  created_at: string
  updated_at: string
  event_type?: EventType
  creator?: {
    first_name: string
    last_name: string
    email: string
  }
  assignee?: {
    first_name: string
    last_name: string
    email: string
  }
  client?: {
    first_name: string
    last_name: string
  }
  participants?: EventParticipant[]
}

export interface EventParticipant {
  id: string
  event_id: string
  user_id: string
  role: 'organizer' | 'participant' | 'observer'
  response_status: 'pending' | 'accepted' | 'declined' | 'tentative'
  added_at: string
  user?: {
    first_name: string
    last_name: string
    email: string
  }
}

export interface Absence {
  id: string
  user_id: string
  absence_type: 'vacation' | 'sick_leave' | 'training' | 'personal' | 'other'
  start_date: string
  end_date: string
  reason?: string
  approved_by?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  user?: {
    first_name: string
    last_name: string
    email: string
  }
  approver?: {
    first_name: string
    last_name: string
  }
}

// Courses interfaces
export interface Course {
  id: string
  title: string
  description?: string
  short_description?: string
  price: number
  currency: string
  max_participants?: number
  start_date?: string
  end_date?: string
  duration_hours?: number
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category?: string
  image_url?: string
  video_url?: string
  is_active: boolean
  is_featured: boolean
  instructor_id?: string
  created_by?: string
  created_at: string
  updated_at: string
  instructor?: {
    first_name: string
    last_name: string
    email: string
  }
  creator?: {
    first_name: string
    last_name: string
    email: string
  }
  enrollments?: CourseEnrollment[]
  modules?: CourseModule[]
}

export interface CourseEnrollment {
  id: string
  course_id: string
  client_id: string
  enrolled_at: string
  status: 'enrolled' | 'completed' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'paid' | 'partial' | 'overdue' | 'refunded'
  paid_amount: number
  discount_amount: number
  final_price: number
  payment_date?: string
  completion_date?: string
  progress_percentage: number
  notes?: string
  enrolled_by?: string
  client?: {
    first_name: string
    last_name: string
    email: string
    phone?: string
  }
  course?: {
    title: string
    price: number
  }
  enrolledBy?: {
    first_name: string
    last_name: string
  }
}

export interface CourseModule {
  id: string
  course_id: string
  title: string
  description?: string
  content?: string
  video_url?: string
  pdf_url?: string
  order_index: number
  duration_minutes?: number
  is_free_preview: boolean
  created_at: string
}

export interface CoursePayment {
  id: string
  enrollment_id: string
  amount: number
  payment_method?: string
  payment_date: string
  transaction_id?: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  notes?: string
  processed_by?: string
  enrollment?: {
    client?: {
      first_name: string
      last_name: string
    }
  }
  processor?: {
    first_name: string
    last_name: string
  }
}

export interface CourseStats {
  total_courses: number
  active_courses: number
  total_enrollments: number
  total_revenue: number
  average_price: number
  top_courses: {
    title: string
    enrollments: number
    revenue: number
  }[]
  monthly_sales: {
    month: string
    revenue: number
    enrollments: number
  }[]
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Authentication functions
export const signUp = async (email: string, password: string, userData: {
  first_name: string
  last_name: string
  role?: 'boss' | 'project_manager' | 'junior_manager' | 'therapist' | 'junior_therapist'
  phone?: string
  hourly_rate?: number
}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })

  if (error) throw error
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })

  if (error) throw error
  return data
}

export const updatePassword = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password
  })

  if (error) throw error
  return data
}

// Get user profile from users table
export const getUserProfile = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

// Helper functions for user management
export const getUserStats = async (userId: string): Promise<WorkStats | null> => {
  try {
    // Get work sessions for the user
    const { data: sessions, error } = await supabase
      .from('work_sessions')
      .select('*')
      .eq('user_id', userId)
      .not('end_time', 'is', null)

    if (error) throw error

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Calculate statistics
    const todaySessions = sessions?.filter(s => new Date(s.created_at) >= today) || []
    const weekSessions = sessions?.filter(s => new Date(s.created_at) >= weekStart) || []
    const monthSessions = sessions?.filter(s => new Date(s.created_at) >= monthStart) || []

    const totalHoursToday = todaySessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / 60
    const totalHoursWeek = weekSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / 60
    const totalHoursMonth = monthSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / 60

    const avgDuration = sessions?.length 
      ? sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / sessions.length 
      : 0

    // Get user hourly rate
    const { data: user } = await supabase
      .from('users')
      .select('hourly_rate')
      .eq('id', userId)
      .single()

    const earnings = totalHoursMonth * (user?.hourly_rate || 0)

    return {
      user_id: userId,
      total_hours_today: totalHoursToday,
      total_hours_this_week: totalHoursWeek,
      total_hours_this_month: totalHoursMonth,
      total_sessions_count: sessions?.length || 0,
      average_session_duration: avgDuration,
      total_earnings_this_month: earnings
    }
  } catch (error) {
    console.error('Error getting user stats:', error)
    return null
  }
}

export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return []
  }

  return data || []
}

export const createUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single()

  if (error) {
    console.error('Error creating user:', error)
    return null
  }

  return data
}

export const updateUser = async (id: string, userData: Partial<User>): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .update({ ...userData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating user:', error)
    return null
  }

  return data
}

export const deleteUser = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting user:', error)
    return false
  }

  return true
}

// Activity logs functions
export const getActivityLogs = async (limit: number = 50, offset: number = 0): Promise<ActivityLog[]> => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        user:users(first_name, last_name, email, role)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching activity logs:', error)
    return []
  }
}

export const getActivityLogsCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('activity_logs')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count || 0
  } catch (error) {
    console.error('Error getting activity logs count:', error)
    return 0
  }
}

export const logActivity = async (
  userId: string | null,
  action: string,
  details?: any,
  ipAddress?: string,
  userAgent?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert([{
        user_id: userId,
        action,
        details,
        ip_address: ipAddress,
        user_agent: userAgent
      }])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error logging activity:', error)
    return false
  }
}

// Helper function to get client IP and user agent
export const logUserActivity = async (
  userId: string | null,
  action: string,
  details?: any
): Promise<boolean> => {
  try {
    // Get user agent from navigator
    const userAgent = typeof window !== 'undefined' ? navigator.userAgent : undefined
    
    // In a real app, you'd get the IP from the server
    // For now, we'll skip IP logging or use a placeholder
    const ipAddress = undefined // Will be null in database
    
    return await logActivity(userId, action, details, ipAddress, userAgent)
  } catch (error) {
    console.error('Error logging user activity:', error)
    return false
  }
}

// Clients functions
export const getAllClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        therapist:users!assigned_therapist_id(first_name, last_name, email)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching clients:', error)
    return []
  }
}

export const getClientsByTherapist = async (therapistId: string): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('assigned_therapist_id', therapistId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching clients by therapist:', error)
    return []
  }
}

export const createClientRecord = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating client:', error)
    return null
  }
}

export const updateClient = async (id: string, clientData: Partial<Client>): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update({ ...clientData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating client:', error)
    return null
  }
}

export const deleteClient = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting client:', error)
    return false
  }
}

// Transactions functions (now should work with proper table)
export const getTransactionsByTherapist = async (therapistId: string): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        client:clients(first_name, last_name),
        therapist:users(first_name, last_name)
      `)
      .eq('therapist_id', therapistId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
}

export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        client:clients(first_name, last_name),
        therapist:users(first_name, last_name)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching all transactions:', error)
    return []
  }
}

// Sessions functions
export const getSessionsByTherapist = async (therapistId: string): Promise<Session[]> => {
  try {
    const { data, error } = await supabase
      .from('work_sessions')
      .select(`
        *,
        client:clients(first_name, last_name),
        therapist:users!user_id(first_name, last_name)
      `)
      .eq('user_id', therapistId)
      .order('start_time', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return []
  }
}

export const getUpcomingSessions = async (therapistId?: string): Promise<Session[]> => {
  try {
    let query = supabase
      .from('work_sessions')
      .select(`
        *,
        client:clients(first_name, last_name),
        therapist:users!user_id(first_name, last_name)
      `)
      .gte('start_time', new Date().toISOString())
      .is('end_time', null)

    if (therapistId) {
      query = query.eq('user_id', therapistId)
    }

    const { data, error } = await query.order('start_time', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching upcoming sessions:', error)
    return []
  }
}

// Therapist statistics
export const getTherapistStats = async (therapistId: string): Promise<TherapistStats | null> => {
  try {
    // Get client count
    const { count: clientCount } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('assigned_therapist_id', therapistId)
      .eq('is_active', true)

    // Get sessions count and stats
    const { data: sessions } = await supabase
      .from('work_sessions')
      .select('*')
      .eq('user_id', therapistId)
      .not('end_time', 'is', null)

    // Get transactions for earnings
    const { data: transactions } = await supabase
      .from('transactions')
      .select('amount, commission_amount')
      .eq('therapist_id', therapistId)
      .eq('payment_status', 'completed')

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const sessionsThisMonth = sessions?.filter((s: any) => 
      new Date(s.created_at) >= monthStart
    ).length || 0

    const totalEarnings = transactions?.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) || 0
    const commissionAmount = transactions?.reduce((sum: number, t: any) => sum + (t.commission_amount || 0), 0) || 0
    
    const lastSession = sessions?.[0]

    return {
      therapist_id: therapistId,
      client_count: clientCount || 0,
      total_sessions: sessions?.length || 0,
      total_earnings: totalEarnings,
      commission_amount: commissionAmount,
      average_session_price: sessions?.length ? totalEarnings / sessions.length : 0,
      sessions_this_month: sessionsThisMonth,
      last_session_date: lastSession?.end_time
    }
  } catch (error) {
    console.error('Error getting therapist stats:', error)
    return null
  }
}

export const getAllTherapistStats = async (): Promise<TherapistStats[]> => {
  try {
    // Get all therapists
    const { data: therapists } = await supabase
      .from('users')
      .select('id')
      .in('role', ['therapist', 'junior_therapist'])
      .eq('is_active', true)

    if (!therapists) return []

    // Get stats for each therapist
    const statsPromises = therapists.map(async (therapist) => {
      return await getTherapistStats(therapist.id)
    })

    const statsResults = await Promise.all(statsPromises)
    return statsResults.filter(stat => stat !== null) as TherapistStats[]
  } catch (error) {
    console.error('Error getting all therapist stats:', error)
    return []
  }
}

// Calendar functions
export const getEventTypes = async (): Promise<EventType[]> => {
  try {
    const { data, error } = await supabase
      .from('event_types')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching event types:', error)
    return []
  }
}

export const getCalendarEvents = async (
  startDate?: string,
  endDate?: string,
  userId?: string,
  eventTypeIds?: string[]
): Promise<CalendarEvent[]> => {
  try {
    let query = supabase
      .from('calendar_events')
      .select(`
        *,
        event_type:event_types(id, name, color, description),
        creator:users!created_by(first_name, last_name, email),
        assignee:users!assigned_to(first_name, last_name, email),
        client:clients(first_name, last_name)
      `)

    // Filter by date range
    if (startDate) {
      query = query.gte('start_time', startDate)
    }
    if (endDate) {
      query = query.lte('end_time', endDate)
    }

    // Filter by user (either created by or assigned to)
    if (userId) {
      query = query.or(`created_by.eq.${userId},assigned_to.eq.${userId}`)
    }

    // Filter by event types
    if (eventTypeIds && eventTypeIds.length > 0) {
      query = query.in('event_type_id', eventTypeIds)
    }

    const { data, error } = await query.order('start_time')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    return []
  }
}

export const createCalendarEvent = async (
  eventData: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>
): Promise<CalendarEvent | null> => {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert([eventData])
      .select(`
        *,
        event_type:event_types(id, name, color, description),
        creator:users!created_by(first_name, last_name, email),
        assignee:users!assigned_to(first_name, last_name, email),
        client:clients(first_name, last_name)
      `)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating calendar event:', error)
    return null
  }
}

export const updateCalendarEvent = async (
  id: string,
  eventData: Partial<CalendarEvent>
): Promise<CalendarEvent | null> => {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .update({ ...eventData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        event_type:event_types(id, name, color, description),
        creator:users!created_by(first_name, last_name, email),
        assignee:users!assigned_to(first_name, last_name, email),
        client:clients(first_name, last_name)
      `)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating calendar event:', error)
    return null
  }
}

export const deleteCalendarEvent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting calendar event:', error)
    return false
  }
}

export const getEventParticipants = async (eventId: string): Promise<EventParticipant[]> => {
  try {
    const { data, error } = await supabase
      .from('event_participants')
      .select(`
        *,
        user:users(first_name, last_name, email)
      `)
      .eq('event_id', eventId)
      .order('added_at')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching event participants:', error)
    return []
  }
}

export const addEventParticipant = async (
  eventId: string,
  userId: string,
  role: 'organizer' | 'participant' | 'observer' = 'participant'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('event_participants')
      .insert([{
        event_id: eventId,
        user_id: userId,
        role,
        response_status: 'pending'
      }])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error adding event participant:', error)
    return false
  }
}

export const updateParticipantResponse = async (
  eventId: string,
  userId: string,
  responseStatus: 'pending' | 'accepted' | 'declined' | 'tentative'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('event_participants')
      .update({ response_status: responseStatus })
      .eq('event_id', eventId)
      .eq('user_id', userId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error updating participant response:', error)
    return false
  }
}

export const getAbsences = async (
  userId?: string,
  startDate?: string,
  endDate?: string
): Promise<Absence[]> => {
  try {
    let query = supabase
      .from('absences')
      .select(`
        *,
        user:users!user_id(first_name, last_name, email),
        approver:users!approved_by(first_name, last_name)
      `)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (startDate) {
      query = query.gte('start_date', startDate)
    }

    if (endDate) {
      query = query.lte('end_date', endDate)
    }

    const { data, error } = await query.order('start_date', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching absences:', error)
    return []
  }
}

export const createAbsence = async (
  absenceData: Omit<Absence, 'id' | 'created_at'>
): Promise<Absence | null> => {
  try {
    const { data, error } = await supabase
      .from('absences')
      .insert([absenceData])
      .select(`
        *,
        user:users!user_id(first_name, last_name, email),
        approver:users!approved_by(first_name, last_name)
      `)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating absence:', error)
    return null
  }
}

// Get events for specific user's calendar view
export const getUserCalendarEvents = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<CalendarEvent[]> => {
  try {
    // Get events where user is creator, assignee, or participant
    const { data: events, error: eventsError } = await supabase
      .from('calendar_events')
      .select(`
        *,
        event_type:event_types(id, name, color, description),
        creator:users!created_by(first_name, last_name, email),
        assignee:users!assigned_to(first_name, last_name, email),
        client:clients(first_name, last_name)
      `)
      .or(`created_by.eq.${userId},assigned_to.eq.${userId}`)
      .gte('start_time', startDate)
      .lte('end_time', endDate)
      .order('start_time')

    if (eventsError) throw eventsError

    // Get events where user is participant
    const { data: participantEvents, error: participantError } = await supabase
      .from('event_participants')
      .select(`
        event_id,
        calendar_events!inner(
          *,
          event_type:event_types(id, name, color, description),
          creator:users!created_by(first_name, last_name, email),
          assignee:users!assigned_to(first_name, last_name, email),
          client:clients(first_name, last_name)
        )
      `)
      .eq('user_id', userId)
      .gte('calendar_events.start_time', startDate)
      .lte('calendar_events.end_time', endDate)

    if (participantError) throw participantError

    // Combine and deduplicate events
    const allEvents = [...(events || [])]
    
    if (participantEvents) {
      participantEvents.forEach((pe: any) => {
        const event = pe.calendar_events
        if (!allEvents.find(e => e.id === event.id)) {
          allEvents.push(event)
        }
      })
    }

    return allEvents.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
  } catch (error) {
    console.error('Error fetching user calendar events:', error)
    return []
  }
}

// ===============================================================
// COURSES FUNCTIONS
// ===============================================================

// Get all courses
export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:users!instructor_id(first_name, last_name, email),
        creator:users!created_by(first_name, last_name, email)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

// Get course with full details
export const getCourseDetails = async (courseId: string): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:users!instructor_id(first_name, last_name, email),
        creator:users!created_by(first_name, last_name, email),
        enrollments:course_enrollments(
          *,
          client:clients(first_name, last_name, email, phone)
        ),
        modules:course_modules(*)
      `)
      .eq('id', courseId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching course details:', error)
    return null
  }
}

// Create new course
export const createCourse = async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select(`
        *,
        instructor:users!instructor_id(first_name, last_name, email),
        creator:users!created_by(first_name, last_name, email)
      `)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating course:', error)
    return null
  }
}

// Update course
export const updateCourse = async (id: string, courseData: Partial<Course>): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .update({ ...courseData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        instructor:users!instructor_id(first_name, last_name, email),
        creator:users!created_by(first_name, last_name, email)
      `)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating course:', error)
    return null
  }
}

// Delete course
export const deleteCourse = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting course:', error)
    return false
  }
}

// Get course enrollments
export const getCourseEnrollments = async (courseId: string): Promise<CourseEnrollment[]> => {
  try {
    const { data, error } = await supabase
      .from('course_enrollments')
      .select(`
        *,
        client:clients(first_name, last_name, email, phone),
        course:courses(title, price),
        enrolledBy:users!enrolled_by(first_name, last_name)
      `)
      .eq('course_id', courseId)
      .order('enrolled_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching course enrollments:', error)
    return []
  }
}

// Enroll client in course
export const enrollClientInCourse = async (
  courseId: string,
  clientId: string,
  enrolledBy: string,
  paidAmount: number = 0,
  paymentStatus: 'pending' | 'paid' | 'partial' = 'pending'
): Promise<CourseEnrollment | null> => {
  try {
    const { data, error } = await supabase
      .from('course_enrollments')
      .insert([{
        course_id: courseId,
        client_id: clientId,
        enrolled_by: enrolledBy,
        paid_amount: paidAmount,
        payment_status: paymentStatus,
        payment_date: paymentStatus === 'paid' ? new Date().toISOString() : null
      }])
      .select(`
        *,
        client:clients(first_name, last_name, email, phone),
        course:courses(title, price),
        enrolledBy:users!enrolled_by(first_name, last_name)
      `)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error enrolling client in course:', error)
    return null
  }
}

// Update enrollment
export const updateEnrollment = async (
  id: string,
  enrollmentData: Partial<CourseEnrollment>
): Promise<CourseEnrollment | null> => {
  try {
    const { data, error } = await supabase
      .from('course_enrollments')
      .update(enrollmentData)
      .eq('id', id)
      .select(`
        *,
        client:clients(first_name, last_name, email, phone),
        course:courses(title, price),
        enrolledBy:users!enrolled_by(first_name, last_name)
      `)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating enrollment:', error)
    return null
  }
}

// Get course modules
export const getCourseModules = async (courseId: string): Promise<CourseModule[]> => {
  try {
    const { data, error } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching course modules:', error)
    return []
  }
}

// Create course module
export const createCourseModule = async (moduleData: Omit<CourseModule, 'id' | 'created_at'>): Promise<CourseModule | null> => {
  try {
    const { data, error } = await supabase
      .from('course_modules')
      .insert([moduleData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating course module:', error)
    return null
  }
}

// Get course payments
export const getCoursePayments = async (enrollmentId?: string): Promise<CoursePayment[]> => {
  try {
    let query = supabase
      .from('course_payments')
      .select(`
        *,
        enrollment:course_enrollments(
          client:clients(first_name, last_name)
        ),
        processor:users!processed_by(first_name, last_name)
      `)

    if (enrollmentId) {
      query = query.eq('enrollment_id', enrollmentId)
    }

    const { data, error } = await query.order('payment_date', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching course payments:', error)
    return []
  }
}

// Record course payment
export const recordCoursePayment = async (paymentData: Omit<CoursePayment, 'id'>): Promise<CoursePayment | null> => {
  try {
    const { data, error } = await supabase
      .from('course_payments')
      .insert([paymentData])
      .select(`
        *,
        enrollment:course_enrollments(
          client:clients(first_name, last_name)
        ),
        processor:users!processed_by(first_name, last_name)
      `)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error recording course payment:', error)
    return null
  }
}

// Get course statistics
export const getCourseStats = async (): Promise<CourseStats> => {
  try {
    // Get course counts
    const { count: totalCourses } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })

    const { count: activeCourses } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Get enrollments data
    const { data: enrollments } = await supabase
      .from('course_enrollments')
      .select(`
        paid_amount,
        course:courses(title)
      `)
      .eq('payment_status', 'paid')

    // Get total enrollments count
    const { count: totalEnrollments } = await supabase
      .from('course_enrollments')
      .select('*', { count: 'exact', head: true })

    const totalRevenue = enrollments?.reduce((sum, e) => sum + (e.paid_amount || 0), 0) || 0
    const averagePrice = enrollments?.length ? totalRevenue / enrollments.length : 0

    // Get top courses by enrollments
    const { data: topCoursesData } = await supabase
      .from('courses')
      .select(`
        title,
        price,
        enrollments:course_enrollments(count)
      `)
      .eq('is_active', true)
      .order('enrollments.count', { ascending: false })
      .limit(3)

    const topCourses = topCoursesData?.map(course => ({
      title: course.title,
      enrollments: course.enrollments?.length || 0,
      revenue: (course.enrollments?.length || 0) * course.price
    })) || []

    // Get monthly sales (last 6 months)
    const monthlySales = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString()
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString()

      const { data: monthEnrollments, count } = await supabase
        .from('course_enrollments')
        .select('paid_amount', { count: 'exact' })
        .gte('enrolled_at', monthStart)
        .lte('enrolled_at', monthEnd)
        .eq('payment_status', 'paid')

      const monthRevenue = monthEnrollments?.reduce((sum, e) => sum + (e.paid_amount || 0), 0) || 0

      monthlySales.push({
        month: date.toLocaleDateString('pl-PL', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue,
        enrollments: count || 0
      })
    }

    return {
      total_courses: totalCourses || 0,
      active_courses: activeCourses || 0,
      total_enrollments: totalEnrollments || 0,
      total_revenue: totalRevenue,
      average_price: averagePrice,
      top_courses: topCourses,
      monthly_sales: monthlySales
    }
  } catch (error) {
    console.error('Error fetching course stats:', error)
    return {
      total_courses: 0,
      active_courses: 0,
      total_enrollments: 0,
      total_revenue: 0,
      average_price: 0,
      top_courses: [],
      monthly_sales: []
    }
  }
}