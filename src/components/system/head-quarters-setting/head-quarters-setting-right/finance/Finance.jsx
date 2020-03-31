import React from 'react'
import { Select, Switch, InputNumber, Button, Spin, message } from 'antd'
import CustList from '../../../../common/cust-list/CustList'
import styles from './Finance.less'

const { Option } = Select

function Finance({
  dp,
  // 支出类别
  projectList,              // 支出类别列表
  projectLoading,

  saveProject,              // 保存修改支出类别
  removeProject,            // 删除支出类别
  projectChange,            // 改变当前行

  // 支出项目
  projectSubList,          // 支出项目列表
  projectSubLoading,

  saveProjectSub,           // 保存修改支出项目
  removeProjectSub,         // 删除支出项目

  // 设置
  financeLoading,
  financeSwitch,
  financeDate,
}){

  const firstProps = {
    title: '支出类别',
    list: projectList,
    placeholder: '请输入支出类别',
    loading: projectLoading,
    hasAction: true,

    onSave: saveProject,
    onRemove: removeProject,
    onChange: projectChange
  }

  function addFunc(){
    if(!projectList || projectList.length < 1){
        message.error('请先创建支出类别')
    }
  }

  const firstSubProps = {
    custClass: styles.first_sub_source,
    title: '支出项目',
    list: projectSubList,
    placeholder: '请输入支出项目',
    loading: projectSubLoading,
    placement: 'topRight',
    hasAction: true,
    ctrlList: projectList,

    addFunc,
    onSave: saveProjectSub,
    onRemove: removeProjectSub,
  }

  // 开关change
  function switchOnChange(checked) {
    let switchValue = checked ? '1' : '0'
    dp('headQuartersSetting/updateState', {financeSwitch: switchValue})
  }

  // 日期change
  function dateChange(value){
    dp('headQuartersSetting/updateState', {financeDate: value})
  }

  // 保存设置
  function saveFinanceSet(){
    if(!financeDate || financeDate == ''){
      message.error('调整日期限制每月1-20日')
      return
    }
    if(financeSwitch == '1' && (financeDate > 20 || financeDate < 1)){
      message.error('调整日期限制每月1-20日')
    } else {
      let financeJson = [
        {
          key: financeDate,
          status: financeSwitch,
          text: null,
          value: "支出项目时间可操作时间限制"
        }
      ]
      dp('headQuartersSetting/saveFinanceSet', {confKey: 'spendTimeCheck', value: JSON.stringify(financeJson), orgId: '0'})
    }
  }

  return (
    <div style={{ width: 830 }}>

      <div className={styles.lists_box}>
        <CustList {...firstProps} />
        <CustList {...firstSubProps} />
      </div>

      <div style={{ marginTop: 50 }}>
        <Spin spinning={financeLoading} tip="加载中...">
          <h3 className={styles.finance_title}><i className={styles.title_block} />操作限制</h3>
          <div>
            <Switch style={{ marginRight: 10 }} checked={financeSwitch == '1'} onChange={switchOnChange} />
            每月<InputNumber style={{ width: 80 }} placeholder="输入日期" min={1} precision={0} disabled={financeSwitch == '0'} value={financeDate} onChange={dateChange} />号不能操作历史支出项
            <Button type="primary" style={{ marginLeft: 20 }} onClick={saveFinanceSet}>保存</Button>
          </div>
        </Spin>
      </div>
    </div>
  )
}

export default Finance
