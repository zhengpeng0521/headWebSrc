import React from 'react';
import { Form, Modal, Button, Popconfirm, Icon, Select, Upload, Input, message, DatePicker, Checkbox, InputNumber } from 'antd';
import QueueAnim from 'rc-queue-anim';
import WxCourseCreateFormRender from './WxCourseCreateFormRender';
import TenantOrgSelect from '../../../pages/common/tenant-org-select/TenantOrgSelect';
import style from './WxCourseCreateForm.less';
const { RangePicker } = DatePicker;
const Option = Select.Option;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

function WxCourseCreateForm({
    //打开校区选择框
    selectOrgs,
    modifyCourse,
    onOpenSelectOrgModal,
    selectModalVisible,
    onSelectOrgModalClose,
    afterSelectOrgModal,

    wxCourseCreateVisible,
    courseInfo,                       //课程详情信息
    dict,                             //课程类型和年龄选择项

    cancelAddWxCourse,
    confirmAddWxCourse,

    id,

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
        disabled        : modifyCourse,
        no_select_campus: modifyCourse,
    };

    function afterClose(){
        resetFields();
    }
    //取消新增
    function cancelAddWxCourseAction(){
        cancelAddWxCourse();
    };

    //确认新增
    function confirmAddWxCourseAction(){
        validateFieldsAndScroll( ( err, values ) => {
            if( !!err ){
                return;
            }
            let detail = values.detail;
            let courseContent = []
            detail && detail.map(function(item,index){
                let key = item.key;
                let detailTitle = getFieldValue(['detailTitle_' + key]);
                let detailContent = getFieldValue(['detailContent_' + key]);

                courseContent.push({
                    title : detailTitle,
                    content : []
                })
                detailContent && detailContent.map(function( d_item, d_index ){
                    let detailContentKey = d_item.c_key;
                    courseContent[index].content.push({
                        contentDetail : getFieldValue(['detailContent_' + key + '_' + detailContentKey ])
                    });
                })
            });
            values.courseContent = courseContent;
            confirmAddWxCourse( values );
        })
    };

    let formItemLayout = {
        labelCol   : { span : 4 },
		wrapperCol : { span : 20 }
    }

    let formItemLayoutWithoutLabel = {
        wrapperCol : { span: 20, offset: 4 },
    };

    //图片上传
    function normFile(e) {
        if( Array.isArray(e) ){
            return e;
        }
        return e && e.fileList;
    };

    //验证图片大小
    function imgMaxSize( file , fileList , size , title){
        let fileSize = file.size;
        if ( fileSize > 1048576 * size ){
            message.error( title + '大小不能超过' + size + 'M')
            return false;
        }
    };

    //图片数量限制
    let uploadButton = (
    	<div>
    		<Icon type = 'plus' />
    		<div>选择图片</div>
    	</div>
    );

    //课程封面
    let initCourseCover = [];
    if( courseInfo && courseInfo.courseCover && courseInfo.courseCover.length > 0){
          initCourseCover.push({
              uid    : -1,
              url    : courseInfo.courseCover,
              status : 'done'
          })
    };
    //详情图片
    let initDetailPic = [];
    if( courseInfo &&  courseInfo.detailPic ){
        let initDetailPicArr = courseInfo.detailPic.split(',');
        initDetailPicArr && initDetailPicArr.map(function( item, index){
            initDetailPic.push({
                uid    : -index,
                url    : item,
                status : 'done'
            })
        })
    };

    //校验名称
    function checkCourseTitle( rule, value, callback ){
        if(!(/^[^\n]{1,20}$/.test(value))){
            callback('不能超过20个字符');
        }else {
            callback();
        }
    };

    //校验详情标题
    function checkDetailTitle( rule, value, callback ){
      if(!(/^[^\n]{1,15}$/.test(value))){
    		  callback('不能超过15个字符');
    	}else if((/^[\s]{1,15}$/.test(value))){
			    callback("不能为空格")
    	}else {
          callback();
    	}
    };

    //校验详情内容
    function checkDetailContent( rule, value, callback ){
        if(!(/^[^\n]{1,100}$/.test(value))){
            callback('不能超过100个字符');
    	   }else if((/^[\s]{1,100}$/.test(value))){
			     callback("不能为空格")
    	   }else {
            callback();
    	   }
    };
    //新增详情
    function addCourseDetail(){
        let courseDetail = getFieldValue('detail') || [];
        if( !!courseDetail && courseDetail.length > 0 ){
            let maxItem = courseDetail[ courseDetail.length - 1 ] || {};
            let maxKey = maxItem.key;
            courseDetail.push({
                key  : maxKey + 1,
                item : {}
            })
        }else {
            courseDetail.push({
                key  : 0,
                item : {}
            })
        }
        setFieldsValue({ 'detail' : courseDetail })
    };

    //删除详情
    function deleteCourseDetail( removeKey ){
        let courseDetail = getFieldValue('detail') || [];
        let newCourseDetail = [];
        courseDetail && courseDetail.length > 0 && courseDetail.map(function( item, index ){
            if( item.key != removeKey ){
                newCourseDetail.push( item )
            }
        })
        setFieldsValue({ 'detail' : newCourseDetail });
    };

    //新增详情内容
    function addCourseDetailContent( detailContentInit ){
        let courseDetailContent = getFieldValue([detailContentInit]);
        if( !!courseDetailContent && courseDetailContent.length > 0 ){
            let maxItem = courseDetailContent[courseDetailContent.length - 1] || {};
            let maxKey = maxItem.c_key;
            courseDetailContent.push({
                c_key  : maxKey + 1,
                c_item : {}
            })
        } else {
            courseDetailContent.push({
                c_key  : 0,
                c_item : {}
            })
        };
        setFieldsValue({ [detailContentInit] : courseDetailContent })
    };
    //删除详情内容
    function deleteCourseDetailContent( detailContentInit, removeKey ){
        let courseDetailContent = getFieldValue([detailContentInit]);
        let newCourseDetailContent = [];
        courseDetailContent && courseDetailContent.length > 0 && courseDetailContent.map(function(item, index){
            if( removeKey != item.c_key ){
                newCourseDetailContent.push( item );
            };
        })
        setFieldsValue({[detailContentInit] : newCourseDetailContent });
    };

    let objCourseDetail = [];
    if( !!courseInfo.detailContent ){
        let initCourseDetail = JSON.parse( courseInfo.detailContent ) || [{}];
        initCourseDetail && initCourseDetail.length >0 && initCourseDetail.map(function( item, index ){
            objCourseDetail.push({
                key  : index,
                item : item,
            })
        })
    } else{
        objCourseDetail.push({
            key  : 0,
            item : {},
        })
    };

    getFieldDecorator('detail',{
        initialValue : objCourseDetail,
        rules : []
    });

    let courseDetail = getFieldValue('detail');
    let courseDetailComponents = [];
    courseDetail && courseDetail.length > 0 && courseDetail.map(function(item, index){
        let objCourseDetailContent = [];
        let courseDetailContent = item.item.content || [{}];
        let detailContentInit = 'detailContent_' + item.key;
        courseDetailContent && courseDetailContent.length > 0 && courseDetailContent.map(function(item, index){
            objCourseDetailContent.push({
                c_key  : index,
                c_item : item,
            })
        });
        getFieldDecorator( [detailContentInit], {
            initialValue : objCourseDetailContent,
            rules : []
        });
        let courseDetailContentComponents = [];
        let detailContent = getFieldValue([detailContentInit]);
        detailContent && detailContent.length > 0 && detailContent.map(function(d_item, d_index){
            let canPlus = detailContent.length - 1 == d_index && detailContent.length < 10;
            let canRemove = detailContent.length !== 1;
            courseDetailContentComponents.push(
                <div key = { 'courseDetailContent_' + item.key + '_' + d_item.c_key }>
                   <FormItem
                        { ...formItemLayoutWithoutLabel }
                        label = ''
                    >
                        { getFieldDecorator([ 'detailContent_' + item.key + '_' + d_item.c_key ],{
                            initialValue : d_item.c_item.contentDetail || '',
                            rules : [
                                { validator : checkDetailContent, whitespace : true }
                            ]
                        })(
                            <Input type = 'textarea' size = 'default' style = {{ width : '92%' }} placeholder = '填写详细内容' />
                        )}
                       <div style = {{ display : 'inline-block', height : '50px' }} >
                           { !!canRemove && !canPlus ?
                                <Icon
                                    onClick = { () => deleteCourseDetailContent ( detailContentInit, d_item.c_key )}
                                    style = {{ position : 'absolute', cursor : 'pointer', fontSize : '20px' , top : 'calc(50% - 10px + 2px)' , right : 0 }}
                                    type  = "minus-circle-o"
                                />
                               :
                             !canRemove && !!canPlus ?
                               <Icon
                                    onClick = { () => addCourseDetailContent( detailContentInit ) }
                                    style = {{ position : 'absolute', cursor : 'pointer', fontSize : '20px' , top : 'calc(50% - 10px + 2px)' , right : 0 }}
                                    type  = "plus-circle-o"
                                />
                               :
                             !!canRemove && !!canPlus ?
                               <div>
                                   <Icon
                                        onClick = { () => deleteCourseDetailContent ( detailContentInit, d_item.c_key )}
                                        style = {{ position : 'absolute', cursor : 'pointer', fontSize : '20px' , top : '10px' , right : 0 }}
                                        type  = "minus-circle-o"
                                    />
                                   <Icon
                                        onClick = { () => addCourseDetailContent( detailContentInit ) }
                                        style = {{ position : 'absolute', cursor : 'pointer', fontSize : '20px' , bottom : '2px' , right : 0 }}
                                        type  = "plus-circle-o"
                                    />
                                </div>
                               :
                               null
                           }
                       </div>
                    </FormItem>
                </div>
            )
        });
        let canRemoveDetail = courseDetail.length !== 0;
        let speFormItemLayout = index == 0 ? formItemLayout : formItemLayoutWithoutLabel;
        courseDetailComponents.push(
            <div className = 'courseDetail' key = { 'courseDetail_' + item.key } >
                <FormItem
                    { ...speFormItemLayout }
                    label = { index == 0 ? '详情内容' : '' }
                >
                    { getFieldDecorator([ 'detailTitle_' + item.key ], {
                        initialValue : item.item.title || '',
                        rules : [
                            { required : true, validator : checkDetailTitle, whitespace : true }
                        ]
                    })(
                        <Input style = {{ width : '100%' }} size = 'default' placeholder = '请输入标题' />
                    )}
                </FormItem>
                { courseDetailContentComponents }
                { !!canRemoveDetail &&
                    <FormItem
                        { ...formItemLayoutWithoutLabel }
                        label = ''
                    >

                            <Button type = 'primary' onClick = { () => deleteCourseDetail( item.key ) } style = {{ marginBottom : '15px' }} size = 'small' >删除</Button>
                    </FormItem>
                }
            </div>
        )
    })

    //得到配置项参数
    function wxCourseRender(){
        let values = {};
        if( !!id && !getFieldValue('name') ){
            values = courseInfo;
        }else {
            values = getFieldsValue();
            //values.adAge = values.adAge && values.adAge.join(',');
            values.courseType = values.courseType && values.courseType.join(',');
        }
        let detailCover, courseType, adAge;
        if ( values.detailPic && values.detailPic.length > 0){
            if( !!id && !getFieldValue('name') ){
                detailCover = values.detailPic.split(',')[0];
            }else{
                let detail_item = values.detailPic[0];
                let detail_item_res = detail_item.response;
                if ( detail_item_res && detail_item_res.errorCode == 9000 ){
                    detailCover = detail_item_res.data.url;
                } else {
                    detailCover = detail_item.url || '';
                }
            }
        };
        let detail = values.detail;
        let courseContent = [];
        if( !!detail ){
            detail && detail.map(function(item,index){
                let key = item.key;
                let detailTitle = getFieldValue(['detailTitle_' + key]);
                let detailContent = getFieldValue(['detailContent_' + key]);
                courseContent.push({
                    title : detailTitle,
                    content : []
                })
                detailContent && detailContent.map(function( d_item, d_index ){
                    let detailContentKey = d_item.c_key;
                    courseContent[index].content.push({
                        contentDetail : getFieldValue(['detailContent_' + key + '_' + detailContentKey ])
                    });
                })
            });
        }
        let detailContent = values.detailContent && JSON.parse( values.detailContent );
        let params = {
            detailCover,
            courseContent : detailContent || courseContent,
            name          : values.name,
            courseType    : values.courseType,
            adAge         : values.adAge,
            perTime       : values.perTime,
            dict,
        }
        return params;
    };

    let isCreate = false;
    if (Object.keys(courseInfo).length > 0) {
        if (courseInfo.isHq) {
            isCreate = false;
        } else {
            isCreate = true;
        }
    } else {
        isCreate = isCreate;
    }

	return(
       <Modal
            className = "yhwu_wx_activity_model"
            visible   = { wxCourseCreateVisible }
            title     = '课程信息'
            maskClosable = { false }
            width     = '950px'
            onCancel  = { cancelAddWxCourse }
            afterClose = { afterClose }
            footer    = {[
				<Button key = "cancelAddClassPackage"  onClick = { cancelAddWxCourse } >取消</Button>,
                <Button key="confirmAddClassPackage" type="primary" disabled={isCreate}  onClick = { confirmAddWxCourseAction } >保存</Button>
			]}
        >
            <WxCourseCreateFormRender courseRenderParams = { wxCourseRender() } />
            <div className = 'design_page' >
                <div className = 'design_page_base' >
                    <span>基本信息</span>
                </div>
                <Form>
                    <FormItem
                        { ...formItemLayout }
                        label = '课程名称'
                    >
                        { getFieldDecorator('name', {
                            initialValue : courseInfo.name || '',
                            rules : [
                                { required : true, message : '请输入课程名称', whitespace: true },
                                { validator : checkCourseTitle }
                            ]
                        })(
                            <Input size = 'default' style = {{ width : '100%' }} placeholder = '请输入课程名称, 限20字' />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout}
                        label = "课程封面"
                        help = "课程首图, 支持png、jpeg、gif格式的图片, 建议宽高 350*350px; 图片大小小于2M"
                    >
                        { getFieldDecorator('courseCover', {
                            initialValue  : initCourseCover || [],
                            valuePropName : 'fileList',
                            // action        : `${BASE_URL}/uploadController/upload`,
                            action        : '/thinknode/upload/image',
                            normalize     : normFile,
                            rules         : [
                                { required : true, type : 'array', message : '请上传课程封面' }
                            ]
                        })(
                            <Upload
                                // action = { BASE_URL + '/uploadController/upload' }
                                action='/thinknode/upload/image'
                                listType = "picture-card"
                                beforeUpload = {( file , fileList ) => imgMaxSize( file , fileList , 2 , '课程封面')}
                            >
                                { getFieldValue('courseCover') && getFieldValue('courseCover').length >= 1 ?  null : uploadButton }
                            </Upload>
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout}
                        label = "详情图片"
                        help = "课程详情图, 最多5张; 支持png、jpeg、gif格式的图片, 建议宽高 750*400px; 图片大小小于2M"
                    >
                        { getFieldDecorator('detailPic', {
                            initialValue  : initDetailPic || [],
                            valuePropName : 'fileList',
                            // action        : `${BASE_URL}/uploadController/upload`,
                            action : '/thinknode/upload/image',
                            normalize     : normFile,
                            rules         : [
                                { required : true, type : 'array' , message : '请上传详情图片' }
                            ]
                        })(
                            <Upload
                                // action = { BASE_URL + '/uploadController/upload' }
                                action='/thinknode/upload/image'
                                listType = "picture-card"
                                beforeUpload = {( file , fileList ) => imgMaxSize( file , fileList , 2 , '详情图片')}
                            >
                                { getFieldValue('detailPic') && getFieldValue('detailPic').length >= 5 ?  null : uploadButton }
                            </Upload>
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label = '排序值'
                    >
                        { getFieldDecorator('sort',{
                            initialValue : courseInfo.sort || '',
                            rules : [

                            ]
                        })(
                            <InputNumber min = { 0 } max = { 9999 } size = 'default' style = {{ width : '100%' }} placeholder = '设置为0~9999中某个数字, 用户浏览列表是排序值大的在前' />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label = "开课校区"
                    >
                        <span style = {{ 'color' : '#5D9CEC', 'marginRight' : '10px' }}>{ selectOrgs && selectOrgs.length || '0' }校区</span>
                         { getFieldDecorator('orgIds',{
                            initialValue : courseInfo.orgIds || '',
                            rules : [
                                { required : true , message : '请选择校区' }
                            ]
                        })(
                            <Button type="primary" size="small" onClick={onOpenSelectOrgModal} >{modifyCourse ? '查看校区' : '选择校区'}</Button>
                        )}
                    </FormItem>
                </Form>
                <div className = 'design_page_base' >
                    <span>课程详情</span>
                </div>
                <Form>
                    <FormItem
                        { ...formItemLayout }
                        label = '课程类型'
                    >
						          { getFieldDecorator('courseType',{
                            initialValue :  courseInfo.courseType && courseInfo.courseType.split(',') || [],
                            rules : [
                                { required : true, message : '请选择类型' }
                            ]
                        })(
                            <CheckboxGroup options = { dict && dict.organcategory } />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label = '适合年龄'
                    >
                          { getFieldDecorator('adAge',{
                            initialValue : courseInfo.adAge && courseInfo.adAge || '',
                            rules : [
                                { type: 'string', required: true, message: '请填写适合年龄,限40字', whitespace: true, max: 40, },
                            ]
                        })(
                              <Input size='default' placeholder='请填写适合年龄,限40字' />
                        )}
                    </FormItem>
					<FormItem
							{ ...formItemLayout }
							label = '每节时长'
						>

							{ getFieldDecorator('perTime', {
								initialValue : courseInfo.perTime || '',
								rules : [
                                    { required : true, message : '请输入每节时长' }
								]
							})(
								<InputNumber min = { 0 } max = { 9999 } size = 'default' style = {{ width : '100%' }} placeholder = '请输入每节时长/单位分钟' />
							)}
					</FormItem>
                    { courseDetailComponents }
                    {
                        courseDetail && courseDetail.length < 10 &&
                        <FormItem
                            { ...formItemLayoutWithoutLabel }
                            label = ''
                        >
                            <Button style = {{ width : '100%' }} type = 'primary' onClick = { addCourseDetail } >
                                <Icon type = 'plus' />新增详情
                            </Button>
                        </FormItem>
                    }
                </Form>
            </div>
            <TenantOrgSelect { ...tenantOrgSelectProps } />
        </Modal>
	)
};

export default Form.create({})(WxCourseCreateForm);
