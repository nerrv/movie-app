import MovieService from './movie-service'

export default class SessionService extends MovieService {
  createGuestSession = async () => {
    const res = await this.getResource(`/authentication/guest_session/new?api_key=${this._apiKey}`)
    return res.json()
  }

  rateMovie = async (id, rate, session) => {
    const url = `${this._apiBase}/movie/${id}/rating?api_key=${this._apiKey}&guest_session_id=${session}`
    if (!rate) return
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: rate }),
    })
    if (!res.ok) {
      throw new Error('Failed to rate' + `, received ${res.status}`)
    }
    return res.json()
  }

  getRatedMovies = async (session, page = 1) => {
    if (!session) return
    try {
      const res = await this.getResource(`/guest_session/${session}/rated/movies?api_key=${this._apiKey}&page=${page}`)
      return res.json()
    } catch (err) {
      throw new Error(`Received ${err}`)
    }
  }
}
