# Trip Checklist Frontend

Фронтенд приложения для создания персональных чеклистов путешествий.

## Технологии

- **Nuxt 3** - Vue.js фреймворк
- **Vuetify 3** - UI библиотека
- **Vuelidate** - валидация форм
- **TypeScript** - типизация

## Установка

```bash
npm install
```

## Настройка

1. Создайте файл `.env` в корне проекта:
```env
# API Configuration
NUXT_API_BASE_URL=http://localhost:3000
```

2. Убедитесь, что ваш API сервер запущен на указанном порту.

## Разработка

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

## Функциональность

### Авторизация

- ✅ Вход в систему
- ✅ Регистрация
- ✅ Восстановление пароля
- ✅ Валидация форм с Vuelidate
- ✅ Middleware для защиты маршрутов
- ✅ Автоматическое перенаправление

### Компоненты

- `LoginForm` - форма входа
- `RegisterForm` - форма регистрации  
- `ForgotPasswordForm` - форма восстановления пароля

### Composable

- `useAuth` - управление состоянием авторизации

### Middleware

- `auth` - защита маршрутов для авторизованных пользователей
- `guest` - перенаправление авторизованных пользователей

## Структура проекта

```
src/
├── components/
│   └── auth/
│       ├── LoginForm.vue
│       ├── RegisterForm.vue
│       └── ForgotPasswordForm.vue
├── composables/
│   └── useAuth.ts
├── config/
│   └── api.ts
├── middleware/
│   ├── auth.ts
│   └── guest.ts
├── pages/
│   ├── index.vue
│   └── auth.vue
├── plugins/
│   └── vuelidate.client.ts
└── types/
    └── auth.ts
```

## API Endpoints

Приложение использует следующие эндпоинты API:

- `POST /auth/login` - вход в систему
- `POST /auth/register` - регистрация
- `GET /auth/me` - получение профиля пользователя
- `POST /auth/forgot-password` - запрос сброса пароля
- `POST /auth/reset-password` - сброс пароля
- `POST /auth/verify-email` - подтверждение email
- `POST /auth/resend-verification` - повторная отправка письма подтверждения
