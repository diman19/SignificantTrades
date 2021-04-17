import { MutationTree, ActionTree, GetterTree, Module } from 'vuex'

import Vue from 'vue'
import { randomString } from '@/utils/helpers'

export interface Threshold {
  id: string
  amount: number
  buyColor: string
  sellColor: string
  gif?: string
}

export interface TradesPaneState {
  _id?: string
  thresholds: Threshold[]
  showThresholdsAsTable: boolean
  maxRows: number
  showLogos: boolean
  showTradesPairs: boolean
  liquidationsOnly: boolean
  multipliers: { [identifier: string]: number }
}

const getters = {} as GetterTree<TradesPaneState, TradesPaneState>

// https://coolors.co/d91f1c-eb1e2f-ef4352-77945c-3bca6d-00ff7f

const state = {
  thresholds: [
    {
      id: 'threshold',
      amount: 250000,
      buyColor: 'rgba(119, 148, 92, .5)',
      sellColor: 'rgba(239, 67, 82,.5)'
    },
    {
      id: 'significant',
      amount: 500000,
      buyColor: 'rgb(100, 157, 102)',
      sellColor: 'rgb(239, 67, 82)'
    },
    {
      id: 'huge',
      amount: 1000000,
      gif: 'cash',
      buyColor: 'rgb(59, 202, 109)',
      sellColor: 'rgb(235, 30, 47)'
    },
    {
      id: 'rare',
      amount: 10000000,
      gif: 'explosion',
      buyColor: 'rgb(0, 255, 127)',
      sellColor: 'rgb(217, 31, 28)'
    }
  ],
  multipliers: {},
  showThresholdsAsTable: true,
  maxRows: 100,
  showTradesPairs: false,
  liquidationsOnly: false,
  showLogos: true
} as TradesPaneState

const actions = {} as ActionTree<TradesPaneState, TradesPaneState>

const mutations = {
  TOGGLE_TRADES_PAIRS(state) {
    state.showTradesPairs = !state.showTradesPairs
  },
  SET_MAX_ROWS(state, value) {
    state.maxRows = value
  },
  TOGGLE_LOGOS(state, value) {
    state.showLogos = value ? true : false
  },
  TOGGLE_LIQUIDATIONS_ONLY(state) {
    state.liquidationsOnly = !state.liquidationsOnly
  },
  TOGGLE_THRESHOLDS_TABLE(state, value) {
    state.showThresholdsAsTable = value ? true : false
  },
  SET_THRESHOLD_AMOUNT(state, payload) {
    const threshold = state.thresholds[payload.index]

    if (threshold) {
      if (typeof payload.value === 'string' && /m|k$/i.test(payload.value)) {
        if (/m$/i.test(payload.value)) {
          threshold.amount = parseFloat(payload.value) * 1000000
        } else {
          threshold.amount = parseFloat(payload.value) * 1000
        }
      }
      threshold.amount = +payload.value

      Vue.set(state.thresholds, payload.index, threshold)
    }
  },
  SET_THRESHOLD_MULTIPLIER(state, { identifier, multiplier }: { identifier: string; multiplier: number }) {
    if (isNaN(multiplier) || multiplier < 0) {
      multiplier = 0
    }
    console.log(multiplier)
    Vue.set(state.multipliers, identifier, multiplier)
  },
  SET_THRESHOLD_GIF(state, payload) {
    const threshold = state.thresholds[payload.index]

    if (threshold) {
      if (payload.value.trim().length) {
        threshold.gif = payload.value
      } else {
        payload.value = threshold.gif
        payload.isDeleted = true

        threshold.gif = null
      }

      Vue.set(state.thresholds, payload.index, threshold)
    }
  },
  SET_THRESHOLD_COLOR(state, payload) {
    const threshold = state.thresholds[payload.index]

    if (threshold) {
      threshold[payload.side] = payload.value

      Vue.set(state.thresholds, payload.index, threshold)
    }
  },
  ADD_THRESHOLD(state) {
    state.thresholds.push({
      id: randomString(8),
      amount: state.thresholds[state.thresholds.length - 1].amount * 2,
      buyColor: 'rgb(0, 255, 0)',
      sellColor: 'rgb(255, 0, 0)'
    })
  },
  DELETE_THRESHOLD(state, index) {
    state.thresholds.splice(index, 1)
  }
} as MutationTree<TradesPaneState>

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
} as Module<TradesPaneState, TradesPaneState>