import { Component } from 'react'
import { Typography, Image, Rate } from 'antd'
import { format } from 'date-fns'
import PropTypes from 'prop-types'

import cutDescription from '../../helpers/cut-description'
import Genres from '../genres'
import VoteAverage from '../vote-average'

import './movie-card.css'

const { Title, Paragraph } = Typography

export default class MovieCard extends Component {
  static defaultProps = {
    title: '',
    id: null,
    overview: '',
    poster_path: '',
    genre_ids: [],
    vote_average: 0,
    rating: 0,
    rateMovie: () => {},
  }

  static propTypes = {
    title: PropTypes.string,
    id: PropTypes.number,
    overview: PropTypes.string,
    poster_path: PropTypes.string,
    genre_ids: PropTypes.arrayOf(PropTypes.number),
    vote_average: PropTypes.number,
    rating: PropTypes.number,
    rateMovie: PropTypes.func,
  }

  state = {
    rating: this.props.rating,
    rating_state: 0,
  }

  onRatingChange = (e) => {
    const { id, session, rateMovie } = this.props
    rateMovie(id, e, session)
    this.setState({ rating_state: e })
  }

  render() {
    const { title, id, overview, poster_path, release_date, genre_ids, vote_average, rating } = this.props
    const { rating_state } = this.state
    return (
      <div className="card">
        <div className="card__img">
          <Image src={poster_path ? 'https://image.tmdb.org/t/p/original' + poster_path : '/no_image.jpg'} />
        </div>
        <div className="card__info">
          <Title className="card__title" level={5}>
            {title}
          </Title>
          <Paragraph className="card__date" style={{ marginBottom: '9px' }}>
            {release_date ? format(new Date(release_date), 'MMMM d, y') : null}
          </Paragraph>
          <Genres className="card__genres" genre_ids={genre_ids} id={id} />
        </div>
        <VoteAverage className="card__vote" vote_average={vote_average} />
        <Paragraph className="card__description">{cutDescription(overview)}</Paragraph>
        <Rate
          className="card__rating"
          count={10}
          value={rating || rating_state}
          onChange={this.onRatingChange}
          allowHalf
        />
      </div>
    )
  }
}
