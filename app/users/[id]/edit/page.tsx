"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, ArrowRight, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type UserData = {
  userId: string
  userName: string
  phoneNumber: string
  isActive: boolean
}

export default function UserEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user: authUser, roles, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const isAdmin = roles.includes("Admin")

  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [userName, setUserName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isActive, setIsActive] = useState(true)

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
      setUserName(data.userName)
      setPhoneNumber(data.phoneNumber)
      setIsActive(data.isActive)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل تحميل بيانات المستخدم"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!userName.trim()) {
      setError("الاسم مطلوب")
      return
    }

    if (!phoneNumber.trim()) {
      setError("رقم الهاتف مطلوب")
      return
    }

    setSaving(true)
    try {
      await api.put(`/users/${id}`, {
        userName,
        phoneNumber,
        isActive,
      })
      toast({
        title: "تم الحفظ",
        description: "تم تحديث بيانات المستخدم بنجاح",
      })
      router.push(`/users/${id}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل حفظ البيانات"
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || !authUser) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isAdmin && (
            <>
              <Link href="/users" className="hover:text-foreground">
                المستخدمون
              </Link>
              <ArrowRight className="h-4 w-4 rotate-180" />
            </>
          )}
          <Link href={`/users/${id}`} className="hover:text-foreground">
            تفاصيل المستخدم
          </Link>
          <ArrowRight className="h-4 w-4 rotate-180" />
          <span className="text-foreground">تعديل</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error && !userData ? (
          <Card>
            <CardContent className="py-12 text-center text-destructive">
              {error}
            </CardContent>
          </Card>
        ) : userData ? (
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>تعديل المستخدم</CardTitle>
              <CardDescription>تحديث بيانات المستخدم</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="userName">الاسم</Label>
                  <Input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="الاسم الكامل"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">رقم الهاتف</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="05xxxxxxxx"
                    dir="ltr"
                    className="text-right"
                    required
                  />
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isActive"
                      checked={isActive}
                      onCheckedChange={(checked) => setIsActive(checked === true)}
                    />
                    <Label htmlFor="isActive" className="cursor-pointer">
                      نشط
                    </Label>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جارٍ الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="ml-2 h-4 w-4" />
                        حفظ التغييرات
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/users/${id}`)}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </DashboardLayout>
  )
}
