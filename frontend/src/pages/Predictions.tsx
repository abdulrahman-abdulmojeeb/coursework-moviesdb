import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { predictionsApi, genresApi } from "../services/api"
import type { Genre, PredictionResult, SimilarMovie } from "../types"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Star } from "lucide-react"
import InfoCard from "@/components/InfoCard"
import { cn } from "@/lib/utils"

export default function Predictions() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [usePanel, setUsePanel] = useState(false)
  const [panelSize, setPanelSize] = useState(100)
  const navigate = useNavigate()

  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: () => genresApi.getGenres().then((res) => res.data as Genre[]),
  })

  const predictMutation = useMutation({
    mutationFn: () =>
      predictionsApi
        .predict({
          genres: selectedGenres,
          ...(usePanel ? { panel_size: panelSize } : {}),
        })
        .then((res) => res.data as PredictionResult),
  })

  const similarMutation = useMutation({
    mutationFn: () =>
      predictionsApi
        .getSimilarByGenres(selectedGenres, 6)
        .then((res) => res.data?.similar_movies as SimilarMovie[] ?? []),
  })

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }

  const handlePredict = () => {
    if (selectedGenres.length > 0) {
      predictMutation.mutate(undefined, {
        onSuccess: () => similarMutation.mutate(),
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Predictive Ratings</h1>
        <p className="text-muted-foreground">
          Predict viewer ratings for new or upcoming titles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>New Title Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Genres (select at least one)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {genres?.map((genre) => (
                  <Badge
                    key={genre.genre_id}
                    variant={
                      selectedGenres.includes(genre.name) ? "default" : "outline"
                    }
                    className={cn(
                      "cursor-pointer transition-colors",
                      selectedGenres.includes(genre.name)
                        ? ""
                        : "hover:bg-secondary"
                    )}
                    onClick={() => handleGenreToggle(genre.name)}
                  >
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="use-panel"
                  checked={usePanel}
                  onChange={(e) => setUsePanel(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="use-panel">Use preview panel</Label>
              </div>
              {usePanel && (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Panel size</span>
                    <span className="font-medium">{panelSize} users</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={500}
                    step={10}
                    value={panelSize}
                    onChange={(e) => setPanelSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Uses a diverse subset of frequent raters instead of all users
                  </p>
                </div>
              )}
            </div>

            <Button
              onClick={handlePredict}
              disabled={selectedGenres.length === 0 || predictMutation.isPending}
              className="w-full"
            >
              {predictMutation.isPending ? "Predicting..." : "Generate Prediction"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prediction Results</CardTitle>
          </CardHeader>
          <CardContent>
            {!predictMutation.data && !predictMutation.isPending && (
              <div className="py-12 text-center text-muted-foreground">
                Enter movie details and click "Generate Prediction" to see results
              </div>
            )}

            {predictMutation.isPending && (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            )}

            {predictMutation.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to generate prediction. Please try different genres.
                </AlertDescription>
              </Alert>
            )}

            {predictMutation.data && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Predicted Rating</p>
                  <p className="text-5xl font-bold text-primary">
                    {predictMutation.data.prediction.mean_rating}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Confidence:{" "}
                    {predictMutation.data.prediction.confidence_interval.low.toFixed(1)}{" "}
                    -{" "}
                    {predictMutation.data.prediction.confidence_interval.high.toFixed(1)}
                  </p>
                </div>

                <div className={`grid ${predictMutation.data.panel ? "grid-cols-3" : "grid-cols-2"} gap-4 text-center`}>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Weighted Rating</p>
                    <p className="text-xl font-semibold">
                      {predictMutation.data.prediction.weighted_rating}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Based On</p>
                    <p className="text-xl font-semibold">
                      {predictMutation.data.prediction.based_on_ratings.toLocaleString()}{" "}
                      ratings
                    </p>
                  </div>
                  {predictMutation.data.panel && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Panel Coverage</p>
                      <p className="text-xl font-semibold">
                        {predictMutation.data.panel.users_in_results}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        of {predictMutation.data.panel.requested_size} panelists
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">
                    Predicted Rating Distribution
                  </p>
                  <div className="h-40 sm:h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={predictMutation.data.distribution}
                        margin={{ left: -10, right: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="rating" />
                        <YAxis />
                        <Tooltip
                          formatter={(value?: number) => [
                            `${value ?? 0}%`,
                            "Percentage",
                          ]}
                        />
                        <Bar dataKey="percentage" fill="var(--primary)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {(similarMutation.isPending || similarMutation.data) && (
        <Card>
          <CardHeader>
            <CardTitle>
              Similar Movies
              <span className="text-sm font-normal text-muted-foreground ml-2">
                matching {selectedGenres.join(", ")}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {similarMutation.isPending && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="aspect-[2/3] w-full rounded-md" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {similarMutation.data && similarMutation.data.length === 0 && (
              <p className="text-center text-muted-foreground py-6">
                No similar movies found for these genres.
              </p>
            )}

            {similarMutation.data && similarMutation.data.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {similarMutation.data.map((movie: SimilarMovie) => (
                  <div
                    key={movie.movie_id}
                    className="group space-y-2 cursor-pointer"
                    onClick={() => navigate(`/movies/${movie.movie_id}`)}
                  >
                    <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-muted">
                      {movie.poster_url ? (
                        <img
                          src={movie.poster_url}
                          alt={movie.title}
                          className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-xs text-center px-2">
                          No poster
                        </div>
                      )}
                      {movie.genre_similarity_pct && (
                        <div className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                          {movie.genre_similarity_pct}% match
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium leading-tight line-clamp-2">
                        {movie.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">
                          {movie.avg_rating ?? "—"}
                        </span>
                        {movie.release_year && (
                          <span className="text-xs text-muted-foreground">
                            · {movie.release_year}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <InfoCard>
        <p>
          <strong>Data Source:</strong> Predictions are based on the{" "}
          <a
            href="https://grouplens.org/datasets/movielens/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            MovieLens ml-latest-small dataset
          </a>{" "}
          containing 100,000 ratings from 600 users across 9,700 movies.
        </p>
        <p>
          <strong>Methodology:</strong> The prediction algorithm calculates genre
          similarity between your input and existing movies, then computes a weighted
          average rating based on similar titles. The confidence interval reflects the
          variance in ratings for movies with matching genre profiles. Higher genre
          overlap with well-rated films yields more confident predictions.
        </p>
      </InfoCard>
    </div>
  )
}