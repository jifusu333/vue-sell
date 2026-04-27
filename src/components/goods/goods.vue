<template>
  <div class="goods">
    <div class="scroll-nav-wrapper">
      <cube-scroll-nav
        :side=true
        :data="goods"
        :options="scrollOptions"
        v-if="goods.length"
      >
        <template slot="bar" slot-scope="props">
          <cube-scroll-nav-bar
            direction="vertical"
            :labels="props.labels"
            :txts="barTxts"
            :current="props.current"
          >
            <template slot-scope="props">
              <div class="text">
                <support-ico
                  v-if="props.txt.type>=1"
                  :size=3
                  :type="props.txt.type"
                ></support-ico>
                <span>{{props.txt.name}}</span>
                <span class="num" v-if="props.txt.count">
                  <bubble :num="props.txt.count"></bubble>
                </span>
              </div>
            </template>
          </cube-scroll-nav-bar>
        </template>
        <cube-scroll-nav-panel
          v-for="good in goods"
          :key="good.name"
          :label="good.name"
          :title="good.name"
        >
          <ul>
            <li
              @click="selectFood(food)"
              v-for="food in good.foods"
              :key="food.name"
              class="food-item"
            >
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cart-control-wrapper">
                  <cart-control @add="onAdd" :food="food"></cart-control>
                </div>
              </div>
            </li>
          </ul>
        </cube-scroll-nav-panel>
      </cube-scroll-nav>
    </div>
    <div class="shop-cart-wrapper">
      <shop-cart
        ref="shopCart"
        :select-foods="selectFoods"
        :delivery-price="seller.deliveryPrice"
        :min-price="seller.minPrice"></shop-cart>
    </div>
  </div>
</template>

<script>
  import { getGoods } from 'api'
  import CartControl from 'components/cart-control/cart-control'
  import ShopCart from 'components/shop-cart/shop-cart'
  import Food from 'components/food/food'
  import SupportIco from 'components/support-ico/support-ico'
  import Bubble from 'components/bubble/bubble'

  export default {
    name: 'goods',
    props: {
      data: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        goods: [],
        selectedFood: {},
        scrollOptions: {
          click: false,
          directionLockThreshold: 0
        }
      }
    },
    computed: {
      seller() {
        return this.data.seller
      },
      selectFoods() {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      },
      barTxts() {
        let ret = []
        this.goods.forEach((good) => {
          const { type, name, foods } = good
          let count = 0
          foods.forEach((food) => {
            count += food.count || 0
          })
          ret.push({
            type,
            name,
            count
          })
        })
        return ret
      }
    },
    methods: {
      fetch() {
        if (!this.fetched) {
          this.fetched = true
          getGoods({
            id: this.seller.id
          }).then((goods) => {
            this.goods = goods
          })
        }
      },
      selectFood(food) {
        this.selectedFood = food
        this._showFood()
        this._showShopCartSticky()
      },
      onAdd(target) {
        this.$refs.shopCart.drop(target)
      },
      _showFood() {
        this.foodComp = this.foodComp || this.$createFood({
          $props: {
            food: 'selectedFood'
          },
          $events: {
            add: (target) => {
              this.shopCartStickyComp.drop(target)
            },
            leave: () => {
              this._hideShopCartSticky()
            }
          }
        })
        this.foodComp.show()
      },
      _showShopCartSticky() {
        this.shopCartStickyComp = this.shopCartStickyComp || this.$createShopCartSticky({
          $props: {
            selectFoods: 'selectFoods',
            deliveryPrice: this.seller.deliveryPrice,
            minPrice: this.seller.minPrice,
            fold: true
          }
        })
        this.shopCartStickyComp.show()
      },
      _hideShopCartSticky() {
        this.shopCartStickyComp.hide()
      }
    },
    components: {
      Bubble,
      SupportIco,
      CartControl,
      ShopCart,
      Food
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"
  .goods
    position: relative
    text-align: left
    height: 100%
    background: $color-white
    .scroll-nav-wrapper
      position: absolute
      width: 100%
      top: 0
      left: 0
      bottom: 48px
    >>> .cube-scroll-nav-bar
      width: 85px
      white-space: normal
      overflow: hidden
      background: linear-gradient(180deg, #f8f9fa 0%, #f1f3f4 100%)
    >>> .cube-scroll-nav-bar-item
      padding: 0 12px
      display: flex
      align-items: center
      height: 58px
      line-height: 14px
      font-size: $fontsize-small
      background: transparent
      transition: all 0.2s ease
      position: relative

      &::before
        content: ''
        position: absolute
        left: 0
        top: 50%
        transform: translateY(-50%)
        width: 3px
        height: 0
        background: $color-blue
        transition: height 0.2s ease

      .text
        flex: 1
        position: relative
        font-weight: 500
      .num
        position: absolute
        right: -8px
        top: -10px
      .support-ico
        display: inline-block
        vertical-align: top
        margin-right: 4px
    >>> .cube-scroll-nav-bar-item_active
      background: $color-white
      color: $color-dark-grey
      font-weight: bold

      &::before
        height: 24px
    >>> .cube-scroll-nav-panel
      background: $color-white
    >>> .cube-scroll-nav-panel-title
      padding-left: 16px
      height: 32px
      line-height: 32px
      border-left: none
      font-size: $fontsize-small
      color: $color-dark-grey
      background: linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)
      font-weight: bold
      text-transform: uppercase
      letter-spacing: 1px
    .food-item
      display: flex
      margin: 0
      padding: 16px
      padding-bottom: 16px
      position: relative
      transition: background 0.2s ease
      border-bottom: 1px solid $color-row-line

      &:hover
        background: rgba(0, 160, 220, 0.05)

      &:last-child
        border-none()
        margin-bottom: 0

      .icon
        flex: 0 0 64px
        width: 64px
        height: 64px
        margin-right: 12px
        border-radius: 8px
        overflow: hidden
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
        transition: transform 0.2s ease

        &:hover
          transform: scale(1.05)

        img
          width: 100%
          height: 100%
          object-fit: cover
      .content
        flex: 1
        min-width: 0

        .name
          margin: 0 0 6px 0
          height: auto
          line-height: 18px
          font-size: $fontsize-medium
          color: $color-dark-grey
          font-weight: bold
          overflow: hidden
          text-overflow: ellipsis
          display: -webkit-box
          -webkit-line-clamp: 2
          -webkit-box-orient: vertical
        .desc, .extra
          line-height: 14px
          font-size: $fontsize-small-s
          color: $color-light-grey
        .desc
          line-height: 14px
          margin-bottom: 6px
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
        .extra
          .count
            margin-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          margin-top: 4px

          .now
            margin-right: 8px
            font-size: $fontsize-medium
            color: $color-red
            font-weight: bold
          .old
            text-decoration: line-through
            font-size: $fontsize-small-s
            color: $color-light-grey
      .cart-control-wrapper
        position: absolute
        right: 16px
        bottom: 16px
    .shop-cart-wrapper
      position: absolute
      left: 0
      bottom: 0
      z-index: 50
      width: 100%
      height: 48px
      box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1)
</style>
