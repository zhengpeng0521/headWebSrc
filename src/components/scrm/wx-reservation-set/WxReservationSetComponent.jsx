import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { Button , Modal , Form , Input , Select, Radio, Switch, Icon } from 'antd';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import style from './WxReservationSetComponent.less';
let FormItem = Form.Item;
let Option = Select.Option;
let RadioGroup = Radio.Group;

function WxReservationSetComponent({
    orgId,

    orgChoice,
    addr,
    babyName,
    babySex,
    babyBirthday,
    tel,
    gift,
    orgAddr,
    giftContent,

    TenantSelectOnSelect,
    saveWxReservation,              //保存

    changeOrgChoice,
    changeOrgAddr,
    changeBabyName,
    changeBabySex,
    changeBabyBirthday,
    changeTel,
    changeAddr,
    changeGift,

	form : {
		getFieldDecorator,
        validateFieldsAndScroll,
        validateFields,
        getFieldsValue,
        getFieldValue,
        getFieldError,
        setFieldsValue,
        resetFields,
	}
}){

    //校区下拉列表属性
    let tenantOrgSelectProps = {
        width        : 420,
        onChange     : TenantSelectOnSelect,            //改变机构触发事件
    };

	//表单布局
    let formItemLayout = {
        labelCol   : { span : 20 },
   	    wrapperCol : { span : 4 }
    };

	//保存预约设置
	function saveWxReservationAction(){
		validateFieldsAndScroll((err, values) => {
            if ( !!err ) {
                return;
            }
            saveWxReservation( values )
        });
	};
	return (
        <div className = { style.content }>
            <div className = { style.content_detail }>
                <div className = { style.content_head }>
                    <Form>
                        <FormItem>
                            { getFieldDecorator('orgId',{
                                initialValue : orgId || '',
                                rules : [
                                    { required : true, message : '请选择校区' }
                                ]
                            })(
                                <TenantOrgSelect { ...tenantOrgSelectProps } />
                            )}
                        </FormItem>
                    </Form>
                </div>
                    <div className = { style.content_body }>
                        <Form className = 'content_body_form' >
                            <FormItem
                                { ...formItemLayout }
                                label = '是否显示校区选择'
                            >
                                <Switch checked = { orgChoice } checkedChildren = { '是' } unCheckedChildren = { '否' } onChange = { changeOrgChoice } />
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label = '是否显示校区地址'
                            >
                                <Switch checked = { orgAddr } checkedChildren = { '是' } unCheckedChildren = { '否' } onChange = { changeOrgAddr } />
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label = '是否显示学员姓名'
                            >
                                <Switch checked = { babyName } checkedChildren = { '是' } unCheckedChildren = { '否' } onChange = { changeBabyName } />
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label = '是否显示学员性别'
                            >
                                <Switch checked = { babySex } checkedChildren = { '是' } unCheckedChildren = { '否' } onChange = { changeBabySex } />
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label = '是否显示学员生日'
                            >
                                <Switch checked = { babyBirthday } checkedChildren = { '是' } unCheckedChildren = { '否' } onChange = { changeBabyBirthday } />
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label = '是否显示联系方式'
                            >
                                <Switch checked = { tel } checkedChildren = { '是' } unCheckedChildren = { '否' } onChange = { changeTel } />
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label = '是否显示联系地址'
                            >
                                <Switch checked = { addr } checkedChildren = { '是' } unCheckedChildren = { '否' } onChange = { changeAddr } />
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label = '是否预约有礼'
                            >
                                <Switch checked = { gift } checkedChildren = { '是' } unCheckedChildren = { '否' } onChange = { changeGift } />
                            </FormItem>
                            {
                                gift == '1' ?
                                <FormItem
                                    wrapperCol = {{ span : 24 }}
                                    label = ''
                                    style = {{ border : 'none', padding : '0', marginTop : '-5px'}}
                                >
                                    { getFieldDecorator('giftContent',{
                                        initialValue : giftContent || '',
                                        rules : [
                                            { required : true, message : '请填写礼物' }
                                        ]

                                    })(
                                        <Input type = 'textarea' placeholder = '请输入预约有礼的内容' />
                                    )}
                                </FormItem>
                                : null
                            }
                            <Button onClick = { saveWxReservationAction } type = 'primary' style = {{ width : '100%', height : '32px' }} >保存</Button>
                        </Form>
                    </div>
            </div>
        </div>
	)
}

export default Form.create({})(WxReservationSetComponent);
