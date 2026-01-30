import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Demo users for testing
const DEMO_USERS = [
  {
    id: "1",
    userName: "أحمد محمد",
    phoneNumber: "0501234567",
    password: "password123",
    isActive: true,
    roles: ["admin"],
  },
  {
    id: "2",
    userName: "سارة علي",
    phoneNumber: "0509876543",
    password: "password123",
    isActive: true,
    roles: ["user"],
  },
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phoneNumber, password, rememberMe } = body

    // Find user
    const user = DEMO_USERS.find(
      (u) => u.phoneNumber === phoneNumber && u.password === password
    )

    if (!user) {
      return NextResponse.json(
        { message: "رقم الهاتف أو كلمة المرور غير صحيحة" },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { message: "الحساب غير مفعل" },
        { status: 403 }
      )
    }

    // Create session token
    const sessionData = {
      userId: user.id,
      roles: user.roles,
      exp: Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000),
    }

    const cookieStore = await cookies()
    cookieStore.set("session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
      path: "/",
    })

    return NextResponse.json({
      message: "تم تسجيل الدخول بنجاح",
      user: {
        id: user.id,
        userName: user.userName,
        phoneNumber: user.phoneNumber,
        isActive: user.isActive,
      },
    })
  } catch {
    return NextResponse.json(
      { message: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}
