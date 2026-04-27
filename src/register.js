import { createAPI } from 'cube-ui'
import Vue from 'vue'
import HeaderDetail from 'components/header-detail/header-detail'
import ShopCartList from 'components/shop-cart-list/shop-cart-list'
import ShopCartStikcy from 'components/shop-cart-sticky/shop-cart-sticky'
import Food from 'components/food/food'
import RatingForm from 'components/rating-form/rating-form'
import Checkout from 'components/checkout/checkout'

Vue.component('cube-button', () => import('cube-ui/lib/button'))
Vue.component('cube-input', () => import('cube-ui/lib/input'))
Vue.component('cube-select', () => import('cube-ui/lib/select'))
Vue.component('cube-checkbox', () => import('cube-ui/lib/checkbox'))

createAPI(Vue, HeaderDetail)
createAPI(Vue, ShopCartList)
createAPI(Vue, ShopCartStikcy)
createAPI(Vue, Food)
createAPI(Vue, RatingForm)
createAPI(Vue, Checkout)
