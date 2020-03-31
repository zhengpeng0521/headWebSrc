import React from 'react';
import { Form, Modal ,Button , Popconfirm ,Icon, Select ,Upload,Input, message, Checkbox } from 'antd';
import KoubeiOrgSelect from '../../../pages/scrm/koubei/common/koubei-org-select/KoubeiOrgSelect';
import style from './CourseIntroduceCreateForm.less'
import QueueAnim from 'rc-queue-anim';
let Option = Select.Option;
let FormItem = Form.Item;
let CheckboxGroup = Checkbox.Group

function CourseIntroduceCreateForm({

    createCourseIntroduceVisible,

    singleCourseInfo,

   //打开校区选择框
    selectOrgs, onOpenSelectOrgModal, selectModalVisible, onSelectOrgModalClose, afterSelectOrgModal,

    confirmAddCourse,
    cancelAddCourse,

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

    function afterSelectOrgModalSubmit( org_select ){
        setFieldsValue({ 'orgIds' : org_select.join(',') });
        afterSelectOrgModal( org_select );
    };

    //校区选择框属性
    let tenantOrgSelectProps = {
        visible         : selectModalVisible,
        onClose         : onSelectOrgModalClose,
        afterSubmit     : afterSelectOrgModalSubmit,
        init_org_select : selectOrgs,
		commodityId     : '201612060244770111',        //口碑商品的插件服务号
    };

    let formItemLayout = {
        labelCol : { span : 4 },
		wrapperCol : { span : 18 }
    }

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
    		<div>选择图片</div>
    	</div>
    );

    //课程封面
    let initCourseCover = [];
    if( singleCourseInfo && singleCourseInfo.couse_cover && singleCourseInfo.couse_cover.length > 0){
          initCourseCover.push({
              uid     : -1,
              url     : singleCourseInfo.couse_cover,
              status  : 'done'
          })
    };

    //试用年龄
    let plainOptions = ['0-1岁','1-2岁','2-3岁','3-4岁','4-5岁','5-6岁','6岁以上'];

    //确认新建课程
    function confirmAddCourseAction(){
         validateFieldsAndScroll( ( err, value ) => {
             if( !!err ){
                 return;
             };
             confirmAddCourse( value );
             resetFields();
         })
    };

    //取消新建课程
    function cancelAddCourseAction(){
        resetFields();
        cancelAddCourse();
    };

    //校验课程字数
    function checkCourseName( rule, value, callback ){
        if( !(/^[^\n]{1,20}$/.test(value)) ){
    		callback( '请输入1-20位字符' );
    	}else if( (/^[\s]{1,20}$/.test(value)) ){
			callback( "不能为空格" )
    	} else {
    		callback();
    	}
    };

    //校验排序值
    function checkSort(rule, value, callback){
		if( !(/^[1-9][0-9]{0,3}$/.test(value)) ){
			callback( "请输入1-9999的数值" );
		}else {
			callback();
		}
	};

	return(
       <Modal
            className = "yhwu_follow_up_modal"
            visible = { createCourseIntroduceVisible }
            title = '新建课程'
            maskClosable = { false }
            width = '550px'
            onCancel = { cancelAddCourseAction }
            footer = {[
				<Button key = "cancelAddCourseIntroduce"  onClick = { cancelAddCourseAction } >取消</Button>,
				<Button key = "confirmAddCourseIntroduce" type = "primary" onClick = { confirmAddCourseAction } >保存</Button>
			]}
        >
            <Form>
                <FormItem
                    { ...formItemLayout }
                    label = "适用门店"
                >
                    <span style = {{ 'color' : '#5D9CEC', 'marginRight' : '10px' }}>{ selectOrgs && selectOrgs.length || '0' }校区</span>
                     { getFieldDecorator('belongOrg',{
                        initialValue : selectOrgs.join(',') || '',
                        rules : [
                            { required : true , message : '请选择适用门店' }
                        ]
                    })(
                        <Button type="primary" size = "small" onClick = { onOpenSelectOrgModal } >选择门店</Button>
                    )}
                </FormItem>
                <FormItem
                    label = "课程名称"
                    { ...formItemLayout }
                >
                    { getFieldDecorator('course_name',{
                        initialValue : singleCourseInfo.course_name || '',
                        rules : [
                            { required : true, message : '请输入课程名称' },
                            { validator: checkCourseName }
                        ]
                    })(
                        <Input size = 'default' placeholder = '请输入课程名称' />
                    )}
                </FormItem>
                <FormItem
                    label = "课程封面"
                    { ...formItemLayout }
                    help = "支持png、jpeg、gif格式的图片，建议宽高比16:9，建议尺寸: 1242*698。图片大小≤1M"
                >
                    { getFieldDecorator('couse_cover', {
						initialValue  : initCourseCover || [],
						valuePropName : 'fileList',
                        // action        : `${BASE_URL}/uploadController/upload`,
                        action        : '/thinknode/upload/image',
                        normalize     : normFile,
						rules         : [
							{ required : true, type : 'array' , message : '请上传头像' }
						]
					})(
						<Upload
                            // action = { BASE_URL + '/uploadController/upload' }
                            action='/thinknode/upload/image'
							listType = "picture-card"
							beforeUpload = {( file , fileList ) => imgMaxSize( file, fileList, 1, '课程封面') }
						>
							{ getFieldValue('couse_cover') && getFieldValue('couse_cover').length >= 1 ?  null : uploadButton }
						</Upload>
					)}
                </FormItem>
                <FormItem
				    label = "适合年龄"
				    { ...formItemLayout }
				  >
                    { getFieldDecorator('adage',{
                        initialValue : singleCourseInfo.adage && singleCourseInfo.adage.split(',') || [],
                        rules : [
                            { required : true, message : '请选择年龄' }
                        ]
                    })(
                        <CheckboxGroup options={ plainOptions } />
                    )}
				</FormItem>
                <FormItem
                    label = "排序值"
                    { ...formItemLayout }
                >
                    { getFieldDecorator('sort',{
                        initialValue : singleCourseInfo.sort || '',
                        rules : [
                            { required : true, message : '请输入排序值' },
                            { validator: checkSort }
                        ]
                    })(
                        <Input size = 'default' placeholder = '填写0~9999之间的某个数字，用户在浏览时值大的排在前面' />
                    )}
                </FormItem>
            </Form>
            <p style={{ color : '#f50',textAlign : 'center' }} >温馨提示：请在保存之后，点击操作栏 "课程详情" 编辑课程的图文详情</p>
            <KoubeiOrgSelect { ...tenantOrgSelectProps } />
        </Modal>
	)
};

export default Form.create({})(CourseIntroduceCreateForm);
