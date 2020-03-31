import { message } from "antd"
import { parse } from "qs"
import React from 'react'
import {
  getExpenseList,
  getProjectList,
  getPayWayList,
  addExpense,
  getExpenseDetail,
  editExpense,
  removeExpense,
  addProject,
  editProject,
  addPayWay,
  editPayWay,
  checkModelFile,
  getImportField,
  previewImport,
  expenseImport,
  expenseIsComplete,
  expenseOrgAndDept
} from "../../../../services/financial-center/expenses/expensesService"
import { getOrgList } from '../../../../services/common/GetOrgInfoService'
import { GetRightTableList } from '../../../../services/campus-management/head-org-detail/HeadOrgDetail'
import { GetTreeStuOrCou } from '../../../../services/system/head-quarters-setting/TreeStrOrCou'

export default {
  namespace: "incomeModel",

  state: {
    orgIdList: [],

    expenseCount: 0,
    expenseCurrent: 0,
    tableNewColumns: [], // 列表项
    tableLoading: false,
    tableDataSource: [], // 表格数据
    tableDataTotal: 0, // 总数
    tablePageIndex: 0, // 当前页
    tablePageSize: 20, // 当前条数
    superSearchVisible: false, // 高级搜索显示
    searchValues: {}, // 搜索内容
    superSearchValues: {}, //高级搜索内容

    sectionList: [], // 收款部门下拉
    projectList: [], // 收款项目下拉
    payWayList: [], // 收款方式下拉

    // 添加收款
    visible: false,
    btnLoading: false,
    expenseType: "add", // add添加，edit编辑
    expenseDetail: {}, // 收款详情
    deptList: [], // 城市下拉
    orgList: [],  // 校区下拉
    hasHq: true,
    currentType: '1',

    // 类别
    listVisible: false,
    listType: "project", // 弹窗类型
    listLoading: false,
    list: [], // 列表
    selectIndex: undefined, // 当前选中项
    itemName: "", // 类别名
    saveType: "add", // 保存类型

    // 导入
    contractOrderImportModalVisible: false, //合同导入modal是否显示
    contractOrderImportModalButtonLoading: false, //合同导入按钮加载状态
    contractOrderImportModalStep: 0, //合同导入进行的步数
    isModel: false, // 是否摸板文件
    expenseField: {}, // 导入字段
    uploadId: "", // 上传记录id
    //第一步
    contractOrderImportFirstSuc: false, //第一步是否完成
    contractOrderImportModalExcelName: "请上传文件", //合同导入上传文件名
    //第二步
    secondStepTableTitle: [], //第二步表头
    secondStepTableDataSourse: [], //第二步列表数据
    secondStepTableDataTotal: [], //第二步列表数据数量
    //第三步
    thirdLastButtonDisplay: "inline-block", //第三步中上一步按钮是否显示(点击确定后消失)

    //导入完成提示
    successVisible: false, //提示框是否显示
    successTitle: "", //提示框标题
    successId: undefined, //导出错误日志的id
    successContent: "",
    successAll: false // 是否全部完成
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === "hq_orgser_income") {
          dispatch({ type: "getProjectList" })
          dispatch({ type: "getPayWayList" })
          dispatch({ type: "getAllOrg" })

          dispatch({
            type: "getExpenseList",
            payload: {
              searchValues: {},
              superSearchValues: {},
              pageIndex: 0,
              pageSize: 20
            }
          })
        }
      })
    }
  },

  effects: {
    *getAllOrg({ payload }, { put, call, select }){
      const { ret } = yield call(expenseOrgAndDept, parse(payload))
      if (ret && ret.errorCode === 0) {
        // let allOrgs = [{id: window._init_data.orgId, name: '总部'}]
        // ret.results && ret.results.forEach(item => {
        //   !(item.type == 'dept' && item.id == '0') && allOrgs.push({ id: item.id, name: item.name })
        //   item.children && item.children.length > 0 && item.children.forEach(child => {
        //     if(child.type == 'org'){
        //       allOrgs.push({ id: child.org_id, name: child.org_name })
        //     } else {
        //       allOrgs.push({ id: child.id, name: child.name })
        //     }
        //   })
        // })
        let allOrgs = []
        // 部门
        ret.deptList && ret.deptList.map(item => {
          allOrgs.push(item)
        })
        // 校区
        ret.orgList && ret.orgList.map(item => {
          allOrgs.push(item)
        })

        yield put({
          type: 'updateState',
          payload: {
            orgIdList: allOrgs,
            deptList: ret.deptList || [],
            orgList: ret.orgList || [],
            hasHq: ret.isHq == '1',
            currentType: ret.isHq == '1' ? '1' : '2'
          }
        })
      } else {
        message.error(
          ret && ret.errorMessage ? ret.errorMessage : "获取管辖部门校区失败"
        )
      }
    },

    /** 获取城市下拉 */
    *getCityList({ payload }, { put, call, select }){
      const { ret } = yield call(GetTreeStuOrCou, parse(payload))
      if (ret && ret.errorCode === 9000) {
        yield put({
          type: 'updateState',
          payload: {
            deptList: ret.results
          }
        })
      } else {
        message.error(
          ret && ret.errorMessage ? ret.errorMessage : "获取城市失败"
        )
      }
    },

    /** 获取校区下拉 */
    *getOrgList({ payload }, { put, call, select }){
      const { ret } = yield call(GetRightTableList, parse(payload))
      if (ret && ret.errorCode === 9000) {
        yield put({
          type: 'updateState',
          payload: {
            orgList: ret.results
          }
        })
      } else {
        message.error(
          ret && ret.errorMessage ? ret.errorMessage : "获取校区失败"
        )
      }
    },

    /** 收款记录列表 */
    *getExpenseList({ payload }, { put, call, select }) {
      yield put({ type: "updateState", payload: { tableLoading: true } })
      const { searchValues, superSearchValues, pageIndex, pageSize } = payload
      let params = {
        ...searchValues,
        ...superSearchValues,
        pageIndex,
        pageSize,
        recordType: '2' // 1支出，2收入
      }
      const { ret } = yield call(getExpenseList, parse(params))
      if (ret && ret.errorCode === 0) {
        yield put({
          type: "updateState",
          payload: {
            tableDataSource: ret.results,
            tableDataTotal: ret.data.resultCount,
            tablePageIndex: ret.data.pageIndex,
            tablePageSize: ret.data.pageSize,
            expenseCount: ret.countAmount,
            searchValues: payload.searchValues,
            superSearchValues: payload.superSearchValues
          }
        })
      } else {
        message.error(
          ret && ret.errorMessage ? ret.errorMessage : "获取收款记录失败"
        )
      }
      yield put({ type: "updateState", payload: { tableLoading: false } })
    },

    /** 收款项目列表 */
    *getProjectList({ payload }, { put, call, select }) {
      yield put({ type: "updateState", payload: { listLoading: true } })
      let params = {...payload, projectType:'2'} // 1支出，2收入
      const { ret } = yield call(getProjectList, parse(params))
      if (ret && ret.errorCode === 0) {
        yield put({
          type: "updateState",
          payload: {
            projectList: ret.results,
            list: ret.results
          }
        })
      } else {
        message.error(
          ret && ret.errorMessage ? ret.errorMessage : "获取收款项目失败"
        )
      }
      yield put({ type: "updateState", payload: { listLoading: false } })
    },

    /** 收款方式列表 */
    *getPayWayList({ payload }, { put, call, select }) {
      yield put({ type: "updateState", payload: { listLoading: true } })
      let params = {...payload, payWayType:'2'} // 1支出，2收入
      const { ret } = yield call(getPayWayList, parse(params))
      if (ret && ret.errorCode === 0) {
        yield put({
          type: "updateState",
          payload: {
            payWayList: ret.results,
            list: ret.results
          }
        })
      } else {
        message.error(
          ret && ret.errorMessage ? ret.errorMessage : "获取收款方式失败"
        )
      }
      yield put({ type: "updateState", payload: { listLoading: false } })
    },

    /** 新增收款记录 */
    *addExpense({ payload }, { put, call, select }) {
      yield put({ type: "updateState", payload: { btnLoading: true } })

      let state = select(state => state.incomeModel)
      let params = {
        ...payload,
        recordType: '2' // 1支出，2收入
      }
      const { ret } = yield call(addExpense, parse(params))
      if (ret && ret.errorCode === 0) {
        message.success("新增成功")
        yield put({
          type: "updateState",
          payload: {
            visible: false,
            expenseDetail: {},
            currentType: '1'
          }
        })
        yield put({
          type: "getExpenseList",
          payload: {
            searchValues: state.searchValues,
            superSearchValues: state.superSearchValues,
            pageIndex: 0,
            pageSize: state.tablePageSize
          }
        })
      } else {
        message.error(ret && ret.errorMessage ? ret.errorMessage : "新增失败")
      }
      yield put({ type: "updateState", payload: { btnLoading: false } })
    },

    /** 收款记录详情 */
    *getExpenseDetail({ payload }, { put, call, select }) {
      yield put({ type: "updateState", payload: { btnLoading: true } })

      const { ret } = yield call(getExpenseDetail, parse(payload))
      if (ret && ret.errorCode === 0) {
        yield put({
          type: "updateState",
          payload: {
            expenseDetail: ret
          }
        })
      } else {
        message.error(
          ret && ret.errorMessage ? ret.errorMessage : "获取收款记录详情失败"
        )
      }
      yield put({ type: "updateState", payload: { btnLoading: false } })
    },

    /** 编辑收款记录 */
    *editExpense({ payload }, { put, call, select }) {
      yield put({ type: "updateState", payload: { btnLoading: true } })

      let state = select(state => state.incomeModel)
      const { ret } = yield call(editExpense, parse(payload))
      if (ret && ret.errorCode === 0) {
        message.success("编辑成功")
        yield put({
          type: "updateState",
          payload: {
            visible: false,
            expenseDetail: {},
            currentType: '1'
          }
        })
        yield put({
          type: "getExpenseList",
          payload: {
            searchValues: state.searchValues,
            superSearchValues: state.superSearchValues,
            pageIndex: 0,
            pageSize: state.tablePageSize
          }
        })
      } else {
        message.error(ret && ret.errorMessage ? ret.errorMessage : "编辑失败")
      }
      yield put({ type: "updateState", payload: { btnLoading: false } })
    },

    /** 删除收款记录 */
    *removeExpense({ payload }, { put, call, select }) {
      let state = select(state => state.incomeModel)
      const { ret } = yield call(removeExpense, parse(payload))
      if (ret && ret.errorCode === 0) {
        message.success("删除成功")
        yield put({
          type: "getExpenseList",
          payload: {
            searchValues: state.searchValues,
            superSearchValues: state.superSearchValues,
            pageIndex: 0,
            pageSize: state.tablePageSize
          }
        })
      } else {
        message.error(ret && ret.errorMessage ? ret.errorMessage : "删除失败")
      }
    },

    /** 增加收款项目 */
    *addProject({ payload }, { put, call, select }) {
      yield put({ type: "updateState", payload: { listLoading: true } })
      let params = {...payload, projectType:'2'} // 1支出，2收入
      const { ret } = yield call(addProject, parse(params))
      if (ret && ret.errorCode === 0) {
        message.success("添加成功")
        yield put({
          type: 'updateState',
          payload: {
            selectIndex: undefined,
            itemName: ''
          }
        })
        yield put({
          type: "getProjectList"
        })
      } else {
        message.error(ret && ret.errorMessage ? ret.errorMessage : "添加失败")
      }
      yield put({ type: "updateState", payload: { listLoading: false } })
    },

    /** 编辑/删除收款项目 */
    *editProject({ payload }, { put, call, select }) {
      yield put({ type: "updateState", payload: { listLoading: true } })
      let text = payload.status == "0" ? "删除" : "编辑"
      const { ret } = yield call(editProject, parse(payload))
      if (ret && ret.errorCode === 0) {
        message.success(`${text}成功`)
        yield put({
          type: 'updateState',
          payload: {
            selectIndex: undefined,
            itemName: ''
          }
        })
        yield put({
          type: "getProjectList"
        })
      } else {
        message.error(
          ret && ret.errorMessage ? ret.errorMessage : `${text}失败`
        )
      }
      yield put({ type: "updateState", payload: { listLoading: false } })
    },

    /** 增加收款方式 */
    *addPayWay({ payload }, { put, call, select }) {
      yield put({ type: "updateState", payload: { listLoading: true } })
      let params = {...payload, payWayType:'2'} // 1支出，2收入
      const { ret } = yield call(addPayWay, parse(params))
      if (ret && ret.errorCode === 0) {
        message.success("添加成功")
        yield put({
          type: 'updateState',
          payload: {
            selectIndex: undefined,
            itemName: ''
          }
        })
        yield put({
          type: "getPayWayList"
        })
      } else {
        message.error(ret && ret.errorMessage ? ret.errorMessage : "添加失败")
      }
      yield put({ type: "updateState", payload: { listLoading: false } })
    },

    /** 编辑/删除收款方式 */
    *editPayWay({ payload }, { put, call, select }) {
      yield put({ type: "updateState", payload: { listLoading: true } })
      let text = payload.status == "0" ? "删除" : "编辑"
      const { ret } = yield call(editPayWay, parse(payload))
      if (ret && ret.errorCode === 0) {
        message.success(`${text}成功`)
        yield put({
          type: 'updateState',
          payload: {
            selectIndex: undefined,
            itemName: ''
          }
        })
        yield put({
          type: "getPayWayList"
        })
      } else {
        message.error(
          ret && ret.errorMessage ? ret.errorMessage : `${text}失败`
        )
      }
      yield put({ type: "updateState", payload: { listLoading: false } })
    },

    /** 是否是模板文件 */
    *checkModelFile({ payload }, { put, call, select }) {
      let params = {...payload, type: '2'}
      const { ret } = yield call(checkModelFile, parse(params))
      if (ret && ret.errorCode === 0) {
        if (ret.flag) {
          message.success("检测成功，该文件为模版文件")
          yield put({
            type: "updateState",
            payload: {
              contractOrderImportFirstSuc: true
            }
          })
        } else {
          message.success("检测成功，该文件非模版文件")
          yield put({
            type: "updateState",
            payload: {
              contractOrderImportFirstSuc: false
            }
          })
        }
        yield put({
          type: "updateState",
          payload: {
            isModel: ret.flag,
            contractOrderImportModalExcelName: payload.name,
            uploadId: payload.id
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
        payload: { contractOrderImportModalButtonLoading: true }
      })
      let params = {...payload, type: '2'}
      const { ret } = yield call(getImportField, parse(params))
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
            expenseField: regex,
            uploadId: id
          }
        })
        yield put({
          type: "previewImport",
          payload: {
            regex: JSON.stringify(regex),
            id
          }
        })
      } else {
        message.error(ret && ret.errorMessage ? ret.errorMessage : "获取失败")
        yield put({
          type: "updateState",
          payload: { contractOrderImportModalButtonLoading: false }
        })
      }
    },

    /** 预览表格 */
    *previewImport({ payload }, { put, call, select }) {
      let params = {...payload, type: '2'}
      const { ret } = yield call(previewImport, parse(params))
      if (ret && ret.errorCode === 0) {
        let newList = []
        ret.results && ret.results.forEach((item,index) => {
          newList.push({ ...item, id: 'pre' + index })
        })
        yield put({
          type: "updateState",
          payload: {
            contractOrderImportModalStep: 1,
            secondStepTableTitle: ret.dataModelFields,
            secondStepTableDataSourse: newList,
            secondStepTableDataTotal: ret.results.length
          }
        })
      } else {
        message.error(ret && ret.errorMessage ? ret.errorMessage : "预览失败")
      }
      yield put({
        type: "updateState",
        payload: { contractOrderImportModalButtonLoading: false }
      })
    },

    /** 收款记录导入 */
    *expenseImport({ payload }, { put, call, select }) {
      yield put({
        type: "updateState",
        payload: { contractOrderImportModalButtonLoading: true }
      })
      yield put({
        type: "updateState",
        payload: { thirdLastButtonDisplay: "none" }
      })
      // let indexMainLayoutModel = yield select(
      //   state => state.indexMainLayoutModel
      // )
      // payload.userId =
      //   !!indexMainLayoutModel.userMsg && indexMainLayoutModel.userMsg.userId
      // payload.orgId = window._init_data.orgId
      let params = {...payload, type: '2'}
      let { ret } = yield call(expenseImport, parse(params))
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
          type: "expenseIsComplete",
          payload: {
            // orgId: ret.data.orgId,
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
          payload: { contractOrderImportModalButtonLoading: false }
        })
      }
    },

    /** 轮询是否导入完成 */
    *expenseIsComplete({ payload }, { put, call, select }) {
      yield put({
        type: "updateState",
        payload: { contractOrderImportModalButtonLoading: true, thirdLastButtonDisplay: "none" }
      })
      let expenseModel = yield select(state => state.incomeModel)
      let params = {...payload, type: '2'}
      let { ret } = yield call(expenseIsComplete, parse(params))
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
            type: "expenseIsComplete",
            payload: {
              // orgId: payload.orgId,
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
            payload: { contractOrderImportModalButtonLoading: false, thirdLastButtonDisplay: "inline-block" }
          })
          // 刷新列表
          yield put({
            type: "getExpenseList",
            payload: {
              pageIndex: 0,
              pageSize: expenseModel.tablePageSize,
              searchValues: expenseModel.searchValues,
              superSearchValues: expenseModel.superSearchValues
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
          payload: { contractOrderImportModalButtonLoading: false, thirdLastButtonDisplay: "inline-block" }
        })
      }
    }
  },

  reducers: {
    updateState(state, action) {
      return { ...state, ...action.payload }
    },
    clearUploadModal(state, action) {
      return {
        ...state,
        contractOrderImportOrgId: window._init_data.firstOrg.key, //批量导入时选择校区ID
        contractOrderImportModalVisible: false, //leads导入modal是否显示
        contractOrderImportModalButtonLoading: false, //leads导入按钮加载状态
        contractOrderImportModalStep: 0, //leads导入进行的步数
        contractOrderImportRegex: {}, //leads导入中的regex
        /*第一步*/
        contractOrderImportFirstSuc: false, //第一步是否完成
        contractOrderImportModalExcelName: "请上传文件", //leads导入上传文件名
        uploadId: "", //leads导入上传文件id
        isModel: false, //导入的文件是否是模板
        /*第二步*/
        secondStepTableTitle: [], //第二步表头
        secondStepTableDataSourse: [], //第二步列表数据
        secondStepTableDataTotal: [], //第二步列表数据数量
        /*第三步*/
        thirdLastButtonDisplay: "inline-block", //第三步中上一步按钮是否显示(点击确定后消失)
        lastStepChooseItem: undefined //第三步选中的选项
      }
    }
  }
}
