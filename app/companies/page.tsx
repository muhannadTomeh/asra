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
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2, Search, Eye, Building2, Plus } from "lucide-react"

type Company = {
  id: string
  name: string
  address: string
  ownerName: string
  isActive: boolean
}

export default function CompaniesListPage() {
  const router = useRouter()
  const { user, roles, loading: authLoading } = useAuth()
  const isAdmin = roles.includes("Admin")

  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/")
      return
    }
  }, [authLoading, user, isAdmin, router])

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      loadCompanies()
    }
  }, [authLoading, user, isAdmin])

  const loadCompanies = async () => {
    try {
      const data = await api.get<Company[]>("/companies")
      setCompanies(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل تحميل الشركات"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase()) ||
      c.ownerName?.toLowerCase().includes(search.toLowerCase())
  )

  if (authLoading || !user || !isAdmin) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">الشركات</h1>
            <p className="text-muted-foreground">إدارة الشركات المسجلة في النظام</p>
          </div>
          <Button asChild>
            <Link href="/companies/new">
              <Plus className="ml-2 h-4 w-4" />
              شركة جديدة
            </Link>
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative max-w-md">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="البحث بالاسم أو العنوان أو المالك..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>قائمة الشركات</CardTitle>
            </div>
            <CardDescription>
              {filteredCompanies.length} شركة
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="py-12 text-center text-destructive">{error}</div>
            ) : filteredCompanies.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                لا توجد شركات
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>العنوان</TableHead>
                      <TableHead>المالك</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="text-left">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>{c.address}</TableCell>
                        <TableCell>{c.ownerName || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={c.isActive ? "default" : "secondary"}>
                            {c.isActive ? "نشط" : "غير نشط"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button asChild size="sm" variant="ghost">
                            <Link href={`/companies/${c.id}`}>
                              <Eye className="ml-2 h-4 w-4" />
                              عرض
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
