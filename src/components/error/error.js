import { Alert, Space } from 'antd'

import './error.css'

const Error = ({ error }) => {
  return (
    <Space
      direction="vertical"
      style={{
        width: '100%',
      }}
    >
      <Alert className="error" type="error" message={error.name} description={error.message} showIcon />
    </Space>
  )
}

export default Error
