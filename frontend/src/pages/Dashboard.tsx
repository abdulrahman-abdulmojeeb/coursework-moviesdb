import { useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { moviesApi, genresApi } from "../services/api"
import type { Movie, PaginatedResponse } from "../types"
import MovieCard from "../components/MovieCard"
import SearchFilters from "../components/SearchFilters"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"

const DEFAULTS = {
  page: 1,
  limit: 20,
  title: "",
  genre: "",
  year_from: undefined as number | undefined,
  year_to: undefined as number | undefined,
  min_rating: undefined as number | undefined,
  sort_by: "title",
  sort_order: "asc",
  director: "",
  has_awards: false,
}

function filtersFromParams(params: URLSearchParams) {
  return {
    page: Number(params.get("page")) || DEFAULTS.page,
    limit: DEFAULTS.limit,
    title: params.get("title") || DEFAULTS.title,
    genre: params.get("genre") || DEFAULTS.genre,
    year_from: params.get("year_from") ? Number(params.get("year_from")) : DEFAULTS.year_from,
    year_to: params.get("year_to") ? Number(params.get("year_to")) : DEFAULTS.year_to,
    min_rating: params.get("min_rating") ? Number(params.get("min_rating")) : DEFAULTS.min_rating,
    sort_by: (params.get("sort_by") === "rating" ? "weighted_rating" : params.get("sort_by")) || DEFAULTS.sort_by,
    sort_order: params.get("sort_order") || DEFAULTS.sort_order,
    director: params.get("director") || DEFAULTS.director,
    has_awards: params.get("has_awards") === "true",
  }
}

function filtersToParams(filters: typeof DEFAULTS) {
  const params = new URLSearchParams()
  if (filters.page > 1) params.set("page", String(filters.page))
  if (filters.title) params.set("title", filters.title)
  if (filters.genre) params.set("genre", filters.genre)
  if (filters.year_from != null) params.set("year_from", String(filters.year_from))
  if (filters.year_to != null) params.set("year_to", String(filters.year_to))
  if (filters.min_rating != null) params.set("min_rating", String(filters.min_rating))
  if (filters.sort_by !== DEFAULTS.sort_by) params.set("sort_by", filters.sort_by)
  if (filters.sort_order !== DEFAULTS.sort_order) params.set("sort_order", filters.sort_order)
  if (filters.director) params.set("director", filters.director)
  if (filters.has_awards) params.set("has_awards", "true")
  return params
}

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = filtersFromParams(searchParams)

  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: () => genresApi.getGenres().then((res) => res.data),
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ["movies", filters],
    queryFn: () =>
      moviesApi.getMovies(filters).then((res) => res.data as PaginatedResponse<Movie>),
  })

  const handleFilterChange = useCallback((newFilters: Partial<typeof DEFAULTS>) => {
    setSearchParams(filtersToParams({ ...filters, ...newFilters, page: 1 }), { replace: true })
  }, [filters, setSearchParams])

  const handlePageChange = useCallback((page: number) => {
    setSearchParams(filtersToParams({ ...filters, page }), { replace: true })
  }, [filters, setSearchParams])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Movie Catalogue</h1>
        <p className="text-muted-foreground">Browse and search the film catalogue</p>
      </div>

      <SearchFilters
        filters={filters}
        genres={genres || []}
        onFilterChange={handleFilterChange}
      />

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load movies. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {data && (
        <>
          <div className="text-sm text-muted-foreground">
            Showing {data.movies.length} of {data.total} movies
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.movies.map((movie) => (
              <MovieCard key={movie.movie_id} movie={movie} />
            ))}
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-muted-foreground">
                Page {filters.page} of {data.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === data.pages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
