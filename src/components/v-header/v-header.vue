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
    background: $color-background-ss
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)

    .content-wrapper
      position: relative
      display: flex
      align-items: flex-start
      padding: 20px 16px 16px 20px
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 100%)

      .avatar-wrapper
        display: flex
        flex-direction: column
        align-items: center
        margin-right: 16px

        .avatar
          flex: 0 0 72px
          width: 72px
          margin-bottom: 8px
          border-radius: 8px
          overflow: hidden
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3)
          transition: transform 0.3s ease

          &:hover
            transform: scale(1.05)

          img
            width: 100%
            height: 100%
            object-fit: cover

        .score-badge
          display: flex
          align-items: center
          padding: 4px 8px
          background: rgba(255, 255, 255, 0.95)
          border-radius: 12px
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2)

          .star
            margin-right: 4px

          .score-text
            font-size: $fontsize-small
            font-weight: bold
            color: $color-orange

      .content
        flex: 1
        min-width: 0

        .title
          display: flex
          align-items: center
          margin-bottom: 10px

          .brand
            width: 30px
            height: 18px
            bg-image('brand')
            background-size: 30px 18px
            background-repeat: no-repeat
            flex-shrink: 0

          .name
            margin-left: 8px
            font-size: $fontsize-large
            font-weight: bold
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3)
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap

        .description-wrapper
          margin-bottom: 12px

          .description
            font-size: $fontsize-small
            color: rgba(255, 255, 255, 0.9)
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2)

        .stats
          display: flex
          align-items: center
          margin-bottom: 12px
          padding: 10px 0
          background: rgba(255, 255, 255, 0.1)
          border-radius: 8px
          padding: 8px 12px

          .stat-item
            display: flex
            flex-direction: column
            align-items: center
            flex: 1

            .stat-value
              font-size: $fontsize-medium
              font-weight: bold
              color: $color-white
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2)

            .stat-label
              font-size: $fontsize-small-s
              color: rgba(255, 255, 255, 0.7)
              margin-top: 2px

          .stat-divider
            width: 1px
            height: 24px
            background: rgba(255, 255, 255, 0.2)

        .support
          .support-tags
            display: flex
            flex-wrap: wrap
            gap: 6px

            .support-tag
              display: flex
              align-items: center
              padding: 4px 8px
              background: rgba(255, 255, 255, 0.15)
              border-radius: 4px
              border: 1px solid rgba(255, 255, 255, 0.2)
              transition: all 0.2s ease

              &:hover
                background: rgba(255, 255, 255, 0.25)

              .support-ico
                margin-right: 4px

              .text
                font-size: $fontsize-small-s
                color: rgba(255, 255, 255, 0.9)

    .bulletin-wrapper
      position: relative
      display: flex
      align-items: center
      padding: 10px 16px
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)
      border-top: 1px solid rgba(0, 0, 0, 0.05)

      .bulletin-content
        display: flex
        align-items: center
        flex: 1
        min-width: 0

        .bulletin-icon
          margin-right: 8px
          font-size: $fontsize-small

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
        flex-shrink: 0

    .background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -2
      overflow: hidden

      .gradient-overlay
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%)
        z-index: 1

      img
        width: 100%
        height: 100%
        object-fit: cover
        filter: blur(12px)
        transform: scale(1.1)
</style>
