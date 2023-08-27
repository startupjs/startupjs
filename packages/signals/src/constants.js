const LOCAL_COLLECTION_REGEX = /^(_|$)/

export const isLocalCollection = collectionName => LOCAL_COLLECTION_REGEX.test(collectionName)
export const isRemoteDocSegments = segments => segments.length === 2 && !isLocalCollection(segments[0])
export const isRemoteDocDataSegments = segments => segments.length >= 2 && !isLocalCollection(segments[0])
