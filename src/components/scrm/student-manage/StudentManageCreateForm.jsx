import React from 'react';
import QueueAnim from 'rc-queue-anim';
import style from './StudentManageCreateForm.less';
import { Button , Modal , Form , Input , Select , Upload , Icon , Radio , DatePicker,Row, Col ,message} from 'antd';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import PageModal from '../../common/page-modal/PageModal';
import moment from 'moment';
let FormItem = Form.Item;
let Option = Select.Option;
let RadioGroup = Radio.Group;

function StudentManageCreateForm({
	createStudentModalVisible,
    confirmCreateForm,
    cancelCreateForm,
    studentBirthday,

    createOrgId, //默认选择的校区Id
    createOrgName, //默认选择的校区名字
    //选择器下拉列表
    createSellerList,
    studentTypeList,
    sourceList,
    saleStatusList,

    studentInfo,

    TenantSelectOnSelect,

    checkStudentStatus,        //学员查重

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

	function checkStudentStatusAction( orgId, name ){
		if( orgId == '' || orgId == null || orgId == undefined || /^[\s]*$/.test(orgId) || name == '' || name == undefined || name == null || /^[\s]*$/.test(name)){
            message.warn('请选择校区并输入姓名，请检查有无遗漏');
        }else {
			checkStudentStatus( name );
		}
	}
    //改变校区是清空所选跟进人
    function TenantSelectOnSelectAction( value ){
        setFieldsValue({ 'seller' : undefined });
        if( !!value ){
            TenantSelectOnSelect( value );
        }
    };
    //校区下拉列表属性
    let tenantOrgSelectProps = {
        width        : 390,
        onChange     : TenantSelectOnSelectAction,            //改变机构触发事件
        disabled     : !!studentInfo.orgId
    };

	let formItemLayout = {
		labelCol : { span : 4 },
		wrapperCol : { span : 18 }
	};

	function normFile(e) {
        if (Array.isArray(e)){
          return e;
        }
        return e && e.fileList;
    };

    function imgMaxSize( file , fileList , size , title){
        let fileSize = file.size;
        if ( fileSize > 1048576 * size ){
            message.error( title + '大小不能超过' + size + 'M')
            return false;
        }
    };

    let uploadButton = (
    	<div>
    		<Icon type = 'plus' />
    		<div className = { style.upload_picture_btn } >选择图片</div>
    	</div>
    );

    //学员头像
    let initStudentImg = [];
    if( studentInfo && studentInfo.headimgurl && studentInfo.headimgurl.length > 0){
          initStudentImg.push({
              uid    : -1,
              url    : studentInfo.headimgurl,
              status : 'done'
          })
    };
    //学员生日
    let initStudentBirthday;
    if ( studentInfo && studentInfo.birthday && studentInfo.birthday != ''){
        initStudentBirthday = moment(new Date( studentInfo.birthday ));
    };

    //确认新增表单
	function confirmCreateFormAction(){


        validateFieldsAndScroll((err, values) => {

            if ( !!err ){
                return;
            };

            confirmCreateForm(values);
            cancelCreateFormAction();
        });
	};

    //取消新增表单
	function cancelCreateFormAction(){
        resetFields();
		cancelCreateForm();
	};



	return (
		<Modal
            className = "yhwu_modal_content"
			title = "学员信息"
			visible = { createStudentModalVisible }
			width = '550px'
			onCancel = { cancelCreateFormAction }
			onClose = { cancelCreateFormAction }
			maskClosable = { false }
			footer = {[
				<Button key = "cancelStudent" onClick = { cancelCreateFormAction } >取消</Button>,
				<Button key = "confirmStudent" type = "primary" onClick = { confirmCreateFormAction } >保存</Button>
			]}
		>
			<Form>
				<div className = "yhwu_base_setting" >
                    <span>基本信息</span>
                </div>
                <FormItem
					{ ...formItemLayout }
					label = "所属校区"
				>
					{ getFieldDecorator('orgId',{
						initialValue : !studentInfo.orgId ? (!createOrgId?'':createOrgId):studentInfo.orgId,
						rules : [
							{ required : true , message : '请选择校区' }
						]
					})(
                        <TenantOrgSelect { ...tenantOrgSelectProps } />
					)}
				</FormItem>
                <FormItem
					{ ...formItemLayout }
					label = "负责人"
				>
					{ getFieldDecorator('seller',{
						initialValue : studentInfo.seller || undefined,
					})(
                        <Select
                            size = 'default'
                            style = {{ width : '390px' }}
                            showSearch
                            allowClear
                            optionFilterProp = "children"
                            placeholder = '请选择当前校区下的员工'
                            notFoundContent = { '当前校区下没有员工, 请先在设置里添加员工' }
                        >
                            {
                                createSellerList && createSellerList.map(function( item, index ){
                                    return ( <Option key = { 'intention_' + item.id } value = { item.id + '' } >{ item.name }</Option> )
                                })
                            }
                        </Select>
					)}
				</FormItem>
                <div style={{ position : 'relative' }}>
                    <FormItem
                        { ...formItemLayout }
                        label = "学员姓名"
                    >
                        { getFieldDecorator('name', {
                            initialValue : studentInfo.name || '',
                            rules : [
                                { required : true , message : '请输入学员姓名' }
                            ]
                        })(
                            <Input size = 'default' placeholder = "请输入学员姓名" style = {{ width : '280px'}} />
                        )}

                    </FormItem>
                    <Button onClick = { () => checkStudentStatusAction( getFieldValue('orgId'), getFieldValue('name') ) } style={{ position:'absolute',top:'0',right:'4%' }} type = 'primary'>
                        查重
                    </Button>
                </div>
				<FormItem
					{ ...formItemLayout }
					label = "学员性别"
				>
					{ getFieldDecorator('sex', {
						initialValue : studentInfo.sex || '',
						rules : [
							{ required : true, message : '请选择学员性别' }
						]
					})(
						<RadioGroup style = {{ width : '390px', marginTop : '5px' }} >
							<Radio value = "1">男</Radio>
							<Radio value = "2">女</Radio>
						</RadioGroup>
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = "是否会员"
				>
					{ getFieldDecorator('vip', {
						initialValue : studentInfo.vip || '',
						rules : [
						]
					})(
						<RadioGroup style = {{ width : '390px', marginTop : '5px'}} >
							<Radio value = "0">否</Radio>
							<Radio value = "1">是</Radio>
						</RadioGroup>
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout}
					label = "学员头像"
                    help = "支持png、jpeg、gif格式的图片,图片大小不大于2M!"
				>
					{ getFieldDecorator('headimgurl', {
						initialValue : initStudentImg || [],
						valuePropName: 'fileList',
						// action : `${BASE_URL}/uploadController/upload`,
						action : '/thinknode/upload/image',
                        normalize: normFile,
						rules : [
							{ type : 'array' , message : '请上传头像' }
						]
					})(
						<Upload
							// action = { BASE_URL + '/uploadController/upload' }
							action='/thinknode/upload/image'
							listType = "picture-card"
							beforeUpload = {( file , fileList ) => imgMaxSize( file , fileList , 2 , '学员头像')}
						>
							{ getFieldValue('headimgurl') && getFieldValue('headimgurl').length >= 1 ?  null : uploadButton }
						</Upload>
					)}
				</FormItem>
                <FormItem
					{ ...formItemLayout }
					label = "学员类型"
				>
					{ getFieldDecorator('intention',{
						initialValue : studentInfo.intention || undefined,
						rules : [
						]
					})(
                        <Select
                            style = {{ width : '390px' }}
                            size = 'default'
                            showSearch
                            allowClear
                            optionFilterProp = "children"
                            placeholder = '请选择学员类型'
                            notFoundContent = { '没有学员类型' }
                        >
                            {
                                studentTypeList && studentTypeList.map(function( item, index ){
                                    return ( <Option key = { 'studentType_' + item.key } value = { item.key } >{ item.value }</Option> )
                                })
                            }
                        </Select>
					)}
				</FormItem>
                <FormItem
					{ ...formItemLayout }
					label = "跟进状态"
				>
					{ getFieldDecorator('saleStatus',{
						initialValue : studentInfo.saleStatus || undefined,
						rules : [
						]
					})(
                        <Select
                            style = {{ width : '390px' }}
                            size = 'default'
                            showSearch
                            allowClear
                            optionFilterProp = "children"
                            placeholder = '请选择跟进状态'
                            notFoundContent = { '没有跟进状态' }
                        >
                            {
                                saleStatusList && saleStatusList.map(function( item, index ){
                                    return ( <Option key = { 'saleStatus_' + item.key } value = { item.key } >{ item.value }</Option> )
                                })
                            }
                        </Select>
					)}
				</FormItem>
                <FormItem
					{ ...formItemLayout }
					label = "来源"
				>
					{ getFieldDecorator('channel',{
						initialValue : studentInfo.channel || undefined,
						rules : [
						]
					})(
                        <Select
                            style = {{ width : '390px' }}
                            size = 'default'
                            showSearch
                            allowClear
                            optionFilterProp = "children"
                            placeholder = '请选择来源'
                            notFoundContent = { '没有来源' }
                        >
                            {
                                sourceList && sourceList.map(function( item, index ){
                                    return ( <Option key = { 'source' + item.key } value = { item.key } >{ item.value }</Option> )
                                })
                            }
                        </Select>
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = "学员生日"
				>
					{ getFieldDecorator('birthday',{
						initialValue : initStudentBirthday || undefined,
						rules : [
						 	{ type : 'object', message : '请选择生日' }
						]
					})(
						<DatePicker size = 'default' format="YYYY-MM-DD" style = {{ width : '390px'}} />
					)}
				</FormItem>
                <FormItem
					{ ...formItemLayout }
					label = "联系方式"
				>
					{ getFieldDecorator('mobile',{
						initialValue : studentInfo.mobile || '',
						rules : [
						]
					})(
						<Input size = 'default' placeholder = "请输入联系方式" style = {{ width : '390px'}} />
					)}
				</FormItem>
                <FormItem
					{ ...formItemLayout }
					label = "联系地址"
				>
					{ getFieldDecorator('conaddress',{
						initialValue : studentInfo.conaddress || '',
						rules : [
						]
					})(
						<Input size = 'default' placeholder = "请输入联系地址" style = {{ width : '390px'}} />
					)}
				</FormItem>
                <FormItem
					{ ...formItemLayout }
					label = "居住小区"
				>
					{ getFieldDecorator('community',{
						initialValue : studentInfo.community || '',
						rules : [
						]
					})(
						<Input size = 'default' placeholder = "请输入居住小区" style = {{ width : '390px'}} />
					)}
				</FormItem>
                <FormItem
					{ ...formItemLayout }
					label = "学校"
				>
					{ getFieldDecorator('schaddress',{
						initialValue : studentInfo.schaddress || '',
						rules : [
						]
					})(
						<Input size = 'default' placeholder = "请输入学校" style = {{ width : '390px'}} />
					)}
                </FormItem>
			</Form>
		</Modal>
	)
}

export default Form.create({})(StudentManageCreateForm);
