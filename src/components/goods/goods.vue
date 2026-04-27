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
    background: $color-background-ssss

    .scroll-nav-wrapper
      position: absolute
      width: 100%
      top: 0
      left: 0
      bottom: 56px

    >>> .cube-scroll-nav-bar
      width: 80px
      white-space: normal
      overflow: hidden
      background: $color-white
      border-right: 1px solid $color-row-line

    >>> .cube-scroll-nav-bar-item
      padding: 0 8px
      display: flex
      align-items: center
      justify-content: center
      height: 56px
      line-height: 14px
      font-size: $fontsize-small-s
      background: transparent
      transition: all 0.2s ease
      position: relative

      &::before
        content: ''
        position: absolute
        left: 0
        top: 50%
        transform: translateY(-50%)
        width: 4px
        height: 0
        background: $color-blue
        transition: height 0.2s ease

      .text
        flex: 1
        text-align: center
        font-weight: 500
        color: $color-grey

      .num
        position: absolute
        right: 4px
        top: 8px

      .support-ico
        display: none

    >>> .cube-scroll-nav-bar-item_active
      background: $color-background-ssss
      color: $color-blue
      font-weight: 600

      &::before
        height: 20px

    >>> .cube-scroll-nav-panel
      background: $color-background-ssss

    >>> .cube-scroll-nav-panel-title
      padding-left: 16px
      height: 36px
      line-height: 36px
      border-left: none
      font-size: $fontsize-small-s
      color: $color-light-grey
      background: $color-white
      font-weight: 500
      letter-spacing: 0.5px

    .food-item
      display: flex
      margin: 10px 12px
      padding: 12px
      background: $color-white
      border-radius: 8px
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06)
      transition: all 0.2s ease

      &:active
        transform: scale(0.99)
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1)

      .icon
        flex: 0 0 60px
        width: 60px
        height: 60px
        margin-right: 12px
        border-radius: 6px
        overflow: hidden

        img
          width: 100%
          height: 100%
          object-fit: cover

      .content
        flex: 1
        min-width: 0

        .name
          margin: 0 0 4px 0
          height: auto
          line-height: 17px
          font-size: $fontsize-small
          color: $color-dark-grey
          font-weight: 600
          overflow: hidden
          text-overflow: ellipsis
          display: -webkit-box
          -webkit-line-clamp: 2
          -webkit-box-orient: vertical

        .desc
          line-height: 14px
          font-size: $fontsize-small-s
          color: $color-light-grey
          margin-bottom: 4px
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap

        .extra
          line-height: 12px
          font-size: $fontsize-small-s
          color: $color-light-grey
          margin-bottom: 6px

          .count
            margin-right: 10px

        .price
          display: flex
          align-items: baseline

          .now
            margin-right: 6px
            font-size: $fontsize-medium
            color: $color-red
            font-weight: 700

          .old
            text-decoration: line-through
            font-size: $fontsize-small-s
            color: $color-light-grey

      .cart-control-wrapper
        position: absolute
        right: 12px
        bottom: 12px

    .shop-cart-wrapper
      position: absolute
      left: 0
      bottom: 0
      z-index: 50
      width: 100%
      height: 56px
      background: $color-white
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08)
</style>
