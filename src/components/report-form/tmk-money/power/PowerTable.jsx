import React from "react"
import { Popover, Table } from "antd"
import {
  NullData,
  ProgressBar
} from "../../../common/new-component/NewComponent"
import styles from './PowerTable.less'

function PowerTable({
  loading,
  totalData,      //汇总数据
  dataSource,     //数据
  courseList,               // 课程列表
}) {

  // 汇总
  let totalCol = [
    {
      width: 120,
      title: "统计类型",
      dataIndex: "type",
      key: "type",
    },
  ]

  // 校区
  let columns = [
    {
      title: "城市",
      dataIndex: "deptName",
      key: "deptName",
      width: 100,
      render:  (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "校区",
      dataIndex: "orgName",
      key: "orgName",
      width: 100,
      render:  (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
  ]

  let courseCols = {
    title: "各科权责收入情况",
    width: courseList.length > 0 ? courseList.length * 100 : 100,
    key: "income",
    children: []
  }

  // 课程列
  courseList && courseList.length > 0 && courseList.forEach(item => {
    totalCol.push({
      title: item.label,
      dataIndex: item.key,
      key: item.key,
      width: 100,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    })

    courseCols.children.push({
      title: item.label,
      dataIndex: item.key,
      key: item.key,
      width: 100,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    })
  })

  totalCol.push({
    title: "退费手续费",
    dataIndex: "refundFee",
    key: "refundFee",
    width: 100,
    render: (text, record) => (
      <Popover placement="top" content={text} trigger="hover">
        {text}
      </Popover>
    )
  },{
    title: "权责金额合计",
    dataIndex: "accrualAmount",
    key: "accrualAmount",
    width: 100,
    render: (text, record) => (
      <Popover placement="top" content={text} trigger="hover">
        {text}
      </Popover>
    )
  },{
    title: "耗课课时数",
    dataIndex: "expendPeriod",
    key: "expendPeriod",
    width: 100,
    render: (text, record) => (
      <Popover placement="top" content={text} trigger="hover">
        {text}
      </Popover>
    )
  },{
    title: "耗课平均单价",
    dataIndex: "expendPrice",
    key: "expendPrice",
    width: 100,
    render: (text, record) => (
      <Popover placement="top" content={text} trigger="hover">
        {text}
      </Popover>
    )
  },
  {
    title: "2018年6月1日前后",
    width: 200,
    key: "oneYear",
    children: [
      {
        title: "6月1日前",
        dataIndex: "costBefore",
        key: "costBefore",
        width: 100,
        render: (text, record) => (
          <Popover placement="top" content={text} trigger="hover">
            {text}
          </Popover>
        )
      },
      {
        title: "6月1日后",
        dataIndex: "costAfter",
        key: "costAfter",
        width: 100,
        render: (text, record) => (
          <Popover placement="top" content={text} trigger="hover">
            {text}
          </Popover>
        )
      },
    ]
  })

  courseList && courseList.length > 0 && columns.push(courseCols)

  columns.push({
    title: "退费手续费",
    dataIndex: "refundFee",
    key: "refundFee",
    width: 100,
    render: (text, record) => (
      <Popover placement="top" content={text} trigger="hover">
        {text}
      </Popover>
    )
  },{
    title: "权责金额合计",
    dataIndex: "accrualAmount",
    key: "accrualAmount",
    width: 100,
    render: (text, record) => (
      <Popover placement="top" content={text} trigger="hover">
        {text}
      </Popover>
    )
  },{
    title: "耗课课时数",
    dataIndex: "expendPeriod",
    key: "expendPeriod",
    width: 100,
    render: (text, record) => (
      <Popover placement="top" content={text} trigger="hover">
        {text}
      </Popover>
    )
  },{
    title: "耗课平均单价",
    dataIndex: "expendPrice",
    key: "expendPrice",
    width: 100,
    render: (text, record) => (
      <Popover placement="top" content={text} trigger="hover">
        {text}
      </Popover>
    )
  },
  {
    title: "2018年6月1日前后",
    width: 200,
    key: "oneYear",
    children: [
      {
        title: "6月1日前",
        dataIndex: "costBefore",
        key: "costBefore",
        width: 100,
        render: (text, record) => (
          <Popover placement="top" content={text} trigger="hover">
            {text}
          </Popover>
        )
      },
      {
        title: "6月1日后",
        dataIndex: "costAfter",
        key: "costAfter",
        width: 100,
        render: (text, record) => (
          <Popover placement="top" content={text} trigger="hover">
            {text}
          </Popover>
        )
      },
    ]
  })

  // 表格行点击
  function onRowClick(record, index, e){
    let row = document.getElementsByClassName('ant-table-row')
    if(e.currentTarget.className.indexOf(styles.click_row) > -1) {
      // 当前行已经高亮取消高亮
      e.currentTarget.className = e.currentTarget.className.split(` ${styles.click_row}`)[0]
    } else {
      // 其余行全部取消高亮
      for(let i = 0; i < row.length; i++){
        row[i].className = row[i].className.split(` ${styles.click_row}`)[0]
      }
      e.currentTarget.className = e.currentTarget.className + ` ${styles.click_row}`
    }
  }

  return (
    <div className={styles.sign_type_sheet} style={{marginTop: 20}}>
      <div className = 'zj_sales_achieve_table_common' style={{ padding: "0 20px" }}>
        <Table
          columns={totalCol}
          dataSource={!!loading ? [] : totalData}
          pagination={false}
          bordered
          rowKey="id"
          locale={{
            emptyText: !!loading ? (
              <ProgressBar content="统计中" height="100px" />
            ) : (
              <NullData content="暂时没有数据" height={100} />
            )
          }}
          scroll={{ x: courseList.length > 0 ? 800 + 100*courseList.length : 2000 }}
        />
      </div>
      <div className = 'zj_sales_achieve_table_common' style={{ padding: "0 20px", marginTop: 20 }}>
        <Table
          columns={columns}
          dataSource={!!loading ? [] : dataSource}
          pagination={false}
          bordered
          rowKey="id"
          onRowClick={onRowClick}
          locale={{
            emptyText: !!loading ? (
              <ProgressBar content="统计中" height="100px" />
            ) : (
              <NullData content="暂时没有数据" height={100} />
            )
          }}
          scroll={{ x: courseList.length > 0 ? 900 + 100*courseList.length : 2000 }}
        />
      </div>
    </div>
  )
}

export default PowerTable
