import { Component } from 'react'
import PropTypes from 'prop-types'

import MovieCard from '../movie-card'

import './movie-list.css'

export default class MovieList extends Component {
  static defaultProps = {
    movies: [],
    rating: [],
    rateMovie: () => {},
  }

  static propTypes = {
    movies: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        id: PropTypes.number,
        genre_ids: PropTypes.arrayOf(PropTypes.number),
        overview: PropTypes.string,
        poster_path: PropTypes.string,
        vote_average: PropTypes.number,
      })
    ),
    rating: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        rating: PropTypes.number,
      })
    ),
    rateMovie: PropTypes.func,
  }

  state = {
    cards: [],
  }

  componentDidMount() {
    this.renderCards()
  }

  componentDidUpdate(prevProps) {
    const { movies, rating } = this.props
    if (prevProps.movies !== movies || prevProps.rating !== rating) {
      this.clearCards()
      this.renderCards()
    }
  }

  clearCards = () => {
    this.setState({ cards: [] })
  }

  getRatingById = (id) => {
    const { rating } = this.props
    const ratedMovie = rating.find((item) => item.id === id)
    return ratedMovie.rating
  }

  renderCards = () => {
    const { movies, rating } = this.props
    movies.forEach((movie) => {
      const isRated = rating.some((item) => movie.id === item.id)
      const userRating = isRated ? this.getRatingById(movie.id) : null
      this.setState(({ cards }) => ({
        cards: [
          ...cards,
          {
            title: movie.title,
            id: movie.id,
            genre_ids: movie.genre_ids,
            overview: movie.overview,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            userRating,
          },
        ],
      }))
    })
  }

  render() {
    const { session, rateMovie } = this.props
    const { cards } = this.state
    const elements = cards.map(
      ({ title, id, genre_ids, overview, poster_path, release_date, vote_average, userRating }) => {
        return (
          <li className="movie-list__item" key={id}>
            <MovieCard
              title={title}
              id={id}
              genre_ids={genre_ids}
              overview={overview}
              poster_path={poster_path}
              release_date={release_date}
              vote_average={vote_average}
              rating={userRating}
              rateMovie={rateMovie}
              session={session}
            />
          </li>
        )
      }
    )

    return <ul className="movie-list">{elements}</ul>
  }
}
