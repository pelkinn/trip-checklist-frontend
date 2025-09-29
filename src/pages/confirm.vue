<template>
  <div class="confirm-page">
    <LayoutAppHeader />
    <div class="container">
      <img src="/assets/icons/icon1.webp" alt="" class="img" />
      <span class="info">Почта подтверждена!</span>
      <UiBaseButton size="large" variant="outline" @click="$emit('forgotPassword')"> Войти </UiBaseButton>
    </div>

    <div class="container">
      <img src="/assets/icons/icon2.webp" alt="" class="img" />
      <h2>Ошибка!</h2>
      <span class="info">Истек срок действия ссылки</span>
      <UiBaseButton size="large" variant="outline" @click="$emit('forgotPassword')"> Войти </UiBaseButton>
    </div>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    padding-top: 150px;
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }

  .img {
    max-width: 40px;
  }

  h2 {
    font-size: 30px;
  }
  .info {
    font-size: 26px;
  }
</style>
