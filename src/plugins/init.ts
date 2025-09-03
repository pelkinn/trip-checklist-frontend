export default defineNuxtPlugin(async nuxtApp => {
  const accessTokenCookie = useCookie('accessToken')

  const { getUser } = useUserStore(nuxtApp.vueApp.$nuxt.$pinia)

  if (!accessTokenCookie.value) {
    return
  }

  try {
    await getUser()
  } catch (err: any) {
    const statusCode = err.response?.status || 500
    const message =
      err.response?._data?.message || 'Что-то пошло не так.йцуйцуйцу..'
    console.log(err)
    showError({ statusCode, message })
    return
  }
})
