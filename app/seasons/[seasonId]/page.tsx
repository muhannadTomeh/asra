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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Loader2,
  Edit,
  Trash2,
  Percent,
  DollarSign,
  Scale,
  Droplet,
  ArrowRight,
  Calendar,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type SeasonData = {
  seasonId: string
  companyId: string
  ridPercentage: number
  plasticTankCost: number
  plasticTankWeight: number
  steelTankCost: number
  steelTankWeight: number
  serviceCostPerKg: number
  oilSellingCost: number
  oilBuyingCost: number
  isActiveSeason: boolean
}

export default function SeasonDetailsPage({ params }: { params: Promise<{ seasonId: string }> }) {
  const { seasonId } = use(params)
  const router = useRouter()
  const { user, roles, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const isAdmin = roles.includes("Admin")

  const [season, setSeason] = useState<SeasonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (!authLoading && user) {
      loadSeason()
    }
  }, [authLoading, user, seasonId])

  const loadSeason = async () => {
    try {
      const data = await api.get<SeasonData>(`/seasons/${seasonId}`)
      setSeason(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل تحميل بيانات الموسم"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!season) return
    setDeleting(true)
    try {
      await api.delete(`/seasons/${seasonId}`)
      toast({
        title: "تم الحذف",
        description: "تم حذف الموسم بنجاح",
      })
      router.push(`/companies/${season.companyId}/seasons`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل حذف الموسم"
      toast({
        title: "خطأ",
        description: message,
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  if (authLoading || !user) {
    return null
  }

  const infoItems = season
    ? [
        { label: "نسبة الريد", value: `${season.ridPercentage}%`, icon: Percent },
        { label: "تكلفة الخدمة/كغم", value: season.serviceCostPerKg, icon: DollarSign },
        { label: "تكلفة خزان البلاستيك", value: season.plasticTankCost, icon: DollarSign },
        { label: "وزن خزان البلاستيك", value: season.plasticTankWeight, icon: Scale },
        { label: "تكلفة خزان الحديد", value: season.steelTankCost, icon: DollarSign },
        { label: "وزن خزان الحديد", value: season.steelTankWeight, icon: Scale },
        { label: "سعر بيع الزيت", value: season.oilSellingCost, icon: Droplet },
        { label: "سعر شراء الزيت", value: season.oilBuyingCost, icon: Droplet },
      ]
    : []

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/companies" className="hover:text-foreground">
            الشركات
          </Link>
          <ArrowRight className="h-4 w-4 rotate-180" />
          {season && (
            <>
              <Link href={`/companies/${season.companyId}/seasons`} className="hover:text-foreground">
                المواسم
              </Link>
              <ArrowRight className="h-4 w-4 rotate-180" />
            </>
          )}
          <span className="text-foreground">تفاصيل الموسم</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-12 text-center text-destructive">
              {error}
            </CardContent>
          </Card>
        ) : season ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Season Info Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-xl">تفاصيل الموسم</CardTitle>
                      <CardDescription>معرف: {season.seasonId}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={season.isActiveSeason ? "default" : "secondary"} className="text-sm">
                    {season.isActiveSeason ? "نشط" : "غير نشط"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {infoItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>الإجراءات</CardTitle>
                <CardDescription>إدارة الموسم</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button asChild>
                  <Link href={`/seasons/${seasonId}/edit`}>
                    <Edit className="ml-2 h-4 w-4" />
                    تعديل البيانات
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/companies/${season.companyId}/seasons`}>
                    رجوع للمواسم
                  </Link>
                </Button>
                {isAdmin && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="ml-2 h-4 w-4" />
                        حذف الموسم
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                        <AlertDialogDescription>
                          سيتم حذف الموسم نهائياً ولا يمكن التراجع عن هذا الإجراء.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          disabled={deleting}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deleting ? (
                            <>
                              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                              جارٍ الحذف...
                            </>
                          ) : (
                            "حذف"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  )
}
