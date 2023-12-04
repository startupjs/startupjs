import { useBind } from 'startupjs'

export default function usePagination ({
  variant,
  page,
  $page,
  pages,
  skip,
  $skip,
  limit,
  $limit,
  count,
  boundaryCount = 1, // min 1
  siblingCount = 1, // min 0
  showFirstButton = false,
  showLastButton = false,
  showPrevButton = true,
  showNextButton = true,
  disabled,
  onChangePage,
  onChangeLimit
}
) {
  ({ page, onChangePage } = useBind({ $page, page, onChangePage }))
  ;({ skip } = useBind({ $skip, skip }))
  // TODO: Add selectbox to component to change limit
  ;({ limit, onChangeLimit } = useBind({ $limit, limit, onChangeLimit }))

  if (page == null) {
    if (skip != null && limit != null) {
      page = Math.ceil(skip / limit)
    } else {
      throw new Error(
        '[@startupjs/ui] usePagination: page cannot be calculated'
      )
    }
  }

  if (pages == null) {
    if (count != null && limit != null) {
      pages = Math.ceil(count / limit)
    } else {
      throw new Error(
        '[@startupjs/ui] usePagination: pages cannot be calculated'
      )
    }
  }

  // min 1
  pages = pages || 1

  // Basic list of items to render
  const itemList = [
    ...(showFirstButton ? ['first'] : []),
    ...(showPrevButton ? ['previous'] : [])
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

    const startPages = range(0, Math.min(boundaryCount, pages) - 1)
    const endPages = range(Math.max(pages - boundaryCount, boundaryCount), pages - 1)

    const siblingsStart = Math.max(
      Math.min(
        // Natural start
        page - siblingCount,
        // Lower boundary when page is high
        pages - boundaryCount - siblingCount * 2 - 2
      ),
      // Greater than startPages
      boundaryCount + 1
    )

    const siblingsEnd = Math.min(
      Math.max(
        // Natural end
        page + siblingCount,
        // Upper boundary when page is low
        boundaryCount + siblingCount * 2 + 1
      ),
      // Less than endPages
      endPages[0] - 2
    )

    itemList.push(...startPages)

    // Start ellipsis
    itemList.push(
      ...(siblingsStart > boundaryCount + 1
        ? ['start-ellipsis']
        : boundaryCount + 1 < pages - boundaryCount
          ? [boundaryCount]
          : [])
    )

    // Sibling pages
    itemList.push(...range(siblingsStart, siblingsEnd))

    // End ellipsis
    itemList.push(
      ...(siblingsEnd < pages - boundaryCount - 2
        ? ['end-ellipsis']
        : pages - boundaryCount > boundaryCount
          ? [pages - boundaryCount - 1]
          : [])
    )

    itemList.push(...endPages)
  }

  itemList.push(
    ...(showNextButton ? ['next'] : []),
    ...(showLastButton ? ['last'] : [])
  )

  // Map the button type to its page number
  const buttonPage = (type) => {
    switch (type) {
      case 'first':
        return 0
      case 'previous':
        return page - 1
      case 'next':
        return page + 1
      case 'last':
        return pages - 1
      default:
        return null
    }
  }

  // Convert the basic item list to pagination item props objects
  const items = itemList.map((item) => {
    if (typeof item === 'number') {
      return {
        onPress: () => { onChangePage(item) },
        type: 'page',
        value: item,
        selected: item === page,
        disabled
      }
    }

    if (item === 'status') {
      return {
        type: item,
        value: `${page + 1} of ${pages}`,
        selected: false,
        disabled
      }
    }

    const value = buttonPage(item)

    return {
      onPress: () => { value !== null && onChangePage(value) },
      type: item,
      value,
      selected: false,
      disabled:
        disabled ||
        (item.indexOf('ellipsis') === -1 &&
          (item === 'next' || item === 'last' ? page >= pages - 1 : page <= 0))
    }
  })

  return items
}
