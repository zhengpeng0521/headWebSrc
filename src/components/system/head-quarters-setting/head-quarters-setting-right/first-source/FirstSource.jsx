import React from 'react'
import { Select } from 'antd'
import CustList from '../../../../common/cust-list/CustList'
import styles from './FirstSource.less'

const { Option } = Select

function FirstSource({
  deptList,               // 部门下拉
  deptIdFirst,
  hasAction,          // 操作权限

  deptFirstChange,
  // 市场渠道
  firstList,              // 市场渠道列表
  firstLoading,

  saveFirstSource,        // 保存修改市场渠道
  removeFirstSource,      // 删除市场渠道
  firstChange,            // 改变当前行

  // 二级渠道
  firstSubList,          // 二级渠道列表
  firstSubLoading,

  saveFirstSubSource,    // 保存修改二级渠道
  removeFirstSubSource,  // 删除二级渠道
}){

  const firstProps = {
    title: '市场渠道',
    list: firstList,
    placeholder: '请输入市场渠道',
    loading: firstLoading,
    hasAction,

    onSave: saveFirstSource,
    onRemove: removeFirstSource,
    onChange: firstChange
  }

  const firstSubProps = {
    custClass: styles.first_sub_source,
    title: '二级渠道',
    list: firstSubList,
    placeholder: '请输入二级渠道',
    loading: firstSubLoading,
    placement: 'topRight',
    hasAction: true,

    onSave: saveFirstSubSource,
    onRemove: removeFirstSubSource,
  }

  return (
    <div style={{ width: 830 }}>
      <div style={{ marginBottom: 20 }}>
        <span>部门：</span>
        <Select className={styles.source_select} placeholder="请选择部门" value={deptIdFirst} onSelect={deptFirstChange}>
          {deptList && deptList.map((item, index) => {
            return <Option key={`dept_${index}`} value={item.id}>{item.name}</Option>
          })}
        </Select>
      </div>

      <div className={styles.lists_box}>
        <CustList {...firstProps} />
        <CustList {...firstSubProps} />
      </div>
    </div>
  )
}

export default FirstSource
