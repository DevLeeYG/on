const apiRootUrl = import.meta.env.VITE_API_BASE_URL

async function fetchWithToken(accessToken, method, url, params = undefined, body = undefined) {
  if (params) {
    const query = new URLSearchParams(params)
    url = `${url}?${query}`
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`
  }

  if (typeof body === 'string') {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, {
    method,
    headers,
    body
  })

  if (response.ok) {
    return response
  } else {
    if (
      (response.ok === false && response.statusText === 'Unauthorized') ||
      response.status === 419
    ) {
      alert('다시 로그인을 해주세요')

      window.location.href = '/login'
    } else if (response.status === 500) {
      alert('전송을 내용을 확인해 주세요')
    }
  }
}

async function getWithToken(accessToken, url, params = undefined) {
  const response = await fetchWithToken(accessToken, 'GET', url, params)
  if (response) {
    return await response.json()
  }
}

async function patchWithToken(accessToken, url, params = undefined, body) {
  const response = await fetchWithToken(accessToken, 'PATCH', url, params, body)
  if (response) {
    return await response.json()
  }
}

async function postWithToken(accessToken, url, params = undefined, body) {
  const response = await fetchWithToken(accessToken, 'POST', url, params, body)
  if (response) {
    return await response.json()
  }
}

export { apiRootUrl, getWithToken, patchWithToken, postWithToken }
