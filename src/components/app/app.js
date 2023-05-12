import React, { Component } from 'react'
import { Tabs, Result } from 'antd'
import { FrownOutlined, WifiOutlined } from '@ant-design/icons'
import { debounce } from 'lodash'

import { GenresContext } from '../context/context'
import SearchPanel from '../search-panel'
import MovieService from '../../services/movie-service'
import SessionService from '../../services/session-service'
import MovieList from '../movie-list'
import Spinner from '../spinner'
import Error from '../error'
import Footer from '../footer'

import './app.css'

export default class App extends Component {
  movieService = new MovieService()
  sessionService = new SessionService()

  state = {
    moviesData: [],
    ratedMovies: [],
    rating: [],
    query: '',
    page: 1,
    ratedPage: 1,
    error: null,
    totalMovies: null,
    totalRatedMovies: null,
    genres: null,
    loading: true,
    hasError: false,
    session: localStorage.getItem('session'),
  }

  debouncedSearch = debounce((query, page) => {
    this.updateMovies(query, page)
  }, 700)

  componentDidMount() {
    const { query, page, ratedPage, session } = this.state
    try {
      if (!session) {
        this.sessionService.createGuestSession().then((res) => this.rememberSession(res.guest_session_id))
      }
      this.updateGenres()
      this.updatePopularMovies(page)
      this.updateRatedMovies(session, ratedPage)
      this.debouncedSearch(query, page)
    } catch (err) {
      this.setState({ hasError: true, error: err })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { query, page, ratedPage, rating, session } = this.state
    if (query !== prevState.query || page !== prevState.page) {
      this.debouncedSearch(query, page)
    }

    if (query === '' && page !== prevState.page) {
      this.updatePopularMovies(page)
    }

    if (rating !== prevState.rating || ratedPage !== prevState.ratedPage) {
      this.updateRatedMovies(session, ratedPage)
    }
  }

  rememberSession = (id) => {
    if (!localStorage.getItem('session')) {
      localStorage.setItem('session', id)
      this.setState({ session: id })
    }
  }

  onError = (err) => {
    this.setState({
      hasError: true,
      error: err,
      loading: false,
    })
  }

  onPagination = (page) => {
    this.setState({ page, loading: true })
  }

  onRatedPagination = (ratedPage) => {
    this.setState({ ratedPage, loading: true })
  }

  onRateChange = (id, value) => {
    const { rating } = this.state
    let result = JSON.parse(JSON.stringify(rating))
    const hasUserRating = rating.find((item) => item.id === id)
    if (hasUserRating) {
      result = result.map((item) => {
        if (item.id === id) {
          return {
            id,
            rating: value,
          }
        }
        return item
      })
    } else {
      result.push({
        id,
        rating: value,
      })
    }
    this.setState({ rating: result })
  }

  onTabChange = (key) => {
    const { session, ratedPage, page } = this.state
    if (key === '2') {
      this.updateRatedMovies(session, ratedPage)
    } else {
      this.updatePopularMovies(page)
    }
  }

  onMoviesLoaded = (movies) => {
    this.setState({
      moviesData: movies.results,
      totalMovies: movies.total_results,
      loading: false,
    })
  }

  onRatedMoviesLoaded = (movies) => {
    this.setState({
      ratedMovies: movies.results,
      totalRatedMovies: movies.total_results,
      ratedPage: movies.page,
      loading: false,
    })
  }

  updateMovies(query, page) {
    if (query) {
      this.movieService
        .searchMovies(query, page)
        .then((movies) => {
          this.onMoviesLoaded(movies)
        })
        .catch(this.onError)
    }
  }

  updatePopularMovies(page) {
    this.movieService
      .getPopularMovies(page)
      .then((movies) => {
        this.onMoviesLoaded(movies)
      })
      .catch(this.onError)
  }

  updateRatedMovies(session, ratedPage) {
    if (session) {
      this.sessionService
        .getRatedMovies(session, ratedPage)
        .then((movies) => {
          this.onRatedMoviesLoaded(movies)
        })
        .catch(this.onError)
    }
  }

  updateGenres() {
    this.movieService.getGenres().then(this.onGenresLoaded).catch(this.onError)
  }

  onGenresLoaded = (genres) => {
    this.setState(() => {
      return {
        genres,
        loading: false,
        hasError: false,
      }
    })
  }

  onLabelChange = (evt) => {
    const { value } = evt.target
    this.setState({
      query: value,
      loading: true,
      hasError: false,
    })
  }

  rateMovie = (id, value, session) => {
    const { ratedPage } = this.state
    this.sessionService.rateMovie(id, value, session)
    this.onRateChange(id, value)
    this.updateRatedMovies(session, ratedPage)
  }

  render() {
    const {
      moviesData,
      ratedMovies,
      rating,
      loading,
      hasError,
      error,
      query,
      page,
      ratedPage,
      totalMovies,
      totalRatedMovies,
      genres,
      session,
    } = this.state

    const hasData = !(loading || hasError)
    const spinner = loading ? <Spinner /> : null
    const isEmpty = hasData && moviesData.length === 0
    const isOnline = window.navigator.onLine
    const items = [
      {
        key: '1',
        label: 'Search',
        children: (
          <div className="wrapper">
            <SearchPanel query={query} onLabelChange={this.onLabelChange} />
            {spinner}
            {isEmpty ? <Result icon={<FrownOutlined />} title="No movies found" /> : null}
            {hasError ? <Error error={error} /> : null}
            {hasData ? (
              <MovieList movies={moviesData} session={session} rating={rating} rateMovie={this.rateMovie} />
            ) : null}
            <Footer total={totalMovies} page={page} onPagination={this.onPagination} />
          </div>
        ),
      },
      {
        key: '2',
        label: 'Rated',
        children: (
          <div>
            {spinner}
            {hasError ? <Error error={error} /> : null}
            {hasData ? (
              <MovieList movies={ratedMovies} session={session} rating={rating} rateMovie={this.rateMovie} />
            ) : null}
            <Footer total={totalRatedMovies} page={ratedPage} onPagination={this.onRatedPagination} />
          </div>
        ),
      },
    ]
    const content = isOnline ? (
      <section className="movie-app">
        <GenresContext.Provider value={genres}>
          <Tabs defaultActiveKey="1" items={items} onChange={this.onTabChange} centered />
        </GenresContext.Provider>
      </section>
    ) : (
      <Result icon={<WifiOutlined />} title="You're offline" subTitle="Please, check your connection." />
    )

    return <React.Fragment>{content}</React.Fragment>
  }
}
