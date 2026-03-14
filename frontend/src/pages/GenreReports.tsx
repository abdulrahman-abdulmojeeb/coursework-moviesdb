import { useQuery } from "@tanstack/react-query"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { genresApi } from "../services/api"
import type { GenrePopularity, GenrePolarisation } from "../types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import InfoCard from "@/components/InfoCard"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

export default function GenreReports() {
  const { data: popularity, isLoading: loadingPopularity } = useQuery({
    queryKey: ["genre-popularity"],
    queryFn: () => genresApi.getPopularity().then((res) => res.data as GenrePopularity[]),
  })

  const { data: polarisation, isLoading: loadingPolarisation } = useQuery({
    queryKey: ["genre-polarisation"],
    queryFn: () => genresApi.getPolarisation().then((res) => res.data as GenrePolarisation[]),
  })

  const isLoading = loadingPopularity || loadingPolarisation

  // Merge avg_rating from popularity into polarisation rows
  const avgRatingMap = new Map(popularity?.map((p) => [p.genre, p.avg_rating]))
  const genreAnalysis = polarisation?.map((p) => ({
    ...p,
    avg_rating: avgRatingMap.get(p.genre) ?? null,
  }))

  const getBarColor = (value: number) => {
    if (value >= 4) return "#22c55e"
    if (value >= 3.5) return "#30bfc2"
    if (value >= 3) return "#eab308"
    return "#ef4444"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Genre Reports</h1>
        <p className="text-muted-foreground">
          Analyze genre popularity and polarisation
        </p>
      </div>

      {isLoading && (
        <div className="space-y-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {popularity && (
        <Card>
          <CardHeader>
            <CardTitle>Genre Popularity by Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularity} layout="vertical" margin={{ left: 60, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 5]} />
                  <YAxis type="category" dataKey="genre" width={80} />
                  <Tooltip
                    formatter={(value?: number) => [value?.toFixed(2) ?? "", "Avg Rating"]}
                  />
                  <Bar dataKey="avg_rating">
                    {popularity.map((entry, index) => (
                      <Cell key={index} fill={getBarColor(entry.avg_rating)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {genreAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>Genre Analysis</CardTitle>
            <CardDescription>
              Average ratings and polarisation scores across genres.
              Polarisation indicates genres with more extreme ratings (love it or hate it).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Genre</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Avg Rating</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Low (%)</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Mid (%)</TableHead>
                  <TableHead className="text-right whitespace-nowrap">High (%)</TableHead>
                  <TableHead className="text-right whitespace-nowrap">
                    <TooltipProvider>
                      <UITooltip delayDuration={200}>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center gap-1 cursor-help">
                            Polarisation
                            <Info className="h-3.5 w-3.5 text-muted-foreground" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs text-left text-xs leading-relaxed">
                          <p className="font-semibold mb-1">How polarisation is measured</p>
                          <p className="mb-1">
                            Measured by <strong>standard deviation</strong> of all ratings
                            in the genre (0.5–5.0 scale).
                          </p>
                          <p className="mb-1">
                            Higher stddev = more disagreement among viewers.
                          </p>
                          <ul className="list-disc pl-4 space-y-0.5">
                            <li><strong>&gt; 1.1</strong> — highly polarising</li>
                            <li><strong>0.95–1.1</strong> — moderately divisive</li>
                            <li><strong>&lt; 0.95</strong> — general consensus</li>
                          </ul>
                          <p className="mt-1 text-muted-foreground">
                            Only genres with 100+ ratings are included.
                          </p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {genreAnalysis.map((genre) => (
                  <TableRow key={genre.genre}>
                    <TableCell className="font-medium">{genre.genre}</TableCell>
                    <TableCell className="text-right">
                      {genre.avg_rating != null ? (
                        <span className={cn(
                          "font-semibold",
                          genre.avg_rating >= 4 ? "text-green-600 dark:text-green-400"
                            : genre.avg_rating >= 3.5 ? "text-cyan-600 dark:text-cyan-400"
                            : genre.avg_rating >= 3 ? "text-yellow-600 dark:text-yellow-400"
                            : "text-red-600 dark:text-red-400"
                        )}>
                          {genre.avg_rating.toFixed(2)}
                        </span>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="text-right text-red-600 dark:text-red-400">
                      {genre.low_pct}%
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {genre.mid_pct}%
                    </TableCell>
                    <TableCell className="text-right text-green-600 dark:text-green-400">
                      {genre.high_pct}%
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          "font-bold",
                          genre.polarisation_score > 1.1
                            ? "text-purple-600 dark:text-purple-400"
                            : genre.polarisation_score > 0.95
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-muted-foreground"
                        )}
                      >
                        {genre.polarisation_score}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <InfoCard>
        <p>
          <strong>Data Source:</strong> Genre statistics are derived from the{" "}
          <a href="https://grouplens.org/datasets/movielens/" target="_blank" rel="noopener noreferrer" className="underline">
            MovieLens ml-latest-small dataset
          </a>{" "}
          containing 100,000 ratings from 600 users across 9,700 movies.
        </p>
        <p>
          <strong>Methodology:</strong> Popularity is measured by average rating across all movies in each genre.
          Polarisation is measured by the standard deviation of all ratings in the genre — higher values indicate
          more disagreement among viewers. Scores above 1.1 are highly polarising, 0.95–1.1 moderately divisive,
          and below 0.95 indicate general consensus.
        </p>
      </InfoCard>
    </div>
  )
}
