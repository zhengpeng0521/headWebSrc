import React from "react"
import { Popover, Icon, Table } from "antd"
import {
  NullData,
  ProgressBar
} from "../../../common/new-component/NewComponent"
import styles from './ActiveStuTable.less'

function ActiveStuTable({
  loading,
  totalData,      //汇总数据
  dataSource,     //数据
}) {
  // 汇总
  let totalCol = [
    {
      width: 120,
      title: "统计类型",
      dataIndex: "type",
      key: "type",
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "在读学员数",
      dataIndex: "readStuNum",
      key: "readStuNum",
      width: 100,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "活跃学员数",
      dataIndex: "stuNum",
      key: "stuNum",
      width: 100,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "活跃率",
      dataIndex: "rate",
      key: "rate",
      width: 100,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "同比增长率",
      dataIndex: "basic",
      key: "basic",
      width: 100,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "环比增长率",
      dataIndex: "sequential",
      key: "sequential",
      width: 100,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    }
  ]

  // 分类
  let columns = [
    {
      title: "城市",
      dataIndex: "deptName",
      key: "deptName",
      width: 100,
      render: (text, record, index) => {
        return (
          <Popover placement="top" content={text} trigger="hover">
            {text}
          </Popover>
        )
      }
    },
    {
      title: "校区",
      dataIndex: "orgName",
      key: "orgName",
      width: 100,
      render: (text, record, index) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "在读学员数",
      dataIndex: "readStuNum",
      key: "readStuNum",
      width: 100,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "活跃学员数",
      dataIndex: "stuNum",
      key: "stuNum",
      width: 100,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "活跃率",
      dataIndex: "rate",
      key: "rate",
      width: 100,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "同比增长率",
      dataIndex: "basic",
      key: "basic",
      width: 100,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "环比增长率",
      dataIndex: "sequential",
      key: "sequential",
      width: 100,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    }
  ]

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
          scroll={{ x: 1000 }}
        />
      </div>
      <div className = 'zj_sales_achieve_table_common' style={{ padding: "0 20px", marginTop: 20 }}>
        <Table
          columns={columns}
          dataSource={!!loading ? [] : dataSource}
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
          scroll={{ x: 1000 }}
        />
      </div>
    </div>
  )
}

export default ActiveStuTable
