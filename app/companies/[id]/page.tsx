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
  Building2,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  ArrowRight,
  Calendar,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type CompanyData = {
  id: string
  name: string
  address: string
  ownerName: string
  isActive: boolean
}

export default function CompanyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user, roles, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const isAdmin = roles.includes("Admin")

  const [company, setCompany] = useState<CompanyData | null>(null)
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
      loadCompany()
    }
  }, [authLoading, user, id])

  const loadCompany = async () => {
    try {
      const data = await api.get<CompanyData>(`/companies/${id}`)
      setCompany(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل تحميل بيانات الشركة"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/companies/${id}`)
      toast({
        title: "تم الحذف",
        description: "تم حذف الشركة بنجاح",
      })
      router.push("/companies")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل حذف الشركة"
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/companies" className="hover:text-foreground">
            الشركات
          </Link>
          <ArrowRight className="h-4 w-4 rotate-180" />
          <span className="text-foreground">تفاصيل الشركة</span>
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
        ) : company ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Company Info Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">معلومات الشركة</CardTitle>
                    <CardDescription>البيانات الأساسية للشركة</CardDescription>
                  </div>
                  <Badge variant={company.isActive ? "default" : "secondary"} className="text-sm">
                    {company.isActive ? "نشطة" : "غير نشطة"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الاسم</p>
                      <p className="font-medium">{company.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">العنوان</p>
                      <p className="font-medium">{company.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">المالك</p>
                      <p className="font-medium">{company.ownerName || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      {company.isActive ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الحالة</p>
                      <p className="font-medium">
                        {company.isActive ? "نشطة" : "غير نشطة"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>الإجراءات</CardTitle>
                <CardDescription>إدارة الشركة</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button asChild>
                  <Link href={`/companies/${id}/edit`}>
                    <Edit className="ml-2 h-4 w-4" />
                    تعديل البيانات
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href={`/companies/${id}/seasons`}>
                    <Calendar className="ml-2 h-4 w-4" />
                    مواسم الشركة
                  </Link>
                </Button>
                {isAdmin && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="ml-2 h-4 w-4" />
                        حذف الشركة
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                        <AlertDialogDescription>
                          سيتم حذف الشركة نهائياً ولا يمكن التراجع عن هذا الإجراء.
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
