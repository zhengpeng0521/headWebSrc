import React from "react"
import { Popover, Icon, Table } from "antd"
import {
  NullData,
  ProgressBar
} from "../../../common/new-component/NewComponent"
import styles from "./SignTypeTable.less"

function SignTypeTable({
  loading,
  totalData, //汇总数据
  dataSource //数据
}) {
  // 汇总
  let totalCol = [
    {
      width: 120,
      title: "城市",
      dataIndex: "deptName",
      key: "deptName",
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "签单汇总",
      width: 600,
      key: "new",
      children: [
        {
          title: "总业绩",
          dataIndex: "amount",
          key: "amount",
          width: 100,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          title: "退费前业绩",
          dataIndex: "beforeAmount",
          key: "beforeAmount",
          width: 100,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          title: "招生总数",
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
          title: "均单金额",
          dataIndex: "avgAmount",
          key: "avgAmount",
          width: 100,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          title: "合同总数",
          dataIndex: "purNum",
          key: "purNum",
          width: 100,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          title: "签单总课时",
          dataIndex: "periodNum",
          key: "periodNum",
          width: 100,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          title: "总课时单价",
          dataIndex: "periodPrice",
          key: "periodPrice",
          width: 100,
          render: (text, record) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        }
      ]
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
        if (index < dataSource.length - 1) {
          return (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        }

        return {
          children: (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          ),
          props: {
            colSpan: 2
          }
        }
      }
    },
    {
      title: "签约类型",
      dataIndex: "signType",
      key: "signType",
      width: 100,
      render: (text, record, index) => {
        const obj = {
          children: (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          ),
          props: {}
        }
        if (index === dataSource.length - 1) {
          obj.props.colSpan = 0
        }
        return obj
      }
    },
    {
      title: "业绩金额",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "业绩占比",
      dataIndex: "amountRat",
      key: "amountRat",
      width: 100,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "退费前业绩",
      dataIndex: "beforeAmount",
      key: "beforeAmount",
      width: 100,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "招生人数",
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
      title: "均单金额",
      dataIndex: "avgAmount",
      key: "avgAmount",
      width: 100,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "合同数",
      dataIndex: "purNum",
      key: "purNum",
      width: 100,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "签单课时",
      dataIndex: "periodNum",
      key: "periodNum",
      width: 100,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    },
    {
      title: "课时单价",
      dataIndex: "periodPrice",
      key: "periodPrice",
      width: 100,
      render: (text, record) => (
        <Popover placement="top" content={text} trigger="hover">
          {text}
        </Popover>
      )
    }
  ]

  return (
    <div className={styles.sign_type_sheet} style={{ marginTop: 20 }}>
      <div
        className="zj_sales_achieve_table_common"
        style={{ padding: "0 20px" }}>
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
      <div
        className="zj_sales_achieve_table_common"
        style={{ padding: "0 20px", marginTop: 20 }}>
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

export default SignTypeTable
