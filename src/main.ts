import '@mdi/font/css/materialdesignicons.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import App from '@/App.vue'

const vuetify = createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#3949ab',
        },
      },
    },
  },
})

createApp(App).use(createPinia()).use(vuetify).mount('#app')
