import { Component } from 'react'
import { Tag } from 'antd'

import { GenresContext } from '../context/context'

import './genres.css'

export default class Genres extends Component {
  static contextType = GenresContext
  render() {
    const { genres } = this.context
    const { genre_ids } = this.props
    const genreList = genres.map((element) => {
      for (const genreId of genre_ids) {
        if (element.id === genreId) {
          return (
            <li className="genres__item" key={element.name}>
              <Tag key={element.name}>{element.name}</Tag>
            </li>
          )
        }
      }
    })

    return <ul className="genres">{genreList}</ul>
  }
}
