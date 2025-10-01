<template>
  <VContainer class="container">
    <div>
      <h2 class="mb-8 text-center text-h4">
        Организуйте поездку <br />
        с персональными чеклистами
      </h2>
      <div v-if="lgAndUp" class="d-flex justify-center">
        <img v-if="currentForm === 'login'" src="/assets/images/img1.webp" alt="" class="img" />
        <img v-if="currentForm === 'register'" src="/assets/images/img2.webp" alt="" class="img" />
        <img v-if="currentForm === 'forgot-password'" src="/assets/images/img3.webp" alt="" class="img" />
      </div>
    </div>

    <div class="wrapper-form">
      <AuthLoginForm
        v-if="currentForm === 'login'"
        @register="currentForm = 'register'"
        @forgot-password="currentForm = 'forgot-password'"
      />

      <AuthRegisterForm v-else-if="currentForm === 'register'" @login="currentForm = 'login'" />

      <AuthForgotPasswordForm v-else-if="currentForm === 'forgot-password'" @back-to-login="currentForm = 'login'" />
    </div>
  </VContainer>
</template>

<script setup lang="ts">
  import { useDisplay } from 'vuetify';

  useHead({
    title: 'Авторизация - Trip Checklist',
    meta: [
      {
        name: 'description',
        content: 'Войдите в систему или зарегистрируйтесь для создания персональных чеклистов путешествий'
      }
    ]
  });

  const { lgAndUp } = useDisplay();

  const currentForm = ref<'login' | 'register' | 'forgot-password'>('login');
</script>

<style scoped lang="scss">
  .container {
    display: grid;
    position: relative;
    grid-template-columns: 1fr;
    max-width: 1200px !important;
    margin-top: 50px;
    justify-items: center;

    @media #{map.get(v.$display-breakpoints, 'lg-and-up')} {
      grid-template-columns: 1fr 320px;
      gap: 150px;
      margin-top: 100px;
    }
  }

  .wrapper-form {
    width: 310px;
  }

  .img {
    max-width: 500px;
  }
</style>
