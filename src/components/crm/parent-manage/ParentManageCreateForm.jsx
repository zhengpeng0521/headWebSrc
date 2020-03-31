import React from 'react';
import { Form, Modal, Button, Popconfirm, Icon, Select, Upload, Input, message, Radio } from 'antd';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import styles from './ParentManageCreateForm.less';
import QueueAnim from 'rc-queue-anim';
let Option     = Select.Option;
let FormItem   = Form.Item;
let RadioGroup = Radio.Group;

function ClassPackageCreateForm({
    createParentVisible,
    stuIdList,
    parentIdList,
    parentRelationList,
    parentDetailInfo,
    stuId,
    updateOrgId,
    orgId,
    parentId,
    updateParentId,
    oldParentId,
    createOrgId,


    TenantSelectOnSelect,

    cancelAddParent,
    confirmAddParent,

    checkParent,            //检验家长/手机号是否存在

	openId,

	parentCreateBtnLoading,

	checkoutParentName,

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
    //验证手机号是否存在
    function checkParentAction( e, changeParentInfoSelect ){
        let value = e.target.value;
        if( !!value && value.length == '11' ){
            checkParent( value, changeParentInfoSelect )
        }
    };

    //改变校区时清空所选课程
    function TenantSelectOnSelectAction( orgId ){
        setFieldsValue({ 'stuId'  : undefined });    //清空学员
        setFieldsValue({ 'mobile' : '' });
        if( !!orgId ){
            TenantSelectOnSelect( orgId );
        }
    };
    //校区下拉列表属性
    let tenantOrgSelectProps = {
        width        : 432,
        onChange     : TenantSelectOnSelectAction,            //改变机构触发事件
        disabled     : !!updateOrgId
    };

    let formItemLayout = {
        labelCol   : { span : 4 },
		wrapperCol : { span : 20 }
    };

    //确认新增家长
    function confirmAddParentAction(){
        validateFieldsAndScroll( (err, values) => {
            if( !!err ){
                return;
            };
            if( !!oldParentId && updateParentId != oldParentId ){
                message.error('手机号已被占用');
                return;
            }
            confirmAddParent( values, changeParentInfoSelect );
        })
    };

    //取消新增家长
    function cancelAddParentAction(){
        cancelAddParent();
    }

    function afterClose(){
        resetFields();
    };

    //验证手机号若存在，从家长库选择家长
    function changeParentInfoSelect( id ) {
        setFieldsValue({ 'parentInfo' : '2' });
        setFieldsValue({ 'id' : id });
    }

    //校验手机号格式
    function checkMobile( rule, value, callback ){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if( !(/^1[0-9]{10}$/.test( value )) ){
            callback(new Error('请输入正确的手机号'));
        }else{
            callback();
        }
    };

	return(
       <Modal
            className = "zj_parent_manage_create_form"
            visible = { createParentVisible }
            title = '家长信息'
            maskClosable = { false }
            width = '550px'
            onCancel = { cancelAddParentAction }
            afterClose = { afterClose }
            footer = {[
				<Button key = "cancelAddParent" onClick = { cancelAddParentAction } >取消</Button>,
				<Button
					key = "confirmAddParent"
					type = "primary"
					onClick = { confirmAddParentAction }
					loading = { parentCreateBtnLoading }
					disabled = { parentCreateBtnLoading }
                    style = {{ marginLeft : 20 }}
					>确认</Button>
			]}
        >
            <Form>
                { !!createParentVisible &&
                    <FormItem
                        label = "所属校区"
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('orgId',{
                            initialValue :  !parentDetailInfo.orgId ? createOrgId :  parentDetailInfo.orgId  ,
                            rules : [
                                { required : true, message : '请选择校区' }
                            ]
                        })(
                            <TenantOrgSelect { ...tenantOrgSelectProps } />
                        )}
                    </FormItem>
                }
				{
                    !updateOrgId && !stuId &&
					<FormItem
						label = "关联学员"
						{ ...formItemLayout }
					>
						{ getFieldDecorator('stuId', {
							initialValue : parentDetailInfo.stuId || undefined,
							rules : [
								{ message : '请选择学员' }
							]
						})(
							<Select
								size = 'default'
								showSearch
								allowClear
								placeholder = "请选择学员"
								optionFilterProp = "children"
								notFoundContent = "没有学员"
								disabled = { !!stuId }
							>
								{ stuIdList && stuIdList.map(function( item, index ){
									return ( <Option key = { 'parent_stuId' + item.stuId } value = { item.stuId } >{ item.stuName }</Option> )
								})}
							</Select>
						)}
					</FormItem>
				}
                {
                    !updateOrgId && !stuId &&
                    <FormItem
                        label = "家长信息"
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('parentInfo',{
                            initialValue : '1',
                            rules : [
                                { required : true, message : '请选择' }
                            ]
                        })(
                            <Select
                                size = 'default'
                                allowClear
                                placeholder = "请选择学员"

                            >
                                <Option value = '1' >新建家长</Option>
                                <Option value = '2' >从家长库选择</Option>
                            </Select>
                        )}
                    </FormItem>
                }
                <QueueAnim
                        type={['top', 'bottom']}
                        ease={['easeOutQuart', 'easeInOutQuart']}
                        style={{width : '100%'}} >
                    { !!getFieldValue('parentInfo') && getFieldValue('parentInfo') == '2' ?
                        <div key = 'parentIsQueueAnim'>
                            <FormItem
                                label = "家长姓名"
                                { ...formItemLayout }
                                style = {{ marginBottom : 10 }}
                            >
                                { getFieldDecorator('id', {
                                    initialValue : parentId || undefined,
                                    rules : [
                                        { required : true, message : '请选择家长'}
                                    ]
                                })(
                                    <Select
                                        showSearch
                                        allowClear
                                        size = 'default'
                                        placeholder = "请选择家长"
                                        optionFilterProp = "children"
                                        notFoundContent = "没有家长"
                                    >
                                        { parentIdList && parentIdList.map(function(item, index){
                                            return ( <Option key = { 'parentName_' + item.id } value = { item.id }>{ item.name }</Option> )
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                        </div>
                        :
                        <div key = 'parentNotQueueAnim' >
                            <FormItem
                                label = "家长姓名"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('name',{
                                    initialValue : parentDetailInfo.name || '',
                                    rules : [
                                        { required : true, message : '请输入家长姓名', whitespace: true, }
                                    ]
                                })(
                                    <Input size = 'default' placeholder = '请输入家长姓名' /*onBlur = { ( e ) => checkoutParentName( e, getFieldValue('orgId'), parentDetailInfo.id ) } *//>
                                )}
                            </FormItem>
                            <FormItem
                                label = "手机号"
                                { ...formItemLayout }
								help = { !!openId && '手机已验证, 不能修改'}
                                style = {{ marginBottom : 10 }}
                            >
                                { getFieldDecorator('mobile',{
                                    initialValue : parentDetailInfo.mobile || '',
                                    rules : [
                                        { required : true, message : '请输入联系方式' },
                                        { validator : checkMobile }
                                    ]
                                })(
                                    <Input disabled = { !!openId } size = 'default' placeholder = '请输入联系方式' onChange = { (e) => checkParentAction( e, changeParentInfoSelect ) } />
                                )}
                            </FormItem>
                        </div>

                    }
                </QueueAnim>
				{
                    !updateOrgId && !stuId &&
					<FormItem
						label = "家长关系"
						{ ...formItemLayout }
					>
						{ getFieldDecorator('relation',{
							initialValue : parentDetailInfo.relation || undefined,
							rules : [
								{ message : '请选择家长关系' }
							]
						})(
							<Select
								showSearch
								allowClear
								size = 'default'
								optionFilterProp="children"
								placeholder = "请选择家长关系"
							>
								{ parentRelationList && parentRelationList.map(function( item, index ){
									return ( <Option key = { 'parent_relation_' + item.index } value = { item.key } >{ item.value }</Option> )
								})}
							</Select>
						)}
					</FormItem>
				}
				<FormItem
                    label = "qq"
                    { ...formItemLayout }
                >
                    { getFieldDecorator('qqNumber',{
                        initialValue : parentDetailInfo.qqNumber || '',
                        rules : [
                        ]
                    })(
                        <Input size = 'default' placeholder = '请输入qq' />
                    )}
                </FormItem>
				<FormItem
                    label = "所属行业"
                    { ...formItemLayout }
                >
                    { getFieldDecorator('trade',{
                        initialValue : parentDetailInfo.trade || '',
                        rules : [
                        ]
                    })(
                        <Input size = 'default' placeholder = '请输入所属行业' />
                    )}
                </FormItem>
                <FormItem
                    label = "邮箱"
                    { ...formItemLayout }
                >
                    { getFieldDecorator('email',{
                        initialValue : parentDetailInfo.email || '',
                        rules : [
                        ]
                    })(
                        <Input size = 'default' placeholder = '请输入邮箱' />
                    )}
                </FormItem>
				<FormItem
                    label = "工作单位"
                    { ...formItemLayout }
                >
                    { getFieldDecorator('workUnit',{
                        initialValue : parentDetailInfo.workUnit || '',
                        rules : [
                        ]
                    })(
                        <Input size = 'default' placeholder = '请输入工作单位' />
                    )}
                </FormItem>
            </Form>
        </Modal>
	)
};

export default Form.create({})(ClassPackageCreateForm);
