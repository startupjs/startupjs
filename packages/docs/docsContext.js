import React, { useContext, createContext } from 'react'

const DocsContext = createContext()

export function wrapDocsContext (Component, docs = {}) {
  return function DocsContextWrapper (props) {
    return (
      <DocsContext.Provider value={docs}>
        <Component {...props} />
      </DocsContext.Provider>
    )
  }
}

export function useDocsContext () {
  return useContext(DocsContext)
}
