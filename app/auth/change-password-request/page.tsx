"use client"

import { useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Loader2, Phone, AlertCircle, CheckCircle, ArrowRight } from "lucide-react"

export default function ChangePasswordRequestPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data = await api.post<{ token: string }>("/auth/change-password-request", {
        phoneNumber,
      })
      setToken(data.token)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل إرسال الطلب"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/30 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Building2 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">عصراتي</h1>
        </div>

        {/* Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl">طلب تغيير كلمة المرور</CardTitle>
            <CardDescription>
              أدخل رقم هاتفك لإرسال رمز التحقق
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">رقم الهاتف</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="05xxxxxxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pr-10"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {token && (
                <Alert className="border-primary/20 bg-primary/5">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-foreground">
                    <span className="font-medium">الرمز (للاختبار):</span>
                    <code className="mr-2 rounded bg-muted px-2 py-1 font-mono text-sm" dir="ltr">
                      {token}
                    </code>
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جارٍ الإرسال...
                  </>
                ) : (
                  "إرسال الرمز"
                )}
              </Button>
            </form>

            {token && (
              <div className="mt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/auth/change-password?token=${token}`}>
                    المتابعة لتغيير كلمة المرور
                    <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                  </Link>
                </Button>
              </div>
            )}

            <div className="mt-6 text-center text-sm">
              <Link href="/login" className="text-primary hover:underline">
                العودة لتسجيل الدخول
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
