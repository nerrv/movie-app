import React, { Component } from 'react'
import { Input } from 'antd'
import PropTypes from 'prop-types'

import './search-panel.css'

export default class SearchPanel extends Component {
  static defaultProps = {
    query: '',
    onLabelChange: () => {},
  }

  static propTypes = {
    query: PropTypes.string,
    onLabelChange: PropTypes.func,
  }

  onSubmit = (evt) => {
    evt.preventDefault()
  }

  render() {
    const { query, onLabelChange } = this.props
    return (
      <form className="search-form" onSubmit={this.onSubmit}>
        <Input placeholder="Type to search..." value={query} allowClear onChange={onLabelChange} />
      </form>
    )
  }
}
