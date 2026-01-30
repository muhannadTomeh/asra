import { NextResponse } from "next/server"

// Demo companies
const companies = [
  {
    id: "1",
    companyName: "شركة الزيتون الذهبي",
    companyLogo: null,
    subscriptionStatus: "active",
    subscriptionEndDate: "2025-12-31",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    companyName: "معصرة الشمال",
    companyLogo: null,
    subscriptionStatus: "active",
    subscriptionEndDate: "2025-06-30",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    companyName: "زيت البركة",
    companyLogo: null,
    subscriptionStatus: "expired",
    subscriptionEndDate: "2024-12-31",
    createdAt: "2024-03-10",
  },
]

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const company = companies.find((c) => c.id === id)
  
  if (!company) {
    return NextResponse.json(
      { message: "الشركة غير موجودة" },
      { status: 404 }
    )
  }
  
  return NextResponse.json(company)
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params
  const index = companies.findIndex((c) => c.id === id)
  
  if (index === -1) {
    return NextResponse.json(
      { message: "الشركة غير موجودة" },
      { status: 404 }
    )
  }
  
  const body = await request.json()
  companies[index] = { ...companies[index], ...body }
  
  return NextResponse.json(companies[index])
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const index = companies.findIndex((c) => c.id === id)
  
  if (index === -1) {
    return NextResponse.json(
      { message: "الشركة غير موجودة" },
      { status: 404 }
    )
  }
  
  companies.splice(index, 1)
  return new NextResponse(null, { status: 204 })
}
