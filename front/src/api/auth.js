import { apiRootUrl } from './_base'

async function getTokens(username, password) {
  const response = await fetch(`${apiRootUrl}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })

  if (response.ok) {
    return await response.json()
  }
}
export { getTokens }
