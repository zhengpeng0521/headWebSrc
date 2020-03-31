/**
 * 收入统计表
 */
import React from 'react'
import {connect} from 'dva'
import {Popover, Icon} from 'antd'
import Media from 'react-media'
import SheetTop from '../../../../components/common/report-form/report-form-top/ReportFormTop'
import IncomeTotal from '../../../../components/report-form/tmk-money/income/IncomeTotal'
import ManagerList from '../../../../components/common/new-component/manager-list/ManagerList'

function IncomeSheet({dispatch, tmkIncomeModel}){

  let {
    dataSource,
    searchValue,
    buttonLoading,
    firstEnter,
    total,
    loading

  } = tmkIncomeModel

  //点击生成报表
  function onSearch(values){
    let orgIds = undefined
    if(values.orgId || values.orgId === 0){
      orgIds = 0
    }
    dispatch({
      type: 'tmkIncomeModel/getList',
      payload: {
        orgIds,
        depIds: values.orgId,
        startTime: values.startDate,
        endTime: values.endDate
      }
    })
  }

  // 搜索属性
  const topProps = {
    hasTotal: true,
    noOrg: true,
    // tmkCity: true,
    tmkOrg: true,
    default: 'thisMonth',
    dataTotal : dataSource.length,
    exportPath : `/stat/tmk/income/export`,
    exportObj : searchValue,
    GeneratingReports: onSearch,      //点击生成报表
    buttonLoading,          //生成报表按钮加载状态
    // firstEnter,             //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
    popoverTitle: '收入统计表',
    popoverContent: [
      {
        name: '退费前业绩：',
        content: '以合同审核通过时间在查询时段内作为退费前业绩选取点。合同审核状态为“已通过”，收款状态为“收款完成”的合同金额记为退费前业绩。转校转入合同不计算在退费前业绩内。'
      },
      {
        name: '订金金额：',
        content: '订金金额 = 创建时间在查询时段内的订金金额 + 查询时段内未计算为业绩的合同的收款单金额（收款单创建时间在查询时段内，若收款单作废金额不计算）- 创建时间在查询时段内且退订的订金金额。'
      },
      {
        name: '实收金额：',
        content: '业绩金额 + 订金金额。'
      },
      {
        name: '退费金额：',
        content: '查询时间段内当前校区中所有合同的退费金额，以退费审核通过时间作为退费计算时间；该退费包括部分退费；该退费包括在选择时段外生成的合同在选择时段内的进行退费的金额，退费金额包括转校转入合同退费。'
      },
      {
        name: '业绩金额：',
        content: '退费前业绩 - 退费金额。以合同审核通过时间作为业绩金额选取点。'
      },
      {
        name: '到访数：',
        content: '查询时段内，到访数 = 实际上门试听的人数 + 实际到访的人数；同一学员多次到访只计算一次到访（实际上门试听、实际到访指系统确认学员已上门试听、到访；到访数计算包括在读学员，潜在学员，往期学员的确认到访数）。'
      },
      {
        name: '签单数：',
        content: '查询时间段内，客户一次或多次新签单只计为1次签单数，1次签单生成多个合同也算1次签单，若同时有续签单，每一次续签单计为1次签单人数；若有退费合同，当该学员在查询时段内所生成的所有主合同所有课时都通过退款单退课时退为0，则签单人数减1；若是续签单则该签单合同所有课时都通过退款单退课时退为0时则减1。',
        annotation: '注：1.新签-转介绍当新签来看待；2.历史时段签订为业绩的合同退费不影响查询时间段内的签单数；3.转校转入合同不计算。'

      },
      {
        name: '签单比：',
        content: '到访数 / 签单数。'
      },
      {
        name: '签单课时：',
        content: '查询时间段内由客户签单所生成合同总数所包含的课时总数（新签+转介绍+续费课时，含赠送合同），只计算有过付清记录的合同数量（如发生退费，则扣除相应的退费课时）。',
        annotation: '注：1.查询时段内已经计算签单课时之后又手工作废掉的赠送合同内所含的课时数也扣除；2.查询时间段内的转校合同内所含的课时不计算转入校的签单课时；3.历史合同退费不影响查询时间段内的签单课时。'
      },
      {
        name: '课时单价：',
        content: '（查询时间段内的所有计算为退费前业绩的金额 - 在查询时间段内计算业绩并当月发生退费的合同产生退费的金额）/签单课时。'
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
    rowKey : 'rowKey',
    height :360,
    xScroll : 1204,
  }

  // 大屏
  let lTable = {
    loading,
    dataSource,
    rowKey : 'rowKey',
    height : 320,
    xScroll : 1204,
  }

  let newColumns = [
    {
      title : '城市',
      key : 'deptName',
      dataIndex : 'deptName',
      width : 96,
      render : (text,record) => (
          <Popover placement="top" content={text} trigger="hover">
              { text }
          </Popover>
      )
    },
    {
      title : '校区',
      key : 'orgName',
      dataIndex : 'orgName',
      width : 96,
      render : (text,record) => (
          <Popover placement="top" content={text} trigger="hover">
              { text }
          </Popover>
      )
    },
    {
      title : '退费前业绩',
      key : 'dicmoneyBefore',
      dataIndex : 'dicmoneyBefore',
      width : 96,
      render : (text,record) => (
          <Popover placement="top" content={text} trigger="hover">
              { text }
          </Popover>
      )
    },
    {
      title : '订金金额',
      key : 'deposit',
      dataIndex : 'deposit',
      width : 96,
      render : (text,record) => (
          <Popover placement="top" content={text} trigger="hover">
              { text }
          </Popover>
      )
    },
    {
      title : '实收金额',
      key : 'payAmount',
      dataIndex : 'payAmount',
      width : 96,
      render : (text,record) => (
          <Popover placement="top" content={text} trigger="hover">
              { text }
          </Popover>
      )
    },
    {
      title : '退费金额',
      key : 'refunds',
      dataIndex : 'refunds',
      width : 96,
      render : (text,record) => (
          <Popover placement="top" content={text} trigger="hover">
              { text }
          </Popover>
      )
    },
    {
      title : '业绩金额',
      key : 'performance',
      dataIndex : 'performance',
      width : 96,
      render : (text,record) => (
          <Popover placement="top" content={text} trigger="hover">
              { text }
          </Popover>
      )
    },
    {
      title : '到访数',
      key : 'visitNum',
      dataIndex : 'visitNum',
      width : 96,
      render : (text,record) => (
          <Popover placement="top" content={text} trigger="hover">
              { text }
          </Popover>
      )
    },
    {
      title : '签单数',
      key : 'signBillNum',
      dataIndex : 'signBillNum',
      width : 96,
      render : (text,record) => (
          <Popover placement="top" content={text} trigger="hover">
              { text }
          </Popover>
      )
    },
    {
      title : '签单比',
      key : 'signBillRate',
      dataIndex : 'signBillRate',
      width : 96,
      render : (text,record) => (
          <Popover placement="top" content={text} trigger="hover">
              { text }
          </Popover>
      )
    },
    {
      title : '签单课时',
      key : 'signBillClass',
      dataIndex : 'signBillClass',
      width : 96,
      render : (text,record) => (
          <Popover placement="top" content={text} trigger="hover">
              { text }
          </Popover>
      )
    },
    {
      title : '课时单价',
      key : 'classPrice',
      dataIndex : 'classPrice',
      width : 96,
      render : (text,record) => (
          <Popover placement="top" content={text} trigger="hover">
              { text }
          </Popover>
      )
    },
  ]

  sTable.columns = newColumns;

  lTable.columns = newColumns;

  return (
    <div style={{overflow: 'hidden', height: '100%'}}>
      <SheetTop { ...topProps } />
      <IncomeTotal {...totalProps} />
      <div style={{ width: '100%', height: 4, background: '#5d9cec' }} />
      <Media query="(max-width: 1350px)">
        { matches => matches ?
          (<ManagerList table = { sTable } />)
          :
          (<ManagerList table = { lTable } />)
        }
      </Media>
    </div>
  )
}

const mapStateToProps = ({tmkIncomeModel}) => ({tmkIncomeModel})

export default connect(mapStateToProps)(IncomeSheet)
