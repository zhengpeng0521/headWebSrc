import React from "react"
import { connect } from "dva"
import { message } from "antd"
import moment from 'moment'
import IncomeComponent from "../../../components/financial-center/income/IncomeComponent"
import SuperSearch from "../../../components/common/new-component/super-search/SuperSearch"
import AddIncome from "../../../components/financial-center/income/AddIncome"
import ListModal from "../../../components/financial-center/income/ListModal"
import ExpenseImport from "../../../components/financial-center/income/import-step/ExpenseImport"
import { AlertModal } from "../../../components/common/new-component/NewComponent"

function Income({ dispatch, incomeModel }) {
  const {
    orgIdList,

    expenseCount,
    expenseCurrent,
    tableNewColumns, // 列表项
    tableLoading,
    tableDataSource, // 表格数据
    tableDataTotal, // 总数
    tablePageIndex, // 当前页
    tablePageSize, // 当前条数
    superSearchVisible, // 高级搜索显示
    searchValues, // 搜索内容
    superSearchValues, //高级搜索内容
    sectionList, // 收款部门下拉
    projectList, // 收款项目下拉
    payWayList, // 收款方式下拉

    // 添加
    visible,
    btnLoading,
    expenseType,
    expenseDetail, // 收款详情
    deptList, // 城市下拉
    orgList,  // 校区下拉
    hasHq,
    currentType,

    // 类别
    listVisible,
    listType, // 弹窗类型
    listLoading,
    list, // 列表
    selectIndex, // 当前选中项
    itemName, // 类别名
    saveType, // 保存类型 ada增加，edit编辑

    // 导入
    contractOrderImportModalVisible, //合同导入modal是否显示
    contractOrderImportModalButtonLoading, //合同导入按钮加载状态
    contractOrderImportModalStep, //合同导入进行的步数
    isModel,
    uploadId, // 上传记录id
    expenseField,
    //第一步
    contractOrderImportFirstSuc, //第一步是否完成
    contractOrderImportModalExcelName, //合同导入上传文件名
    //第二步
    secondStepTableTitle, //第二步表头
    secondStepTableDataSourse, //第二步列表数据
    secondStepTableDataTotal, //第二步列表数据数量
    //第三步
    thirdLastButtonDisplay, //第三步中上一步按钮是否显示(点击确定后消失)

    //导入完成提示
    successVisible, //提示框是否显示
    successTitle, //提示框标题
    successId, //导出错误日志的id
    successContent,
    successAll // 是否全部完成
  } = incomeModel

  /** 搜索 */
  function onSearch(values) {
    if(values.createTime && values.createTime.length > 0){
      values.createTimeStart = values.createTime[0].format('YYYY-MM-DD')
      values.createTimeEnd = values.createTime[1].format('YYYY-MM-DD')
    }
    delete values.createTime
    if(values.spendTime && values.spendTime.length > 0){
      values.spendTimeStart = values.spendTime[0].format('YYYY-MM-DD')
      values.spendTimeEnd = values.spendTime[1].format('YYYY-MM-DD')
    }
    delete values.spendTime
    if(values && (values.orgIds || values.orgIds === 0)){
      values.depIds = values.orgIds
    } else if(values && values.depIds) {
      delete values.depIds
    }

    dispatch({
      type: "incomeModel/getExpenseList",
      payload: {
        pageIndex: 0,
        pageSize: tablePageSize,
        searchValues: values,
        superSearchValues
      }
    })
  }

  /** 高级搜索 */
  function superSearchClick(values) {
    dispatch({
      type: "incomeModel/getExpenseList",
      payload: {
        pageIndex: 0,
        pageSize: tablePageSize,
        searchValues,
        superSearchValues: values
      }
    })
  }

  //列表控制显示行
  function TableChangeColumns(tableNewColumns) {
    dispatch({
      type: "incomeModel/updateState",
      payload: {
        tableNewColumns
      }
    })
  }

  //分页改变事件
  function TablePageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'incomeModel/getExpenseList',
      payload: {
        pageIndex: pageIndex - 1,
        pageSize: pageSize,
        searchValues,
        superSearchValues
      }
    })
  }

  //table点击高级搜索事件和高级搜索点击右上角的X
  function onSuperSearch() {
    dispatch({
      type: "incomeModel/updateState",
      payload: {
        superSearchVisible: !superSearchVisible
      }
    })
  }

  /** 打开添加/编辑收款 */
  function addPay(type, row) {
    if (type == "edit") {
      dispatch({
        type: "incomeModel/getExpenseDetail",
        payload: {
          id: row.id
        }
      })
    }
    dispatch({
      type: "incomeModel/updateState",
      payload: {
        visible: true,
        expenseType: type
      }
    })
    // // 获取城市下拉
    // dispatch({
    //   type: "incomeModel/getCityList",
    //   payload: {
    //     treeType: 'structure'
    //   }
    // })
    // // 获取校区下拉
    // dispatch({
    //   type: "incomeModel/getOrgList",
    //   payload: {
    //     pageIndex: 0,
    //     pageSize: 9999
    //   }
    // })
  }

  /**
   * 更多操作
   * import导入，export导出
   **/
  function moreAction(e) {
    if (e.key == "import") {
      dispatch({
        type: "incomeModel/updateState",
        payload: {
          contractOrderImportModalVisible: true
        }
      })
    } else if (e.key == "export") {
      let params = {
        ...searchValues,
        ...superSearchValues,
        recordType: '2',
        pageSize: tableDataTotal === 0 ? 999 : tableDataTotal
      }
      window.excelExport("/crm/hq/income/record/export", params)
    }
  }

  /** 删除 */
  function deleteRecord(row) {
    dispatch({
      type: "incomeModel/removeExpense",
      payload: {
        id: row.id
      }
    })
  }

  // ---------------------------------添加/编辑弹窗---------------------------------
  /** 取消添加 */
  function cancelAdd() {
    dispatch({
      type: "incomeModel/updateState",
      payload: {
        visible: false,
        expenseDetail: {},
        currentType: '1'
      }
    })
  }

  /** 保存添加及编辑 */
  function saveAdd(values) {
    if (expenseType == "edit") {
      dispatch({
        type: "incomeModel/editExpense",
        payload: {
          ...values,
          id: expenseDetail.id
        }
      })
    } else {
      dispatch({
        type: "incomeModel/addExpense",
        payload: {
          ...values
        }
      })
    }
  }

  /** 部门类型change */
  function typeChange(e){
    dispatch({
      type: "incomeModel/updateState",
      payload: {
        currentType: e.target.value
      }
    })
  }

  /**
   * 打开收款项目列表
   * project支付项目  way支付方式
   **/
  function openNewModal(type) {
    dispatch({
      type: "incomeModel/updateState",
      payload: {
        listVisible: true,
        listType: type
      }
    })

    if (type == "project") {
      dispatch({
        type: "incomeModel/getProjectList"
      })
    } else {
      dispatch({
        type: "incomeModel/getPayWayList"
      })
    }
  }

  // -------------------------------------收款项目 / 支付方式----------------------------------
  /** 关闭类别 */
  function closeListModal() {
    dispatch({
      type: "incomeModel/updateState",
      payload: {
        listVisible: false
      }
    })
    cancelItem()
  }

  /** 删除类别 */
  function deleteItem(row) {
    if (listType == "project") {
      dispatch({
        type: "incomeModel/editProject",
        payload: {
          name: row.name,
          id: row.id,
          status: "0"
        }
      })
    } else {
      dispatch({
        type: "incomeModel/editPayWay",
        payload: {
          name: row.name,
          id: row.id,
          status: "0"
        }
      })
    }
  }

  /** 类别名change */
  function itemNameChange(e) {
    dispatch({
      type: "incomeModel/updateState",
      payload: {
        itemName: e.target.value
      }
    })
  }

  /** 编辑类别名 */
  function editItem(index, item) {
    dispatch({
      type: "incomeModel/updateState",
      payload: {
        selectIndex: index,
        itemName: item.name,
        saveType: "edit"
      }
    })
  }

  /** 保存类别名 */
  function saveItem(row) {
    // 校验
    if (listType == "project" && itemName && itemName.length > 8) {
      message.warning("最多8个字")
      return
    } else if (
      listType == "way" &&
      itemName &&
      itemName.length > 15
    ) {
      message.warning("最多15字")
      return
    }

    if (saveType == "edit") {
      if (listType == "project") {
        dispatch({
          type: "incomeModel/editProject",
          payload: {
            name: itemName,
            id: row.id,
            status: "1"
          }
        })
      } else {
        dispatch({
          type: "incomeModel/editPayWay",
          payload: {
            name: itemName,
            id: row.id,
            status: "1"
          }
        })
      }
    } else {
      if (listType == "project") {
        dispatch({
          type: "incomeModel/addProject",
          payload: {
            name: itemName
          }
        })
      } else {
        dispatch({
          type: "incomeModel/addPayWay",
          payload: {
            name: itemName
          }
        })
      }
    }
  }

  /** 取消类别名 */
  function cancelItem() {
    const tempList = [...list]
    if (saveType == "add") {
      tempList.pop()
      dispatch({
        type: "incomeModel/updateState",
        payload: {
          selectIndex: undefined,
          itemName: "",
          list: tempList
        }
      })
    }
    dispatch({
      type: "incomeModel/updateState",
      payload: {
        selectIndex: undefined,
        itemName: ""
      }
    })
  }

  /** 增加类别 */
  function createItem() {
    const tempList = [...list]
    tempList.push({ id: "", name: "" })
    dispatch({
      type: "incomeModel/updateState",
      payload: {
        list: tempList,
        selectIndex: tempList.length - 1,
        saveType: "add"
      }
    })
  }

  // -----------------------------------导入----------------------------------------
  /*点击modal内按钮*/
  function ModalOperation(type) {
    if (type == "first_next") {
      if (isModel) {
        //获取预览表格
        dispatch({
          type: "incomeModel/getImportField",
          payload: {
            id: uploadId
            // regex: JSON.stringify(regex)
          }
        })
      } else {
        message.error("上传文件非模板文件，请重新上传")
      }
    } else if (type == "second_prestep") {
      dispatch({
        type: "incomeModel/updateState",
        payload: {
          contractOrderImportModalStep: 0
        }
      })
    } else if (type == "second_next") {
      dispatch({
        type: "incomeModel/updateState",
        payload: {
          contractOrderImportModalStep: 2
        }
      })
    } else if (type == "last_prestep") {
      dispatch({
        type: "incomeModel/updateState",
        payload: {
          contractOrderImportModalStep: 1
        }
      })
    } else if (type == "finish") {
      dispatch({
        type: "incomeModel/expenseImport",
        payload: {
          id: uploadId,
          regex: JSON.stringify(expenseField), //合同导入中的regex
        }
      })
    }
  }

  /*合同导入modal关闭*/
  function ContractOrderImportModalClose() {
    dispatch({ type: "incomeModel/clearUploadModal" })
  }

  //选择文件onChange事件
  function FirstStepUploadOnChange(info) {
    if (
      info.file.status != "uploading" &&
      info.file.response &&
      info.file.response.errorCode !== 0
    ) {
      return message.error(info.file.response.errorMessage || "上传失败")
    }

    if (info.file.status == "done") {
      message.success(`上传成功,正在检测文件类型`)
      /*检查是不是模板文件*/
      dispatch({
        type: "incomeModel/checkModelFile",
        payload: {
          id:
            (info &&
              info.fileList.length > 0 &&
              info.fileList[info.fileList.length - 1].response.id) ||
            undefined,
          name: info.file.name
        }
      })
    } else if (info.file.status === "error") {
      message.error(`上传失败`)
    }
  }

  //点击下载数据模板
  function FirstStepDownLoadDataModal() {
    let params = {
      type: "80"
    }
    window.excelExport("/crm/tmk/clue/excel/downloadStuInfoModel", params)
  }

  // ----------------------------------------导入完成提示---------------------------------------
  //提示框点击取消
  function alertModalOnCancel() {
    dispatch({
      type: "incomeModel/updateState",
      payload: {
        successVisible: false
      }
    })
  }

  //提示框点击下载错误日志
  function alertModalOnOk() {
    if (successAll) {
      dispatch({
        type: "incomeModel/updateState",
        payload: {
          successVisible: false
        }
      })
      // dispatch({
      //   type: "incomeModel/getExpenseList",
      //   payload: {
      //     pageSize: tablePageSize,
      //     pageIndex: tablePageIndex,
      //     searchValues,
      //     superSearchValues
      //   }
      // })
    } else {
      let params = {
        id: successId
      }
      window.excelExport("/crm/hq/spend/download/downloadFile", params)
    }
  }

  // 页面属性
  const compoentProps = {
    orgIdList,
    expenseCount,
    expenseCurrent,
    tableNewColumns, // 列表项
    tableLoading,
    tableDataSource, // 表格数据
    tableDataTotal, // 总数
    tablePageIndex, // 当前页
    tablePageSize, // 当前条数
    superSearchVisible, // 高级搜索显示
    sectionList, // 收款部门下拉
    projectList, // 收款项目下拉

    /** 方法 */
    onSearch, // 搜索
    TableChangeColumns, // 列表项change
    TablePageOnChange, // 分页change
    onSuperSearch, // 高级搜索
    addPay, // 添加收款
    moreAction,
    deleteRecord // 删除
  }

  // 高级搜索
  const superProps = {
    searchVisible: superSearchVisible,
    closeSearch: onSuperSearch,
    onSearch: data => superSearchClick(data),
    onClear: data => superSearchClick(data),
    fields: [
      {
        key: "payWayId",
        type: "select",
        label: "收款方式",
        placeholder: "请选择收款方式",
        options: payWayList,
        opt_key: 'id',
        opt_label: 'name'
      },
      {
        key: "isInvoice",
        type: "select",
        label: "有无发票",
        placeholder: "请选择有无发票",
        options: [{ key: "1", label: "有" }, { key: "0", label: "无" }]
      }
    ]
  }

  const addProps = {
    visible,
    btnLoading,
    expenseType,
    projectList, // 收款项目下拉
    payWayList, // 收款方式下拉
    deptList, // 城市下拉
    orgList,  // 校区下拉
    expenseDetail, // 收款详情
    hasHq,
    currentType,

    /** 方法 */
    cancelAdd, // 取消
    saveAdd, // 保存
    openNewModal, // 打开收款项目
    typeChange,
  }

  const listModalProps = {
    listVisible,
    listType, // 弹窗类型
    listLoading,
    list, // 列表
    selectIndex, // 当前选中项
    itemName, // 类别名

    /** 方法 */
    closeListModal,
    deleteItem, // 删除类别
    editItem, // 编辑类别名
    itemNameChange, // 类别名change
    saveItem, // 保存类别名
    cancelItem, // 取消类别名
    createItem // 增加类别
  }

  // 导入属性
  const importModalProps = {
    // contractOrderImportOrgId, //批量导入时选择校区ID
    contractOrderImportModalVisible, //合同导入modal是否显示
    contractOrderImportModalButtonLoading, //合同导入按钮加载状态
    contractOrderImportModalStep, //合同导入进行的步数

    ModalOperation, //点击modal内按钮
    ContractOrderImportModalClose, //合同导入modal关闭

    /*第一步*/
    contractOrderImportFirstSuc, //第一步是否完成
    contractOrderImportModalExcelName, //合同导入上传文件名
    FirstStepUploadOnChange, //选择文件onChange事件
    FirstStepDownLoadDataModal, //点击下载数据模板

    /*第二步*/
    secondStepTableTitle, //第二步表头
    secondStepTableDataSourse, //第二步列表数据
    secondStepTableDataTotal, //第二步列表数据数量

    /*第三步*/
    thirdLastButtonDisplay //第三步中上一步按钮是否显示(点击确定后消失)
  }

  // 导入完成提示
  const AlertModalProps = {
    visible: successVisible, //提示框是否显示
    title: successTitle, //提示框标题
    content: successContent, //提示框内容
    onOk: alertModalOnOk, //提示框点击下载
    onCancel: alertModalOnCancel, //提示框点击取消
    footerEnsure: successAll ? "确定" : "下载错误日志",
    footerCancel: "关闭"
  }

  return (
    <div style={{overflow: 'hidden'}}>
      <IncomeComponent {...compoentProps} />
      <SuperSearch {...superProps} />
      {visible && <AddIncome {...addProps} />}
      {listVisible && <ListModal {...listModalProps} />}
      {contractOrderImportModalVisible && (
        <ExpenseImport {...importModalProps} />
      )}
      {successVisible && <AlertModal {...AlertModalProps} />}
    </div>
  )
}

const mapStateToProps = ({ incomeModel }) => ({ incomeModel })

export default connect(mapStateToProps)(Income)
