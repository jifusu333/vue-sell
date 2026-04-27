<template>
  <cube-popup
    :mask-closable="true"
    v-show="visible"
    @mask-click="hide"
    position="bottom"
    type="rating-form"
    :z-index="100"
  >
    <div class="rating-form">
      <div class="form-header">
        <h3 class="title">发表评价</h3>
        <span class="close" @click="hide">
          <i class="icon-close"></i>
        </span>
      </div>
      <div class="form-content">
        <div class="rating-section">
          <h4 class="section-title">整体评分</h4>
          <div class="star-wrapper">
            <star-rate
              v-model="ratingData.score"
              :size="48"
              :allow-half="false"
            ></star-rate>
            <span class="rating-text">{{getRatingText(ratingData.score)}}</span>
          </div>
        </div>
        <div class="rating-section">
          <h4 class="section-title">服务评分</h4>
          <div class="star-wrapper">
            <star-rate
              v-model="ratingData.serviceScore"
              :size="36"
              :allow-half="false"
            ></star-rate>
          </div>
        </div>
        <div class="rating-section">
          <h4 class="section-title">商品评分</h4>
          <div class="star-wrapper">
            <star-rate
              v-model="ratingData.foodScore"
              :size="36"
              :allow-half="false"
            ></star-rate>
          </div>
        </div>
        <div class="rating-section">
          <h4 class="section-title">配送时间（分钟）</h4>
          <div class="delivery-time">
            <cube-input
              v-model="deliveryTimeStr"
              type="number"
              placeholder="请输入配送时间"
              :maxlength="3"
            ></cube-input>
          </div>
        </div>
        <div class="rating-section">
          <h4 class="section-title">评价内容</h4>
          <div class="text-wrapper">
            <textarea
              v-model="ratingData.text"
              placeholder="分享您的用餐体验..."
              :maxlength="500"
              class="rating-textarea"
            ></textarea>
            <span class="char-count">{{ratingData.text.length}}/500</span>
          </div>
        </div>
        <div class="rating-section recommend-section">
          <h4 class="section-title">推荐商品（可选）</h4>
          <div class="food-list">
            <div
              v-for="food in foods"
              :key="food.name"
              class="food-item"
              :class="{ active: isRecommended(food) }"
              @click="toggleRecommend(food)"
            >
              <span class="food-name">{{food.name}}</span>
              <span v-if="isRecommended(food)" class="check-icon">
                <i class="icon-check_circle"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="form-footer">
        <cube-button
          class="submit-btn"
          :disabled="!canSubmit"
          @click="submitRating"
        >
          提交评价
        </cube-button>
      </div>
    </div>
  </cube-popup>
</template>

<script>
import StarRate from 'components/star-rate/star-rate'
import popupMixin from 'common/mixins/popup'

const EVENT_SUBMIT = 'submit'
const EVENT_HIDE = 'hide'

export default {
  name: 'rating-form',
  mixins: [popupMixin],
  props: {
    foods: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      ratingData: {
        score: 5,
        serviceScore: 5,
        foodScore: 5,
        text: '',
        recommend: [],
        rateType: 0
      },
      deliveryTimeStr: ''
    }
  },
  computed: {
    canSubmit() {
      return this.ratingData.score > 0
    },
    deliveryTime() {
      const time = parseInt(this.deliveryTimeStr)
      return isNaN(time) ? '' : time
    }
  },
  methods: {
    getRatingText(score) {
      if (score >= 4.5) return '非常满意'
      if (score >= 3.5) return '满意'
      if (score >= 2.5) return '一般'
      if (score >= 1.5) return '不满意'
      return '非常不满意'
    },
    isRecommended(food) {
      return this.ratingData.recommend.indexOf(food.name) > -1
    },
    toggleRecommend(food) {
      const index = this.ratingData.recommend.indexOf(food.name)
      if (index > -1) {
        this.ratingData.recommend.splice(index, 1)
      } else {
        this.ratingData.recommend.push(food.name)
      }
    },
    submitRating() {
      if (!this.canSubmit) {
        return
      }
      const rating = {
        username: '当前用户',
        rateTime: Date.now(),
        deliveryTime: this.deliveryTime,
        score: this.ratingData.score,
        rateType: this.ratingData.score >= 3 ? 0 : 1,
        text: this.ratingData.text,
        avatar: 'http://static.galileo.xiaojukeji.com/static/tms/default_header.png',
        recommend: this.ratingData.recommend
      }
      this.$emit(EVENT_SUBMIT, rating)
      this.resetForm()
      this.hide()
    },
    resetForm() {
      this.ratingData = {
        score: 5,
        serviceScore: 5,
        foodScore: 5,
        text: '',
        recommend: [],
        rateType: 0
      }
      this.deliveryTimeStr = ''
    },
    hide() {
      this.$emit(EVENT_HIDE)
      popupMixin.methods.hide.call(this)
    }
  },
  components: {
    StarRate
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.cube-rating-form
  background: $color-white

.rating-form
  max-height: 80vh
  overflow-y: auto
  background: $color-white
  border-radius: 16px 16px 0 0

  .form-header
    display: flex
    align-items: center
    justify-content: space-between
    padding: 16px 18px
    border-bottom: 1px solid $color-col-line

    .title
      font-size: $fontsize-medium
      font-weight: bold
      color: $color-dark-grey

    .close
      font-size: $fontsize-large
      color: $color-light-grey
      cursor: pointer

  .form-content
    padding: 0 18px

    .rating-section
      padding: 16px 0
      border-bottom: 1px solid $color-row-line

      &:last-child
        border-bottom: none

      .section-title
        margin-bottom: 12px
        font-size: $fontsize-small
        color: $color-dark-grey
        font-weight: bold

      .star-wrapper
        display: flex
        align-items: center

        .rating-text
          margin-left: 12px
          font-size: $fontsize-small
          color: $color-orange

      .delivery-time
        width: 100%

      .text-wrapper
        position: relative

        .rating-textarea
          width: 100%
          min-height: 100px
          padding: 12px
          box-sizing: border-box
          border: 1px solid $color-col-line
          border-radius: 8px
          font-size: $fontsize-small
          color: $color-dark-grey
          resize: vertical
          outline: none

          &:focus
            border-color: $color-blue

        .char-count
          position: absolute
          bottom: 8px
          right: 12px
          font-size: $fontsize-small-s
          color: $color-light-grey

      .recommend-section
        .food-list
          display: flex
          flex-wrap: wrap

          .food-item
            display: flex
            align-items: center
            padding: 8px 12px
            margin-right: 8px
            margin-bottom: 8px
            border: 1px solid $color-col-line
            border-radius: 16px
            font-size: $fontsize-small-s
            color: $color-dark-grey
            cursor: pointer
            transition: all 0.2s

            &.active
              border-color: $color-blue
              background: $color-light-blue
              color: $color-blue

            .check-icon
              margin-left: 4px
              color: $color-blue

  .form-footer
    padding: 16px 18px
    border-top: 1px solid $color-col-line

    .submit-btn
      width: 100%
      background: $color-blue
      color: $color-white
</style>
