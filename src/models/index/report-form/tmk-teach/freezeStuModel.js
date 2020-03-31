import {
  queryList
} from "../../../../services/report-form/tmk-teach/freezeStuService"
import { message } from "antd"
import { parse } from "qs"

export default {
  namespace: "freezeStuModel",

  state: {
    dataSource: [], //数据
    searchValue: {}, //搜索内容
    buttonLoading: false, //按钮加载
    firstEnter: true,
    loading: false, //表格加载
    total: [],
    pageIndex: 0,
    pageSize: 20,
    resultCount: 0
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, query }) => {
        if (pathname === "/hq_tmk_cerpReport_freezeStu") {
          let size = localStorage.getItem("head_freezeStu_pageSize")
          let pageSize = size ? Number(size) : 20

          dispatch({
            type: "init",
            payload: {
              pageIndex: 0,
              pageSize
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

      let { ret } = yield call(queryList, payload)
      if (ret && ret.errorCode === 0) {
        let total = { ...ret }

        let dataSource = []
        ret.results &&
          ret.results.forEach((item, index) => {
            dataSource.push({
              ...item,
              rowKey: 'report' + index
            })
          })
        let pageIndex = payload.pageIndex
        let pageSize = payload.pageSize
        localStorage.setItem("head_freezeStu_pageSize", pageSize)

        delete payload.pageIndex
        delete payload.pageSize

        yield put({
          type: "updateState",
          payload: {
            total,
            dataSource,
            resultCount: ret.data && ret.data.resultCount ? ret.data.resultCount : 0,
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
  },

  reducers: {
    updateState(state, action) {
      return { ...state, ...action.payload }
    }
  }
}
