import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [inviteToken, setInviteToken] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === "login") {
        const res = await fetch("http://localhost:8000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.detail || "Login failed"); return }
        localStorage.setItem("access_token", data.access_token)
        localStorage.setItem("refresh_token", data.refresh_token)
        navigate("/profile")

      } else {
        const res = await fetch("http://localhost:8000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, email: email || undefined, invite_token: inviteToken }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.detail || "Registration failed"); return }
        const loginRes = await fetch("http://localhost:8000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        })
        const loginData = await loginRes.json()
        localStorage.setItem("access_token", loginData.access_token)
        localStorage.setItem("refresh_token", loginData.refresh_token)
        navigate("/profile")
      }
    } catch (err) {
      setError("Could not connect to server")
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