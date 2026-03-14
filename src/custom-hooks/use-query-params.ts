import { useState } from "react"

const getQuery = () => {
  return new URLSearchParams(window.location.search)
}

const getQueryStringVal = (key: string) => {
  return getQuery().get(key)
}

const useQueryParam = (key: string, defaultVal: string): [string, (newVal: string) => void] => {
  const [query, setQuery] = useState(getQueryStringVal(key) || defaultVal)

  const updateUrl = (newVal: string) => {
    setQuery(newVal)

    const query = getQuery()

    if (newVal.trim() !== "") {
      query.set(key, newVal)
    } else {
      query.delete(key)
    }

    const { protocol, pathname, host } = window.location
    const newUrl = `${protocol}//${host}${pathname}?${query.toString()}`
    window.history.pushState({}, "", newUrl)
  }

  return [query, updateUrl]
}

export default useQueryParam
