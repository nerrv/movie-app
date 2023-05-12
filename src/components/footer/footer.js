import { Pagination } from 'antd'
import PropTypes from 'prop-types'

import './footer.css'

const Footer = ({ total, page, onPagination }) => {
  return (
    <Pagination
      className="footer"
      pageSize={20}
      current={page}
      total={total}
      showSizeChanger={false}
      onChange={onPagination}
    />
  )
}

Footer.defaultProps = {
  total: 0,
  page: 1,
  onPagination: () => {},
}

Footer.propTypes = {
  total: PropTypes.number,
  page: PropTypes.number,
  onPagination: PropTypes.func,
}

export default Footer
