import { NextResponse } from "next/server"

// Demo seasons
const seasons = [
  {
    id: "1",
    companyId: "1",
    seasonName: "موسم 2024",
    startDate: "2024-10-01",
    endDate: "2024-12-31",
    isActive: true,
    defaultPricePerKg: 15.0,
    defaultExtractionRate: 20.0,
    allowDebt: true,
    maxDebtAmount: 5000,
  },
  {
    id: "2",
    companyId: "1",
    seasonName: "موسم 2023",
    startDate: "2023-10-01",
    endDate: "2023-12-31",
    isActive: false,
    defaultPricePerKg: 12.0,
    defaultExtractionRate: 18.0,
    allowDebt: true,
    maxDebtAmount: 3000,
  },
  {
    id: "3",
    companyId: "2",
    seasonName: "موسم الخريف 2024",
    startDate: "2024-09-01",
    endDate: "2024-11-30",
    isActive: true,
    defaultPricePerKg: 14.0,
    defaultExtractionRate: 22.0,
    allowDebt: false,
    maxDebtAmount: 0,
  },
]

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const companySeasons = seasons.filter((s) => s.companyId === id)
  return NextResponse.json(companySeasons)
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const newSeason = {
      id: Date.now().toString(),
      companyId: id,
      ...body,
    }
    seasons.push(newSeason)
    return NextResponse.json(newSeason, { status: 201 })
  } catch {
    return NextResponse.json(
      { message: "حدث خطأ في إنشاء الموسم" },
      { status: 500 }
    )
  }
}
