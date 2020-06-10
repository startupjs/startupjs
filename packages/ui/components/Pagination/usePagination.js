export default function usePagination (props = {}) {
  console.log('usepagination')
  const {
    variant,
    page = 1,
    boundaryCount = 0,
    count = 10,
    siblingCount = 1,
    showFirstButton = false,
    showLastButton = false,
    hidePrevButton = false,
    hideNextButton = false,
    disabled,
    onChange
  } = props

  // Basic list of items to render
  let itemList = [
    ...(showFirstButton ? ['first'] : []),
    ...(hidePrevButton ? [] : ['previous'])
  ]

  if (variant === 'compact') {
    itemList.push('status')
  } else {
    // this logic was taken from here
    // https://github.com/mui-org/material-ui/blob/master/packages/material-ui-lab/src/Pagination/usePagination.js
    const range = (start, end) => {
      const length = end - start + 1
      return Array.from({ length }, (_, i) => start + i)
    }

    const startPages = range(1, Math.min(boundaryCount, count))
    const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count)

    const siblingsStart = Math.max(
      Math.min(
        // Natural start
        page - siblingCount,
        // Lower boundary when page is high
        count - boundaryCount - siblingCount * 2 - 1
      ),
      // Greater than startPages
      boundaryCount + 2
    )

    const siblingsEnd = Math.min(
      Math.max(
        // Natural end
        page + siblingCount,
        // Upper boundary when page is low
        boundaryCount + siblingCount * 2 + 2
      ),
      // Less than endPages
      endPages[0] - 2
    )

    itemList.push(...startPages)

    // Start ellipsis
    itemList.push(
      ...(siblingsStart > boundaryCount + 2
        ? ['start-ellipsis']
        : boundaryCount + 1 < count - boundaryCount
          ? [boundaryCount + 1]
          : [])
    )

    // Sibling pages
    itemList.push(...range(siblingsStart, siblingsEnd))

    // End ellipsis
    itemList.push(
      ...(siblingsEnd < count - boundaryCount - 1
        ? ['end-ellipsis']
        : count - boundaryCount > boundaryCount
          ? [count - boundaryCount]
          : [])
    )

    itemList.push(...endPages)
  }

  itemList.push(
    ...(hideNextButton ? [] : ['next']),
    ...(showLastButton ? ['last'] : [])
  )

  // Map the button type to its page number
  const buttonPage = (type) => {
    switch (type) {
      case 'first':
        return 1
      case 'previous':
        return page - 1
      case 'next':
        return page + 1
      case 'last':
        return count
      default:
        return null
    }
  }

  // Convert the basic item list to pagination item props objects
  const items = itemList.map((item) => {
    if (typeof item === 'number') {
      return {
        onPress: (event) => { onChange(event, item) },
        type: 'page',
        value: item,
        selected: item === page,
        disabled
      }
    }

    const value = buttonPage(item)
    return {
      onPress: (event) => { onChange(event, value) },
      type: item,
      value,
      selected: false,
      disabled:
        disabled ||
        (item.indexOf('ellipsis') === -1 && item !== 'status' &&
          (item === 'next' || item === 'last' ? page >= count : page <= 1))
    }
  })

  return items
}
