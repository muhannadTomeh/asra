"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2, Eye, Calendar, Plus, ArrowRight } from "lucide-react"

type Season = {
  seasonId: string
  ridPercentage: number
  isActiveSeason: boolean
}

export default function SeasonsListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: companyId } = use(params)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [seasons, setSeasons] = useState<Season[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (!authLoading && user) {
      loadSeasons()
    }
  }, [authLoading, user, companyId])

  const loadSeasons = async () => {
    try {
      const data = await api.get<Season[]>(`/companies/${companyId}/seasons`)
      setSeasons(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل تحميل المواسم"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/companies" className="hover:text-foreground">
            الشركات
          </Link>
          <ArrowRight className="h-4 w-4 rotate-180" />
          <Link href={`/companies/${companyId}`} className="hover:text-foreground">
            تفاصيل الشركة
          </Link>
          <ArrowRight className="h-4 w-4 rotate-180" />
          <span className="text-foreground">المواسم</span>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">مواسم الشركة</h1>
            <p className="text-muted-foreground">إدارة المواسم المرتبطة بالشركة</p>
          </div>
          <Button asChild>
            <Link href={`/companies/${companyId}/seasons/new`}>
              <Plus className="ml-2 h-4 w-4" />
              موسم جديد
            </Link>
          </Button>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>قائمة المواسم</CardTitle>
            </div>
            <CardDescription>
              {seasons.length} موسم
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="py-12 text-center text-destructive">{error}</div>
            ) : seasons.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                لا توجد مواسم
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المعرف</TableHead>
                      <TableHead>نسبة الريد</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="text-left">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {seasons.map((s) => (
                      <TableRow key={s.seasonId}>
                        <TableCell className="font-mono">{s.seasonId}</TableCell>
                        <TableCell>{s.ridPercentage}%</TableCell>
                        <TableCell>
                          <Badge variant={s.isActiveSeason ? "default" : "secondary"}>
                            {s.isActiveSeason ? "نشط" : "غير نشط"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button asChild size="sm" variant="ghost">
                            <Link href={`/seasons/${s.seasonId}`}>
                              <Eye className="ml-2 h-4 w-4" />
                              تفاصيل
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
