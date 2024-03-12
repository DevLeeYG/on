import { apiRootUrl, getWithToken } from './_base'

const getBins = async (token) => {
  const res = await getWithToken(token, `${apiRootUrl}/toolshop/bins`)
  if (res) return res.rows
}

const getUnSotredTools = async (token) => {
  const res = await getWithToken(token, `${apiRootUrl}/toolshop/unsorted_tools`)
  if (res) return res.rows
}

const getUnSotredToolTips = async (token) => {
  const res = await getWithToken(token, `${apiRootUrl}/toolshop/unsorted_tool_tips`)
  if (res) return res.rows
}

// Toools//
const getToolTypes = async (token, currentPage, pageSize, ordering, search) => {
  const params = new URLSearchParams()

  params.append('page', currentPage)
  params.append('page_size', pageSize)
  params.append('ordering', ordering)
  params.append('search', search)

  const query = params.toString()
  const res = await getWithToken(token, `${apiRootUrl}/tool_types/?${query}`)

  if (res) {
    return res
  }
}

export { getBins }
