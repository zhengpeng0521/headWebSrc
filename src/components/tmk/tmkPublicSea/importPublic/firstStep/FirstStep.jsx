import React from 'react'
import { Form, Select } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

function FirstStep({
  cityList,       //城市下拉
  importDeptId,   //选中城市

  deptIdChange,

  form: {
    getFieldDecorator,
  }
}){

  const formItemLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 }
  }

  return (
    <Form>
      <FormItem {...formItemLayout} label="选择城市">
        { getFieldDecorator('deptId', {
          initialValue: importDeptId
        })(
          <Select style={{ width: 220 }} placeholder="请选择所在城市" onChange={deptIdChange}>
            {cityList && cityList.map((item, index) => {
                return (
                  <Option key={"city" + index} value={item.id}>
                    {item.name}
                  </Option>
                )
            })}
          </Select>
        )}
      </FormItem>
    </Form>
  )
}

export default Form.create()(FirstStep)
