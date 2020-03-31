import React from "react"
import {
  Button,
  Form,
  Radio,
  Select,
  DatePicker,
  Modal,
  Icon,
  Input,
  InputNumber
} from "antd"
import moment from 'moment'
import styles from "./AddIncome.less"

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

function AddIncome({
  visible,
  btnLoading,
  expenseType,
  projectList, // 收款项目下拉
  payWayList, // 收款方式下拉
  deptList, // 城市下拉
  orgList,  // 校区下拉
  expenseDetail,  // 收款详情
  hasHq,
  currentType,

  /** 方法 */
  cancelAdd, // 取消
  saveAdd, // 保存
  openNewModal, // 打开类别
  typeChange,

  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
    getFieldValue,
    validateFieldsAndScroll
  }
}) {
  /** 关闭弹窗并清空 */
  function cancelAddAction(){
    resetFields()
    cancelAdd()
  }

  /** 保存 */
  function saveAddAction(e) {
    e.preventDefault()
    validateFieldsAndScroll((error, values) => {
      if (!!error) {
          return
      }
      if(values.type == '1'){
        values.orgId = window._init_data.orgId
      }
      values.spendTime = values.spendTime.format('YYYY-MM-DD')
      values.uid = window.uid
      saveAdd(values)
    })
  }

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 }
  }

  const title = expenseType == 'edit' ? '编辑收款' : '添加收款'

  return (
    <Modal
      className={styles.expense_modal}
      visible={visible}
      title={title}
      width={500}
      maskClosable={false}
      onCancel={cancelAddAction}
      footer={[
        <Button key="back" onClick={cancelAddAction}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={btnLoading}
          onClick={saveAddAction}>
          保存
        </Button>
      ]}>
      <Form>
        <FormItem label="收款部门" {...formItemLayout}>
          {getFieldDecorator("type", {
            initialValue: expenseType == 'edit' ? (expenseDetail.type || currentType) : currentType,
            rules: [{ required: true, message: "请选择收款部门" }]
          })(
            <RadioGroup className={styles.expense_section} name="section" disabled={expenseType == 'edit'} onChange={typeChange}>
              {hasHq && <Radio value="1">总部</Radio>}
              <Radio value="2">分部</Radio>
              <Radio value="3">校区</Radio>
            </RadioGroup>
          )}
        </FormItem>

        {(expenseType == 'edit' ? expenseDetail.type == '2' : currentType == "2") && (
          <FormItem label="选择分部" {...formItemLayout}>
            {getFieldDecorator("deptId", {
              initialValue: expenseDetail.deptId,
              rules: [{ required: true, message: "请选择分部" }]
            })(
              <Select placeholder="请选择分部" disabled={expenseType == 'edit'}>
                {deptList &&
                  deptList.map((item, index) => {
                    return (
                      <Option key={"city" + index} value={item.id}>
                        {item.name}
                      </Option>
                    )
                  })}
              </Select>
            )}
          </FormItem>
        )}

        {(expenseType == 'edit' ? expenseDetail.type == '3' : currentType == "3") && (
          <FormItem label="选择校区" {...formItemLayout}>
            {getFieldDecorator("orgId", {
              initialValue: expenseDetail.orgId,
              rules: [{ required: true, message: "请选择校区" }]
            })(
              <Select placeholder="请选择校区" disabled={expenseType == 'edit'}>
                {orgList &&
                  orgList.map((item, index) => {
                    return (
                      <Option key={"city" + index} value={item.id}>
                        {item.name}
                      </Option>
                    )
                  })}
              </Select>
            )}
          </FormItem>
        )}

        <FormItem label="收款时间" {...formItemLayout}>
          {getFieldDecorator("spendTime", {
            initialValue: expenseDetail.spendTime ? moment(expenseDetail.spendTime) : undefined,
            rules: [{ required: true, message: "请选择收款时间" }]
          })(<DatePicker format="YYYY-MM-DD" />)}
        </FormItem>

        <div className={styles.project_box}>
          <FormItem label="收款项目" {...formItemLayout}>
            {getFieldDecorator("projectId", {
              initialValue: expenseDetail.projectId,
              rules: [{ required: true, message: "请选择收款项目" }]
            })(
              <Select placeholder="请选择收款项目">
                {projectList &&
                  projectList.map((item, index) => {
                    return (
                      <Option key={"project" + index} value={item.id}>
                        {item.name}
                      </Option>
                    )
                  })}
              </Select>
            )}
          </FormItem>
          <Icon
            type="plus-circle"
            className={styles.project_icon}
            onClick={openNewModal.bind(this, "project")}
          />
        </div>

        <FormItem label="收款金额" {...formItemLayout}>
          {getFieldDecorator("amount", {
            initialValue: expenseDetail.amount,
            rules: [{ required: true, message: "请输入收款金额" }]
          })(
            <InputNumber placeholder="请输入收款金额" min={0} precision={2} max={99999999.99} />
          )}
        </FormItem>

        <div className={styles.project_box}>
          <FormItem label="支付方式" {...formItemLayout}>
            {getFieldDecorator("payWayId", {
              initialValue: expenseDetail.payWayId,
              rules: [{ required: true, message: "请选择支付方式" }]
            })(
              <Select placeholder="请选择支付方式">
                {payWayList &&
                  payWayList.map((item, index) => {
                    return (
                      <Option key={"project" + index} value={item.id}>
                        {item.name}
                      </Option>
                    )
                  })}
              </Select>
            )}
          </FormItem>
          <Icon
            type="plus-circle"
            className={styles.project_icon}
            onClick={openNewModal.bind(this, "way")}
          />
        </div>

        <FormItem label="付款人" {...formItemLayout}>
          {getFieldDecorator("agentName", {
            initialValue: expenseDetail.agentName,
            rules: [
              { required: true, message: "请输入付款人" },
              { max: 15, message: "最多15字" }
            ]
          })(<Input placeholder="请输入付款人" />)}
        </FormItem>

        <FormItem label="经办人" {...formItemLayout}>
          {getFieldDecorator("collectionName", {
            initialValue: expenseDetail.collectName,
            rules: [
              { required: true, message: "请输入经办人" },
              { max: 8, message: "最多8字" }
            ]
          })(<Input placeholder="请输入经办人" />)}
        </FormItem>

        <FormItem label="有无发票" {...formItemLayout}>
          {getFieldDecorator("isInvoice", {
            initialValue: expenseDetail.isInvoice || "0",
            rules: [{ required: true, message: "请选择有无发票" }]
          })(
            <RadioGroup className={styles.expense_section} name="ticket">
              <Radio value="0">无</Radio>
              <Radio value="1">有</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator("remark", {
            initialValue: expenseDetail.remark,
            rules: [{ max: 15, message: "最多15字" }]
          })(
            <Input
              type="textarea"
              placeholder="请输入备注"
              autosize={{ minRows: 3, maxRows: 4 }}
            />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(AddIncome)
