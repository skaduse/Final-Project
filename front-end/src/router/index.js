import Vue from 'vue'
import VueRouter from 'vue-router'
import Feed from '../views/MyFeed.vue'
import Profile from '../views/Profile.vue'
import Global from '../views/Global.vue'
import Photo from '../views/Photo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'MyFeed',
    component: Feed
  },
  {
    path: '/Profile',
    name: 'Profile',
    component: Profile
  },
  {
    path:'/Global',
    name: 'Global',
    component: Global
  },
  {
  path: '/photo/:id',
  name: 'photo',
  component: Photo
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
