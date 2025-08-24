import './styles.css';
import router from './router';
import { createApp } from 'vue';
import App from './app/App.vue';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { md3 } from 'vuetify/blueprints';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/index';
import i18n from './i18n';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

const vuetify = createVuetify({
  blueprint: md3,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'customLight',
    themes: {
      customLight: {
        dark: false,
        colors: {
          primary: '#DB4444',
          secondary: '#000000',
        },
        variables: {
          // optional overrides
        },
      },
    },
  },
});

const app = createApp(App);
app.use(createPinia());
app.use(i18n);
app.use(router);
app.use(vuetify);
app.component('VSelect', vSelect);

// Initialize auth store after pinia is created
const pinia = app._context.provides.pinia;
const authStore = useAuthStore(pinia);

// Initialize auth store
authStore
  .initializeFromStorage()
  .then(() => {
    app.mount('#root');
  })
  .catch((error) => {
    // Failed to initialize auth store
  });
