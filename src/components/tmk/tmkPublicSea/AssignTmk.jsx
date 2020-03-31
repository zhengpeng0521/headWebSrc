import React from 'react'
import { Modal, Checkbox, InputNumber, Button, Form, Spin, message } from 'antd'
import styles from './AssginTmk.less'

const FormItem = Form.Item

function AssginTmk({
  assignVisible,
  assignLoading,
  allNum,         //可分配数
  operatorList,   //分配人员
  users,

  cancelAssign,   //取消
  saveAssign,     //保存
  setUsers,

  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    resetFields,
    getFieldValue,
    validateFieldsAndScroll
  }
}){

  /** 取消 */
  function cancelAssignAction(){
    resetFields()
    cancelAssign()
  }

  /** 保存 */
  function saveAssignAction(e){
    e.preventDefault()
    validateFieldsAndScroll((error, values) => {
      if (!!error) {
          return
      }

      if(users && users.length > 0){
        const newValues = {
          users: JSON.stringify(users)
        }
        saveAssign(newValues)
      } else {
        message.warn('请先分配员工后再保存')
      }
    })
  }

  /** 选择人员分配 */
  function selectOperator(value, index, id){
    setFieldsValue({ ['number' + id]: 0 })
    let users = []
    let num = 0
    let formValues = getFieldsValue()
    formValues['name' + index] = value
    operatorList && operatorList.forEach((item, key) => {
      if(formValues['name' + key] && formValues['name' + key].length > 0){
        num++
        users.push({ id: formValues['name' + key][0], num: 0 })
      }
    })
    let perNum = parseInt(allNum / num)
    let remainder = allNum % num

    if(remainder > 0) {
      //有余数时,将余数再分配
      users.map((item, index) => {
        if(index < remainder){
          setFieldsValue({ ['number' + item.id]: perNum + 1 })
          item.num = perNum + 1
        } else {
          setFieldsValue({ ['number' + item.id]: perNum })
          item.num = perNum
        }
      })
    } else {
      // 没有余数直接分配
      users.map(item => {
        setFieldsValue({ ['number' + item.id]: perNum })
        item.num = perNum
      })
    }
    console.log(users)
    setUsers(users)
  }

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  const header = (
    <div className={styles.assign_table_header}>
      <span>操作/帐户名</span>
      <span>数量</span>
    </div>
  )

  return (
    <Modal
      visible={assignVisible}
      title="分配TMK"
      width={600}
      maskClosable={false}
      onCancel={cancelAssignAction}
      footer={[
        <Button key="back" onClick={cancelAssignAction}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={assignLoading}
          onClick={saveAssignAction}>
          保存
        </Button>
      ]}
    >
      <Spin tip="加载中..." spinning={assignLoading}>
        <div className={styles.assign_total}>可分配数：<span>{allNum || '0'}</span></div>
        <div className={styles.assign_tip}>注：数据将平均分配到每个已选人员</div>
        <div>选择人员</div>
        <Form className={styles.assign_form}>
          {header}
          {header}
          {operatorList && operatorList.map((item, index) => (
            <div key={'assign'+index}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator("name" + index)(
                  <Checkbox.Group
                    name="operator"
                    options={[{ label: item.name, value: item.id }]}
                    onChange={(value) => selectOperator(value, index, item.id)} />
                )}
              </FormItem>

              <FormItem {...formItemLayout}>
                {getFieldDecorator("number" + item.id, {
                  initialValue: 0
                })(
                  <InputNumber disabled min={0} />
                )}
              </FormItem>
            </div>
          ))}
        </Form>
      </Spin>
    </Modal>
  )
}

export default Form.create()(AssginTmk)
