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

export async function GET() {
  return NextResponse.json(users)
}
