'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { LogIn, User, LogOut } from 'lucide-react'

export default function AuthButton() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    // 获取当前用户
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      router.refresh()
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 animate-pulse"></div>
    )
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium"
      >
        <LogIn className="w-4 h-4" />
        登录
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/portfolio"
        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all font-medium"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">{user.email?.split('@')[0]}</span>
      </Link>
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all font-medium"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  )
}

