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

export async function GET() {
  return NextResponse.json(companies)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newCompany = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString().split("T")[0],
    }
    companies.push(newCompany)
    return NextResponse.json(newCompany, { status: 201 })
  } catch {
    return NextResponse.json(
      { message: "حدث خطأ في إنشاء الشركة" },
      { status: 500 }
    )
  }
}
