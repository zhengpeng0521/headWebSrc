import React from "react"
import moment from "moment"
import {
  Button,
  Form,
  Radio,
  Select,
  DatePicker,
  Modal,
  Input,
  Row,
  Col,
  Spin
} from "antd"
import { BlockTitle } from "../../../components/common/new-component/NewComponent"
import TenantOrgFilter from "../../../pages/common/tmk-org-select/TenantOrgFilter"
import styles from "./AddOrEditTmk.less"

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

function AddOrEditTmk({
  modalType, //弹窗类型
  addVisible,
  btnLoading,
  secondChannel, //选中市场渠道
  tmkDetail, //编辑信息
  cityList, //城市下拉
  sourceTypes, //来源类别下拉
  marketList, //市场渠道下拉
  marketSubList, //二级渠道下拉
  selectModalVisible,
  selectOrgs,
  collecterList,  // 收集人下拉

  onSelectOrgModalClose,
  afterSelectOrgModal,
  cancelAdd, //取消
  saveAdd, //保存
  secondSelect, //选择市场渠道
  citySelect, //选择城市

  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
    getFieldValue,
    setFieldsValue,
    validateFieldsAndScroll
  }
}) {
  /** 关闭弹窗并清空 */
  function cancelAddAction() {
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
      let orgIds = values.deptId && values.deptId.split("-")
      values.deptId = orgIds[1]
      values.orgId = orgIds[0]
      values.addType = "1"
      values.birthday = values.birthday && values.birthday.format("YYYY-MM-DD")
      saveAdd(values)
    })
  }

  /** 城市选择 */
  // function citySelectAction(value){
  //   citySelect(value)
  //   resetFields(['secondChannel', 'subSecondChannel'])
  // }
  function onOrgChange(value) {
    setFieldsValue({
      secondChannel: undefined,
      subSecondChannel: undefined,
      collecterId: undefined
    })
    citySelect(value)

  }

  /** 选择市场渠道 */
  function secondSelectAction(value) {
    let ids = getFieldValue("deptId") ? getFieldValue("deptId").split("-") : []
    let deptId = ids[1]
    let orgId = ids[0]
    secondSelect(value, deptId, orgId)
    setTimeout(() => {
      setFieldsValue({
        subSecondChannel: undefined
      })
    }, 10)
  }

  /** 日期禁选 */
  function disabledDate(current) {
    return current && current > moment().endOf("day")
  }

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  //校区选择框属性
  let tenantOrgSelectProps = {
    hasDept: true,
    placeholder: "请选择校区所在城市",
    visible: selectModalVisible,
    onClose: onSelectOrgModalClose,
    onChange: onOrgChange,
    init_org_select: selectOrgs,
    width: 240
  }

  let title = modalType == "edit" ? "编辑名单" : "新建名单"

  return (
    <Modal
      className={styles.tmk_add}
      visible={addVisible}
      title={title}
      width={700}
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
      <Spin tip="加载中..." spinning={btnLoading}>
        <Form layout="inline">
          <BlockTitle>学员信息</BlockTitle>

          <Row gutter={24}>
            <Col span={12}>
              <FormItem label="学员姓名" {...formItemLayout}>
                {getFieldDecorator("name", {
                  initialValue: tmkDetail.stuName,
                  rules: [
                    { required: true, message: "请输入学员姓名" },
                    { max: 10, message: "不得超过10个字" }
                  ]
                })(<Input placeholder="请输入学员姓名" />)}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label="学员性别" {...formItemLayout}>
                {getFieldDecorator("sex", {
                  initialValue: tmkDetail.sex || "1",
                  rules: [{ required: true, message: "请选择学员性别" }]
                })(
                  <RadioGroup name="sex" style={{ lineHeight: "32px" }}>
                    <Radio value="1">男</Radio>
                    <Radio value="2">女</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label="所在城市" {...formItemLayout}>
                {getFieldDecorator("deptId", {
                  initialValue: tmkDetail.deptId
                    ? tmkDetail.orgId + "-" + tmkDetail.deptId
                    : undefined,
                  rules: [{ required: true, message: "请选择所在城市(校区)" }]
                })(
                  // <Select placeholder="请选择所在城市" onSelect={citySelectAction}>
                  //   {cityList && cityList.map((item, index) => {
                  //       return (
                  //         <Option key={"city" + index} value={item.id}>
                  //           {item.name}
                  //         </Option>
                  //       )
                  //   })}
                  // </Select>
                  <TenantOrgFilter {...tenantOrgSelectProps} />
                )}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label="学员生日" {...formItemLayout}>
                {getFieldDecorator("birthday", {
                  initialValue: tmkDetail.birthday
                    ? moment(tmkDetail.birthday)
                    : undefined
                })(
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    disabledDate={disabledDate}
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          <BlockTitle>家长信息</BlockTitle>

          <Row gutter={24}>
            <Col span={12}>
              <FormItem label="家长姓名" {...formItemLayout}>
                {getFieldDecorator("list[0].parentName", {
                  initialValue:
                    tmkDetail.parentItemList && tmkDetail.parentItemList.length > 0 ?
                    tmkDetail.parentItemList[0].parentName : undefined,
                  rules: [
                    { required: true, message: "请输入家长姓名" },
                    { max: 10, message: "不得超过10个字" }
                  ]
                })(<Input placeholder="请输入家长姓名" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="手机号码" {...formItemLayout}>
                {getFieldDecorator("list[0].parentMobile", {
                  initialValue:
                    tmkDetail.parentItemList && tmkDetail.parentItemList.length > 0 ?
                    tmkDetail.parentItemList[0].mobile : undefined,
                  rules: [
                    { required: true, message: "请输入手机号码" },
                    {
                      len: 11,
                      pattern: /^1\d{10}$/,
                      message: "请输入正确手机号码格式"
                    }
                  ]
                })(<Input placeholder="请输入手机号码" />)}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label="来源类别" {...formItemLayout}>
                {getFieldDecorator("firstChannel", {
                  initialValue: tmkDetail.firstChannel,
                  rules: [{ required: true, message: "请选择来源类别" }]
                })(
                  <Select placeholder="请选择来源类别">
                    {sourceTypes &&
                      sourceTypes.map((item, index) => {
                        return (
                          <Option key={"source" + index} value={item.key}>
                            {item.value}
                          </Option>
                        )
                      })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="市场渠道" {...formItemLayout}>
                {getFieldDecorator("secondChannel", {
                  initialValue: tmkDetail.secondChannel || undefined,
                  rules: [{ required: true, message: "请选择市场渠道" }]
                })(
                  <Select
                    placeholder="请选择市场渠道"
                    onSelect={secondSelectAction}>
                    {marketList &&
                      marketList.map((item, index) => {
                        return (
                          <Option key={"source" + index} value={item.key}>
                            {item.value}
                          </Option>
                        )
                      })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="收集人" {...formItemLayout}>
                {getFieldDecorator("collecterId", {
                  initialValue: tmkDetail.collectId || undefined,
                })(
                  <Select placeholder="请选择收集人(请先选择所在城市)">
                    {collecterList &&
                      collecterList.map((item, index) => {
                        return (
                          <Option key={"collecter" + index} value={item.id}>
                            {item.name}
                          </Option>
                        )
                      })}
                  </Select>
                )}
              </FormItem>
            </Col>

            {secondChannel && (
              <Col span={12}>
                <FormItem label="二级渠道" {...formItemLayout}>
                  {getFieldDecorator("subSecondChannel", {
                    initialValue: tmkDetail.subSecondChannel,
                    rules: [{ required: true, message: "请选择二级渠道" }]
                  })(
                    <Select placeholder="请选择二级渠道(请先选择所在城市)">
                      {marketSubList &&
                        marketSubList.map((item, index) => {
                          return (
                            <Option key={"subSource" + index} value={item.id}>
                              {item.value}
                            </Option>
                          )
                        })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            )}

            <Col span={12}>
              <FormItem label="备注信息" {...formItemLayout}>
                {getFieldDecorator("remark", {
                  initialValue: tmkDetail.remark,
                  rules: [{ max: 15, message: "最多15个字" }]
                })(
                  <Input
                    type="textarea"
                    placeholder="请输入备注信息，限制15个字"
                    autosize={{ minRows: 3, maxRows: 4 }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  )
}

export default Form.create()(AddOrEditTmk)
