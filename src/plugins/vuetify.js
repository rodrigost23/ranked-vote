import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import VueRouter from 'vue-router'
import 'vuetify/src/stylus/app.styl'
import en from '../locale/en.ts'
import pt from '../locale/pt.ts'

Vue.use(Vuetify, {
  iconfont: 'mdi',
  lang: {
    locales: { en, pt },
    current: 'en'
  }
});

Vue.use(VueRouter);