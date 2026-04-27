<template>
  <cube-scroll ref="scroll" class="ratings" :options="scrollOptions">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <div class="write-rating">
        <cube-button class="write-btn" @click="showRatingForm">
          <i class="icon-add_circle"></i> 写评价
        </cube-button>
      </div>
      <split></split>
      <rating-select
        @select="onSelect"
        @toggle="onToggle"
        :selectType="selectType"
        :onlyContent="onlyContent"
        :ratings="ratings"
      >
      </rating-select>
      <div class="rating-wrapper">
        <ul>
          <li
            v-for="(rating,index) in computedRatings"
            :key="index"
            class="rating-item border-bottom-1px"
          >
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span
                  class="item"
                  v-for="(item,index) in rating.recommend"
                  :key="index"
                >
                  {{item}}
                </span>
              </div>
              <div class="time">
                {{format(rating.rateTime)}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </cube-scroll>
</template>

<script>
  import Star from 'components/star/star'
  import RatingSelect from 'components/rating-select/rating-select'
  import Split from 'components/split/split'
  import RatingForm from 'components/rating-form/rating-form'
  import ratingMixin from 'common/mixins/rating'
  import { getRatings, getGoods } from 'api'
  import moment from 'moment'

  export default {
    name: 'ratings',
    mixins: [ratingMixin],
    props: {
      data: {
        type: Object
      }
    },
    data () {
      return {
        ratings: [],
        goods: [],
        scrollOptions: {
          click: false,
          directionLockThreshold: 0
        }
      }
    },
    computed: {
      seller () {
        return this.data.seller || {}
      },
      allFoods () {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            foods.push(food)
          })
        })
        return foods
      }
    },
    methods: {
      fetch () {
        if (!this.fetched) {
          this.fetched = true
          getRatings({
            id: this.seller.id
          }).then((ratings) => {
            this.ratings = ratings
          })
          getGoods({
            id: this.seller.id
          }).then((goods) => {
            this.goods = goods
          })
        }
      },
      format (time) {
        return moment(time).format('YYYY-MM-DD hh:mm')
      },
      showRatingForm () {
        this.ratingFormComp = this.ratingFormComp || this.$createRatingForm({
          $props: {
            foods: this.allFoods
          },
          $events: {
            submit: (rating) => {
              this.ratings.unshift(rating)
              this.$nextTick(() => {
                this.$refs.scroll.refresh()
              })
              this.showSubmitSuccess()
            },
            hide: () => {
            }
          }
        })
        this.ratingFormComp.show()
      },
      showSubmitSuccess () {
        this.$createToast({
          txt: '评价提交成功！',
          type: 'correct'
        }).show()
      }
    },
    components: {
      Star,
      Split,
      RatingSelect,
      RatingForm
    },
    watch: {
      selectType () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .ratings
    position: relative
    text-align: left
    white-space: normal
    height: 100%
    background: $color-background-ssss

    .overview
      background: $color-white
      display: flex
      padding: 16px
      border-radius: 0 0 12px 12px
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06)

      .overview-left
        flex: 0 0 100px
        width: 100px
        display: flex
        flex-direction: column
        align-items: center
        padding-right: 16px
        border-right: 1px solid $color-row-line

        .score
          font-size: 36px
          font-weight: 700
          color: $color-orange
          line-height: 1.2

        .title
          font-size: $fontsize-small-s
          color: $color-light-grey
          margin-top: 4px

        .rank
          font-size: $fontsize-small-s
          color: $color-green
          margin-top: 2px

      .overview-right
        flex: 1
        padding-left: 16px
        display: flex
        flex-direction: column
        justify-content: center

        .score-wrapper
          display: flex
          align-items: center
          margin-bottom: 6px

          .title
            font-size: $fontsize-small-s
            color: $color-grey
            width: 56px

          .star
            margin-right: 8px

          .score
            font-size: $fontsize-small
            font-weight: 600
            color: $color-dark-grey

        .delivery-wrapper
          display: flex
          align-items: center

          .title
            font-size: $fontsize-small-s
            color: $color-grey
            width: 56px

          .delivery
            font-size: $fontsize-small
            color: $color-dark-grey

    .write-rating
      padding: 12px 16px
      margin-top: 10px
      background: $color-white
      border-radius: 8px
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06)

      .write-btn
        width: 100%
        height: 40px
        background: linear-gradient(135deg, $color-blue 0%, #0088cc 100%)
        color: $color-white
        font-size: $fontsize-small
        font-weight: 500
        border-radius: 6px
        border: none
        outline: none
        cursor: pointer
        transition: all 0.2s

        &:active
          transform: scale(0.98)
          opacity: 0.9

    .rating-wrapper
      padding: 12px 16px

      .rating-item
        display: flex
        padding: 16px
        margin-bottom: 10px
        background: $color-white
        border-radius: 8px
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04)
        transition: all 0.2s

        &:active
          background: rgba(0, 160, 220, 0.05)

        .avatar
          flex: 0 0 40px
          width: 40px
          height: 40px
          margin-right: 12px

          img
            width: 100%
            height: 100%
            border-radius: 50%
            object-fit: cover

        .content
          flex: 1
          min-width: 0

          .name
            font-size: $fontsize-small
            font-weight: 600
            color: $color-dark-grey
            margin-bottom: 6px

          .star-wrapper
            display: flex
            align-items: center
            margin-bottom: 6px

            .star
              margin-right: 8px

            .delivery
              font-size: $fontsize-small-s
              color: $color-light-grey
              padding: 2px 6px
              background: $color-background-ssss
              border-radius: 4px

          .text
            font-size: $fontsize-small
            color: $color-dark-grey
            line-height: 1.5
            margin-bottom: 8px
            word-break: break-all

          .recommend
            display: flex
            align-items: center
            flex-wrap: wrap
            gap: 6px

            .icon-thumb_up
              color: $color-green
              font-size: $fontsize-small

            .item
              padding: 3px 8px
              background: rgba(0, 160, 220, 0.1)
              border-radius: 4px
              font-size: $fontsize-small-s
              color: $color-blue

          .time
            font-size: $fontsize-small-s
            color: $color-light-grey
            margin-top: 6px
</style>
