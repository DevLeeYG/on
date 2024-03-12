import { apiRootUrl, postWithToken } from './_base'

const postToolType = async (token, body) => {
  const res = await postWithToken(token, `${apiRootUrl}/tool_types`, undefined, body)
  return res
}

const postTools = async (token, body) => {
  const res = postWithToken(token, `${apiRootUrl}/tools`, undefined, body)
  return res
}
const postSpareTools = async (token, body) => {
  const res = await postWithToken(token, `${apiRootUrl}/spare_tools`, undefined, body)
  console.log(body)
  return res
}

const postSpareToolTags = async (token, body) => {
  const res = await postWithToken(token, `${apiRootUrl}/spare_tool_tags`, undefined, body)

  return res
}

const postAddUsers = async (token, body) => {
  const res = await postWithToken(token, `${apiRootUrl}/users`, undefined, body)
  console.log(res)
  return res
}

export { postAddUsers, postSpareTools, postSpareToolTags, postTools, postToolType }
