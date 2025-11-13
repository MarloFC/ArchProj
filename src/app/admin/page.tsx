import { redirect } from "next/navigation"
import { getCurrentUser, isUserAdmin } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldX } from "lucide-react"

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const admin = await isUserAdmin()

  if (!admin) {
    // Render unauthorized page directly instead of redirecting
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <ShieldX className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Acesso Negado
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Você não tem permissão para acessar o painel de administração.
          </p>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Se você acredita que deveria ter acesso, entre em contato com o administrador do sistema.
            </p>

            <Link href="/">
              <Button size="lg" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                Voltar para Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard user={user} />
    </div>
  )
}