<template>
  <cube-popup
    :mask-closable="true"
    v-show="visible"
    @mask-click="hide"
    position="bottom"
    type="checkout"
    :z-index="100"
  >
    <div class="checkout">
      <div class="checkout-header">
        <h3 class="title">确认订单</h3>
        <span class="close" @click="hide">
          <i class="icon-close"></i>
        </span>
      </div>
      <div class="checkout-content">
        <div class="section delivery-section">
          <h4 class="section-title">配送信息</h4>
          <div class="delivery-info">
            <div class="info-item">
              <span class="label">收货人</span>
              <cube-input
                v-model="orderInfo.name"
                placeholder="请输入收货人姓名"
                class="input-field"
              ></cube-input>
            </div>
            <div class="info-item">
              <span class="label">联系电话</span>
              <cube-input
                v-model="orderInfo.phone"
                type="tel"
                placeholder="请输入联系电话"
                class="input-field"
              ></cube-input>
            </div>
            <div class="info-item">
              <span class="label">配送地址</span>
              <textarea
                v-model="orderInfo.address"
                placeholder="请输入详细配送地址"
                class="address-input"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="section time-section">
          <h4 class="section-title">预约配送时间</h4>
          <div class="time-selector">
            <div class="date-select">
              <cube-select
                v-model="orderInfo.date"
                :options="dateOptions"
                :placeholder="'选择日期'"
                @change="onDateChange"
              ></cube-select>
            </div>
            <div class="time-select">
              <cube-select
                v-model="orderInfo.time"
                :options="timeOptions"
                :placeholder="'选择时间'"
              ></cube-select>
            </div>
            <div class="asap-option" @click="selectASAP">
              <cube-checkbox
                v-model="orderInfo.asap"
                :option="asapOption"
              ></cube-checkbox>
              <span class="asap-text">尽快送达</span>
            </div>
          </div>
        </div>

        <div class="section goods-section">
          <h4 class="section-title">商品清单</h4>
          <div class="goods-list">
            <div
              v-for="food in selectFoods"
              :key="food.name"
              class="goods-item"
            >
              <div class="goods-info">
                <img :src="food.icon" class="goods-icon">
                <div class="goods-detail">
                  <h5 class="goods-name">{{food.name}}</h5>
                  <p class="goods-price">￥{{food.price}}</p>
                </div>
              </div>
              <div class="goods-count">
                <span class="count">x{{food.count}}</span>
                <span class="subtotal">￥{{food.price * food.count}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="section remark-section">
          <h4 class="section-title">订单备注</h4>
          <textarea
            v-model="orderInfo.remark"
            placeholder="口味、偏好等要求（选填）"
            class="remark-input"
            :maxlength="200"
          ></textarea>
          <span class="char-count">{{orderInfo.remark.length}}/200</span>
        </div>

        <div class="section payment-section">
          <h4 class="section-title">支付方式</h4>
          <div class="payment-methods">
            <div
              class="payment-item"
              :class="{ active: orderInfo.paymentMethod === 'wechat' }"
              @click="selectPayment('wechat')"
            >
              <span class="payment-icon wechat"></span>
              <span class="payment-name">微信支付</span>
              <span class="check-mark" v-show="orderInfo.paymentMethod === 'wechat'">
                <i class="icon-check_circle"></i>
              </span>
            </div>
            <div
              class="payment-item"
              :class="{ active: orderInfo.paymentMethod === 'alipay' }"
              @click="selectPayment('alipay')"
            >
              <span class="payment-icon alipay"></span>
              <span class="payment-name">支付宝</span>
              <span class="check-mark" v-show="orderInfo.paymentMethod === 'alipay'">
                <i class="icon-check_circle"></i>
              </span>
            </div>
          </div>
        </div>

        <div class="section summary-section">
          <div class="summary-row">
            <span class="summary-label">商品小计</span>
            <span class="summary-value">￥{{totalPrice}}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">配送费</span>
            <span class="summary-value">￥{{deliveryPrice}}</span>
          </div>
          <div class="summary-row total">
            <span class="summary-label">合计</span>
            <span class="summary-value">￥{{grandTotal}}</span>
          </div>
        </div>
      </div>

      <div class="checkout-footer">
        <div class="price-info">
          <span class="total-label">合计：</span>
          <span class="total-price">￥{{grandTotal}}</span>
        </div>
        <cube-button
          class="submit-btn"
          :disabled="!canSubmit"
          @click="submitOrder"
        >
          提交订单
        </cube-button>
      </div>
    </div>
  </cube-popup>
</template>

<script>
import popupMixin from 'common/mixins/popup'
import moment from 'moment'

const EVENT_SUBMIT = 'submit'
const EVENT_HIDE = 'hide'

export default {
  name: 'checkout',
  mixins: [popupMixin],
  props: {
    selectFoods: {
      type: Array,
      default() {
        return []
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      orderInfo: {
        name: '',
        phone: '',
        address: '',
        date: '',
        time: '',
        asap: true,
        remark: '',
        paymentMethod: 'wechat'
      },
      asapOption: {
        value: true,
        label: '尽快送达'
      }
    }
  },
  computed: {
    totalPrice() {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    grandTotal() {
      return this.totalPrice + this.deliveryPrice
    },
    canSubmit() {
      return (
        this.selectFoods.length > 0 &&
        this.orderInfo.name &&
        this.orderInfo.phone &&
        this.orderInfo.address &&
        this.grandTotal > 0
      )
    },
    dateOptions() {
      const options = []
      const today = moment()
      for (let i = 0; i < 7; i++) {
        const date = today.clone().add(i, 'days')
        const label = i === 0 ? '今天' : (i === 1 ? '明天' : date.format('MM月DD日'))
        options.push({
          value: date.format('YYYY-MM-DD'),
          label: `${label} ${this.getWeekDay(date)}`
        })
      }
      return options
    },
    timeOptions() {
      const options = []
      const startTime = 10
      const endTime = 20
      for (let hour = startTime; hour <= endTime; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          options.push({
            value: timeStr,
            label: timeStr
          })
        }
      }
      return options
    }
  },
  methods: {
    getWeekDay(date) {
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      return weekDays[date.day()]
    },
    onDateChange() {
      this.orderInfo.time = ''
    },
    selectASAP() {
      this.orderInfo.asap = !this.orderInfo.asap
      if (this.orderInfo.asap) {
        this.orderInfo.date = ''
        this.orderInfo.time = ''
      }
    },
    selectPayment(method) {
      this.orderInfo.paymentMethod = method
    },
    submitOrder() {
      if (!this.canSubmit) {
        return
      }
      const order = {
        orderId: Date.now().toString(),
        orderTime: Date.now(),
        foods: this.selectFoods.map(food => ({
          name: food.name,
          price: food.price,
          count: food.count,
          icon: food.icon
        })),
        totalPrice: this.totalPrice,
        deliveryPrice: this.deliveryPrice,
        grandTotal: this.grandTotal,
        orderInfo: Object.assign({}, this.orderInfo)
      }
      this.$emit(EVENT_SUBMIT, order)
      this.showOrderSuccess(order)
    },
    showOrderSuccess(order) {
      this.$createDialog({
        type: 'confirm',
        icon: 'cubeic-right',
        title: '订单提交成功',
        content: `订单号：${order.orderId}\n订单金额：￥${order.grandTotal}`,
        confirmBtn: {
          text: '完成',
          active: true,
          disabled: false
        },
        cancelBtn: false,
        $events: {
          confirm: () => {
            this.clearShoppingCart()
            this.hide()
          }
        }
      }).show()
    },
    clearShoppingCart() {
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
    },
    hide() {
      this.$emit(EVENT_HIDE)
      popupMixin.methods.hide.call(this)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.cube-checkout
  background: transparent
  max-height: 90vh
  overflow: hidden

.checkout
  display: flex
  flex-direction: column
  max-height: 90vh
  background: $color-white
  border-radius: 16px 16px 0 0

  .checkout-header
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

  .checkout-content
    flex: 1
    overflow-y: auto
    padding: 0 18px

    .section
      padding: 16px 0
      border-bottom: 1px solid $color-row-line

      &:last-child
        border-bottom: none

      .section-title
        margin-bottom: 12px
        font-size: $fontsize-small
        color: $color-dark-grey
        font-weight: bold

    .delivery-section
      .delivery-info
        .info-item
          display: flex
          align-items: center
          margin-bottom: 12px

          &:last-child
            margin-bottom: 0

          .label
            flex: 0 0 70px
            font-size: $fontsize-small
            color: $color-dark-grey

          .input-field
            flex: 1

          .address-input
            flex: 1
            min-height: 60px
            padding: 8px
            border: 1px solid $color-col-line
            border-radius: 4px
            font-size: $fontsize-small
            color: $color-dark-grey
            resize: none
            outline: none

            &:focus
              border-color: $color-blue

    .time-section
      .time-selector
        .date-select, .time-select
          margin-bottom: 12px

        .asap-option
          display: flex
          align-items: center

          .asap-text
            margin-left: 8px
            font-size: $fontsize-small
            color: $color-dark-grey

    .goods-section
      .goods-list
        .goods-item
          display: flex
          align-items: center
          justify-content: space-between
          padding: 12px 0
          border-bottom: 1px solid $color-row-line

          &:last-child
            border-bottom: none

          .goods-info
            display: flex
            align-items: center

            .goods-icon
              width: 40px
              height: 40px
              border-radius: 4px
              margin-right: 12px

            .goods-detail
              .goods-name
                font-size: $fontsize-small
                color: $color-dark-grey
                margin-bottom: 4px

              .goods-price
                font-size: $fontsize-small-s
                color: $color-red
                font-weight: bold

          .goods-count
            text-align: right

            .count
              font-size: $fontsize-small-s
              color: $color-light-grey
              margin-right: 12px

            .subtotal
              font-size: $fontsize-small
              color: $color-red
              font-weight: bold

    .remark-section
      .remark-input
        width: 100%
        min-height: 60px
        padding: 8px
        border: 1px solid $color-col-line
        border-radius: 4px
        font-size: $fontsize-small
        color: $color-dark-grey
        resize: none
        outline: none
        box-sizing: border-box

        &:focus
          border-color: $color-blue

      .char-count
        float: right
        font-size: $fontsize-small-s
        color: $color-light-grey
        margin-top: 4px

    .payment-section
      .payment-methods
        display: flex
        flex-wrap: wrap

        .payment-item
          display: flex
          align-items: center
          padding: 12px 16px
          margin-right: 12px
          margin-bottom: 8px
          border: 1px solid $color-col-line
          border-radius: 8px
          cursor: pointer
          transition: all 0.2s

          &.active
            border-color: $color-blue
            background: $color-light-blue

          .payment-icon
            width: 24px
            height: 24px
            border-radius: 4px
            margin-right: 8px
            background-size: cover

            &.wechat
              background-color: #07c160

            &.alipay
              background-color: #1677ff

          .payment-name
            font-size: $fontsize-small
            color: $color-dark-grey

          .check-mark
            margin-left: 8px
            color: $color-blue

    .summary-section
      .summary-row
        display: flex
        justify-content: space-between
        margin-bottom: 12px

        &:last-child
          margin-bottom: 0

        .summary-label
          font-size: $fontsize-small
          color: $color-dark-grey

        .summary-value
          font-size: $fontsize-small
          color: $color-dark-grey

        &.total
          padding-top: 12px
          border-top: 1px solid $color-row-line

          .summary-label, .summary-value
            font-weight: bold
            font-size: $fontsize-medium

          .summary-value
            color: $color-red

  .checkout-footer
    display: flex
    align-items: center
    justify-content: space-between
    padding: 12px 18px
    border-top: 1px solid $color-col-line

    .price-info
      .total-label
        font-size: $fontsize-small
        color: $color-dark-grey

      .total-price
        font-size: $fontsize-large
        font-weight: bold
        color: $color-red

    .submit-btn
      width: 120px
      background: $color-blue
      color: $color-white
</style>
