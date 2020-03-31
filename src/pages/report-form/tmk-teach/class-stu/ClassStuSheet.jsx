/**
 * 班级学员人数统计表
 */
import React from "react"
import { connect } from "dva"
import { Popover, Tabs } from "antd"
import Media from "react-media"
import SheetTop from "../../../../components/common/report-form/report-form-top/ReportFormTop"
import ClassStuTotal from "../../../../components/report-form/tmk-teach/class-stu/ClassStuTotal"
import ManagerList from "../../../../components/common/new-component/manager-list/ManagerList"
import styles from "./ClassStuSheet.less"

const { TabPane } = Tabs

function ClassStuSheet({ dispatch, classStuModel }) {
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
    courseGroup,
    activeKey
  } = classStuModel

  //点击生成报表
  function onSearch(values) {
    let orgIds = undefined
    if (values.orgId || values.orgId === 0) {
      orgIds = 0
    }

    dispatch({
      type: "classStuModel/getList",
      payload: {
        orgIds,
        depIds: values.orgId,
        groupId: values.groupId,
        pageIndex: 0,
        pageSize
      }
    })
  }

  /** 分页 */
  function paginationChange( pageIndex, pageSize ){
		dispatch({
			type : 'classStuModel/getList',
			payload : {
        pageIndex: pageIndex - 1,
        pageSize,
        ...searchValue
			}
		})
  }

  /** 切换面板的回调 */
  function tabChange(activeKey){
    dispatch({
			type : 'classStuModel/updateState',
			payload : {
        activeKey
			}
    })

    dispatch({
			type : 'classStuModel/getList',
			payload : {
        pageIndex,
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
    exportPath: `/stat/tmk/clsStuStat/export`,
    exportObj: searchValue,
    GeneratingReports: onSearch, //点击生成报表
    buttonLoading, //生成报表按钮加载状态
    // firstEnter,             //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
    searchContent : [
      {
        type : 'select' ,
        key : 'groupId',
        allowClear: true,
        placeholder : '请选择课系',
        options : courseGroup,
        notFirst: true,
        render_key: 'id',
        render_value: 'name'
      }
    ],
    popoverTitle: '班级学员人数统计表',
    popoverContent: [
      {
        name: '带班教师：',
        content: '按课系查询显示老师，仅显示主教老师。',
        annotation: '注：主教老师关联班级有排课，且班级未结业，班级开课日期在当日及当日之前才显示。'
      },
      {
        name: '带班数：',
        content: '当前教师所带班级的总数。',
        annotation: '注：1.带班数不计算已结业班级；2.老师所带班级数包括开课日期在当日及当日之前的班级数。'
      },
      {
        name: '班级人次：',
        content: '当前时间对应课系下各位教师所带班级内的学员人次总数。',
        annotation: '注：1. 带班数不计算已结业班级；2. 老师所带班级数包括开课日期在当日及当日之前的班级数。'
      },
      {
        name: '满班数：',
        content: '当前时间对应课系下各位教师所带班级中班级人数达到班级最大人数的班级数。'
      },
      {
        name: '满班率：',
        content: '班级人次 / 当前各位教师对应课系所带班级的班级人数上限的总和（例：如一名教师在查询时间段内共带5个班级，每个班级的可容纳学员数量为8人，则该教师所带班级的人数上线总和为：5×8 = 40人）。'
      },
      {
        name: '班容：',
        content: '班级人次 / 带班数。'
      },
      {
        name: '一人班：',
        content: '当前老师对应课系带班数中班级内只有一名学员的班级总数。'
      },
      {
        name: '学员出勤率：',
        content: '查询所在当月教师对应课系所带班级的所有需要排课考勤中，实际出勤人次 / 应出勤人次（例：查询当月内该教师所带的所有班级总共考勤10次，10次考勤总计应出勤80人次，实际出勤50人次，则出勤率为：50 /80 = 62.5%）（出勤：指学员考勤中考勤状态的“出勤”）。'
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
    height: 442,
    xScroll: 1204,
    ProgressBarHeight: 350,
    NullDataHeight: 350
  }

  // 大屏
  let lTable = {
    loading,
    dataSource,
    rowKey: "rowKey",
    height: 405,
    xScroll: 1204,
    ProgressBarHeight: 350,
    NullDataHeight: 350
  }

  let newColumns = activeKey === 'total' ? [
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
      title: "课系",
      key: "groupName",
      dataIndex: "groupName",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "带班数",
      key: "clsNum",
      dataIndex: "clsNum",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "班级人次",
      key: "clsStuNum",
      dataIndex: "clsStuNum",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "满班数",
      key: "fullClsNum",
      dataIndex: "fullClsNum",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "满班率",
      key: "fullClsRate",
      dataIndex: "fullClsRate",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "班容",
      key: "capacityClsRate",
      dataIndex: "capacityClsRate",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "一人班",
      key: "oneClsNum",
      dataIndex: "oneClsNum",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "学员出勤率（本月）",
      key: "signStuRate",
      dataIndex: "signStuRate",
      width: 120,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    }
  ] : [
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
      title: "课系",
      key: "groupName",
      dataIndex: "groupName",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "带班教师",
      key: "uname",
      dataIndex: "uname",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "带班数",
      key: "clsNum",
      dataIndex: "clsNum",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "班级人次",
      key: "clsStuNum",
      dataIndex: "clsStuNum",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "满班数",
      key: "fullClsNum",
      dataIndex: "fullClsNum",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "满班率",
      key: "fullClsRate",
      dataIndex: "fullClsRate",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "班容",
      key: "capacityClsRate",
      dataIndex: "capacityClsRate",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "一人班",
      key: "oneClsNum",
      dataIndex: "oneClsNum",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "学员出勤率（本月）",
      key: "signStuRate",
      dataIndex: "signStuRate",
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

  let content = (
    <div>
      <SheetTop {...topProps} />
      <ClassStuTotal {...totalProps} />
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

  return (
    <div style={{ overflow: "hidden", height: "100%" }} className={styles.class_stu_sheet}>
      <Tabs activeKey={activeKey} onChange={tabChange}>
        <TabPane tab="汇总数据" key="total">
          {/* {content} */}
        </TabPane>
        <TabPane tab="详情数据" key="detail">
          {/* {content} */}
        </TabPane>
      </Tabs>
      {/* 列表不写tab内部，需要切换tab搜索条件不变 */}
      {content}
    </div>
  )
}

const mapStateToProps = ({ classStuModel }) => ({ classStuModel })

export default connect(mapStateToProps)(ClassStuSheet)
