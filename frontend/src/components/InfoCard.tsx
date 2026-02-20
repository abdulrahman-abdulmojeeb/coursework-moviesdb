import { Card, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"

export default function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-2">{children}</div>
        </div>
      </CardContent>
    </Card>
  )
}
