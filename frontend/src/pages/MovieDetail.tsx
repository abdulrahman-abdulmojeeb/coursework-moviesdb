import { useParams, useNavigate, Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { moviesApi, predictionsApi } from "../services/api"
import type { Movie, MovieRatingsResponse, SimilarMoviesResponse } from "../types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Clock,
  Star,
  Users,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Film,
  Award,
  Plus,
  Check,
  Info
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { collectionsApi, appRatingsApi } from "../services/api";
import { formatNumber, formatRuntime, isLoggedIn } from "@/lib/utils"

const scoreColor = (pct: number, prefix: "bg" | "text" = "text") => {
  const colors = {
    bg: {
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      red: "bg-red-500",
    },
    text: {
      green: "text-green-500",
      yellow: "text-yellow-500",
      red: "text-red-500",
    },
  }
  const shade = pct >= 70 ? "green" : pct >= 50 ? "yellow" : "red"
  return colors[prefix][shade]
}
  function RatingBar({ label, score, maxScore, suffix, extra }: {
    label: string; score: number; maxScore: number; suffix: string; extra?: React.ReactNode
  }) {
    const pct = Math.min(100, (score / maxScore) * 100)
    return (
      <div className="space-y-1">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium w-24">{label}</span>
          <div className="flex-1 mx-3">
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-3 rounded-full ${scoreColor(pct, "bg")}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <span className={`font-semibold w-16 text-right ${scoreColor(pct)}`}>{suffix}</span>
          {extra && <span className="text-xs w-24 text-right">{extra}</span>}
        </div>
      </div>
    )
  }

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const movieId = parseInt(id || "0", 10)

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => moviesApi.getMovie(movieId).then((res) => res.data as Movie),
    enabled: movieId > 0,
  })

  const { data: ratingsData } = useQuery({
    queryKey: ["movie-ratings", movieId],
    queryFn: () => moviesApi.getMovieRatings(movieId).then((res) => res.data as MovieRatingsResponse),
    enabled: movieId > 0,
  })

  const { data: similarData } = useQuery({
    queryKey: ["similar-movies", movieId],
    queryFn: () => predictionsApi.getSimilar(movieId, 6).then((res) => res.data as SimilarMoviesResponse),
    enabled: movieId > 0,
  })

  const queryClient = useQueryClient()

  const { data: collectionsData } = useQuery({
    queryKey: ["collections"],
    queryFn: () => collectionsApi.getCollections().then((res) => res.data),
  })

  const addMovieMutation = useMutation({
    mutationFn: (collectionId: number) =>
      collectionsApi.addMovie(collectionId, movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] })
    },
  })

  const getWeightedVerdict = (score: number): string => {
    if (score >= 4.0) return "Universal Acclaim"
    if (score >= 3.5) return "Generally Favorable"
    if (score >= 2.5) return "Mixed Reviews"
    return "Generally Unfavorable"
  }

  const { data: myRating, refetch: refetchMyRating } = useQuery({
    queryKey: ["my-rating", movieId],
    queryFn: () => appRatingsApi.getForMovie(movieId).then(res => res.data),
    enabled: movieId > 0 && isLoggedIn(),
    retry: false,
  })

  const ratingMutation = useMutation({
    mutationFn: (rating: number) => appRatingsApi.addOrUpdate(movieId, rating),
    onSuccess: () => refetchMyRating(),
  })

  const deleteRatingMutation = useMutation({
    mutationFn: () => appRatingsApi.delete(movieId),
    onSuccess: () => refetchMyRating(),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <div className="flex gap-6">
          <Skeleton className="h-72 w-48" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load movie details. The movie may not exist.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        {movie.backdrop_url ? (
          <div className="absolute inset-0 h-48 sm:h-64 overflow-hidden rounded-lg">
            <img
              src={movie.backdrop_url}
              alt=""
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 h-48 sm:h-64 bg-muted rounded-lg" />
        )}

        <div className="relative pt-4 pb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              {movie.poster_url ? (
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-32 sm:w-40 md:w-48 h-48 sm:h-60 md:h-72 object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-32 sm:w-40 md:w-48 h-48 sm:h-60 md:h-72 bg-muted rounded-lg shadow-lg flex items-center justify-center">
                  <Film className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {movie.title}
                  {movie.release_year && (
                    <span className="text-muted-foreground font-normal ml-2">
                      ({movie.release_year})
                    </span>
                  )}
                </h1>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-sm text-muted-foreground">
                  {movie.weighted_rating != null && (
                    <div className="flex items-center gap-1">
                      <Star className={`h-4 w-4 ${scoreColor(movie.weighted_rating * 20)}`} />
                      <span className={scoreColor(movie.weighted_rating * 20)}>
                        {movie.weighted_rating.toFixed(1)}/5
                      </span>
                      <span className="text-xs">
                        (Weighted)
                      </span>
                    </div>
                  )}
                  {movie.runtime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatRuntime(movie.runtime)}
                    </div>
                  )}
                  {movie.rated && (
                    <Badge variant="outline" className="text-xs">
                      {movie.rated}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {movie.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>

              {isLoggedIn() && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => ratingMutation.mutate(star)}
                        disabled={ratingMutation.isPending}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 transition-colors ${
                            myRating && myRating.rating >= star
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground hover:text-yellow-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {myRating && (
                    <button
                      onClick={() => deleteRatingMutation.mutate()}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors ml-1"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}

              {collectionsData && collectionsData.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Collection
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Your Collections</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {collectionsData.map((collection: { collection_id: number; title: string }) => (
                      <DropdownMenuItem
                        key={collection.collection_id}
                        onClick={() => addMovieMutation.mutate(collection.collection_id)}
                        disabled={addMovieMutation.isPending}
                      >
                        {addMovieMutation.isPending ? (
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                        ) : (
                          <Plus className="h-4 w-4 mr-2" />
                        )}
                        {collection.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {movie.overview && (
                <div>
                  <h3 className="font-semibold mb-1">Overview</h3>
                  <p className="text-muted-foreground">{movie.overview}</p>
                </div>
              )}

              <div className="space-y-1 text-sm">
                {movie.director && (
                  <p>
                    <span className="font-medium">Director:</span>{" "}
                    <span className="text-muted-foreground">{movie.director}</span>
                  </p>
                )}
                {movie.lead_actors && (
                  <p>
                    <span className="font-medium">Cast:</span>{" "}
                    <span className="text-muted-foreground">{movie.lead_actors}</span>
                  </p>
                )}
                {movie.awards && (
                  <p className="flex items-start gap-1">
                    <Award className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{movie.awards}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5" />
              Ratings & Statistics
            </CardTitle>
            <p className="text-xs text-muted-foreground">Aggregated from multiple sources</p>
          </CardHeader>
          <CardContent className="space-y-6">
          {movie.weighted_rating != null && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Star className={`h-6 w-6 fill-current ${scoreColor(movie.weighted_rating * 20)}`} />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-2xl font-bold ${scoreColor(movie.weighted_rating * 20)}`}>
                      {movie.weighted_rating.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">/5</span>
                  </div>
                  <span className={`text-xs ${scoreColor(movie.weighted_rating * 20)}`}>
                    {getWeightedVerdict(movie.weighted_rating)}
                  </span>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs p-3">
                    <p className="font-semibold mb-2">Weighted Rating</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Each source is normalized to a 0-5 scale and weighted by platform reliability. Missing sources have their weight redistributed.
                    </p>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-1">Source</th>
                          <th className="text-right py-1">Weight</th>
                          <th className="text-right py-1">Scale</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr><td className="py-0.5">IMDb</td><td className="text-right">30%</td><td className="text-right">/2</td></tr>
                        <tr><td className="py-0.5">TMDB</td><td className="text-right">25%</td><td className="text-right">/2</td></tr>
                        <tr><td className="py-0.5">Rotten Tomatoes</td><td className="text-right">25%</td><td className="text-right">/20</td></tr>
                        <tr><td className="py-0.5">MovieLens</td><td className="text-right">10%</td><td className="text-right">as-is</td></tr>
                        <tr><td className="py-0.5">Metacritic</td><td className="text-right">10%</td><td className="text-right">/20</td></tr>
                      </tbody>
                    </table>
                    <p className="text-xs text-muted-foreground mt-2">
                      TMDB requires 5+ votes, MovieLens requires 5+ ratings to be included.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          <div className="space-y-3">
            {movie.avg_rating && (
              <RatingBar
                label="MovieLens"
                score={movie.avg_rating}
                maxScore={5}
                suffix={`${movie.avg_rating.toFixed(1)}/5`}
                extra={<span className="text-muted-foreground">({formatNumber(movie.rating_count)} ratings)</span>}
              />
            )}

            {movie.imdb_rating && (
              <RatingBar
                label="IMDb"
                score={movie.imdb_rating}
                maxScore={10}
                suffix={`${movie.imdb_rating.toFixed(1)}/10`}
                extra={<span className="text-muted-foreground">{movie.imdb_votes ? `(${formatNumber(movie.imdb_votes)} votes)` : ""}</span>}
              />
            )}

            {movie.vote_average !== null && movie.vote_average !== undefined && (
              <RatingBar
                label="TMDB"
                score={movie.vote_average}
                maxScore={10}
                suffix={`${movie.vote_average.toFixed(1)}/10`}
                extra={<span className="text-muted-foreground">{movie.vote_count ? `(${formatNumber(movie.vote_count)} votes)` : ""}</span>}
              />
            )}

            {movie.rotten_tomatoes_score !== null && movie.rotten_tomatoes_score !== undefined && (
              <RatingBar
                label="RT Critics"
                score={movie.rotten_tomatoes_score}
                maxScore={100}
                suffix={`${movie.rotten_tomatoes_score}%`}
                extra={<span className={movie.rotten_tomatoes_score >= 60 ? "text-green-500" : "text-red-500"}>{movie.rotten_tomatoes_score >= 60 ? "Fresh" : "Rotten"}</span>}
              />
            )}

            {movie.metacritic_score !== null && movie.metacritic_score !== undefined && (
              <RatingBar
                label="Metacritic"
                score={movie.metacritic_score}
                maxScore={100}
                suffix={`${movie.metacritic_score}`}
                extra={<span className={movie.metacritic_score >= 61 ? "text-green-500" : movie.metacritic_score >= 40 ? "text-yellow-500" : "text-red-500"}>{movie.metacritic_score >= 61 ? "Favorable" : movie.metacritic_score >= 40 ? "Mixed" : "Unfavorable"}</span>}
              />
            )}
          </div>

          {ratingsData?.stats?.stddev && (
            <div className="pt-3 border-t flex items-center gap-1.5 text-sm">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Std Dev:</span>
              <span className="font-medium">{ratingsData.stats.stddev.toFixed(2)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            TMDB Data
          </CardTitle>
          <p className="text-xs text-muted-foreground">From The Movie Database</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {movie.budget !== null && movie.budget !== undefined && movie.budget > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Budget
                </span>
                <span className="font-medium">{formatNumber(movie.budget, "$")}</span>
              </div>
            )}
            {movie.revenue !== null && movie.revenue !== undefined && movie.revenue > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Revenue
                </span>
                <span className="font-medium">{formatNumber(movie.revenue, "$")}</span>
              </div>
            )}
            {movie.vote_average !== null && movie.vote_average !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  TMDB Score
                </span>
                <span className="font-medium">{movie.vote_average.toFixed(1)}/10</span>
              </div>
            )}
            {movie.vote_count !== null && movie.vote_count !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  TMDB Votes
                </span>
                <span className="font-medium">{movie.vote_count.toLocaleString()}</span>
              </div>
            )}
            {movie.popularity !== null && movie.popularity !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Popularity
                </span>
                <span className="font-medium">{movie.popularity.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </div>

      {movie.tags && movie.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {movie.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {similarData && similarData.similar_movies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Similar Movies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarData.similar_movies.map((similar) => (
                <Link
                  key={similar.movie_id}
                  to={`/movies/${similar.movie_id}`}
                  className="group"
                >
                  <div className="space-y-2">
                    <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden">
                      {similar.poster_url ? (
                        <img
                          src={similar.poster_url}
                          alt={similar.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {similar.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {similar.release_year || "N/A"}
                        {similar.avg_rating && (
                          <span className="ml-2">
                            <Star className="h-3 w-3 inline" /> {similar.avg_rating.toFixed(1)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">External Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {movie.imdb_id && (
              <Button variant="outline" asChild>
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on IMDB
                </a>
              </Button>
            )}
            {movie.tmdb_id && (
              <Button variant="outline" asChild>
                <a
                  href={`https://www.themoviedb.org/movie/${movie.tmdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on TMDB
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
