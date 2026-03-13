import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export default function LoginRequired({ description }: { description?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <User className="h-12 w-12 mx-auto text-muted-foreground" />
          <CardTitle>Login Required</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/profile">Login / Register</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
