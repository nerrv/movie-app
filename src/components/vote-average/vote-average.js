import './vote-average.css'

const VoteAverage = ({ vote_average }) => {
  let borderColor
  if ((vote_average >= 0) & (vote_average < 3)) {
    borderColor = '#E90000'
  } else if ((vote_average >= 3) & (vote_average < 5)) {
    borderColor = '#E97E00'
  } else if ((vote_average >= 5) & (vote_average < 7)) {
    borderColor = '#E9D100'
  } else if (vote_average >= 7) {
    borderColor = '#66E900'
  }

  return (
    <div className="card__vote" style={{ border: `2px solid ${borderColor}` }}>
      {vote_average.toFixed(1)}
    </div>
  )
}

export default VoteAverage
