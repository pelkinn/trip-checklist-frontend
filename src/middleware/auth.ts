export default defineNuxtRouteMiddleware(() => {
  const nuxtApp = useNuxtApp();
  const { user } = storeToRefs(useUserStore(nuxtApp.$pinia));
  if (!user.value) {
    return navigateTo('/auth');
  }
});
