import React from 'react'
import { Button, Popover, Popconfirm } from "antd"
import ManagerList from "../../common/new-component/manager-list/ManagerList"
import styles from  './TmkPublicSeaTable.less'

function TmkPublicSeaTable({
  tableNewColumns,      //列表项
  tableLoading,         //表格加载
  tableDataSource,      //数据
  tableDataTotal,       //总数
  tablePageIndex,       //当前页数
  tablePageSize,        //每页条数

  TableChangeColumns,
  TablePageOnChange,    //分页change
  assignTmk,            //分配
  addOrEdit,            //新建/编辑
  importTMK,            //导入
  removeRow,            //删除
  searchHandle,         //搜索
}){

  const listProps = {
    search: {
      onSearch: searchHandle,
      onClear: searchHandle,
      noSearchBtn: true,
      fields: [
          {
              key: "createTime",
              type: "rangePicker",
              startPlaceholder: "创建开始日期",
              endPlaceholder: "创建结束日期",
              format: 'YYYY-MM-DD',
              width: 220,
              showTime: false,
          },
          {
              key: "searchName",
              type: "inputSearch",
              placeholder: "请输入学员/家长姓名",
          },
          {
            key: "mobile",
            type: "inputSearch",
            placeholder: "请输入电话号码",
          },
          {
              key: "deptId",
              type: "dept_name",
              placeholder: "请选择城市",
          }
      ]
    },
    rightBars: {
      isSuperSearch: false,
      btns: [
        {
          label: "分配TMK",
          handle: assignTmk,
        },
        {
          label: "新建",
          handle: addOrEdit.bind(this, 'add'),
        },
        {
          label: "导入",
          handle: importTMK,
        }
      ]
    },
    table: {
      rowKey: 'clueStuId',
      newColumns: tableNewColumns,
      changeColumns: TableChangeColumns,
      loading: tableLoading,
      dataSource: tableDataSource,
      xScroll: 1500,
      height: 243,
      columns: [
        {
          key: "action",
          dataIndex: "action",
          title: "操作",
          width: 140,
          render: (text, record) => (
            <div>
              <a className={styles.tmk_edit} onClick={addOrEdit.bind(this, 'edit', record)}>编辑</a>
              <Popconfirm
                title="删除数据后将无法恢复，确定要删除吗？"
                placement="topLeft"
                onConfirm={removeRow.bind(this, record)}>
                <a>删除</a>
              </Popconfirm>
            </div>
          )
        },
        {
          key: "deptName",
          dataIndex: "deptName",
          title: "城市",
          width: 120,
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "name",
          dataIndex: "name",
          title: "姓名",
          width: 96,
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "sex",
          dataIndex: "sex",
          title: "性别",
          width: 96,
          render: (text, record, index) => (
            <Popover placement="top" content={text == '1' ? '男' : text == '2' ? '女' : ''} trigger="hover">
              {text == '1' ? '男' : text == '2' ? '女' : ''}
            </Popover>
          )
        },
        {
          key: "birthday",
          dataIndex: "birthday",
          title: "生日",
          width: 140,
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "parentName",
          dataIndex: "parentName",
          title: "家长姓名",
          width: 96,
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "parentMobile",
          dataIndex: "parentMobile",
          title: "联系方式",
          width: 120,
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "createTime",
          dataIndex: "createTime",
          title: "创建时间",
          width: 140,
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "channel",
          dataIndex: "channel",
          title: "来源类别",
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "secondChannel",
          dataIndex: "secondChannel",
          title: "市场渠道",
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "subSecondChannelStr",
          dataIndex: "subSecondChannelStr",
          title: "二级渠道",
          render: (text, record, index) => (
            <Popover placement="top" content={text} trigger="hover">
              {text}
            </Popover>
          )
        },
        {
          key: "collectName",
          dataIndex: "collectName",
          title: "收集人",
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
          width: 160,
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
  }

  return (
    <div>
      {/* <div className={styles.public_sea_top}>
        <Button type="primary" onClick={assignTmk}>分配TMK</Button>
        <div>
          <Button type="primary" onClick={addOrEdit.bind(this, 'add')}>新建</Button>
          <Button className={styles.public_sea_import} onClick={importTMK}>导入</Button>
        </div>
      </div> */}
      <ManagerList {...listProps} />
    </div>
  )
}

export default TmkPublicSeaTable
