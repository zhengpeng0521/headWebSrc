import React from 'react'
import { Select } from 'antd'
import CustList from '../../../../common/cust-list/CustList'
import styles from './SecondSource.less'

const { Option } = Select

function SecondSource({
  deptList,           // 部门下拉
  deptId,             // 默认部门
  secondList,         // 来源类别列表
  secondLoading,
  hasAction,          // 操作权限

  saveSecondSource,   // 保存修改
  removeSecondSource, // 删除来源类别
  deptChange,         // 选择部门
}){
  const listProps = {
    title: '来源类别',
    list: secondList,   // 来源类别列表
    placeholder: '请输入来源类别',
    loading: secondLoading,
    hasAction,

    onSave: saveSecondSource,
    onRemove: removeSecondSource,
  }

  return (
    <div>
      {/* <div style={{ marginBottom: 20 }}>
        <span>部门：</span>
        <Select className={styles.source_select} placeholder="请选择部门" value={deptId} onSelect={deptChange}>
          {deptList && deptList.map((item, index) => {
            return <Option key={`dept_${index}`} value={item.id}>{item.name}</Option>
          })}
        </Select>
      </div> */}
      <CustList {...listProps} />
    </div>
  )
}

export default SecondSource
