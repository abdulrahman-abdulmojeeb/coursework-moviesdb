import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authApi } from "@/services/api"

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [inviteToken, setInviteToken] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return "Password must be at least 8 characters"
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one number"
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) return "Password must contain at least one special character"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (mode === "register") {
      const passwordError = validatePassword(password)
      if (passwordError) {
        setError(passwordError)
        setLoading(false)
        return
      }
    }

    try {
      if (mode === "register") {
        await authApi.register(username, password, inviteToken, email || undefined)
      }
      const { data } = await authApi.login(username, password)
      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("refresh_token", data.refresh_token)
      navigate("/profile")
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not connect to server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-end mb-2">
            {mode === "login" ? (
              <button type="button" className="text-sm text-primary underline" onClick={() => { setMode("register"); setError(null) }}>
                Create an account
              </button>
            ) : (
              <button type="button" className="text-sm text-primary underline" onClick={() => { setMode("login"); setError(null) }}>
                Already have an account? Login
              </button>
            )}
          </div>
          <CardTitle>{mode === "login" ? "Welcome back" : "Create account"}</CardTitle>
          <CardDescription>{mode === "login" ? "Enter your credentials to continue" : "Fill in the details below"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {mode === "register" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite">Invite Token</Label>
                  <Input id="invite" value={inviteToken} onChange={(e) => setInviteToken(e.target.value)} required />
                </div>
              </>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}