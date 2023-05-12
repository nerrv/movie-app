const cutDescription = (description, maxLength = 120) => {
  if (description.length <= 0) {
    return 'No description found.'
  }
  if (description.length > 0 && description.length <= maxLength) {
    return description
  }
  if (description.length > maxLength) {
    const truncated = description.slice(0, maxLength)
    const lastSpaceIndex = truncated.lastIndexOf(' ')
    if (lastSpaceIndex !== -1) {
      return truncated.slice(0, lastSpaceIndex) + '...'
    }
    return truncated + '...'
  }
}

export default cutDescription
