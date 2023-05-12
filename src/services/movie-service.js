export default class MovieService {
  _apiBase = 'https://api.themoviedb.org/3'
  _apiKey = 'd98e405e80a6f654633a01c5ce6b9dd2'

  getResource = async (url) => {
    const res = await fetch(`${this._apiBase}${url}`)
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}` + `, received ${res.status}`)
    }
    return res
  }

  getPopularMovies = async (page = 1) => {
    try {
      const res = await this.getResource(`/movie/popular?api_key=${this._apiKey}&page=${page}`)
      return res.json()
    } catch (err) {
      throw new Error(`Received ${err}`)
    }
  }

  searchMovies = async (query, page = 1) => {
    try {
      const res = await this.getResource(`/search/movie?api_key=${this._apiKey}&query=${query}&page=${page}`)
      return res.json()
    } catch (err) {
      throw new Error(`Received ${err}`)
    }
  }

  getGenres = async () => {
    try {
      const res = await this.getResource(`/genre/movie/list?api_key=${this._apiKey}`)
      return res.json()
    } catch (err) {
      throw new Error(`Received ${err}`)
    }
  }
}
