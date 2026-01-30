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

type CompanyData = {
  id: string
  name: string
  address: string
  ownerName: string
  isActive: boolean
}

export default function CompanyEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()

  const [company, setCompany] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [isActive, setIsActive] = useState(true)

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
      setName(data.name)
      setAddress(data.address)
      setIsActive(data.isActive)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل تحميل بيانات الشركة"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError("اسم الشركة مطلوب")
      return
    }

    if (!address.trim()) {
      setError("العنوان مطلوب")
      return
    }

    setSaving(true)
    try {
      await api.put(`/companies/${id}`, {
        name,
        address,
        isActive,
      })
      toast({
        title: "تم الحفظ",
        description: "تم تحديث بيانات الشركة بنجاح",
      })
      router.push(`/companies/${id}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل حفظ البيانات"
      setError(message)
    } finally {
      setSaving(false)
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
          <Link href={`/companies/${id}`} className="hover:text-foreground">
            تفاصيل الشركة
          </Link>
          <ArrowRight className="h-4 w-4 rotate-180" />
          <span className="text-foreground">تعديل</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error && !company ? (
          <Card>
            <CardContent className="py-12 text-center text-destructive">
              {error}
            </CardContent>
          </Card>
        ) : company ? (
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>تعديل الشركة</CardTitle>
              <CardDescription>تحديث بيانات الشركة</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم الشركة</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل اسم الشركة"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">العنوان</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="أدخل عنوان الشركة"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={(checked) => setIsActive(checked === true)}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    نشطة
                  </Label>
                </div>

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
                    onClick={() => router.push(`/companies/${id}`)}
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
