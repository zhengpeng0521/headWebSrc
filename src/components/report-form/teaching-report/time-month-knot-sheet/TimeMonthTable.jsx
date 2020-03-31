import React from "react"
import { Popover, Icon } from "antd"
import { StatusFlag } from "../../../common/new-component/NewComponent"

import ManagerList from "../../../common/new-component/manager-list/ManagerList"

function TimeMonthTable({
  pageIndex,
  pageSize,
  resultCount,
  dataSource,
  loading,

  //方法
  paginationChange
}) {
  let managerListProps = {
    table: {
      loading: loading,
      dataSource: dataSource,
      xScroll: 2000,
      height: 256,
      columns: [
        {
          title: "所属校区",
          dataIndex: "orgName",
          key: "orgName",
          width: 120,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          title: "合同编号",
          dataIndex: "orderNum",
          key: "orderNum",
          width: 120,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          title: "学员姓名",
          key: "stuName",
          dataIndex: "stuName",
          width: 96,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "packageName",
          dataIndex: "packageName",
          title: "课时套餐",
          width: 120,
          render: (text, record) => (
            <Popover
              placement="top"
              content={
                !!text &&
                text.map((item, index) => {
                  if (index == 0) {
                    return <span key={`package_${index}`}>{item}</span>
                  } else {
                    return <span key={`package_${index}`}>{", " + item}</span>
                  }
                })
              }
              trigger="hover">
              {!!text &&
                text.map((item, index) => {
                  if (index == 0) {
                    return <span key={`package_${index}`}>{item}</span>
                  } else {
                    return <span key={`package_${index}`}>{", " + item}</span>
                  }
                })}
            </Popover>
          )
          // <<<<<<< HEAD
          // 				},{
          // 				key       : 'teachAidItems',
          // 				dataIndex : 'teachAidItems',
          // 				title     : '物资套餐',
          // 				width     : 120,
          // 				render    : ( text, record ) => (
          // 					<Popover placement = 'top' content = { !!text && text.map((item, index) => {
          // 						if(index == 0){
          // 							return <span key={`teach_${index}`}>{item.aidName}</span>
          // 						} else {
          // 							return <span key={`teach_${index}`}>{', ' + item.aidName}</span>
          // 						}
          // 					}) } trigger = 'hover' >
          // 						{ !!text && text.map((item, index) => {
          // =======
        },
        {
          key: "teachAidItems",
          dataIndex: "teachAidItems",
          title: "物资套餐",
          width: 120,
          render: (text, record) => (
            // <Popover placement = 'top' content = { !!text && text.map((item, index) => {
            // 	trigger = 'hover'
            // 	{ !!text && text.map((item, index) => {
            // 		if(index == 0){
            // 			return <span key={`teach_${index}`}>{item.aidName}</span>
            // 		} else {
            // 			return <span key={`teach_${index}`}>{', ' + item.aidName}</span>
            // 		}
            // 	}) }>
            // </Popover>
            <Popover
              placement="top"
              content={
                !!text &&
                text.map((item, index) => {
                  if (index == 0) {
                    return <span key={`teach_${index}`}>{item.aidName}</span>
                  } else {
                    return (
                      <span key={`teach_${index}`}>{", " + item.aidName}</span>
                    )
                  }
                })
              }
              trigger="hover">
              {!!text &&
                text.map((item, index) => {
                  if (index == 0) {
                    return <span key={`teach_${index}`}>{item.aidName}</span>
                  } else {
                    return (
                      <span key={`teach_${index}`}>{", " + item.aidName}</span>
                    )
                  }
                })}
            </Popover>
          )
        },
        // {
        // 			}) } trigger = 'hover' >
        // 				{ !!text && text.map((item, index) => {
        // 					if(index == 0){
        // 						return <span key={`teach_${index}`}>{item.aidName}</span>
        // 					} else {
        // 						return <span key={`teach_${index}`}>{', ' + item.aidName}</span>
        // 					}
        // 				}) }
        // 			</Popover>
        // 		)
        // 	},
        {
          title: "套餐金额",
          key: "oriMoney",
          dataIndex: "oriMoney",
          width: 96,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          title: "套餐应收",
          key: "dicMoney",
          dataIndex: "dicMoney",
          width: 96,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          title: "物资金额",
          key: "taOriMoney",
          dataIndex: "taOriMoney",
          width: 96,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          title: "物资应收",
          key: "aidMoney",
          dataIndex: "aidMoney",
          width: 96,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          title: "总实收金额",
          key: "payMoney",
          dataIndex: "payMoney",
          width: 96,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          title: "签订日期",
          key: "signTime",
          dataIndex: "signTime",
          width: 120,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          title: "合同开始日期",
          key: "startTime",
          dataIndex: "startTime",
          width: 120,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          title: "合同结束日期",
          key: "endTime",
          dataIndex: "endTime",
          width: 120,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          title: "有效月份",
          key: "month",
          dataIndex: "month",
          width: 96,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          title: "本月消耗金额",
          key: "monthMoney",
          dataIndex: "monthMoney",
          width: 96,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          title: "剩余金额",
          key: "balanceMoney",
          dataIndex: "balanceMoney",
          width: 96,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        }
      ]
    },
    pagination: {
      total: resultCount,
      pageIndex: pageIndex,
      pageSize: pageSize,
      showTotal: total => `总共 ${total} 条`,
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange: paginationChange,
      onChange: paginationChange
    }
  }

  return <ManagerList {...managerListProps} />
}

export default TimeMonthTable
