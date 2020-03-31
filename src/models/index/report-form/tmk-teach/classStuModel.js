import {
  queryTotal,
  querySummary,
  queryDetail
} from "../../../../services/report-form/tmk-teach/classStuService"
import {CourseOrderSystemOpen} from '../../../../services/campus-management/courseManage/courseManageService'
import { message } from "antd"
import { parse } from "qs"

export default {
  namespace: "classStuModel",

  state: {
    dataSource: [], //数据
    searchValue: {}, //搜索内容
    buttonLoading: false, //按钮加载
    firstEnter: true,
    loading: false, //表格加载
    total: [],
    pageIndex: 0,
    pageSize: 50,
    resultCount: 0,
    courseGroup: [], // 课系下拉
    activeKey: 'total'
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, query }) => {
        if (pathname === "/hq_tmk_cerpReport_classStuNum") {
          let size = localStorage.getItem("head_classStu_pageSize")
          let pageSize = size ? Number(size) : 50

          dispatch({
            type: 'updateState',
            payload: {
              pageSize
            }
          })
          // 获取课系
          dispatch({
            type: 'getCourseGorup'
          })

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

      // 合计
      let total = yield call(queryTotal, payload)
      if (total && total.ret && total.ret.errorCode === 0) {
        yield put({
          type: "updateState",
          payload: {
            total: total.ret && total.ret.results
          }
        })
      } else {
        message.error((total.ret && total.ret.errorMessage) || "总计查询失败")
      }

      let state = yield select(state => state.classStuModel)
      if(state.activeKey === 'total'){
        // 汇总列表
        let { ret } = yield call(querySummary, payload)
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
          localStorage.setItem("head_classStu_pageSize", pageSize)

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
      } else {
        // 详情列表
        let detailList = yield call(queryDetail, payload)
        if (detailList && detailList.ret && detailList.ret.errorCode === 0) {
          let dataSource = []
          detailList.ret.results &&
          detailList.ret.results.forEach((item, index) => {
              dataSource.push({
                ...item,
                rowKey: index + 1 + ""
              })
            })
          let pageIndex = payload.pageIndex
          let pageSize = payload.pageSize
          localStorage.setItem("head_classStu_pageSize", pageSize)

          delete payload.pageIndex
          delete payload.pageSize

          yield put({
            type: "updateState",
            payload: {
              dataSource,
              resultCount: detailList.ret.data.resultCount,
              searchValue: payload,
              pageIndex,
              pageSize
            }
          })
        } else {
          message.error((detailList && detailList.ret && detailList.ret.errorMessage) || "报表查询失败")
        }
      }

      yield put({
        type: "updateState",
        payload: { buttonLoading: false, loading: false }
      })
    },

    /** 课系下拉 */
    *getCourseGorup({ payload }, { call, put, select }) {
      let { ret } = yield call(CourseOrderSystemOpen, payload)
      if (ret && ret.errorCode === 9000) {
        yield put({
          type: "updateState",
          payload: {
            courseGroup: ret.results
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
