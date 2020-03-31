import React from "react"
import { connect } from "dva"
import { message } from "antd"
import moment from "moment"
import TmkPublicSeaTable from "../../components/tmk/tmkPublicSea/TmkPublicSeaTable"
import AddOrEditTmk from "../../components/tmk/tmkPublicSea/AddOrEditTmk"
import AssginTmk from "../../components/tmk/tmkPublicSea/AssignTmk"
import ImportPublic from "../../components/tmk/tmkPublicSea/importPublic/ImportPublic"
import { AlertModal } from "../../components/common/new-component/NewComponent"

function TmkPublicSeaPage({ dispatch, TmkPublicSeaModel }) {
  let {
    /** 表格 */
    tableNewColumns, //列表项
    tableLoading, //表格加载
    tableDataSource, //数据
    tableDataTotal, //总数
    tablePageIndex, //当前页数
    tablePageSize, //每页条数

    /** 新增编辑 */
    modalType, //弹窗类型
    addVisible,
    btnLoading,
    secondChannel, //选中市场渠道
    tmkDetail, //编辑信息
    cityList, //城市下拉
    sourceTypes, //来源类别下拉
    marketList, //市场渠道下拉
    marketSubList, //二级渠道下拉
    collecterList,  // 收集人下拉

    /** 分配tmk */
    assignVisible,
    assignLoading,
    allNum, //可分配数
    operatorList, //分配人员
    users,

    /** 导入 */
    importVisible,
    importStep, //当前步数
    importLoading,
    /** 第一步 */
    importDeptId, //选中城市
    /** 第二步 */
    uploadSuc,
    importName, //合同导入上传文件名
    isModel, //是否摸板
    uploadId, //上传id
    /** 信息配对 */
    leadsImportSecondSuc, //第二步是否完成
    secondStepMatchData, //第二步匹配数据
    secondStepMisMatchData, //第二步不匹配数据
    secondStepSelectData, //第二步下拉列表数据
    secondStepHasChoosedData, //第二步中已选中的未配对数据
    /** 第三步 */
    importTableTitle, //表头
    importTableDataSourse, //列表数据
    importTableTotal, //列表数据数量
    importField,

    //导入完成提示
    successVisible, //提示框是否显示
    successTitle, //提示框标题
    successId, //导出错误日志的id
    successContent,
    successAll, // 是否全部完成

    selectModalVisible,
    selectOrgs
  } = TmkPublicSeaModel

  /** 列表控制显示行 */
  function TableChangeColumns(tableNewColumns) {
    dispatch({
      type: "TmkPublicSeaModel/updateState",
      payload: {
        tableNewColumns
      }
    })
  }

  /** 分页改变事件 */
  function TablePageOnChange(pageIndex, pageSize) {
    dispatch({
      type: "TmkPublicSeaModel/getPublicList",
      payload: {
        pageIndex: pageIndex - 1,
        pageSize: pageSize
      }
    })
  }

  /** 删除公海池 */
  function removeRow(row) {
    dispatch({
      type: "TmkPublicSeaModel/removePublic",
      payload: {
        stuIds: row.clueStuId,
        stauts: "0"
      }
    })
  }

  /** 打开分配 */
  function assignTmk() {
    dispatch({
      type: "TmkPublicSeaModel/updateState",
      payload: {
        assignVisible: true
      }
    })
    dispatch({
      type: "TmkPublicSeaModel/getTmkFollow"
    })
  }

  /** 打开新建/编辑 */
  function addOrEdit(type, row) {
    if (type == "edit") {
      dispatch({
        type: "TmkPublicSeaModel/updateState",
        payload: {
          modalType: type,
          addVisible: true,
          currentRow: row
        }
      })

      dispatch({
        type: "TmkPublicSeaModel/getPublicDetail",
        payload: {
          id: row.clueStuId
        }
      })
    } else {
      dispatch({
        type: "TmkPublicSeaModel/updateState",
        payload: {
          modalType: type,
          addVisible: true
        }
      })
    }
  }

  /** 打开导入 */
  function importTMK() {
    dispatch({
      type: "TmkPublicSeaModel/updateState",
      payload: {
        importVisible: true
      }
    })
  }

  /*************************************新增/编辑*********************************** */
  /** 取消 */
  function cancelAdd() {
    dispatch({
      type: "TmkPublicSeaModel/updateState",
      payload: {
        addVisible: false,
        tmkDetail: {},
        secondChannel: undefined
      }
    })
  }

  /** 保存 */
  function saveAdd(values) {
    if (modalType == "edit") {
      dispatch({
        type: "TmkPublicSeaModel/editPublic",
        payload: {
          ...values
        }
      })
    } else {
      dispatch({
        type: "TmkPublicSeaModel/addPublic",
        payload: {
          ...values
        }
      })
    }
  }

  /** 选择市场渠道 */
  function secondSelect(value, deptId, orgId) {
    dispatch({
      type: "TmkPublicSeaModel/updateState",
      payload: {
        secondChannel: value
      }
    })
    dispatch({
      type: "TmkPublicSeaModel/getSubSecond",
      payload: {
        itemKey: value,
        deptId,
        orgId
      }
    })
  }

  function onSelectOrgModalClose() {
    dispatch({
      type: "TmkPublicSeaModel/updateState",
      payload: {
        selectModalVisible: !selectModalVisible
      }
    })
  }

  function afterSelectOrgModal(org_select) {
    dispatch({
      type: "TmkPublicSeaModel/updateState",
      payload: {
        selectOrgs: org_select
      }
    })
  }

  /** 选择城市 */
  function citySelect(value) {
    dispatch({
      type: "TmkPublicSeaModel/updateState",
      payload: {
        secondChannel: undefined
      }
    })
    let ids = value ? value.split("-") : []
    let orgId = ids[0]
    // 获取收集人
    dispatch({
      type: "TmkPublicSeaModel/getCollecterList",
      payload: {
        orgId
      }
    })
    // 来源类别
    // dispatch({
    //   type: 'TmkPublicSeaModel/getSourceTypes',
    //   payload: {
    //     deptId: value
    //   }
    // })
    // 市场渠道
    // dispatch({
    //   type: 'TmkPublicSeaModel/getMarketList',
    //   payload: {
    //     deptId: value
    //   }
    // })
  }

  /*************************************分配tmk************************************/
  /** 取消分配 */
  function cancelAssign() {
    dispatch({
      type: "TmkPublicSeaModel/updateState",
      payload: {
        assignVisible: false,
        operatorList: [],
        allNum: 0
      }
    })
  }

  /** 保存分配 */
  function saveAssign(values) {
    dispatch({
      type: "TmkPublicSeaModel/assignPublic",
      payload: {
        ...values
      }
    })
  }

  /** 分配参数 */
  function setUsers(users) {
    dispatch({
      type: "TmkPublicSeaModel/updateState",
      payload: {
        users
      }
    })
  }

  /***********************************导入***********************************************/
  /** 取消导入 */
  function importCancel() {
    dispatch({
      type: "TmkPublicSeaModel/updateState",
      payload: {
        importVisible: false,
        importStep: 0,
        importDeptId: undefined,
        importName: undefined,
        isModel: false,
        uploadId: undefined,
        uploadSuc: false
      }
    })
  }

  /** 上一步 */
  function importPrev() {
    let current = importStep - 1
    if (importStep === 3 && isModel) {
      current--
    }
    dispatch({
      type: "TmkPublicSeaModel/updateState",
      payload: {
        importStep: current
      }
    })
  }

  /** 下一步 */
  function importNext() {
    let current = importStep + 1

    if (importStep === 0 && !importDeptId) {
      // 第一步
      message.warn("请选择校区")
      return
    } else if (importStep === 1) {
      // 第二步
      if (isModel) {
        // 跳过配对
        current++
        //获取预览表格
        dispatch({
          type: "TmkPublicSeaModel/getImportField",
          payload: {
            id: uploadId
          }
        })
      } else {
        //配对
        dispatch({
          type: "TmkPublicSeaModel/getImportField",
          payload: {
            id: uploadId
          }
        })
      }
    } else if (importStep === 2) {
      let regex = {}
      for (let i in secondStepHasChoosedData) {
        regex[secondStepHasChoosedData[i].value] =
          secondStepHasChoosedData[i].key
      }
      dispatch({
        type: "TmkPublicSeaModel/updateState",
        payload: {
          importField: regex
        }
      })
      dispatch({
        type: "TmkPublicSeaModel/previewImport",
        payload: {
          id: uploadId,
          regex: JSON.stringify(regex)
        }
      })
    } else if (importStep === 4) {
      // 第四步
      dispatch({
        type: "TmkPublicSeaModel/importTmk",
        payload: {
          id: uploadId,
          deptId: importDeptId,
          regex: JSON.stringify(importField) //导入中的regex
        }
      })

      return
    }

    dispatch({
      type: "TmkPublicSeaModel/updateState",
      payload: {
        importStep: current
      }
    })
  }

  /************第一步**************/
  /** 城市选择 */
  function deptIdChange(value) {
    dispatch({
      type: "TmkPublicSeaModel/updateState",
      payload: {
        importDeptId: value
      }
    })
  }
  /************第二步**************/
  /** 校区选择 */
  function uploadChange(info) {
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
        type: "TmkPublicSeaModel/checkModelFile",
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
  function downloadTemplate() {
    let params = {
      type: "70"
    }
    window.excelExport("/crm/tmk/clue/excel/downloadStuInfoModel", params)
  }

  /**************************信息配对********************************/
  function SecondStepSelectOnChange(value, key) {
    if (value != "" && value != null && value != undefined) {
      //选中
      let flag = false
      for (let i in secondStepHasChoosedData) {
        if (secondStepHasChoosedData[i].key == key) {
          flag = true
          break
        }
      }
      if (flag) {
        //替换原有数据
        for (let i in secondStepHasChoosedData) {
          if (key == secondStepHasChoosedData[i].key) {
            let obj = { value: value, key: key }
            secondStepHasChoosedData.splice(i, 1, obj)
            break
          }
        }
      } else {
        //新增数据
        secondStepHasChoosedData.push({
          value,
          key
        })
      }

      //初始化是否选中数据
      for (let i in secondStepSelectData) {
        secondStepSelectData[i].disabled = false
      }
      //找到选中项并且将disabled改为true
      for (let i in secondStepHasChoosedData) {
        secondStepSelectData[secondStepHasChoosedData[i].value].disabled = true
      }
    } else {
      //取消选中
      //将取消选中项的disabled改为false
      for (let i in secondStepHasChoosedData) {
        if (key == secondStepHasChoosedData[i].key) {
          for (let j in secondStepSelectData) {
            if (secondStepHasChoosedData[i].value == j) {
              secondStepSelectData[j].disabled = false
              break
            }
          }
          break
        }
      }

      //从已选中项中删除当前项
      for (let i in secondStepHasChoosedData) {
        if (key == secondStepHasChoosedData[i].key) {
          secondStepHasChoosedData.splice(i, 1)
          break
        }
      }
    }

    //如果必填项已经全部选中，则第二步可进行下去 否则不可点击下一步
    let array = []
    for (let i in secondStepHasChoosedData) {
      array.push(secondStepHasChoosedData[i].key)
    }
    let str = array.join(",")
    if (
      str.indexOf("name") > -1 &&
      str.indexOf("firstParentName") > -1 &&
      str.indexOf("firstParentMobile") > -1
    ) {
      dispatch({
        type: "TmkPublicSeaModel/updateState",
        payload: {
          leadsImportSecondSuc: true
        }
      })
    } else {
      dispatch({
        type: "TmkPublicSeaModel/updateState",
        payload: {
          leadsImportSecondSuc: false
        }
      })
    }
    dispatch({
      type: "TmkPublicSeaModel/updateState",
      payload: {
        secondStepHasChoosedData,
        secondStepSelectData,
        secondStepMisMatchData: secondStepSelectData
      }
    })
  }

  // ----------------------------------------导入完成提示---------------------------------------
  //提示框点击取消
  function alertModalOnCancel() {
    dispatch({
      type: "TmkPublicSeaModel/updateState",
      payload: {
        successVisible: false
      }
    })
  }

  //提示框点击下载错误日志
  function alertModalOnOk() {
    if (successAll) {
      dispatch({
        type: "TmkPublicSeaModel/updateState",
        payload: {
          successVisible: false
        }
      })
    } else {
      let params = {
        id: successId
      }
      window.excelExport(
        "/crm/tmk/clue/leads/download/downloadByFileSys",
        params
      )
    }
  }

  /** 搜索 */
  function searchHandle(values) {
    if (values.createTime && values.createTime.length > 0) {
      values.createTimeStart = values.createTime[0].format("YYYY-MM-DD")
      values.createTimeEnd = values.createTime[1].format("YYYY-MM-DD")
      delete values.createTime
    }
    dispatch({
      type: "TmkPublicSeaModel/getPublicList",
      payload: {
        searchValues: values,
        pageIndex: 0,
        pageSize: tablePageSize
      }
    })
  }

  // 表格
  const tableProps = {
    tableNewColumns, //列表项
    tableLoading, //表格加载
    tableDataSource, //数据
    tableDataTotal, //总数
    tablePageIndex, //当前页数
    tablePageSize, //每页条数

    TableChangeColumns,
    TablePageOnChange, //分页change
    assignTmk, //分配
    addOrEdit, //新建/编辑
    importTMK, //导入
    removeRow, //删除
    searchHandle //搜索
  }

  // 新增编辑
  const addOrEditProps = {
    modalType, //弹窗类型
    addVisible,
    btnLoading,
    secondChannel, //选中市场渠道
    tmkDetail, //编辑信息
    cityList, //城市下拉
    sourceTypes, //来源类别下拉
    marketList, //市场渠道下拉
    marketSubList, //二级渠道下拉
    selectModalVisible,
    selectOrgs,
    collecterList,  // 收集人下拉

    onSelectOrgModalClose,
    afterSelectOrgModal,
    cancelAdd, //取消
    saveAdd, //保存
    secondSelect, //选择市场渠道
    citySelect //选择城市
  }

  // 分配
  const assignProps = {
    assignVisible,
    assignLoading,
    allNum, //可分配数
    operatorList, //分配人员
    users,

    cancelAssign, //取消
    saveAssign, //保存
    setUsers
  }

  // 导入
  const importProps = {
    importVisible,
    importStep, //当前步数
    importLoading,

    importNext, //下一步
    importPrev, //上一步
    importCancel, //取消

    /** 第一步 */
    cityList, //城市下拉
    importDeptId, //选中城市

    deptIdChange,

    /** 第二步 */
    uploadSuc,
    importName, //合同导入上传文件名

    uploadChange, //选择文件onChange事件
    downloadTemplate, //点击下载数据模板

    /** 信息配对 */
    leadsImportSecondSuc, //第二步是否完成
    secondStepMatchData, //第二步匹配数据
    secondStepMisMatchData, //第二步不匹配数据
    secondStepSelectData, //第二步下拉列表数据

    SecondStepSelectOnChange, //第二步下拉列表onChange事件

    /** 第三步 */
    importTableTitle, //表头
    importTableDataSourse, //列表数据
    importTableTotal //列表数据数量
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
    <div style={{overflow: 'hidden', height: "100%"}}>
      <TmkPublicSeaTable {...tableProps} />
      {addVisible && <AddOrEditTmk {...addOrEditProps} />}
      {assignVisible && <AssginTmk {...assignProps} />}
      {importVisible && <ImportPublic {...importProps} />}
      {successVisible && <AlertModal {...AlertModalProps} />}
    </div>
  )
}

const mapToProps = ({ TmkPublicSeaModel }) => ({ TmkPublicSeaModel })

export default connect(mapToProps)(TmkPublicSeaPage)
