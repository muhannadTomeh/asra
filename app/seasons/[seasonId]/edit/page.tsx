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

export default function SeasonEditPage({ params }: { params: Promise<{ seasonId: string }> }) {
  const { seasonId } = use(params)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()

  const [season, setSeason] = useState<SeasonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [ridPercentage, setRidPercentage] = useState("")
  const [plasticTankCost, setPlasticTankCost] = useState("")
  const [plasticTankWeight, setPlasticTankWeight] = useState("")
  const [steelTankCost, setSteelTankCost] = useState("")
  const [steelTankWeight, setSteelTankWeight] = useState("")
  const [serviceCostPerKg, setServiceCostPerKg] = useState("")
  const [oilSellingCost, setOilSellingCost] = useState("")
  const [oilBuyingCost, setOilBuyingCost] = useState("")
  const [isActiveSeason, setIsActiveSeason] = useState(true)

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
      setRidPercentage(String(data.ridPercentage))
      setPlasticTankCost(String(data.plasticTankCost))
      setPlasticTankWeight(String(data.plasticTankWeight))
      setSteelTankCost(String(data.steelTankCost))
      setSteelTankWeight(String(data.steelTankWeight))
      setServiceCostPerKg(String(data.serviceCostPerKg))
      setOilSellingCost(String(data.oilSellingCost))
      setOilBuyingCost(String(data.oilBuyingCost))
      setIsActiveSeason(data.isActiveSeason)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل تحميل بيانات الموسم"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    setSaving(true)
    try {
      await api.put(`/seasons/${seasonId}`, {
        ridPercentage: Number(ridPercentage) || 0,
        plasticTankCost: Number(plasticTankCost) || 0,
        plasticTankWeight: Number(plasticTankWeight) || 0,
        steelTankCost: Number(steelTankCost) || 0,
        steelTankWeight: Number(steelTankWeight) || 0,
        serviceCostPerKg: Number(serviceCostPerKg) || 0,
        oilSellingCost: Number(oilSellingCost) || 0,
        oilBuyingCost: Number(oilBuyingCost) || 0,
        isActiveSeason,
      })
      toast({
        title: "تم الحفظ",
        description: "تم تحديث بيانات الموسم بنجاح",
      })
      router.push(`/seasons/${seasonId}`)
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
          {season && (
            <>
              <Link href={`/companies/${season.companyId}/seasons`} className="hover:text-foreground">
                المواسم
              </Link>
              <ArrowRight className="h-4 w-4 rotate-180" />
            </>
          )}
          <Link href={`/seasons/${seasonId}`} className="hover:text-foreground">
            تفاصيل الموسم
          </Link>
          <ArrowRight className="h-4 w-4 rotate-180" />
          <span className="text-foreground">تعديل</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error && !season ? (
          <Card>
            <CardContent className="py-12 text-center text-destructive">
              {error}
            </CardContent>
          </Card>
        ) : season ? (
          <Card className="mx-auto max-w-3xl">
            <CardHeader>
              <CardTitle>تعديل الموسم</CardTitle>
              <CardDescription>تحديث بيانات الموسم</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ridPercentage">نسبة الريد (%)</Label>
                    <Input
                      id="ridPercentage"
                      type="number"
                      min="0"
                      max="100"
                      value={ridPercentage}
                      onChange={(e) => setRidPercentage(e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceCostPerKg">تكلفة الخدمة/كغم</Label>
                    <Input
                      id="serviceCostPerKg"
                      type="number"
                      min="0"
                      step="0.01"
                      value={serviceCostPerKg}
                      onChange={(e) => setServiceCostPerKg(e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plasticTankCost">تكلفة خزان البلاستيك</Label>
                    <Input
                      id="plasticTankCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={plasticTankCost}
                      onChange={(e) => setPlasticTankCost(e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plasticTankWeight">وزن خزان البلاستيك</Label>
                    <Input
                      id="plasticTankWeight"
                      type="number"
                      min="0"
                      step="0.01"
                      value={plasticTankWeight}
                      onChange={(e) => setPlasticTankWeight(e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="steelTankCost">تكلفة خزان الحديد</Label>
                    <Input
                      id="steelTankCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={steelTankCost}
                      onChange={(e) => setSteelTankCost(e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="steelTankWeight">وزن خزان الحديد</Label>
                    <Input
                      id="steelTankWeight"
                      type="number"
                      min="0"
                      step="0.01"
                      value={steelTankWeight}
                      onChange={(e) => setSteelTankWeight(e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="oilSellingCost">سعر بيع الزيت</Label>
                    <Input
                      id="oilSellingCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={oilSellingCost}
                      onChange={(e) => setOilSellingCost(e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="oilBuyingCost">سعر شراء الزيت</Label>
                    <Input
                      id="oilBuyingCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={oilBuyingCost}
                      onChange={(e) => setOilBuyingCost(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isActiveSeason"
                    checked={isActiveSeason}
                    onCheckedChange={(checked) => setIsActiveSeason(checked === true)}
                  />
                  <Label htmlFor="isActiveSeason" className="cursor-pointer">
                    نشط
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
                    onClick={() => router.push(`/seasons/${seasonId}`)}
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
