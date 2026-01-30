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
import { Loader2, Edit, Trash2, User, Phone, CheckCircle, XCircle, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type UserData = {
  userId: string
  userName: string
  phoneNumber: string
  isActive: boolean
}

export default function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user: authUser, roles, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const isAdmin = roles.includes("Admin")

  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push("/login")
      return
    }
  }, [authLoading, authUser, router])

  useEffect(() => {
    if (!authLoading && authUser) {
      loadUser()
    }
  }, [authLoading, authUser, id])

  const loadUser = async () => {
    try {
      const data = await api.get<UserData>(`/users/${id}`)
      setUserData(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل تحميل بيانات المستخدم"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/users/${id}`)
      toast({
        title: "تم الحذف",
        description: "تم حذف المستخدم بنجاح",
      })
      router.push("/users")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل حذف المستخدم"
      toast({
        title: "خطأ",
        description: message,
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  if (authLoading || !authUser) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        {isAdmin && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/users" className="hover:text-foreground">
              المستخدمون
            </Link>
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span className="text-foreground">تفاصيل المستخدم</span>
          </div>
        )}

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
        ) : userData ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* User Info Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">معلومات المستخدم</CardTitle>
                    <CardDescription>البيانات الأساسية للمستخدم</CardDescription>
                  </div>
                  <Badge variant={userData.isActive ? "default" : "secondary"} className="text-sm">
                    {userData.isActive ? "نشط" : "غير نشط"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الاسم</p>
                      <p className="font-medium">{userData.userName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                      <p className="font-medium" dir="ltr">
                        {userData.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      {userData.isActive ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الحالة</p>
                      <p className="font-medium">
                        {userData.isActive ? "نشط" : "غير نشط"}
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
                <CardDescription>إدارة حساب المستخدم</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button asChild>
                  <Link href={`/users/${id}/edit`}>
                    <Edit className="ml-2 h-4 w-4" />
                    تعديل البيانات
                  </Link>
                </Button>
                {isAdmin && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="ml-2 h-4 w-4" />
                        حذف المستخدم
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                        <AlertDialogDescription>
                          سيتم حذف المستخدم نهائياً ولا يمكن التراجع عن هذا الإجراء.
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
