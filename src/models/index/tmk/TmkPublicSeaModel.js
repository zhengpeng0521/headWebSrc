import React from "react"
import { parse } from "qs"
import { message } from "antd"
import {
  getDict,
  getPublicList,
  removePublic,
  addPublic,
  getPublicDetail,
  editPublic,
  getTmkFollow,
  assignPublic,
  isTmkModel,
  getTableCols,
  previewData,
  importTmk,
  importComplete,
  getSubSecond,
  collecterList
} from "../../../services/tmk/tmkPublicSeaService"
// import { GetTreeStuOrCou } from '../../../services/system/head-quarters-setting/TreeStrOrCou'
import { expenseOrgAndDept } from "../../../services/financial-center/expenses/expensesService"

export default {
  namespace: "TmkPublicSeaModel",

  state: {
    /** 表格 */
    tableNewColumns: [], //列表项
    tableLoading: false, //表格加载
    tableDataSource: [], //数据
    tableDataTotal: 0, //总数
    tablePageIndex: 0, //当前页数
    tablePageSize: 20, //每页条数
    currentRow: {}, //当前编辑行
    searchValues: {}, //搜索条件

    /** 新增编辑 */
    modalType: "add", //弹窗类型 add新建，edit编辑
    addVisible: false,
    btnLoading: false,
    secondChannel: undefined, //选中市场渠道
    tmkDetail: {}, //编辑信息
    cityList: [], //城市下拉
    sourceTypes: [], //来源类别下拉（一级来源）
    marketList: [], //市场渠道下拉（二级来源）
    marketSubList: [], //二级渠道下拉
    collecterList: [],  // 收集人下拉

    /** 分配tmk */
    assignVisible: false,
    assignLoading: false,
    allNum: 0, //可分配数
    operatorList: [], //分配人员
    users: [], //分配参数

    /** 导入 */
    importVisible: false,
    importStep: 0, //当前步数
    importLoading: false,
    /** 第一步 */
    importDeptId: undefined, //选中城市
    /** 第二步 */
    uploadSuc: false, //上传是否完成
    importName: undefined, //导入上传文件名
    isModel: false, //是否摸板
    uploadId: undefined, //上传id
    /** 信息配对 */
    leadsImportSecondSuc: false, //第二步是否完成
    secondStepMatchData: [], //第二步匹配数据
    secondStepMisMatchData: [], //第二步不匹配数据
    secondStepSelectData: [], //第二步下拉列表数据
    secondStepHasChoosedData: [], //第二步中已选中的未配对数据
    /** 第三步 */
    importTableTitle: [], //表头
    importTableDataSourse: [], //列表数据
    importTableTotal: 0, //列表数据数量
    importField: {}, //字段
    /** 第四步 */
    logFileId: undefined, //失败日志id

    //导入完成提示
    successVisible: false, //提示框是否显示
    successTitle: "", //提示框标题
    successId: undefined, //导出错误日志的id
    successContent: "",
    successAll: false, //是否全部完成

    selectModalVisible: false,
    selectOrgs: []
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === "/hq_tmk_publicsea") {
          dispatch({
            type: "getPublicList",
            payload: {
              pageIndex: 0,
              pageSize: 20
            }
          })
          dispatch({
            type: "getCityList"
            // payload: {
            //   treeType: 'structure'
            // }
          })
          dispatch({
            type: "getSourceTypes"
          })
          dispatch({
            type: "getMarketList"
          })
        }
      })
    }
  },

  effects: {
    /** 获取城市下拉 */
    *getCityList({ payload }, { put, call, select }) {
      const { ret } = yield call(expenseOrgAndDept, parse(payload))
      if (ret && ret.errorCode === 0) {
        yield put({
          type: "updateState",
          payload: {
            cityList: ret.deptList || []
          }
        })
      } else {
        message.error(
          ret && ret.errorMessage ? ret.errorMessage : "获取城市失败"
        )
      }
    },

    /** 获取来源类别下拉 */
    *getSourceTypes({ payload }, { put, call, select }) {
      const params = {
        dictkey: "firstChannel",
        orgId: "0",
        ...payload
      }
      const { ret } = yield call(getDict, parse(params))
      if (ret && ret.errorCode === 0) {
        yield put({
          type: "updateState",
          payload: {
            sourceTypes: ret.results
          }
        })
      } else {
        message.error(
          ret && ret.errorMessage ? ret.errorMessage : "获取来源类别失败"
        )
      }
    },

    /** 获取市场渠道下拉 */
    *getMarketList({ payload }, { put, call, select }) {
      const params = {
        dictkey: "secondChannel",
        orgId: "0",
        ...payload
      }
      const { ret } = yield call(getDict, parse(params))
      if (ret && ret.errorCode === 0) {
        yield put({
          type: "updateState",
          payload: {
            marketList: ret.results
          }
        })
      } else {
        message.error(
          ret && ret.errorMessage ? ret.errorMessage : "获取市场渠道失败"
        )
      }
    },

    /** 查询二级渠道下拉 */
    *getSubSecond({ payload }, { put, call, select }) {
      const { ret } = yield call(getSubSecond, parse(payload))
      if (ret && ret.errorCode === 0) {
        yield put({
          type: "updateState",
          payload: {
            marketSubList: ret.results
          }
        })
      } else {
        message.error(
          ret && ret.errorMessage ? ret.errorMessage : "获取二级渠道失败"
        )
      }
    },

    /** 收集人列表 */
    *getCollecterList({ payload }, { put, call, select }) {
      const { ret } = yield call(collecterList, parse(payload))
      if (ret && ret.errorCode === 0) {
        yield put({
          type: "updateState",
          payload: {
            collecterList: ret.results || []
          }
        })
      } else {
        message.error(ret && ret.errorMessage ? ret.errorMessage : "收集人列表获取失败")
      }
    },

    /** 公海池列表 */
    *getPublicList({ payload }, { put, call, select }) {
      yield put({ type: "showTableLoading" })
      const { searchValues, pageIndex, pageSize } = payload
      const params = {
        ...searchValues,
        pageIndex,
        pageSize,
        type: "4"
      }
      const { ret } = yield call(getPublicList, parse(params))
      if (ret && ret.errorCode === 0) {
        yield put({
          type: "updateState",
          payload: {
            tableDataSource: ret.results,
            tableDataTotal: ret.data.resultCount,
            tablePageIndex: ret.data.pageIndex,
            tablePageSize: ret.data.pageSize,
            searchValues
          }
        })
      } else {
        message.error(
          ret && ret.errorMessage ? ret.errorMessage : "获取公海池列表失败"
        )
      }
      yield put({ type: "closeTableLoading" })
    },

    /** 删除公海池名单 */
    *removePublic({ payload }, { put, call, select }) {
      const state = yield select(state => state.TmkPublicSeaModel)
      const { ret } = yield call(removePublic, parse(payload))
      if (ret && ret.errorCode === 0) {
        message.success("删除成功")
        yield put({
          type: "getPublicList",
          payload: {
            pageIndex: 0,
            pageSize: state.tablePageSize,
            searchValues: state.searchValues
          }
        })
      } else {
        message.error(ret && ret.errorMessage ? ret.errorMessage : "删除失败")
      }
    },

    /** 新建公海池名单 */
    *addPublic({ payload }, { put, call, select }) {
      yield put({ type: "showBtnLoading" })
      const state = yield select(state => state.TmkPublicSeaModel)
      const { ret } = yield call(addPublic, parse(payload))
      if (ret && ret.errorCode === 0) {
        message.success("新建成功")
        yield put({
          type: "updateState",
          payload: {
            addVisible: false,
            secondChannel: undefined
          }
        })
        yield put({
          type: "getPublicList",
          payload: {
            pageIndex: 0,
            pageSize: state.tablePageSize,
            searchValues: state.searchValues
          }
        })
      } else {
        message.error(ret && ret.errorMessage ? ret.errorMessage : "新建失败")
      }
      yield put({ type: "closeBtnLoading" })
    },

    /** 获取编辑详情 */
    *getPublicDetail({ payload }, { put, call, select }) {
      yield put({ type: "showBtnLoading" })
      const { ret } = yield call(getPublicDetail, parse(payload))
      if (ret && ret.errorCode === 0) {
        // 类别来源
        yield put({
          type: "getSourceTypes"
          // payload: {
          //   deptId: ret.deptId
          // }
        })
        // 市场渠道
        yield put({
          type: "getMarketList"
          // payload: {
          //   deptId: ret.deptId
          // }
        })
        // 二级渠道
        yield put({
          type: "getSubSecond",
          payload: {
            itemKey: ret.secondChannel,
            deptId: ret.deptId,
            orgId: ret.orgId
          }
        })
        // 获取收集人
        yield put({
          type: "getCollecterList",
          payload: {
            deptId: ret.deptId
          }
        })

        yield put({
          type: "updateState",
          payload: {
            tmkDetail: ret,
            secondChannel: ret.secondChannel
          }
        })
      } else {
        message.error(
          ret && ret.errorMessage ? ret.errorMessage : "获取编辑详情失败"
        )
      }
      yield put({ type: "closeBtnLoading" })
    },

    /** 编辑名单 */
    *editPublic({ payload }, { put, call, select }) {
      yield put({ type: "showBtnLoading" })
      const state = yield select(state => state.TmkPublicSeaModel)
      let list = [
        {
          ...payload.list[0],
          parentId: state.tmkDetail.parentItemList[0].parentId
        }
      ]
      let params = {
        ...payload,
        id: state.currentRow.clueStuId,
        list
      }
      const { ret } = yield call(editPublic, parse(params))
      if (ret && ret.errorCode === 0) {
        message.success("编辑成功")
        yield put({
          type: "updateState",
          payload: {
            addVisible: false,
            tmkDetail: {},
            currentRow: {},
            secondChannel: undefined
          }
        })
        yield put({
          type: "getPublicList",
          payload: {
            pageIndex: 0,
            pageSize: state.tablePageSize,
            searchValues: state.searchValues
          }
        })
      } else {
        message.error(ret && ret.errorMessage ? ret.errorMessage : "编辑失败")
      }
      yield put({ type: "closeBtnLoading" })
    },

    /** 获取分配人员 */
    *getTmkFollow({ payload }, { put, call, select }) {
      yield put({ type: "showAssignLoading" })
      const { ret } = yield call(getTmkFollow, parse(payload))
      if (ret && ret.errorCode === 0) {
        yield put({
          type: "updateState",
          payload: {
            operatorList: ret.results || [],
            allNum: ret.count
          }
        })
      } else {
        message.error(ret && ret.errorMessage ? ret.errorMessage : "分配失败")
      }
      yield put({ type: "closeAssignLoading" })
    },

    /** 分配 */
    *assignPublic({ payload }, { put, call, select }) {
      yield put({ type: "showAssignLoading" })
      const state = yield select(state => state.TmkPublicSeaModel)
      const { ret } = yield call(assignPublic, parse(payload))
      if (ret && ret.errorCode === 0) {
        message.success("分配成功")
        yield put({
          type: "updateState",
          payload: {
            assignVisible: false
          }
        })
        yield put({
          type: "getPublicList",
          payload: {
            pageIndex: 0,
            pageSize: state.tablePageSize,
            searchValues: state.searchValues
          }
        })
      } else {
        message.error(ret && ret.errorMessage ? ret.errorMessage : "分配失败")
      }
      yield put({ type: "closeAssignLoading" })
    },

    /**************************************导入*****************************************/
    /** 是否是模板文件 */
    *checkModelFile({ payload }, { put, call, select }) {
      const { ret } = yield call(isTmkModel, parse(payload))
      if (ret && ret.errorCode === 0) {
        if (ret.flag) {
          message.success("检测成功，该文件为模版文件")
        } else {
          message.success("检测成功，该文件非模版文件")
        }
        yield put({
          type: "updateState",
          payload: {
            isModel: ret.flag,
            importName: payload.name,
            uploadId: payload.id,
            uploadSuc: true
          }
        })
      } else {
        message.error(ret && ret.errorMessage ? ret.errorMessage : "检测失败")
      }
    },

    /** 获取导入字段 */
    *getImportField({ payload }, { put, call, select }) {
      yield put({
        type: "updateState",
        payload: { importLoading: true }
      })
      const state = yield select(state => state.TmkPublicSeaModel)
      const { ret } = yield call(getTableCols, parse(payload))
      if (ret && ret.errorCode === 0) {
        const { dataModelFields, sourceFields, id } = ret.data
        let regex = {}
        sourceFields.forEach((item, index) => {
          dataModelFields.forEach(filed => {
            if (item[index].indexOf(filed.value) > -1) {
              regex[index] = filed.key
            }
          })
        })
        yield put({
          type: "updateState",
          payload: {
            importField: regex,
            uploadId: id,
            secondStepMatchData: ret.data.dataModelFields,
            secondStepMisMatchData: sourceFields,
            secondStepSelectData: sourceFields
          }
        })
        // 是摸板直接预览
        if (state.isModel) {
          yield put({
            type: "previewImport",
            payload: {
              regex: JSON.stringify(regex),
              id
            }
          })
        } else {
          yield put({
            type: "updateState",
            payload: { importLoading: false }
          })
        }
      } else {
        message.error(ret && ret.errorMessage ? ret.errorMessage : "获取失败")
        yield put({
          type: "updateState",
          payload: { importLoading: false }
        })
      }
    },

    /** 预览表格 */
    *previewImport({ payload }, { put, call, select }) {
      const { ret } = yield call(previewData, parse(payload))
      if (ret && ret.errorCode === 0) {
        let newList = []
        ret.results &&
          ret.results.forEach((item, index) => {
            newList.push({ ...item, id: "pre" + index })
          })
        yield put({
          type: "updateState",
          payload: {
            importStep: 3,
            importTableTitle: ret.dataModelFields,
            importTableDataSourse: newList,
            importTableTotal: ret.results.length
          }
        })
      } else {
        message.error(ret && ret.errorMessage ? ret.errorMessage : "预览失败")
      }
      yield put({
        type: "updateState",
        payload: { importLoading: false }
      })
    },

    /** 导入公海池 */
    *importTmk({ payload }, { put, call, select }) {
      yield put({
        type: "updateState",
        payload: { importLoading: true }
      })
      let { ret } = yield call(importTmk, parse(payload))
      if (ret && ret.errorCode === 0) {
        let sleep = function(ms) {
          return new Promise(function(resolve, reject) {
            setTimeout(function() {
              resolve()
            }, ms)
          })
        }
        yield sleep(5000)
        yield put({
          type: "tmkIsComplete",
          payload: {
            logFileId: ret.data.logFileId
          }
        })
      } else {
        ret && ret.errorMessage
          ? message.error(ret.errorMessage)
          : message.error("批量导入失败")
        yield put({ type: "clearUploadModal" })
        yield put({
          type: "updateState",
          payload: { importLoading: false }
        })
      }
    },

    /** 轮询是否导入完成 */
    *tmkIsComplete({ payload }, { put, call, select }) {
      yield put({
        type: "updateState",
        payload: { importLoading: true }
      })
      let TmkPublicSeaModel = yield select(state => state.TmkPublicSeaModel)
      let { ret } = yield call(importComplete, parse(payload))
      if (ret && ret.errorCode === 0) {
        let sleep = function(ms) {
          return new Promise(function(resolve, reject) {
            setTimeout(function() {
              resolve()
            }, ms)
          })
        }
        if (!ret.data.complete) {
          yield sleep(5000)
          yield put({
            type: "tmkIsComplete",
            payload: {
              logFileId: payload.logFileId
            }
          })
        } else {
          yield put({ type: "clearUploadModal" })
          yield put({
            type: "updateState",
            payload: {
              //导入成功后提示框
              successVisible: true, //提示框是否显示
              successTitle: "导入完成", //提示框标题
              successId: ret.data.logFileId, //导出错误日志的id
              successContent: (
                <div>
                  <div>成功{ret.data.sucNum}条</div>
                  <div>失败{ret.data.failNum}条</div>
                </div>
              ) //提示框内容
            }
          })
          if (ret.data.failNum != "0") {
            //导入有失败，未完全导入，提醒下载错误日志
            yield put({
              type: "updateState",
              payload: {
                successAll: false
              }
            })
          } else {
            yield put({
              //导入无失败
              type: "updateState",
              payload: {
                successAll: true
              }
            })
          }
          yield put({
            type: "updateState",
            payload: { importLoading: false }
          })
          // 刷新列表
          yield put({
            type: "getPublicList",
            payload: {
              pageIndex: 0,
              pageSize: TmkPublicSeaModel.tablePageSize,
              searchValues: TmkPublicSeaModel.searchValues
            }
          })
        }
      } else {
        ret && ret.errorMessage
          ? message.error(ret.errorMessage)
          : message.error("批量导入失败")
        yield put({ type: "clearUploadModal" })
        yield put({
          type: "updateState",
          payload: { importLoading: false }
        })
      }
    }
  },

  reducers: {
    updateState(state, action) {
      return { ...state, ...action.payload }
    },
    showTableLoading(state, action) {
      return { ...state, tableLoading: true }
    },
    closeTableLoading(state, action) {
      return { ...state, tableLoading: false }
    },

    showBtnLoading(state, action) {
      return { ...state, btnLoading: true }
    },
    closeBtnLoading(state, action) {
      return { ...state, btnLoading: false }
    },

    showAssignLoading(state, action) {
      return { ...state, assignLoading: true }
    },
    closeAssignLoading(state, action) {
      return { ...state, assignLoading: false }
    },

    clearUploadModal(state, action) {
      return {
        ...state,
        importDeptId: undefined, //批量导入时选择校区ID
        importVisible: false, //leads导入modal是否显示
        importLoading: false, //leads导入按钮加载状态
        importStep: 0, //leads导入进行的步数
        importField: {}, //leads导入中的regex
        /*第一步*/
        uploadSuc: false, //第一步是否完成
        importName: undefined, //leads导入上传文件名
        uploadId: "", //leads导入上传文件id
        isModel: false, //导入的文件是否是模板
        /*第二步*/
        importTableTitle: [], //第二步表头
        importTableDataSourse: [], //第二步列表数据
        importTableTotal: [] //第二步列表数据数量
      }
    }
  }
}
