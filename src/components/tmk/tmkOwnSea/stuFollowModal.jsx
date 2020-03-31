import React from "react"
import {
    Form,
    Input,
    Modal,
    Button,
    Select,
    Spin,
    DatePicker,
    Icon
} from "antd"
import style from './stuFollowModal.less';
const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 19
    }
}

/*学员跟进modal*/
const stuFollowModal = ({
    stuFollowModalVisible, //学员跟进modal是否显示
    stuFollowModalLoading, //学员跟进modal加载状态
    stuFollowModalButtonLoading, //学员跟进modal按钮加载状态
    stuFollowModalCancel, // 取消
    stuFollowModalSubmit, // 确定
    followResultChange, // 跟进结果change
    followData, // 学员跟进表单数据
    followList, //跟进列表
    recordItem,
    stuFollowStatelist, // 学员跟进状态
    followResultList, //学员跟进结果
    followContScroll,
    followRecordLoading,
    followListHasMore,
    isAssign,        // 是否已分配
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        setFieldsValue,
        validateFieldsAndScroll
    }
}) => {
    /* 确定 */
    function handleComplete(e) {
        e.preventDefault()
        // 已分配不可操作
        if(isAssign){
            stuFollowModalCancel()
            return
        }
        validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return
            }
            //格式化下次跟进时间
            if(values.tmkNextFollowTime != '' && values.tmkNextFollowTime != null &&values.tmkNextFollowTime != undefined &&　!/^[\s]*$/.test(values.tmkNextFollowTime)){
                values.tmkNextFollowTime = values.tmkNextFollowTime.format('YYYY-MM-DD HH:mm');
            }
            stuFollowModalSubmit(values,resetFields)
        })
    }
    /* 取消 */
    function handleCancel(e) {
        e.preventDefault()
        resetFields()
        stuFollowModalCancel()
    }

    /*检验是否只输入了空格*/
    function checkWetherSpace(rule, value, callback) {
        if (value == "" || value == undefined || value == null) {
            callback()
        } else if (/^[\s]*$/.test(value)) {
            callback(new Error("请输入跟进内容，限制30字"))
        } else {
            callback()
        }
    }

    function disabledDate(current) {
        return current && current.valueOf() < Date.now() - 24 * 60 * 60 * 1000
    }

    //模态框的属性
    let modalOpts = {
        title: "学员跟进",
        maskClosable: false,
        visible: stuFollowModalVisible,
        closable: true,
        width: 600,
        onOk: handleComplete,
        onCancel: handleCancel,
        footer: [
            <Button key="cancel" type="ghost" onClick={handleCancel}>
                取消
            </Button>,
            <Button
                key="submit"
                type="primary"
                onClick={handleComplete}
                disabled={stuFollowModalLoading}
                loading={stuFollowModalLoading}
                style={{ marginLeft: 20 }}>
                确定
            </Button>
        ],
        className: "card_transform_course_modal"
    }
    return (
        <Modal {...modalOpts}>
            <Spin spinning={stuFollowModalLoading}>
                <Form>
                    <FormItem label="跟进名单" {...formItemLayout}>
                        {getFieldDecorator("stuName", {
                            initialValue: recordItem.name || undefined,
                            rules: [
                                { required: true, message: "请选择跟进名单" }
                            ]
                        })(<Input disabled />)}
                    </FormItem>
                    <FormItem label="跟进家长" {...formItemLayout}>
                        {getFieldDecorator("parent", {
                            initialValue: recordItem.parentName|| undefined,
                            rules: [
                                { required: true, message: "请选择跟进家长" }
                            ]
                        })(<Input disabled />)}
                    </FormItem>
                    <FormItem label="跟进状态" {...formItemLayout}>
                        {getFieldDecorator("followType", {
                            initialValue: followData.followStatus || undefined,
                            rules: [
                                { required: true, message: "请选择跟进状态" }
                            ]
                        })(
                            <Select
                                disabled={isAssign}
                                notFoundContent = "未找到"
                                size = 'default'
                                placeholder = '请选择跟进状态'
                                optionFilterProp="children">
                                { stuFollowStatelist && stuFollowStatelist.length > 0 ?
                                    stuFollowStatelist.map(function(item,index){
                                        return(
                                            <Option value = { item.key + '' } key = { item.key + '' }>{ item.value + '' }</Option>
                                        )
                                    })
                                    :
                                    []
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="跟进结果" {...formItemLayout}>
                        {getFieldDecorator("tmkFollowResult", {
                            initialValue: followData.followResult || undefined,
                            rules: [
                                { required: true, message: "请选择跟进结果" }
                            ]
                        })(
                            <Select
                                disabled={isAssign}
                                onChange={followResultChange}
                                notFoundContent = "未找到"
                                size = 'default'
                                placeholder = '请选择跟进结果'
                                optionFilterProp="children">
                                { followResultList && followResultList.length > 0 ?
                                    followResultList.map(function(item,index){
                                        return(
                                            <Option value = { item.key + '' } key = { item.key + '' }>{ item.value + '' }</Option>
                                        )
                                    })
                                    :
                                    []
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="跟进内容" {...formItemLayout}>
                        {getFieldDecorator("content", {
                            initialValue: followData.followContent || undefined,
                            rules: [
                                {
                                    required: true,
                                    message: "请输入跟进内容，限制30字",
                                    max: 30
                                },
                                { validator: checkWetherSpace }
                            ]
                        })(
                            <Input
                                type="textarea"
                                placeholder="请输入跟进内容，限制30字"
                                disabled={isAssign}
                                autosize={{ minRows: 3, maxRows: 3 }}
                            />
                        )}
                    </FormItem>
                    {
                        followData.followResult ?
                        followData.followResult== '7' || followData.followResult == '8' ?
                        null :
                            <FormItem {...formItemLayout} label="下次跟进">
                            {getFieldDecorator("tmkNextFollowTime", {
                                initialValue:
                                    followData.nextFollowTime || undefined,
                                rules: [{ required: true, type: "object" }]
                            })(
                                <DatePicker
                                    showTime
                                    disabled={isAssign}
                                    disabledDate={disabledDate}
                                    size="default"
                                    style={{ width: "100%" }}
                                    format="YYYY-MM-DD HH:mm"
                                    placeholder="选择下次跟进时间"
                                />
                            )}
                        </FormItem>
                        :
                        null
                    }
                    { followList && followList.length > 0 ?
                        <div>
                            <FormItem label='跟进记录' {...formItemLayout} style={{marginBottom: '0'}}></FormItem>
                            <div className={style.followRecord} onScroll = { followContScroll }>
                                <div className={style.recordList} id="record_list">
                                    {
                                        followList && followList.length > 0 ?
                                        followList.map((item,index) => {
                                            return (
                                                <FormItem {...formItemLayout} label={item.uname || '--'} key={index+'_1'}>
                                                    <div className={style.intro}>
                                                        <div className={style.text}>
                                                            <div>{item.content}</div>
                                                            <div className={style.dot}></div>
                                                        </div>
                                                        <div>{item.createTime}</div>
                                                    </div>
                                                </FormItem>
                                            )
                                        })
                                        :
                                        null
                                    }
                                </div>
                                <div style={{ textAlign: 'center'}}>
                                    {
                                        followRecordLoading ?
                                        <div>
                                            <Icon type="loading" /> 加载中...
                                        </div>
                                        :
                                        followListHasMore ?
                                        '上拉加载更多'
                                        :
                                        '没有更多数据了'
                                    }
                                </div>
                            </div>
                        </div>
                        :
                        null
                    }
                </Form>
            </Spin>
        </Modal>
    )
}

export default Form.create()(stuFollowModal)
