import { NextResponse } from "next/server"

// Demo seasons (same as parent)
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

type RouteContext = { params: Promise<{ seasonId: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { seasonId } = await context.params
  const season = seasons.find((s) => s.id === seasonId)

  if (!season) {
    return NextResponse.json(
      { message: "الموسم غير موجود" },
      { status: 404 }
    )
  }

  return NextResponse.json(season)
}

export async function PUT(request: Request, context: RouteContext) {
  const { seasonId } = await context.params
  const index = seasons.findIndex((s) => s.id === seasonId)

  if (index === -1) {
    return NextResponse.json(
      { message: "الموسم غير موجود" },
      { status: 404 }
    )
  }

  const body = await request.json()
  seasons[index] = { ...seasons[index], ...body }

  return NextResponse.json(seasons[index])
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { seasonId } = await context.params
  const index = seasons.findIndex((s) => s.id === seasonId)

  if (index === -1) {
    return NextResponse.json(
      { message: "الموسم غير موجود" },
      { status: 404 }
    )
  }

  seasons.splice(index, 1)
  return new NextResponse(null, { status: 204 })
}
