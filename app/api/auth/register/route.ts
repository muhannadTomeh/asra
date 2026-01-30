import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userName, phoneNumber, password } = body

    if (!userName || !phoneNumber || !password) {
      return NextResponse.json(
        { message: "جميع الحقول مطلوبة" },
        { status: 400 }
      )
    }

    // Create new user (in real app, save to database)
    const newUser = {
      id: Date.now().toString(),
      userName,
      phoneNumber,
      isActive: true,
    }

    // Create session
    const sessionData = {
      userId: newUser.id,
      roles: ["user"],
      exp: Date.now() + 24 * 60 * 60 * 1000,
    }

    const cookieStore = await cookies()
    cookieStore.set("session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    })

    return NextResponse.json({
      message: "تم إنشاء الحساب بنجاح",
      user: newUser,
    })
  } catch {
    return NextResponse.json(
      { message: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}
