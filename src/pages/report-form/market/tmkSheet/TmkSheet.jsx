/**
 * TMK报表
 */
import React from "react"
import { connect } from "dva"
import { Popover, Icon } from "antd"
import Media from "react-media"
import SheetTop from "../../../../components/common/report-form/report-form-top/ReportFormTop"
import TmkSheetTotal from "../../../../components/report-form/market/tmkSheet/TmkSheetTotal"
import ManagerList from "../../../../components/common/new-component/manager-list/ManagerList"

function TmkSheet({ dispatch, tmkSheetModel }) {
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
  } = tmkSheetModel

  //点击生成报表
  function onSearch(values) {
    let orgIds = undefined
    if (values.orgId || values.orgId === 0) {
      orgIds = 0
    }
    dispatch({
      type: "tmkSheetModel/getList",
      payload: {
        orgIds,
        depIds: values.orgId,
        startTime: values.startDate,
        endTime: values.endDate,
        id: values.id,
        pageIndex: 0,
        pageSize
      }
    })
  }

  /** 分页 */
  function paginationChange( pageIndex, pageSize ){
		dispatch({
			type : 'tmkSheetModel/getList',
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
    // tmkCity: true,
    tmkOrg: true,
    default: "thisMonth",
    dataTotal: dataSource.length,
    exportPath: `/stat/tmk/tmkReport/export`,
    exportObj: searchValue,
    GeneratingReports: onSearch, //点击生成报表
    buttonLoading, //生成报表按钮加载状态
    // firstEnter,             //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
    searchContent : [
      {
        type : 'select' ,
        key : 'id',
        allowClear: true,
        placeholder : '请选择TMK',
        options : tmkList,
        notFirst: true,
        render_key: 'id',
        render_value: 'name'
      }
    ],
    popoverTitle: 'TMK报表',
    popoverContent: [
      {
        name: 'Leads数： ',
        content: '查询时间段内分配给TMK的新增客户名单数量（客户分配时间在选取时间段内）。',
        annotation: '注：1. 若有一个客户在多个TMK流转的情况，以目前该学员所在的TMK为准；2. 若查询时段内有学员从校区退回TMK公海池，查该TMK的leads数减去对应学员数。'
      },
      {
        name: '已跟进：',
        content: '查询时间段内TMK名下新增加的leads数的跟进潜在学员名单数量（查询时段内有跟进记录，无下次跟进时间）。',
        annotation: '注：1. 同一个客户跟进多次只计算一个已跟进数；2. 仅计算跟进状态有内容的学员；3. 仅记录学员在TMK个人池的跟进状态，不包括学员在校区的跟进记录。'
      },
      {
        name: '未跟进：',
        content: '查询时间段内TMK名下新增加的leads数的未跟进的客户名单数量（查询时间段内有没有跟进记录）。',
        annotation: '注：1.计算分配时间在选取时间段内，且跟进状态为空的客户；2. 仅记录学员在TMK个人池的跟进状态，不包括学员在校区的跟进记录。'
      },
      {
        name: '待跟进：',
        content: '预计跟进时间在查询时间段内，且跟进未完成的客户名单数（查询时段内有跟进记录，且有下次跟进时间（下次跟进记录也在查询时间段内））。',
        annotation: '注：1. 包含TMK名下在查询时段外的leads名单在查询时段内的跟进；2. 查询时段内一客户同时有 “已跟进”记录和“待跟进”记录，则记录为“待跟进”；3. 仅记录学员在TMK个人池的跟进状态，不包括学员在校区的跟进记录。'
      },
      {
        name: '预约到访：',
        content: '查询时间段内TMK名下客户有添加过预约到访计划的客户数量。',
        annotation: '注：设置到访时间在查询时段内，且完成到访的客户数。'
      },
      {
        name: '预约试听：',
        content: '查询时间段内TMK名下客户有添加过预约试听计划的客户数量。',
        annotation: '注：设置的试听时间在查询时段内，且完成试听的客户数。'
      },
      {
        name: '到访数：',
        content: '查询时间段内TMK名下潜在学员有确认到访记录的数量。',
        annotation: '注：1. 多次到访只计算一次到访；2. 到访数 = 实际上门试听的人数 + 实际到访的人数，到访数用户去重。'
      },
      {
        name: '到访比：',
        content: 'Leads数/ 到访数。'
      },
      {
        name: '签单数：',
        content: '查询时间段内TMK名下客户有签单记录的数量（只计算该客户的第一次签单，一次签单生成多个合同也只计算一个签单数，若有退费合同，当该学员在查询时段内所生成的所有主合同所有课时都通过退款单退课时退为0，该签单数减1；续约签单不计算TMK签单数。',
        annotation: '注：1.TMK不计算转校转入合同、不计算转介绍数据；2.历史合同退费不影响查询时间段内的签单数。'
      },
      {
        name: '到访签单比：',
        content: '到访数 / 签单数。'
      },
      {
        name: '签单金额：',
        content: '查询时间段内TMK名下客户签单金额累计数（即计算客户名下有过付清记录计算为业绩的合同金额，如合同在查询时间段发生退费，签单金额则扣除相应的退费金额），续约签单不计算TMK签单金额。',
        annotation: '注：1.退费金额只计算查询时间段内完成合同审核、合同全额付款完成且付款审核通过的合同，并且这些合同在查询时段内发生退款且完成退款审核的退款金额。（退费金额不计算退费手续费）；2.TMK不计算转校转入合同、转介绍合同数据；3.历史合同退费不影响查询时间段内的签单金额；4.若有退费手续费则留在签单金额中。'
      },
      {
        name: '均单金额：',
        content: '签单金额 / 签单数。'
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
    xScroll: 1204
  }

  // 大屏
  let lTable = {
    loading,
    dataSource,
    rowKey: "rowKey",
    height: 354,
    xScroll: 1204
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
      title: "TMK",
      key: "name",
      dataIndex: "name",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "Leads数",
      key: "leadsNum",
      dataIndex: "leadsNum",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "已跟进",
      key: "yetFollow",
      dataIndex: "yetFollow",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "未跟进",
      key: "notFollow",
      dataIndex: "notFollow",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "待跟进",
      key: "toFollow",
      dataIndex: "toFollow",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "预约到访",
      key: "appointVisit",
      dataIndex: "appointVisit",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "预约试听",
      key: "appointAudition",
      dataIndex: "appointAudition",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "到访数",
      key: "visitNum",
      dataIndex: "visitNum",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "到访比",
      key: "visitRat",
      dataIndex: "visitRat",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "签单数",
      key: "purNum",
      dataIndex: "purNum",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "到访签单比",
      key: "purVisitRat",
      dataIndex: "purVisitRat",
      width: 96,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "签单金额",
      key: "purMoney",
      dataIndex: "purMoney",
      width: 96,
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
      <TmkSheetTotal {...totalProps} />
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

const mapStateToProps = ({ tmkSheetModel }) => ({ tmkSheetModel })

export default connect(mapStateToProps)(TmkSheet)
