import {
  queryTotal,
  queryList,
  queryTmkList
} from "../../../../services/report-form/market/tmkSheetService"
import { message } from "antd"
import { parse } from "qs"
import moment from "moment"
import { GetCountDays } from "../../../../utils/dateFormat"

export default {
  namespace: "tmkSheetModel",

  state: {
    dataSource: [], //数据
    searchValue: {}, //搜索内容
    buttonLoading: false, //按钮加载
    firstEnter: true,
    loading: false, //表格加载
    total: [],
    pageIndex: 0,
    pageSize: 20,
    resultCount: 0,
    tmkList: [] // tmk下拉
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, query }) => {
        if (pathname === "/hq_tmk_markReport_tmkReport") {
          dispatch({
            type: "getTmkList"
          })

          let nowObj = window.GetNowDateAndTime()
          let rangerPicker = {
            startTime: nowObj.startDate,
            endTime: nowObj.endDate
          }

          let nowDate = rangerPicker.startTime
          let formatNowDate = new Date(nowDate)
          // 默认为本月时
          let year = formatNowDate.getFullYear()
          let month = formatNowDate.getMonth() + 1
          let days = GetCountDays(year, month) //获取本月有多少天
          rangerPicker.startTime = nowDate.substr(0, 8) + "01"
          rangerPicker.endTime = nowDate.substr(0, 8) + days

          dispatch({
            type: "init",
            payload: {
              ...rangerPicker,
              pageIndex: 0,
              pageSize: 20
            }
          })
        }
      })
    }
  },

  effects: {
    /** 初始化 */
    *init({ payload }, { call, put, select }) {
      yield put({
        type: "getList",
        payload
      })
    },

    /*生成报表得到列表*/
    *getList({ payload }, { call, put, select }) {
      yield put({
        type: "updateState",
        payload: { buttonLoading: true, loading: true }
      })

      // 合计
      let total = yield call(queryTotal, payload)
      if (total && total.ret && total.ret.errorCode === 0) {
        yield put({
          type: "updateState",
          payload: {
            total: total.ret && total.ret.countItem
          }
        })
      } else {
        message.error((total.ret && total.ret.errorMessage) || "合计查询失败")
      }

      // 表格
      let { ret } = yield call(queryList, payload)
      if (ret && ret.errorCode === 0) {
        let dataSource = []
        ret.results &&
          ret.results.forEach((item, index) => {
            dataSource.push({
              ...item,
              rowKey: index + 1 + ""
            })
          })
        let pageIndex = payload.pageIndex
        let pageSize = payload.pageSize

        delete payload.pageIndex
        delete payload.pageSize

        yield put({
          type: "updateState",
          payload: {
            dataSource,
            resultCount: ret.data.resultCount,
            searchValue: payload,
            pageIndex,
            pageSize
          }
        })
      } else {
        message.error((ret && ret.errorMessage) || "报表查询失败")
      }
      yield put({
        type: "updateState",
        payload: { buttonLoading: false, loading: false }
      })
    },

    /** tmk下拉 */
    *getTmkList({ payload }, { call, put, select }) {
      let { ret } = yield call(queryTmkList, payload)
      if (ret && ret.errorCode === 0) {
        yield put({
          type: "updateState",
          payload: {
            tmkList: ret.results
          }
        })
      } else {
        message.error((ret && ret.errorMessage) || "报表查询失败")
      }
    }
  },

  reducers: {
    updateState(state, action) {
      return { ...state, ...action.payload }
    }
  }
}
