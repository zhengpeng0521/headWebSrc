/**
 * 退费情况表
 */
import React from 'react'
import {connect} from 'dva'
import {Popover, Icon} from 'antd'
import Media from 'react-media'
import SheetTop from '../../../../components/common/report-form/report-form-top/ReportFormTop'
import RefundTotal from '../../../../components/report-form/tmk-money/refund/RefundTotal'
import ManagerList from '../../../../components/common/new-component/manager-list/ManagerList'

function RefundSheet({dispatch, tmkRefundModel}){

  let {
    dataSource,
    searchValue,
    buttonLoading,
    firstEnter,
    total,
    loading

  } = tmkRefundModel

  //点击生成报表
  function onSearch(values){
    let orgIds = undefined
    if(values.orgId || values.orgId === 0){
      orgIds = 0
    }
    dispatch({
      type: 'tmkRefundModel/getList',
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
    exportPath : `/stat/tmk/refunds/export`,
    exportObj : searchValue,
    GeneratingReports: onSearch,      //点击生成报表
    buttonLoading,          //生成报表按钮加载状态
    // firstEnter,             //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
    popoverTitle: '退费情况表',
    popoverContent: [
      {
        name: '业绩金额：',
        content: '退费前业绩 - 查询时间段内所有的退费金额。',
        annotation: '注：1.以合同审核时间为数据选取点，需合同审核通过、合同全额付款完成、付款审核通过的合同才计算业绩金额；2. 转校转入的合同不算进业绩金额。'
      },
      {
        name: '退费前业绩：',
        content: '查询时段内，以合同审核通过时间为数据选取点，合同审核通过、合同全额付款完成、付款审核通过的合同才计算退费前业绩金额，转校转入的合同不算进退费前业绩金额。'
      },
      {
        name: '退费人数：',
        content: '查询时间段发生退费的学员人数合计。',
        annotation: '注：1. 如一名学员发生多次退费，只计算一个退费人数；2.包括在选择时段外生成的合同在选择时段内的进行退费的合同下的学员数；3.转校转入合同的退费算入退费人数内。'
      },
      {
        name: '退费合同数：',
        content: '查询时间段内发生退费的学员合同数合计。',
        annotation: '注：1. 没有付款审核通过的合同、转校转入的合同不计算在内；2. 包括在选择时段外生成的合同在选择时段内的进行退费的合同数；3. 查询时段内同一个合同部分退费或全部退费，都只记为一个退费合同数。'
      },
      {
        name: '退费金额：',
        content: '查询时间段内当前城市下所有校区内所有学员合同退费金额合计，只计算有过付清记录合同的退费金额。',
        annotation: '注：1. 没有付款审核通过的合同不计算在内；2. 以退费审核通过时间作为退费计算时间；3. 该退费包括部分退费；4. 退费金额包括在选择时段外生成的合同在选择时段内的进行退费的金额；5. 退费金额包括转校转入合同的退费。'
      },
      {
        name: '退费业绩占比：',
        content: '退费金额 / 退费前业绩。'
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
    rowKey : 'id',
    height :360,
    xScroll : 1204,
  }

  // 大屏
  let lTable = {
    loading,
    dataSource,
    rowKey : 'id',
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
      title : '业绩金额',
      key : 'dicmoney',
      dataIndex : 'dicmoney',
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
      title : '退费人数',
      key : 'refundsStu',
      dataIndex : 'refundsStu',
      width : 96,
      render : (text,record) => (
          <Popover placement="top" content={text} trigger="hover">
              { text }
          </Popover>
      )
    },
    {
      title : '退费合同数',
      key : 'refundsPurchase',
      dataIndex : 'refundsPurchase',
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
      title : '退费业绩占比',
      key : 'dicmoneyRate',
      dataIndex : 'dicmoneyRate',
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
      <RefundTotal {...totalProps} />
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

const mapStateToProps = ({tmkRefundModel}) => ({tmkRefundModel})

export default connect(mapStateToProps)(RefundSheet)
