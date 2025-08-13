import { LogOut, MoveUpRight, Settings, CreditCard, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

interface MenuItem {
  label: string
  value?: string
  href: string
  icon?: React.ReactNode
  external?: boolean
}

interface Profile01Props {
  name?: string
  role?: string
  avatar?: string
  subscription?: string
}

const defaultProfile = {
  name: "Usuário",
  role: "Membro",
  avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-02-albo9B0tWOSLXCVZh9rX9KFxXIVWMr.png",
  subscription: "Free Trial",
} satisfies Required<Profile01Props>

export default function Profile01(props: Profile01Props = {}) {
  const { user, logout, isLoading } = useAuth()
  
  // Usa dados do usuário logado ou props ou valores padrão
  const name = user?.name || props.name || defaultProfile.name
  const role = props.role || "Membro" // Como não temos role no user, usa prop ou padrão
  const avatar = user?.avatar || props.avatar || defaultProfile.avatar
  const subscription = props.subscription || defaultProfile.subscription

  const handleLogout = () => {
    logout()
  }

  const menuItems: MenuItem[] = [
    {
      label: "Subscription",
      value: subscription,
      href: "#",
      icon: <CreditCard className="w-4 h-4" />,
      external: false,
    },
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="w-4 h-4" />,
    },
    {
      label: "Terms & Policies",
      href: "#",
      icon: <FileText className="w-4 h-4" />,
      external: true,
    },
  ]

  if (isLoading) {
    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="relative px-6 pt-12 pb-6">
            <div className="animate-pulse">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-[72px] h-[72px] bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="relative px-6 pt-12 pb-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative shrink-0">
              <Image
                src={avatar}
                alt={name}
                width={72}
                height={72}
                className="rounded-full ring-4 ring-white dark:ring-zinc-900 object-cover"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{name}</h2>
              <p className="text-zinc-600 dark:text-zinc-400">{role}</p>
              {user?.email && (
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">{user.email}</p>
              )}
            </div>
          </div>
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-6" />
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between p-2 
                                    hover:bg-zinc-50 dark:hover:bg-zinc-800/50 
                                    rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.label}</span>
                </div>
                <div className="flex items-center">
                  {item.value && <span className="text-sm text-zinc-500 dark:text-zinc-400 mr-2">{item.value}</span>}
                  {item.external && <MoveUpRight className="w-4 h-4" />}
                </div>
              </Link>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-2 
                                hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:bg-red-50 dark:hover:bg-red-900/20
                                rounded-lg transition-colors duration-200 group"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4 group-hover:text-red-600 dark:group-hover:text-red-400" />
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400">
                  Logout
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}