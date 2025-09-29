import { mdiClose } from '@mdi/js';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { ru } from 'vuetify/locale';
import 'vuetify/styles';
import colors from 'vuetify/util/colors';

export default defineNuxtPlugin(async (nuxtApp) => {
  const vuetify = createVuetify({
    locale: {
      locale: 'ru',
      messages: { ru }
    },

    icons: {
      defaultSet: 'mdi',
      aliases: {
        ...aliases,
        clear: mdiClose
      },
      sets: { mdi }
    },

    theme: {
      defaultTheme: 'default',
      themes: {
        default: {
          dark: false,
          colors: {
            primary: '#5492c8',
            secondary: '#ff6b1a',
            success: colors.green.base,
            error: colors.red.base
          }
        }
      }
    },

    defaults: {
      VContainerSlim: {
        fluid: true,
        class: 'v-container-slim'
      },
      VChipGroup: {
        color: 'lighten-3',
        variant: 'outlined'
      },
      VProgressLinear: {
        color: 'primary'
      },
      VList: {
        color: 'secondary'
      },
      VTabs: {
        color: 'primary'
      },
      VBtn: {
        color: 'primary',
        flat: true,
        variant: 'flat',
        size: 'large'
      },
      VTextField: {
        variant: 'outlined',
        density: 'comfortable',
        flat: true
      },
      VTextarea: {
        variant: 'outlined',
        density: 'comfortable',
        flat: true
      },
      VSelect: {
        variant: 'outlined',
        flat: true,
        hideDetails: 'auto',
        density: 'comfortable'
      },
      VCheckbox: {
        color: 'primary',
        density: 'comfortable'
      },

      VRadioGroup: {
        color: 'success'
      },
      VRadio: {
        color: 'success'
      },
      VSlider: {
        color: 'success'
      }
    }
  });

  nuxtApp.vueApp.use(vuetify);
});
