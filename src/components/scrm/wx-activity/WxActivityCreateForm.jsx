import React from 'react';
import { Form, Modal, Button, Popconfirm, Icon, Select, Upload, Input, message, DatePicker, InputNumber, Radio } from 'antd';
import QueueAnim from 'rc-queue-anim';
import moment from 'moment';
import style from './WxActivityCreateForm.less';
import WxActivityCreateFormRender from './WxActivityCreateFormRender';
import TenantOrgSelect from '../../../pages/common/tenant-org-select/TenantOrgSelect';
const [ RangePicker, Option, FormItem, RadioGroup ]   = [ DatePicker.RangePicker, Select.Option, Form.Item, Radio.Group ];

function WxActivityCreateForm({

    id,
    modifyCourse,
    limitTime,
    wxActivityCreateVisible,
    activityInfo,                       //活动详情信息
    cancelAddWxActivity,
    confirmAddWxActivity,
    selectOrgs,
    onOpenSelectOrgModal,
    selectModalVisible,
    onSelectOrgModalClose,
    afterSelectOrgModal,
    changeActivityTime,
    isModify,
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

    let data = getFieldsValue();

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

    //关闭模态框后情况表单数据
    function afterClose(){
      resetFields();
    };

    //确认新增
    function confirmAddWxActivityAction(){        
        validateFieldsAndScroll( ( err, values ) => {
            if( !!err ){
                return;
            }
            let detail = values.detail;
            let activityContent = []
            detail && detail.map(function(item,index){
                let key = item.key;
                let detailTitle = getFieldValue(['detailTitle_' + key]);
                let detailContent = getFieldValue(['detailContent_' + key]);
                activityContent.push({
                    title : detailTitle,
                    content : []
                })
                detailContent && detailContent.map(function( d_item, d_index ){
                    let detailContentKey = d_item.c_key;
                    activityContent[index].content.push({
                        contentDetail : getFieldValue(['detailContent_' + key + '_' + detailContentKey ])
                    });
                })
            });
            values.activityContent = activityContent;
            confirmAddWxActivity( values );
        })
    };

    let formItemLayout = {
        labelCol   : { span : 4 },
		wrapperCol : { span : 20 }
    }

    let formItemLayoutWithoutLabel = {
        wrapperCol : { span: 20, offset: 4 },
    };

	let formItemLayout1 = {
		labelCol : { span : 9 },
		wrapperCol : { span : 15 }
    }
    
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

    //活动封面
    let initActivityCover = [];
    if( activityInfo && activityInfo.activityCover && activityInfo.activityCover.length > 0){
          initActivityCover.push({
              uid    : -1,
              url    : activityInfo.activityCover,
              status : 'done'
          })
    };
    //详情图片
    let initDetailPic = [];
    if( activityInfo &&  activityInfo.detailPic ){
        let initDetailPicArr = activityInfo.detailPic.split(',');
        initDetailPicArr && initDetailPicArr.map(function( item, index){
            initDetailPic.push({
                uid    : -index,
                url    : item,
                status : 'done'
            })
        })
    };

    //活动报名时间
    let initApplyTime = [];
    if ( activityInfo && activityInfo.applyStartTime && activityInfo.applyStartTime != ''){
        initApplyTime.push(moment(new Date( activityInfo.applyStartTime )))
    };
    if( activityInfo && activityInfo.applyEndTime && activityInfo.applyEndTime != '' ){
        initApplyTime.push(moment(new Date( activityInfo.applyEndTime )));
    }

    //活动时间
    let initActivityTime = [];
    if( activityInfo && activityInfo.activityStartTime && activityInfo.activityStartTime != ''){
        initActivityTime.push(moment(new Date( activityInfo.activityStartTime )));
    }
    if( activityInfo && activityInfo.activityEndTime && activityInfo.activityEndTime != ''){
        initActivityTime.push(moment(new Date( activityInfo.activityEndTime )));
    }

    //取消报名截止时间
    let initCancelTime;
    if( activityInfo && activityInfo.cancelTime && activityInfo.cancelTime != ''){
        initCancelTime = moment(new Date( activityInfo.cancelTime ))
    }
    
    //校验名称
    function checkActivityTitle( rule, value, callback ){
        if(!(/^[^\n]{1,20}$/.test(value))){
            callback('不能超过20个字符');
        }else {
            callback();
        }
    };

    //校验详情标题
    function checkDetailTitle( rule, value, callback ){
        if(!(/^[^\n]{1,15}$/.test(value))){
    		callback('字数限制为1~15');
    	}else if((/^[\s]{1,15}$/.test(value))){
			callback("不能为空格")
    	}else {
            callback();
    	}
    };

    //校验详情内容
    function checkDetailContent( rule, value, callback ){
        if(!(/^[^\n]{1,100}$/.test(value))){
    		callback('字数限制为1~100');
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
    if( !!activityInfo.courseDetail ){
        let initCourseDetail = JSON.parse( activityInfo.courseDetail ) || [{}];
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
    function wxActivityRender(){
        let values = {};
        if( !!id && !getFieldValue( 'name' ) ){
            values = activityInfo;
        }else {
            values = getFieldsValue();
        }
        let startTime, endTime, detailCover;
        if( !!values.activityTime && !!values.activityTime[0] ){
            startTime = values.activityTime[0].format('YYYY-MM-DD HH:mm:ss');
            endTime = values.activityTime[1].format('YYYY-MM-DD HH:mm:ss');
        };
        if ( values.detailPic && values.detailPic.length > 0 ){
            if( !!id && !getFieldValue('name') ){
                detailCover = values.detailPic.split(',')[0];
            }else{
                let activity_detail_item = values.detailPic[0];
                let activity_detail_item_res = activity_detail_item.response;
                if ( activity_detail_item_res && activity_detail_item_res.errorCode == 9000 ){
                    detailCover = activity_detail_item_res.data.url;
                } else {
                    detailCover = activity_detail_item.url || '';
                }
            }
        };
        let detail = values.detail;
        let activityContent = []
        if( !!detail ){
            detail && detail.map(function(item,index){
                let key = item.key;
                let detailTitle = getFieldValue(['detailTitle_' + key]);
                let detailContent = getFieldValue(['detailContent_' + key]);
                activityContent.push({
                    title : detailTitle,
                    content : []
                })
                detailContent && detailContent.map(function( d_item, d_index ){
                    let detailContentKey = d_item.c_key;
                    activityContent[index].content.push({
                        contentDetail : getFieldValue(['detailContent_' + key + '_' + detailContentKey ])
                    });
                })
            });
        }
        let content = values.courseDetail && JSON.parse( values.courseDetail )
        let params = {
            activityContent : content || activityContent,
            detailCover,
            startTime,
            endTime,
            name         : values.name,
            address      : values.address,
            number       : values.number,
            activityType : values.activityType,
            applyType    : values.applyType,
            targetPeople : values.targetPeople,
            classCus     : values.classCus,
            materialFee  : values.materialFee,

        }
        return params;
    };

    function changeActivityTimeAction( moment, date ){
        changeActivityTime( date[0] )
    };

    let isCreate = false;
    if (Object.keys(activityInfo).length > 0) {
        if (activityInfo.isHq) {
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
            visible   = { wxActivityCreateVisible }
            title     = '活动信息'
            maskClosable = { false }
            width     = '950px'
            onCancel  = { cancelAddWxActivity }
            afterClose = { afterClose }
            footer    = {[
                        <Button key = "cancelAddClassPackage"  onClick = { cancelAddWxActivity } >取消</Button>,
                        <Button key="confirmAddClassPackage" type="primary" disabled={isCreate} onClick = { confirmAddWxActivityAction } >保存</Button>
                      ]}
        >
            <WxActivityCreateFormRender wxActivityRenderParams = { wxActivityRender() } />
            <div className = 'design_page' >
                <div className = 'design_page_base' >
                    <span>基本信息</span>
                </div>
                <Form>
                    <FormItem
                        { ...formItemLayout }
                        label = '活动名称'
                    >
                        { getFieldDecorator('name', {
                            initialValue : activityInfo.name || '',
                            rules : [
                                { required : true, message : '请输入活动名称', whitespace: true },
                                { validator : checkActivityTitle }
                            ]
                        })(
                            <Input size = 'default' style = {{ width : '100%' }} placeholder = '请输入活动名称, 限20字' />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout}
                        label = "活动封面"
                        help = "活动首图, 支持png、jpeg、gif格式的图片, 建议宽高 350*350px; 图片大小小于2M"
                    >
                        { getFieldDecorator('activityCover', {
                            initialValue  : initActivityCover || [],
                            valuePropName : 'fileList',
                            // action        : `${BASE_URL}/uploadController/upload`,
                            action        : '/thinknode/upload/image',
                            normalize     : normFile,
                            rules         : [
                                { required : true, message : '请上传活动封面' }
                            ]
                        })(
                            <Upload
                                // action = { BASE_URL + '/uploadController/upload' }
                                action='/thinknode/upload/image'
                                listType = "picture-card"
                                beforeUpload = {( file , fileList ) => imgMaxSize( file , fileList , 2 , '活动封面')}
                            >
                                { getFieldValue('activityCover') && getFieldValue('activityCover').length >= 1 ?  null : uploadButton }
                            </Upload>
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout}
                        label = "详情图片"
                        help = "活动详情图, 最多5张; 支持png、jpeg、gif格式的图片, 建议宽高 750*400px; 图片大小小于2M"
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
                            initialValue : activityInfo.sort || '',
                            rules : [

                            ]
                        })(
                            <InputNumber min = { 0 } max = { 9999 } size = 'default' style = {{ width : '100%' }} placeholder = '设置为0~9999中某个数字, 用户浏览列表是排序值大的在前' />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label = "开设校区"
                    >
                        <span style = {{ 'color' : '#5D9CEC', 'marginRight' : '10px' }}>{ selectOrgs && selectOrgs.length || '0' }校区</span>
                         { getFieldDecorator('orgIds',{
                            initialValue : activityInfo.orgIds || '',
                            rules : [
                                { required : true , message : '请选择校区' }
                            ]
                        })(
                            <Button type="primary" size="small" onClick={onOpenSelectOrgModal} >{isModify ? '查看校区' : '选择校区'}</Button>
                        )}
                    </FormItem>
                </Form>
                <div className = 'design_page_base' >
                    <span>活动详情</span>
                </div>
                <Form>
                    <FormItem
                        { ...formItemLayout }
                        label = '报名时间'
                        help = '允许用户报名的时间'
                    >
                        { getFieldDecorator('applyTime',{
                            initialValue : initApplyTime || undefined,
                            rules : [
                                { type : 'array', required : true, message : '请选择报名时间' }
                            ]
                        })(
                            <RangePicker style = {{ width : '100%' }} size = 'default' showTime format = "YYYY-MM-DD HH:mm" placeholder = {['开始时间', '结束时间']} />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label = '活动时间'
                    >
                        { getFieldDecorator('activityTime',{
                            initialValue : initActivityTime || undefined,
                            rules : [
                                { type : 'array', required : true, message : '请选择活动时间' }
                            ]
                        })(
                            <RangePicker style = {{ width : '100%' }} size = 'default' showTime format = "YYYY-MM-DD HH:mm" placeholder = {['开始时间', '结束时间']} onChange = { changeActivityTimeAction } />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label = '活动地点'
                    >
                        { getFieldDecorator('address',{
                            initialValue : activityInfo.address || '',
                            rules : [
                                { required : true, message : '请输入活动地址' }
                            ]
                        })(
                            <Input style = {{ width : '100%' }} size = 'default' placeholder = '请输入活动地址'  />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label = '活动人数'
						help = '必填项, 创建之后无法修改'
                    >
                        { getFieldDecorator('number', {
                            initialValue : activityInfo.number || '',
                            rules : [
                                { required : true, message : '请输入活动人数' }
                            ]
                        })(
                            <InputNumber disabled = { !!id } min = { 1 } style = {{ width : '100%' }} size = 'default' placeholder = '请输入活动人数' />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label = '活动类型'
						help = '必填项, 创建之后无法修改'
                    >
                        { getFieldDecorator('activityType',{
                            initialValue : activityInfo.activityType || undefined,
                            rules : [
                                { required : true, message : '请选择活动类型' }
                            ]
                        })(
                            <Select
                                size = 'default'
                                allowClear
                                placeholder = '请选择活动类型'
								disabled = { !!id }
                            >
                                <Option value = '1' >会员专属活动</Option>
                                <Option value = '2' >通用活动</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label = '报名缴费'
                    >
                        { getFieldDecorator('applyType',{
                            initialValue : activityInfo.applyType || undefined,
                            rules : [
                                { required : true, message : '请选择报名缴费类型' }
                            ]
                        })(
                            <Select
                                size = 'default'
                                allowClear
                                placeholder = '请选择报名缴费类型'
                            >
                                <Option value = '1' >消耗课时 + 物料费</Option>
                                <Option value = '2' >消耗课时</Option>
                                <Option value = '3' >物料费</Option>
                                <Option value = '4' >免费</Option>
                            </Select>
                        )}
                    </FormItem>
                    <QueueAnim
                        type={['top', 'top']}
                        ease={['easeOutQuart', 'easeInOutQuart']}
                        style={{ width : '100%' }}
                    >
                            { ( getFieldValue('applyType') == '1' || getFieldValue('applyType') == '2' ) &&
                                <FormItem
                                    key = 'apply_type_course'
                                    { ...formItemLayout }
                                    label = '消耗课时'
                                >
                                    { getFieldDecorator('classCus',{
                                        initialValue : activityInfo.classCus || '',
                                        rules : [
                                            { required : true, message : '请输入消耗课时' }
                                        ]
                                    })(
                                        <InputNumber min = { 1 } style = {{ width : '100%' }} size = 'default' placeholder = '请输入消耗课时数' />
                                    )}
                                </FormItem>
                            }
                    </QueueAnim>
                    <QueueAnim
                        type={['top', 'top']}
                        ease={['easeOutQuart', 'easeInOutQuart']}
                        style={{width : '100%'}}
                    >
                        { ( getFieldValue('applyType') == '1' || getFieldValue('applyType') == '3' ) &&
                                <FormItem
                                    key = 'apply_type_prize'
                                    { ...formItemLayout }
                                    label = '物料费'
                                >
                                    { getFieldDecorator('materialFee',{
                                        initialValue : activityInfo.materialFee || '',
                                        rules : [
                                            { required : true, message : '请输入物料费, 单位元' }
                                        ]
                                    })(
                                        <InputNumber min = { 1 } style = {{ width : '100%' }} size = 'default' placeholder = '请输入物料费, 单位元' />
                                    )}
                                </FormItem>

                            }
                    </QueueAnim>
                    <FormItem
                        { ...formItemLayout }
                        label = '活动对象'
                    >
                        { getFieldDecorator('targetPeople',{
                            initialValue : activityInfo.target || '',
                            rules : [
                                { required : true, message : '请输入活动对象' }
                            ]
                        })(
                            <Input style = {{ width : '100%' }} size = 'default' placeholder = '请输入活动对象'  />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label = '取消报名'
                    >
                        { getFieldDecorator('cancelTime',{
                            initialValue : initCancelTime || undefined,
                            rules : [
                                { type : 'object', message : '请选择活动时间' }
                            ]
                        })(
                            <DatePicker style = {{ width : '100%' }} size = 'default' showTime format = "YYYY-MM-DD HH:mm" placeholder = '允许用户取消报名的最晚时间' />
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
				<div className = 'design_page_base' >
                    <span>报名规则</span>
                </div>
				<Form>
					<FormItem
						{ ...formItemLayout1 }
						label = '是否允许用户自主标记学员'
					>
						{ getFieldDecorator('vipSet', {
							initialValue : activityInfo.vipSet || '1',
							rules : [
								{ required : true , message : '是否允许用户自主标记学员' }
							]
						})(
							<RadioGroup style = {{ width : '250px' }} >
								<Radio value = "1" >是</Radio>
								<Radio value = "0" >否</Radio>
							</RadioGroup>
						)}
					</FormItem>
				</Form>
                
                <Form>
                    <FormItem
                        { ...formItemLayout1 }
                        label='是否设置支付金额'
                    >
                        {getFieldDecorator('moneySet', {
                            initialValue: activityInfo.enablePay || '0',
                            rules: [
                                { required: true, message: '选择是否支付' }
                            ]
                        })(
                            <RadioGroup style={{ width: '250px' }} >
                                <Radio value="1" >是</Radio>
                                <Radio value="0" >否</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                </Form>
                {
                    getFieldValue('moneySet') == '1' ? 
                        <Form>
                            <FormItem
                                { ...formItemLayout1 }
                                label='支付金额'
                            >
                                {getFieldDecorator('moneyNumber', {
                                    initialValue: activityInfo.payAmount || 0.01,
                                    rules: [
                                        { required: true, message: '填写大于0的金额' },
                                    ]
                                })(
                                    <InputNumber step={0.01} min={0.01}  style={{ width: '90%' }} size='default' placeholder='请输大于0的金额' />
                                )}
                            </FormItem>
                        </Form>
                         : 
                         ''
                }
            </div>
            <TenantOrgSelect { ...tenantOrgSelectProps } />
        </Modal>
	)
};

export default Form.create({})(WxActivityCreateForm);
