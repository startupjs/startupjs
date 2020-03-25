export default function usePagination (props = {}) {
  const {
    boundaryCount: boundaryCountProp = 1,
    count,
    disabled,
    hideNextButton,
    hidePrevButton,
    page,
    showFirstButton,
    showLastButton,
    siblingCount
  } = props

  const boundaryCount = boundaryCountProp - 1

  const range = (start, end) => {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
  }

  const startPages = range(1, Math.min(boundaryCount + 1, count))
  const endPages = range(Math.max(count - boundaryCount, boundaryCount + 2), count)

  const siblingsStart = Math.max(
    Math.min(
      // Natural start
      page - siblingCount,
      // Lower boundary when page is high
      count - boundaryCount - siblingCount * 2 - 2
    ),
    // Greater than startPages
    boundaryCount + 3
  )

  const siblingsEnd = Math.min(
    Math.max(
      // Natural end
      page + siblingCount,
      // Upper boundary when page is low
      boundaryCount + siblingCount * 2 + 3
    ),
    // Less than endPages
    endPages[0] - 2
  )

  // Basic list of items to render
  // e.g. itemList = ['first', 'previous', 1, 'ellipsis', 4, 5, 6, 'ellipsis', 10, 'next', 'last']
  const itemList = [
    ...(showFirstButton ? ['first'] : []),
    ...(hidePrevButton ? [] : ['previous']),
    ...startPages,

    // Start ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...(siblingsStart > boundaryCount + 3
      ? ['start-ellipsis']
      : 2 + boundaryCount < count - boundaryCount - 1
        ? [2 + boundaryCount]
        : []),

    // Sibling pages
    ...range(siblingsStart, siblingsEnd),

    // End ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...(siblingsEnd < count - boundaryCount - 2
      ? ['end-ellipsis']
      : count - boundaryCount - 1 > boundaryCount + 1
        ? [count - boundaryCount - 1]
        : []),

    ...endPages,
    ...(hideNextButton ? [] : ['next']),
    ...(showLastButton ? ['last'] : [])
  ]

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

  // Convert the basic item list to PaginationItem props objects
  const items = itemList.map((item) => {
    return typeof item === 'number'
      ? {
        type: 'page',
        page: item,
        selected: item === page,
        disabled
      }
      : {
        type: item,
        page: buttonPage(item),
        selected: false,
        disabled:
            disabled ||
            (item.indexOf('ellipsis') === -1 &&
              (item === 'next' || item === 'last' ? page >= count : page <= 1))
      }
  })

  return items
}
