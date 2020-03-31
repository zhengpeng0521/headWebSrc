/**
 * 支出汇总表
 */
import React from 'react'
import {connect} from 'dva'
import {Popover} from 'antd'
import PayProjectTop from '../../../../components/report-form/tmk-money/pay-project/PayProjectTop'
import ManagerList from '../../../../components/common/new-component/manager-list/ManagerList';

function PayProjectSheet({dispatch, payProjectModel}){

  let {
    years,
    currentYear,
    cityList,
    orgList,									//校区下拉
    projectList,							//支出项目下拉
    searchValue,							//搜索内容
		buttonLoading,					  //按钮加载

    loading,
		dataSource,
		popoverTitle,
		popoverContent,

  } = payProjectModel

  /** 城市select */
  function citySelect(value, option){
    dispatch({
      type: 'payProjectModel/updateState',
      payload: {
        orgList: option.props.items || []
      }
    })
  }

  /** 重置校区列表 */
  function resetOrgList(){
    dispatch({
      type: 'payProjectModel/updateState',
      payload: {
        orgList: []
      }
    })
  }

  /** 生成报表 */
  function getList(values){
		let orgIds = undefined
    if(values.depIds || values.depIds === 0){
			orgIds = 0
    }
    dispatch({
      type: 'payProjectModel/getList',
      payload: {
				...values,
				orgIds
      }
    })
  }

  /** 导出报表 */
  function exportReports(){
    let exportPath = '/stat/tmk/spendMonth/export';
    if( dataSource.length <= 0 ){
        return message.warn('无查询结果可导出');
    }

    window.excelExport( exportPath, searchValue );
  }

  // 搜索属性
  let topProps = {
    years,      //年份
    currentYear,
    cityList,   //城市下拉
    orgList,    //校区下拉
    projectList,							//支出项目下拉
    buttonLoading,					  //按钮加载

    //方法
    citySelect,              //城市select
    resetOrgList,            //重置校区列表
    getList,                 //生成报表
		exportReports,           //导出报表

		popoverTitle,
		popoverContent,
  }

  let managerListProps = {
		table : {
			loading,
			dataSource,
			rowKey: 'projectItemId',
			xScroll       : 1400,
			height        : 220,
      columns : [
        {
					title     : '支出项目',
					dataIndex : 'projectItemName',
					key       : 'projectItemName',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
        },
        {
					title     : '1月',
					dataIndex : 'january',
					key       : 'january',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
        },
        {
					title     : '2月',
					dataIndex : 'february',
					key       : 'february',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
        },
        {
					title     : '3月',
					dataIndex : 'march',
					key       : 'march',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
        },
        {
					title     : '4月',
					dataIndex : 'april',
					key       : 'april',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
        },
        {
					title     : '5月',
					dataIndex : 'may',
					key       : 'may',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
        },
        {
					title     : '6月',
					dataIndex : 'june',
					key       : 'june',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
        },
        {
					title     : '7月',
					dataIndex : 'july',
					key       : 'july',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
        },
        {
					title     : '8月',
					dataIndex : 'august',
					key       : 'august',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
        },
        {
					title     : '9月',
					dataIndex : 'september',
					key       : 'september',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
        },
        {
					title     : '10月',
					dataIndex : 'october',
					key       : 'october',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
        },
        {
					title     : '11月',
					dataIndex : 'november',
					key       : 'november',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
        },
        {
					title     : '12月',
					dataIndex : 'december',
					key       : 'december',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
        },
        {
					title     : '全年汇总',
					dataIndex : 'countMoney',
					key       : 'countMoney',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				}
      ],
    }
	}

  return (
    <div style={{overflow: 'hidden', height: '100%'}}>
      <PayProjectTop {...topProps} />
      <ManagerList { ...managerListProps } />
    </div>
  )
}

const mapStateToProps = ({payProjectModel}) => ({payProjectModel})

export default connect(mapStateToProps)(PayProjectSheet)
