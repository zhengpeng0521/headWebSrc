import React from 'react';
import { Form, Input, Modal, Button, Upload, Icon, message, Select, Popconfirm, Radio, DatePicker, Col } from 'antd';
import moment from 'moment';
import styles from './Cousulting.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

const formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 10},
};
const formItemLayoutWithOutLabel = {
  wrapperCol: { span: 2, offset: 4 },
};

const ConsultingModal = ({
    consultationListFormLoading,
    consultationListFormData,
    consultationListFormVisible,
    consultationListFormType,
    consultationListFormSubmit,
    consultationListFormCancel,
    form: {
        getFieldDecorator,
        validateFields,
        getFieldValue,
        getFieldsValue,
        resetFields,
        validateFieldsAndScroll,
        setFieldsValue,
        fieldsValue
    },
  }) => {
    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors) => {
            if (!!errors) {
                return;
            }
            let data = { ...getFieldsValue()};
            data.birthDay = data.birth.format('YYYY-MM-DD');
            data.jingbanTime = data.jingban.format('YYYY-MM-DD HH:mm:ss');
            delete data.birth;
            delete data.jingban;
            //consultationListFormSubmit(data);
        });
    }

    //检验数是否为正整数
    function checkNumber(rule, value, callback) {
        /*if(value==''||value==null||value==undefined){
            callback();
        }else if (!/^[+]*[\d]*$/.test(value)) {
            callback(new Error('输入不合法，必须是阿拉伯自然数'));
        }else {
            callback();
        }*/
        callback();
    }


    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        consultationListFormCancel();
    }

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    let dateFormat = 'YYYY-MM-DD HH:mm';

    let createTimeInitValue = consultationListFormType=='update'?
                                moment(consultationListFormData.createTime, dateFormat) : '';
    let modifyTimeInitValue = consultationListFormType=='update'?
                                moment(consultationListFormData.createTime, dateFormat) : '';
    let createTimeConfig = {
        initialValue: createTimeInitValue,
        rules: [{ type: 'object', required: true, message: '学员生日未选择' }],
    };
    let modifyTimeConfig = {
        initialValue: modifyTimeInitValue,
    };

    function disabledDate(current) {
        // can not select days after today and today
        return current && current.valueOf() > Date.now();
    }

    let modalOpts = {
    title: consultationListFormType=='create'?'新增咨询':'编辑咨询',
    maskClosable : false,
    visible : consultationListFormVisible,
    closable : true,
    width : 550,
    onOk: handleComplete,
    onCancel : handleCancel,
    footer : [
        <Button className={styles.ModalButton} type="ghost" onClick={handleCancel}>取消</Button>,
        <Button className={styles.ModalButton}
                type="primary"
                onClick={handleComplete}
                disabled={consultationListFormLoading}
                loading={consultationListFormLoading}>保存</Button>
    ],
  };

return (
    <Modal {...modalOpts} className={styles.Modal} style={{maxHeight: '700px'}}>
        <div className={styles.addOrEditFormContent}>
            <Form horizontal>
                <FormItem
                    label="学员姓名"
                    {...formItemLayout}
                    style={{marginBottom:'19px',marginTop:'17px',marginLeft:'-14px'}}
                >
                    {getFieldDecorator('学员姓名', {
                        initialValue:consultationListFormType=='update'?'伍雨豪':'',
                        rules: [
                            { required: true, message: '学员姓名未填写' },{validator: checkNumber},
                        ],
                    })(
                        <Input type="text" size="default" placeholder='请填写学员姓名' style={{width:390}}/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="学员性别"
                    style={{marginBottom:'18px',marginLeft:'-14px'}}
                >
                    {getFieldDecorator('学员性别', {
                        initialValue:consultationListFormType=='update'?'1':'',
                        rules: [
                            { required: true, message: '学员性别未选择' },
                        ],
                    })(
                    <RadioGroup>
                        <Radio value='1'>男</Radio>
                        <Radio value='2'>女</Radio>
                    </RadioGroup>
                )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="学员生日"
                    style={{marginBottom:'19px',marginLeft:'-14px'}}
                    >
                    {getFieldDecorator('birth', createTimeConfig)(
                        <DatePicker size="default" disabledDate={disabledDate} format="YYYY-MM-DD" style={{width:390}}/>
                    )}
                </FormItem>
            </Form>
            <Form inline style={{width:'500px'}}>
                <FormItem
                    label="家长信息"
                    labelCol={{ span:8,offset:5  }}
                    wrapperCol={{span: 11}}
                    style={{marginBottom:'2px',marginLeft:'-19px'}}
                >
                    {getFieldDecorator('家长姓名', {
                        initialValue:consultationListFormType=='update'?'赵健':'',
                        rules: [
                            { required: true, message: '家长姓名未填写' }
                        ],
                    })(
                        <Input size="default" placeholder='姓名' style={{ width: 144 }}/>
                    )}
                </FormItem>

                <FormItem
                    labelCol={{ span: 20 }}
                    style={{marginLeft:'34px'}}
                >
                    {getFieldDecorator('关系', {
                        initialValue:consultationListFormType=='update'?'1':undefined,
                        rules: [
                            { required: true, message: '关系未选择' }
                        ],
                    })(
                      <Select placeholder="关系" size="default" style={{ width: 104 }}>
                        <Option value="父亲" >父亲</Option>
                        <Option value="母亲" >母亲</Option>
                      </Select>
                    )}
                </FormItem>

                <FormItem
                    labelCol={{ span: 15,offset:8 }}
                    wrapperCol={{span: 20}}
                    style={{marginLeft:'-11px'}}
                >
                    {getFieldDecorator('联系方式', {
                        initialValue: 'update'!=consultationListFormType?'':
                                  consultationListFormData.id==undefined?'':consultationListFormData.id+'',
                        rules: [
                            { required: true, message: '联系方式未填写' }
                        ],
                    })(
                        <Input size="default" placeholder='联系方式' style={{ width: 144 }}/>
                    )}
                </FormItem>
            </Form>
            <br/>
            <Form>
                <FormItem
                    label="其他信息"
                    {...formItemLayout}
                    style={{marginBottom:'20px',marginLeft:'-14px'}}
                    className='zj-form-textarea'
                >
                    {getFieldDecorator('其他信息', {
                        initialValue:consultationListFormType=='update'?'其他信息':'',
                    })(
                        <Input type="textarea" rows={4} placeholder='请填写其他信息' style={{width:'389px'}}/>
                    )}
                </FormItem>
            </Form>

            <div className={styles.line}></div>

            <Form>
                <FormItem
                    {...formItemLayout}
                    label="渠道"
                    style={{marginBottom:'19px',marginTop:'15px',marginLeft:'-14px'}}
                >
                    {getFieldDecorator('渠道', {
                        initialValue:consultationListFormType=='update'?'1':undefined,
                    })(
                    <RadioGroup style={{width:'400px'}}>
                        <Radio value='1'>来电</Radio>
                        <Radio value='2'>来访</Radio>
                        <Radio value='3'>网络</Radio>
                        <Radio value='4'>其他</Radio>
                    </RadioGroup>
                )}
                </FormItem>
                <FormItem
                    label="意向度"
                    {...formItemLayout}
                    style={{marginBottom:'18px',marginLeft:'-14px'}}
                >
                    {getFieldDecorator('意向度', {
                        initialValue:consultationListFormType=='update'?'低':undefined,
                    })(
                      <Select size="default" placeholder="请选择意向度" style={{ width: 150 }}>
                        <Option value="无" >无</Option>
                        <Option value="低" >低</Option>
                        <Option value="中" >中</Option>
                        <Option value="高" >高</Option>
                      </Select>
                    )}
                </FormItem>
                <FormItem
                    label="咨询课程"
                    {...formItemLayout}
                    style={{marginBottom:'5px',marginLeft:'-14px'}}
                >
                    {getFieldDecorator('咨询课程', {
                        initialValue:consultationListFormType=='update'?'英语':undefined,
                    })(
                      <Select size="default" placeholder="请选择咨询课程" style={{ width: 150 }}>
                        <Option value="语文" >语文</Option>
                        <Option value="数学" >数学</Option>
                        <Option value="英语" >英语</Option>
                      </Select>
                    )}
                </FormItem>
            </Form>
            <Form inline style={{height:'60px',width:'100%',display:'inline-flex'}}>
                <FormItem
                    labelCol={{ span:9,offset:6 }}
                    wrapperCol={{span: 9}}
                    label="跟进状态"
                    style={{marginLeft:'-36px',marginBottom:'19px'}}
                >
                    {getFieldDecorator('跟进状态', {
                        initialValue:consultationListFormType=='update'?'待跟进':undefined,
                    })(
                    <Select size="default" style={{ width: 150 }} placeholder='请选择跟进状态'>
                        <Option value='跟进'>跟进</Option>
                        <Option value='待跟进'>待跟进</Option>
                    </Select>
                )}
                </FormItem>
                <FormItem
                    labelCol={{ span:30 }}
                    label="关键词"
                    style={{marginLeft:'100px'}}
                >
                    {getFieldDecorator('关键词', {
                        initialValue:consultationListFormType=='update'?'低':undefined,
                    })(
                      <Select size="default" placeholder='请选择关键词' style={{ width: 150 }}>
                        <Option value="无" >无</Option>
                        <Option value="低" >低</Option>
                        <Option value="中" >中</Option>
                        <Option value="高" >高</Option>
                      </Select>
                    )}
                </FormItem>
            </Form>
            <Form>
                <FormItem
                    label="沟通内容"
                    {...formItemLayout}
                    style={{marginTop:'-8px',marginBottom:'20px',marginLeft:'-15px'}}
                    className='zj-form-textarea'
                >
                    {getFieldDecorator('沟通内容', {
                        initialValue:consultationListFormType=='update'?'沟通内容':'',
                    })(
                        <Input size="default" type="textarea" rows={4} placeholder='请填写沟通内容' style={{width:'389px'}}/>
                    )}
                </FormItem>
            </Form>

            <div className={styles.line}></div>

            <Form inline style={{height:'60px',width:'100%',display:'inline-flex'}}>
                <FormItem
                    labelCol={{ span:9,offset:6 }}
                    wrapperCol={{span: 9}}
                    label="经办校区"
                    style={{marginLeft:'-36px',marginBottom:'19px'}}
                >
                    {getFieldDecorator('经办校区', {
                        initialValue:consultationListFormType=='update'?'A校区':undefined,
                    })(
                    <Select size="default" style={{ width: 150 }} placeholder='请选择经办校区'>
                        <Option value="A校区" >A校区</Option>
                        <Option value="B校区" >B校区</Option>
                    </Select>
                )}
                </FormItem>
                <FormItem
                    labelCol={{ span:30 }}
                    label="经办时间"
                    style={{marginLeft:'84px'}}
                >
                    {getFieldDecorator('jingban', modifyTimeConfig)(
                        <DatePicker size="default" style={{ width: 150 }} showTime disabledDate={disabledDate} format="YYYY-MM-DD HH:mm"/>
                    )}
                </FormItem>
            </Form>
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="销售员"
                    style={{marginBottom:'5px',marginTop:'-10px',marginLeft:'-15px'}}
                >
                    {getFieldDecorator('请选择销售员', {
                        initialValue:consultationListFormType=='update'?'职员':undefined,
                    })(
                      <Select size="default" style={{ width: 150 }} placeholder='销售员'>
                        <Option value="管理员" >管理员</Option>
                        <Option value="职员" >职员</Option>
                      </Select>
                    )}
                </FormItem>
            </Form>
        </div>
    </Modal>
  );
};

export default Form.create()(ConsultingModal);
