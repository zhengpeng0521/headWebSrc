/**
 * 收支分类汇总表
 */
import React from 'react'
import {connect} from 'dva'
import {Popover} from 'antd'
import Media from 'react-media';
import SheetTop from '../../../../components/common/report-form/report-form-top/ReportFormTop';
import PayTypeTotal from '../../../../components/report-form/tmk-money/pay-type/PayTypeTotal'
import ManagerList from '../../../../components/common/new-component/manager-list/ManagerList';
import styles from './PayTypeSheet.less'

function PayTypeSheet({dispatch, payTypeModel}){

  let {
    dataSource,
    searchValue,
    buttonLoading,
    firstEnter,
    columns,
    totalProjects,
    totalData,
    loading

  } = payTypeModel

  //点击生成报表
  function onSearch(values){
    let orgIds = undefined
    if(values.orgId || values.orgId === 0){
      orgIds = 0
    }
    dispatch({
      type: 'payTypeModel/getList',
      payload: {
        orgIds,
        depIds: values.orgId,
        startTime: values.startDate,
        endTime: values.endDate
      }
    })
  }

  // 表格行点击
  function onRowClick(record, index){
    let row = document.getElementsByClassName('ant-table-row')
    for(let i = 0; i < row.length; i++){
      if(i === index){
        // 当前点击行高亮
        if(row[i].className.indexOf(styles.click_row) > -1){
          // 已高亮时
          row[i].className = row[i].className.split(` ${styles.click_row}`)[0]
        } else {
          // 未高亮时
          row[i].className = row[i].className + ` ${styles.click_row}`
        }
      } else if(row[i].className.indexOf(styles.click_row) > -1) {
        // 其余行全部取消高亮
        row[i].className = row[i].className.split(` ${styles.click_row}`)[0]
      }
    }
  }

  // 搜索属性
  const topProps = {
    hasTotal: true,
    noOrg: true,
    // tmkCity: true,
    tmkOrg: true,
    default: 'thisMonth',
    dataTotal : dataSource.length,
    exportPath : `/stat/tmk/payBalance/export`,
    exportObj : searchValue,
    GeneratingReports: onSearch,      //点击生成报表
    buttonLoading,          //生成报表按钮加载状态
    // firstEnter,             //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
    popoverTitle: '收支分类汇总表',
    popoverContent: [
      {
        name: '支出类别：',
        content: '各支出类别在查询时段内金额总数。'
      },
      {
        name: '业绩金额：',
        content: '业绩金额 = 退费前业绩 - 退费金额。',
        annotation: '注：需合同审核通过、合同全额付款完成、付款审核通过的合同才计算业绩金额，退费金额包括在查询时段外生成合同在查询时段内退费，转校转入的合同不算进退费前业绩金额。'
      },
      {
        name: '其他收入：',
        content: '其他收入为总部系统收款录入模块收款时间在选择时段内的收入合计。'
      },
      {
        name: '净现金流：',
        content: '业绩金额 + 其他收入 - 支出合计。'
      }
    ]
  }

  // 合计属性
  const totalProps = {
    totalProjects,
    totalData
  }

  // 小屏
  let sTable = {
    loading,
    dataSource,
    rowKey : 'id',
    height :360,
    xScroll : columns.length > 0 ? (columns.length + 6) * 100 : 1204,
    onRowClick
  }

  // 大屏
  let lTable = {
    loading,
    dataSource,
    rowKey : 'id',
    height : 320,
    xScroll : columns.length > 0 ? (columns.length + 6) * 100 : 1204,
    onRowClick
  }

  let newColumns = [
    {
      title : '城市',
      key : 'deptName',
      dataIndex : 'deptName',
      width : 100,
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
      width : 100,
      render : (text,record) => (
          <Popover placement="top" content={text} trigger="hover">
              { text }
          </Popover>
      )
    },
    {
      title : '业绩金额',
      key : 'purchaseMoney',
      dataIndex : 'purchaseMoney',
      width : 100,
      render : (text,record) => (
          <Popover placement="top" content={text} trigger="hover">
              { text }
          </Popover>
      )
    },
    {
      title : '其他收入',
      key : 'incomeMoney',
      dataIndex : 'incomeMoney',
      width : 100,
      render : (text,record) => (
          <Popover placement="top" content={text} trigger="hover">
              { text }
          </Popover>
      )
    },
    {
      title : '支出合计',
      key : 'spendMoney',
      dataIndex : 'spendMoney',
      width : 100,
      render : (text,record) => (
          <Popover placement="top" content={text} trigger="hover">
              { text }
          </Popover>
      )
    },
    {
      title : '净现金流',
      key : 'money',
      dataIndex : 'money',
      width : 100,
      render : (text,record) => (
          <Popover placement="top" content={text} trigger="hover">
              { text }
          </Popover>
      )
    }
  ]

  columns && columns.forEach(item => {
    newColumns.push({
      title : item.label,
      key : item.key,
      dataIndex : item.key,
      width : 100,
      render : (text,record) => (
          <Popover placement="top" content={text} trigger="hover">
              { text }
          </Popover>
      )
    })
  })

  sTable.columns = newColumns;

  lTable.columns = newColumns;

  return (
    <div style={{overflow: 'hidden', height: '100%'}}>
      <SheetTop { ...topProps } />
      <PayTypeTotal {...totalProps} />
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

const mapStateToProps = ({payTypeModel}) => ({payTypeModel})

export default connect(mapStateToProps)(PayTypeSheet)
