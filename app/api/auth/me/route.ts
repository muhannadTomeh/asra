import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Demo users
const DEMO_USERS = [
  {
    id: "1",
    userName: "أحمد محمد",
    phoneNumber: "0501234567",
    isActive: true,
  },
  {
    id: "2",
    userName: "سارة علي",
    phoneNumber: "0509876543",
    isActive: true,
  },
]

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return NextResponse.json(
        { message: "غير مسجل الدخول" },
        { status: 401 }
      )
    }

    const session = JSON.parse(sessionCookie.value)

    if (session.exp < Date.now()) {
      cookieStore.delete("session")
      return NextResponse.json(
        { message: "انتهت صلاحية الجلسة" },
        { status: 401 }
      )
    }

    const user = DEMO_USERS.find((u) => u.id === session.userId)

    if (!user) {
      return NextResponse.json(
        { message: "المستخدم غير موجود" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user,
      roles: session.roles || [],
    })
  } catch {
    return NextResponse.json(
      { message: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}
