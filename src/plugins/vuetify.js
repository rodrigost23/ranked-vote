import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import en from '../locale/en.ts';
import pt from '../locale/pt.ts';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  locale: {
    locales: { en, pt },
    current: 'en'
  }
});
