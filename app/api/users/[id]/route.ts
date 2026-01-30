import { NextResponse } from "next/server"

// Demo users
const users = [
  {
    id: "1",
    userName: "أحمد محمد",
    phoneNumber: "0501234567",
    isActive: true,
    roles: ["admin"],
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    userName: "سارة علي",
    phoneNumber: "0509876543",
    isActive: true,
    roles: ["user"],
    createdAt: "2024-02-15",
  },
  {
    id: "3",
    userName: "محمد خالد",
    phoneNumber: "0551234567",
    isActive: false,
    roles: ["user"],
    createdAt: "2024-03-20",
  },
]

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const user = users.find((u) => u.id === id)

  if (!user) {
    return NextResponse.json(
      { message: "المستخدم غير موجود" },
      { status: 404 }
    )
  }

  return NextResponse.json(user)
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params
  const index = users.findIndex((u) => u.id === id)

  if (index === -1) {
    return NextResponse.json(
      { message: "المستخدم غير موجود" },
      { status: 404 }
    )
  }

  const body = await request.json()
  users[index] = { ...users[index], ...body }

  return NextResponse.json(users[index])
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const index = users.findIndex((u) => u.id === id)

  if (index === -1) {
    return NextResponse.json(
      { message: "المستخدم غير موجود" },
      { status: 404 }
    )
  }

  users.splice(index, 1)
  return new NextResponse(null, { status: 204 })
}
