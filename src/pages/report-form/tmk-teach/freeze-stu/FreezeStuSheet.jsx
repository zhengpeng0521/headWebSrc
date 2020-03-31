/**
 * 冻结学员统计表
 */
import React from "react"
import { connect } from "dva"
import { Popover } from "antd"
import Media from "react-media"
import SheetTop from "../../../../components/common/report-form/report-form-top/ReportFormTop"
import FreezeStuTotal from "../../../../components/report-form/tmk-teach/freeze-stu/FreezeStuTotal"
import ManagerList from "../../../../components/common/new-component/manager-list/ManagerList"

function FreezeStuSheet({ dispatch, freezeStuModel }) {
  let {
    dataSource,
    searchValue,
    buttonLoading,
    firstEnter,
    total,
    loading,
    pageIndex,
    pageSize,
    resultCount,
    tmkList,
  } = freezeStuModel

  //点击生成报表
  function onSearch(values) {
    let stuCardId = values.stuCardId && values.stuCardId != '' ? values.stuCardId : undefined
    let stuName = values.stuName && values.stuName != '' ? values.stuName : undefined
    let orgIds = undefined
    if (values.orgId || values.orgId === 0) {
      orgIds = 0
    }

    dispatch({
      type: "freezeStuModel/getList",
      payload: {
        orgIds,
        depIds: values.orgId,
        stuCardId,
        stuName,
        pageIndex: 0,
        pageSize
      }
    })
  }

  /** 分页 */
  function paginationChange( pageIndex, pageSize ){
		dispatch({
			type : 'freezeStuModel/getList',
			payload : {
        pageIndex: pageIndex - 1,
        pageSize,
        ...searchValue
			}
		})
	}

  // 搜索属性
  const topProps = {
    hasTotal: true,
    noOrg: true,
    dateType: 'nothing',
    tmkOrg: true,
    default: "thisMonth",
    dataTotal: dataSource.length,
    exportPath: `/stat/tmk/cerp/freezeStu/export`,
    exportObj: searchValue,
    GeneratingReports: onSearch, //点击生成报表
    buttonLoading, //生成报表按钮加载状态
    // firstEnter,             //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
    searchContent : [
      {
        type : 'input',
        key : 'stuCardId',
        placeholder : '输入学员账户号'
      },{
        type : 'input',
        key : 'stuName',
        placeholder : '输入学员姓名'
      }
    ],
    popoverTitle: '冻结学员统计表',
    popoverContent: [
      {
        name: '冻结时间：',
        content: '学员账户中点击冻结按钮的时间点。'
      },
      {
        name: '已冻结剩余课时：',
        content: '被冻结的学员账户中对应的所有合同数的未消耗课时数。',
        annotation: '注：包括赠送合同课时。'
      },
      {
        name: '已冻结剩余课时金额：',
        content: '被冻结的学员账户中对应的所有合同内的未消耗金额。'
      },
      {
        name: '已冻结合同数：',
        content: '被冻结的学员账户中对应的所有还有未消耗课时的合同数。',
        annotation: '注：包括赠送合同数。'
      }
    ]
  }

  // 合计属性
  const totalProps = {
    total
  }

  // 小屏
  let sTable = {
    loading,
    dataSource,
    rowKey: "rowKey",
    height: 394,
    xScroll: 1000
  }

  // 大屏
  let lTable = {
    loading,
    dataSource,
    rowKey: "rowKey",
    height: 354,
    xScroll: 1000
  }

  let newColumns = [
    {
      title: "城市",
      key: "deptName",
      dataIndex: "deptName",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "校区",
      key: "orgName",
      dataIndex: "orgName",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "学员账户号",
      key: "cardId",
      dataIndex: "cardId",
      width: 130,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "学员姓名",
      key: "stuList",
      dataIndex: "stuList",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={record.stuList && record.stuList.map((item, index) => {
          if(index === record.stuList.length - 1){
            return item.stu_name
          }
          return item.stu_name + ', '
        })} trigger="hover">
          {record.stuList && record.stuList.map((item, index) => {
            if(index === record.stuList.length - 1){
              return item.stu_name
            }
            return item.stu_name + ', '
          })}
        </Popover>
      )
    },
    {
      title: "冻结时间",
      key: "freezeTime",
      dataIndex: "freezeTime",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "已冻结剩余课时",
      key: "leftPeriod",
      dataIndex: "leftPeriod",
      width: 130,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "已冻结剩余课时金额",
      key: "leftPeriodMoney",
      dataIndex: "leftPeriodMoney",
      width: 150,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "已冻结合同数",
      key: "purNum",
      dataIndex: "purNum",
      width: 120,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    }
  ]

  sTable.columns = newColumns

  lTable.columns = newColumns

  let pagination  = {
    total            : resultCount,
    pageIndex        : pageIndex,
    pageSize         : pageSize,
    showTotal        : total => `总共 ${ total } 条`,
    showSizeChanger  : true,
    showQuickJumper  : true,
    onShowSizeChange : paginationChange,
    onChange         : paginationChange
  }

  return (
    <div style={{ overflow: "hidden", height: "100%" }}>
      <SheetTop {...topProps} />
      <FreezeStuTotal {...totalProps} />
      <div style={{ width: "100%", height: 4, background: "#5d9cec" }} />
      <Media query="(max-width: 1350px)">
        {matches =>
          matches ? (
            <ManagerList table={sTable} pagination={pagination} />
          ) : (
            <ManagerList table={lTable} pagination={pagination} />
          )
        }
      </Media>
    </div>
  )
}

const mapStateToProps = ({ freezeStuModel }) => ({ freezeStuModel })

export default connect(mapStateToProps)(FreezeStuSheet)
