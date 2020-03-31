import React from "react"
import { Button, Dropdown, Icon, Menu, Popconfirm, Popover } from "antd"
import ManagerList from "../../common/new-component/manager-list/ManagerList"
import styles from "./ExpensesComponents.less"

function ExpensesComponents({
  orgIdList,
  expenseCount,
  expenseCurrent,
  tableNewColumns, // 列表项
  tableLoading,
  tableDataSource, // 表格数据
  tableDataTotal, // 总数
  tablePageIndex, // 当前页
  tablePageSize, // 当前条数
  superSearchVisible, // 高级搜索显示
  subProjectOpts,
  sectionList, // 支出部门下拉
  projectList, // 支出项目下拉

  /** 方法 */
  onSearch, // 搜索
  projectSelect,
  projectChange,
  TableChangeColumns, // 列表项change
  TablePageOnChange, // 分页change
  onSuperSearch, // 高级搜索
  addPay, // 添加支出
  moreAction, // 导入导出
  deleteRecord // 删除
}) {
  const menu = (
    <Menu onClick={moreAction}>
      <Menu.Item key="export">导出数据</Menu.Item>
      <Menu.Item key="import">导入数据</Menu.Item>
    </Menu>
  )

  // 属性
  const listProps = {
    // 搜索
    search: {
      isShowSearch: false,
      onSearch: data => onSearch(data),
      onClear: data => onSearch(data),
      fields: [
        {
          key: "createTime",
          type: "rangePicker",
          width: 200,
          startPlaceholder: "录入时间",
          endPlaceholder: "录入时间",
          disabledKey: "spendTime",
          format: "YYYY-MM-DD"
        },
        {
          key: "spendTime",
          type: "rangePicker",
          width: 200,
          startPlaceholder: "支出时间",
          endPlaceholder: "支出时间",
          disabledKey: "createTime",
          format: "YYYY-MM-DD"
        },
        {
          key: "projectId",
          type: "select",
          placeholder: "支出类别",
          options: projectList,
          onSelect: projectSelect,
          changeHandle: projectChange,
          opt_key: 'id',
          opt_label: 'name'
        },
        {
          key: "projectItemId",
          type: "select",
          placeholder: "支出项目(先选择支出类别)",
          width: 170,
          options: subProjectOpts,
          opt_key: 'id',
          opt_label: 'name'
        }
      ]
    },
    // 表格
    table: {
      newColumns: tableNewColumns,
      changeColumns: TableChangeColumns,
      loading: tableLoading,
      dataSource: tableDataSource,
      xScroll: 1600,
      height: 280,
      columns: [
        {
          key: "action",
          dataIndex: "action",
          title: "操作",
          width: 140,
          render: (text, record, index) => (
            <div>
              <a className={styles.expense_actoin} onClick={addPay.bind(this, "edit", record)}>编辑</a>
              <Popconfirm
                title="删除支出项后将无法恢复，确定要删除吗?"
                placement="topRight"
                onConfirm={deleteRecord.bind(this, record)}>
                <a>删除</a>
              </Popconfirm>
            </div>
          )
        },
        {
          key: "nunber",
          dataIndex: "number",
          title: "序号",
          width: 96,
          render: (text, record, index) => index + 1
        },
        {
          key: "orgName",
          dataIndex: "orgName",
          title: "支出部门",
          width: 96,
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "createTime",
          dataIndex: "createTime",
          title: "录入时间",
          width: 140,
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "spendTime",
          dataIndex: "spendTime",
          title: "支出时间",
          width: 140,
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "projectName",
          dataIndex: "projectName",
          title: "支出类别",
          width: 120,
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "projectItemName",
          dataIndex: "projectItemName",
          title: "支出项目",
          width: 120,
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "amount",
          dataIndex: "amount",
          title: "支出金额",
          width: 96,
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "payWayName",
          dataIndex: "payWayName",
          title: "支付方式",
          width: 96,
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "agentName",
          dataIndex: "agentName",
          title: "收款人（企业）",
          width: 120,
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "collectName",
          dataIndex: "collectName",
          title: "经办人",
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "isInvoice",
          dataIndex: "isInvoice",
          title: "有无发票",
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text + '' == '0' ? '无' : '有'}
            </Popover>
          )
        },
        {
          key: "operatorName",
          dataIndex: "operatorName",
          title: "操作账号",
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "remark",
          dataIndex: "remark",
          title: "备注",
          width: 120,
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        }
      ]
    },
    // 分页
    pagination: {
      total: tableDataTotal,
      pageIndex: tablePageIndex,
      pageSize: tablePageSize,
      onChange: TablePageOnChange,
      onShowSizeChange: TablePageOnChange,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: () => `共${tableDataTotal}条`
    },
    // 右侧按钮
    rightBars: {
      isSuperSearch: true,
      superSearchVisible,
      superSearch: onSuperSearch,
      closeSearch: onSuperSearch,
      render: (
        <Dropdown overlay={menu}>
          <Button style={{ marginLeft: 8 }}>
            更多操作 <Icon type="down" />
          </Button>
        </Dropdown>
      )
    }
  }

  return (
    <div>
      <div className={styles.table_top}>
        <span className={styles.top_text_left}>
          支出总计：<span className={styles.top_num}>{expenseCount || '0'}</span>元
        </span>
        <Button type="primary" onClick={addPay.bind(this, "add")}>
          添加支出
        </Button>
      </div>
      <ManagerList {...listProps} />
    </div>
  )
}

export default ExpensesComponents
