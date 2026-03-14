import { Link } from "react-router-dom"
import { Film, Star } from "lucide-react"
import type { Movie } from "../types"
import { Badge } from "@/components/ui/badge"

interface MovieCardProps {
  movie: Movie
  onAddToCollection?: (movieId: number) => void
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      to={`/movies/${movie.movie_id}`}
      className="group"
      aria-label={`View details for ${movie.title}${movie.release_year ? ` (${movie.release_year})` : ''}`}
    >
      <div className="space-y-2">
        <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden relative">
          {movie.poster_url ? (
            <img
              src={movie.poster_url}
              alt={`Movie poster for ${movie.title}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          {movie.weighted_rating != null && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              {movie.weighted_rating.toFixed(1)}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
            {movie.title}
          </p>
          <p className="text-xs text-muted-foreground">{movie.release_year ?? "N/A"}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {movie.genres?.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="secondary" className="text-xs px-1 py-0">
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
