<template>
  <div class="header" @click="showDetail">
    <div class="content-wrapper">
      <div class="avatar-wrapper">
        <div class="avatar">
          <img width="64" height="64" :src="seller.avatar">
        </div>
        <div v-if="seller.score" class="score-badge">
          <star :size="24" :score="seller.score"></star>
          <span class="score-text">{{seller.score}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description-wrapper">
          <div class="description">
            {{seller.description}} · {{seller.deliveryTime}}分钟送达
          </div>
        </div>
        <div class="stats">
          <div class="stat-item">
            <span class="stat-value">{{seller.sellCount}}</span>
            <span class="stat-label">月售</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{seller.ratingCount}}</span>
            <span class="stat-label">评价</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">￥{{seller.minPrice}}</span>
            <span class="stat-label">起送</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">￥{{seller.deliveryPrice}}</span>
            <span class="stat-label">配送费</span>
          </div>
        </div>
        <div v-if="seller.supports" class="support">
          <div class="support-tags">
            <div
              v-for="(support, index) in seller.supports"
              :key="index"
              class="support-tag"
            >
              <support-ico :size=2 :type="support.type"></support-ico>
              <span class="text">{{support.description}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bulletin-wrapper" v-if="seller.bulletin">
      <div class="bulletin-content">
        <span class="bulletin-icon">📋</span>
        <span class="bulletin-text">{{seller.bulletin}}</span>
      </div>
      <i class="icon-keyboard_arrow_right arrow-icon"></i>
    </div>
    <div class="background">
      <div class="gradient-overlay"></div>
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import SupportIco from 'components/support-ico/support-ico'
  import Star from 'components/star/star'

  export default {
    name: 'v-header',
    props: {
      seller: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      showDetail() {
        this.headerDetailComp = this.headerDetailComp || this.$createHeaderDetail({
          $props: {
            seller: 'seller'
          }
        })
        this.headerDetailComp.show()
      }
    },
    components: {
      SupportIco,
      Star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .header
    position: relative
    overflow: hidden
    color: $color-white
    background: $color-background

    .content-wrapper
      position: relative
      display: flex
      align-items: flex-start
      padding: 16px
      background: linear-gradient(180deg, rgba(0, 160, 220, 0.95) 0%, rgba(0, 100, 160, 0.9) 100%)

      .avatar-wrapper
        display: flex
        flex-direction: column
        align-items: center
        margin-right: 14px

        .avatar
          width: 64px
          height: 64px
          margin-bottom: 6px
          border-radius: 50%
          overflow: hidden
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25)
          border: 3px solid rgba(255, 255, 255, 0.3)

          img
            width: 100%
            height: 100%
            object-fit: cover

        .score-badge
          display: flex
          align-items: center
          padding: 3px 8px
          background: rgba(255, 255, 255, 0.95)
          border-radius: 10px
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15)

          .star
            margin-right: 3px

          .score-text
            font-size: $fontsize-small
            font-weight: 600
            color: $color-orange

      .content
        flex: 1
        min-width: 0

        .title
          display: flex
          align-items: center
          margin-bottom: 6px

          .name
            font-size: $fontsize-large
            font-weight: 600
            color: $color-white
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap

        .description-wrapper
          margin-bottom: 10px

          .description
            font-size: $fontsize-small-s
            color: rgba(255, 255, 255, 0.85)

        .stats
          display: flex
          align-items: center
          justify-content: space-around
          padding: 8px 0
          background: rgba(255, 255, 255, 0.1)
          border-radius: 6px

          .stat-item
            display: flex
            flex-direction: column
            align-items: center

            .stat-value
              font-size: $fontsize-medium
              font-weight: 600
              color: $color-white

            .stat-label
              font-size: $fontsize-small-s
              color: rgba(255, 255, 255, 0.7)
              margin-top: 2px

          .stat-divider
            width: 1px
            height: 20px
            background: rgba(255, 255, 255, 0.2)

        .support
          display: none

    .bulletin-wrapper
      display: flex
      align-items: center
      padding: 10px 16px
      background: $color-white
      border-bottom: 1px solid $color-row-line

      .bulletin-content
        display: flex
        align-items: center
        flex: 1
        min-width: 0

        .bulletin-icon
          margin-right: 8px
          font-size: 14px
          color: $color-blue

        .bulletin-text
          flex: 1
          color: $color-dark-grey
          font-size: $fontsize-small
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis

      .arrow-icon
        font-size: $fontsize-small
        color: $color-light-grey
        margin-left: 8px

    .background
      display: none
</style>
