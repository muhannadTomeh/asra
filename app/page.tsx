"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Building2, Calendar, TrendingUp, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function HomePage() {
  const router = useRouter()
  const { user, roles, loading } = useAuth()
  const isAdmin = roles.includes("Admin")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  if (loading || !user) {
    return null
  }

  const stats = [
    {
      title: "المستخدمون",
      value: "---",
      description: "إجمالي المستخدمين المسجلين",
      icon: Users,
      href: "/users",
      adminOnly: true,
    },
    {
      title: "الشركات",
      value: "---",
      description: "الشركات المسجلة في النظام",
      icon: Building2,
      href: "/companies",
      adminOnly: true,
    },
    {
      title: "المواسم",
      value: "---",
      description: "المواسم النشطة حالياً",
      icon: Calendar,
      href: "/companies",
      adminOnly: true,
    },
    {
      title: "النمو",
      value: "---",
      description: "معدل النمو الشهري",
      icon: TrendingUp,
      href: "#",
      adminOnly: false,
    },
  ]

  const filteredStats = stats.filter((stat) => !stat.adminOnly || isAdmin)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="rounded-2xl bg-gradient-to-l from-primary/10 via-primary/5 to-transparent p-6 lg:p-8">
          <h1 className="text-2xl font-bold lg:text-3xl text-balance">
            مرحباً {user.userName}
          </h1>
          <p className="mt-2 text-muted-foreground">
            أهلاً بك في لوحة التحكم. يمكنك إدارة النظام من هنا.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredStats.map((stat) => (
            <Card key={stat.title} className="group relative overflow-hidden transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
              {stat.href !== "#" && (
                <Link
                  href={stat.href}
                  className="absolute inset-0 z-10"
                  aria-label={`الذهاب إلى ${stat.title}`}
                />
              )}
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
            <CardDescription>الوصول السريع للميزات الأساسية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {isAdmin && (
                <>
                  <Button asChild>
                    <Link href="/users" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      إدارة المستخدمين
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href="/companies" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      إدارة الشركات
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/companies/new" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      شركة جديدة
                    </Link>
                  </Button>
                </>
              )}
              <Button asChild variant="outline">
                <Link href={`/users/${user.id}`} className="flex items-center gap-2">
                  صفحتي الشخصية
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
