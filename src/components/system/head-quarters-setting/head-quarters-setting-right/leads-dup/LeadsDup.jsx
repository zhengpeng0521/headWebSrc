import React from 'react'
import { Button, Form, Radio, Checkbox } from 'antd'
import styles from './LeadsDup.less'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

function LeadsDup({
  confArr,
  dupValue,
  allConf,

  saveLeads,      //保存查重规则

  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
    getFieldValue,
    validateFieldsAndScroll
  }
}){
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  }

  function saveLeadsAction(e){
    e.preventDefault()
    validateFieldsAndScroll((error, values) => {
      if (!!error) {
          return
      }
      values.singleScope = allConf.single.scope
      values.batchScope = allConf.batchScope
      saveLeads(values)
    })
  }

  return (
    <Form className={styles.leads_form}>
      <div style={{ fontSize: 14 }} className={styles.leads_title}>
        <div className={styles.title_block}></div>
        <div>查重规则（TMK导入名单、新建名单）</div>
      </div>
      <FormItem
        {...formItemLayout}
        style={{ marginLeft: 40 }}
      >
        {getFieldDecorator('confArray', {
          initialValue: dupValue || 'any'
        })(
          <RadioGroup>
            {confArr && confArr.map((item, index) => (
              <Radio key={`conf${index}`} style={radioStyle} value={item.value}>{item.label}</Radio>
            ))}
          </RadioGroup>
        )}
      </FormItem>

      <Button type="primary" onClick={saveLeadsAction}>保存</Button>
    </Form>
  )
}

export default Form.create()(LeadsDup)
