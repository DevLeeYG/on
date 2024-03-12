import { apiRootUrl, patchWithToken } from './_base'

const patchChangeToolsStockCount = async (token, row, params = undefined, body) => {
  const res = await patchWithToken(
    token,
    `${apiRootUrl}/spare_tools/${row.id}/change_stock_count`,
    params,
    body
  )
  return res
}
const patchChangeToolTipsStockCount = async (token, row, params = undefined, body) => {
  const res = await patchWithToken(
    token,
    `${apiRootUrl}/spare_tool_tips/${row.id}/change_stock_count`,
    params,
    body
  )
  return res
}

const patchChangeStockCount = async (token, item, params = undefined, body) => {
  const res = await patchWithToken(
    token,
    `${apiRootUrl}/spare_${item.type}s/${item.id}/change_stock_count`,
    params,
    body
  )
  return res
}

const patchRemoveSpareToolAndTips = async (token, id, type, body) => {
  const res = await patchWithToken(
    token,
    `${apiRootUrl}/toolshop/bins/${id}/remove_spare_${type}`,
    undefined,
    body
  )
  return res
}

const patchAddSpareTools = async (token, id, body) => {
  const res = await patchWithToken(
    token,
    `${apiRootUrl}/toolshop/bins/${id}/add_spare_tools`,
    undefined,
    body
  )

  return res
}

const patchAddSpareToolTips = async (token, id, body) => {
  const res = await patchWithToken(
    token,
    `${apiRootUrl}/toolshop/bins/${id}/add_spare_tool_tips`,
    undefined,
    body
  )

  return res
}

const patchModifyInfo = async (token, id, type, form) => {
  const res = await patchWithToken(token, `${apiRootUrl}/spare_${type}s/${id}`, undefined, form)
  return res
}

const patchAddTags = async (token, id, body) => {
  await patchWithToken(token, `${apiRootUrl}/spare_tools/${id}/add_tags`, undefined, body)
}

const patchRemoveTags = async (token, id, body) => {
  const res = await patchWithToken(
    token,
    `${apiRootUrl}/spare_tools/${id}/remove_tags`,
    undefined,
    body
  )
  return res
}

const patchAddRoles = async (token, id, body) => {
  const res = await patchWithToken(token, `${apiRootUrl}/users/${id}/add_roles`, undefined, body)
  return res
}

export {
  patchAddRoles,
  patchAddSpareTools,
  patchAddSpareToolTips,
  patchAddTags,
  patchChangeStockCount,
  patchChangeToolsStockCount,
  patchChangeToolTipsStockCount,
  patchModifyInfo,
  patchRemoveSpareToolAndTips,
  patchRemoveTags
}
