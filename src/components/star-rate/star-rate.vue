<template>
  <div class="star-rate" :class="starType">
    <span
      v-for="(itemClass, index) in itemClasses"
      :class="itemClass"
      class="star-item"
      :key="index"
      @click="selectStar(index + 1)"
      @mouseover="previewStar(index + 1)"
      @mouseout="resetPreview"
    ></span>
  </div>
</template>

<script>
const LENGTH = 5
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'

export default {
  name: 'star-rate',
  props: {
    size: {
      type: Number,
      default: 36
    },
    value: {
      type: Number,
      default: 0
    },
    readonly: {
      type: Boolean,
      default: false
    },
    allowHalf: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentValue: this.value,
      previewValue: null
    }
  },
  computed: {
    starType() {
      return 'star-' + this.size
    },
    itemClasses() {
      let result = []
      const score = this.previewValue !== null ? this.previewValue : this.currentValue
      const hasDecimal = this.allowHalf && score % 1 !== 0
      const integer = Math.floor(score)
      for (let i = 0; i < integer; i++) {
        result.push(CLS_ON)
      }
      if (hasDecimal) {
        result.push(CLS_HALF)
      }
      while (result.length < LENGTH) {
        result.push(CLS_OFF)
      }
      return result
    }
  },
  methods: {
    selectStar(index) {
      if (this.readonly) {
        return
      }
      this.currentValue = index
      this.$emit('input', this.currentValue)
      this.$emit('change', this.currentValue)
    },
    previewStar(index) {
      if (this.readonly) {
        return
      }
      this.previewValue = index
    },
    resetPreview() {
      this.previewValue = null
    }
  },
  watch: {
    value(newVal) {
      this.currentValue = newVal
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/mixin.styl"

.star-rate
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  .star-item
    background-repeat: no-repeat
    cursor: pointer
    transition: all 0.2s ease
  &:not(.readonly)
    .star-item:hover
      transform: scale(1.1)
  &.star-48
    .star-item
      width: 20px
      height: 20px
      margin-right: 22px
      background-size: 20px 20px
      &:last-child
        margin-right: 0
      &.on
        background-image: url('../star/star48_on@2x.png')
      &.half
        background-image: url('../star/star48_half@2x.png')
      &.off
        background-image: url('../star/star48_off@2x.png')
  &.star-36
    .star-item
      width: 15px
      height: 15px
      margin-right: 6px
      background-size: 15px 15px
      &:last-child
        margin-right: 0
      &.on
        background-image: url('../star/star36_on@2x.png')
      &.half
        background-image: url('../star/star36_half@2x.png')
      &.off
        background-image: url('../star/star36_off@2x.png')
  &.star-24
    .star-item
      width: 10px
      height: 10px
      margin-right: 3px
      background-size: 10px 10px
      &:last-child
        margin-right: 0
      &.on
        background-image: url('../star/star24_on@2x.png')
      &.half
        background-image: url('../star/star24_half@2x.png')
      &.off
        background-image: url('../star/star24_off@2x.png')
</style>
