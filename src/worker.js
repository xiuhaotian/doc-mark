export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const staticResponse = await env.ASSETS.fetch(request)
    if (staticResponse.status !== 404) return staticResponse
    return new Response('Not Found', { status: 404 })
  },
}
