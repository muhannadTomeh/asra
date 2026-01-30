"use client"

import { useEffect, useState } from "react"
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
import { Loader2, AlertCircle, ArrowRight, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CompanyCreatePage() {
  const router = useRouter()
  const { user, roles, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const isAdmin = roles.includes("Admin")

  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }
  }, [authLoading, user, router])

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

    if (!ownerPhoneNumber.trim()) {
      setError("رقم هاتف المالك مطلوب")
      return
    }

    setSaving(true)
    try {
      const data = await api.post<{ id: string }>("/companies", {
        name,
        address,
        ownerPhoneNumber,
        isActive,
      })
      toast({
        title: "تم الإنشاء",
        description: "تم إنشاء الشركة بنجاح",
      })
      router.push(`/companies/${data.id}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل إنشاء الشركة"
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
          <span className="text-foreground">شركة جديدة</span>
        </div>

        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>شركة جديدة</CardTitle>
            <CardDescription>إضافة شركة جديدة إلى النظام</CardDescription>
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

              <div className="space-y-2">
                <Label htmlFor="ownerPhoneNumber">رقم هاتف المالك</Label>
                <Input
                  id="ownerPhoneNumber"
                  type="tel"
                  value={ownerPhoneNumber}
                  onChange={(e) => setOwnerPhoneNumber(e.target.value)}
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                  className="text-right"
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
                      جارٍ الإنشاء...
                    </>
                  ) : (
                    <>
                      <Plus className="ml-2 h-4 w-4" />
                      إنشاء الشركة
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/companies")}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
