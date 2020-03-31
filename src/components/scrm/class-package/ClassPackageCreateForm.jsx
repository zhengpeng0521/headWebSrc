import React from 'react';
import { Form, Modal, Button, Popconfirm, Icon, Select, Upload, Input, message, Radio } from 'antd';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import TreeOrgCheckSelect from '../../common/new-component/tree-org-check-select/TreeOrgCheckSelect';
import QueueAnim from 'rc-queue-anim';
import style from './ClassPackageCreateForm.less';
let Option = Select.Option;
let FormItem = Form.Item;
let RadioGroup = Radio.Group;

function ClassPackageCreateForm({
    createClassPackageVisible,
    orgIdList,

    confirmAddClassPackage,
    cancelAddClassPackage,

    selectOrgId,

    classHourInfo,
    courseOptList,

    selectedCourseIds,
    signleClassPackageInfo,

    TenantSelectOnSelect,

    courseNameList,
    selectedCourse,

    classPackageId,
    createOrgId,

	orgKind,

	classPackageBtnLoading,

    OpenCloseChooseMgrOrgModal,         //打开选择管辖校区modal
    AfterSelectCampusModalSubmit,       //添加校区选择完毕点击保存
    selectCampusModalVisible,           //选择校区modal是否显示
    selectCampus,
    changeCtype,
    cType,
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

    //改变校区时清空所选课程
    function TenantSelectOnSelectAction( value ){
        let classHourInfoDevide = getFieldValue('classHourInfoDevide');
        classHourInfoDevide && classHourInfoDevide.map(function(item, index){
            let  courseId = 'courseId_' + item.key;
            setFieldsValue({ [ courseId ] : undefined });
        });
        if( !!value ){
            TenantSelectOnSelect( value );
        }
    };

    //校区下拉列表属性
    let tenantOrgSelectProps = {
        width        : 432,
        onSelect     : TenantSelectOnSelectAction,            //改变机构触发事件
        disabled     : !!classPackageId,
    };

    let formItemLayout = {
        labelCol : { span : 4 },
		wrapperCol : { span : 20 }
    }

    /*校区选择框属性*/
    let TreeOrgCheckSelectProps = {
        multiple : false,
        visible: selectCampusModalVisible,
        onClose: OpenCloseChooseMgrOrgModal,
        afterSubmit: AfterSelectCampusModalSubmit,                  /*校区选中后的回调*/
        init_org_select: selectCampus,
        disabled : false
    };

    //确认新增产品
    function confirmAddClassPackageAction(){
        validateFieldsAndScroll( (err, values) => {
            if( !!err ){
                return;
            }
            let params = [];
            let selectedCourseIds = [];
            let courseCountTotal = 0;
            let classHourInfo = values.classHourInfoDevide;
            if( getFieldValue('cType') == '2' ){
                classHourInfo.map(function(item,index){
                    params.push({
                        courseId : getFieldValue([ 'courseId_' + item.key ]).split('_')[0],
                        courseName : getFieldValue([ 'courseId_' + item.key ]).split('_')[1],
                        courseCount : getFieldValue([ 'courseCount_' + item.key ])
                    });
                    courseCountTotal += Number(getFieldValue([ 'courseCount_' + item.key ]));
                    selectedCourseIds.push(getFieldValue([ 'courseId_' + item.key ]))
                });
                let newSelectedCourseIds = [];
                for( let i = 0; i < selectedCourseIds.length; i++ ){
                    if( newSelectedCourseIds.indexOf( selectedCourseIds[i]) == -1 ){
                        newSelectedCourseIds.push( selectedCourseIds[i] )
                    } else {
                        message.error('不能选择相同的课程');
                        return;
                    }
                };
                if( Number(courseCountTotal) !== Number(getFieldValue('amount')) ){
                    message.error('分配课时数一定等于总课时数');
                    return;
                }
            };
            values.scope = JSON.stringify(params);
            values.type = '1';

            if((!!selectCampus && selectCampus.length==0) || selectCampus == null){
                message.error('请选择开设校区')
            }else if(!!selectCampus && selectCampus.length > 0 && selectCampus != null){
                values.orgIds = selectCampus.join(',');
//                console.info(values)
                confirmAddClassPackage( values );
                cancelAddClassPackageAction();
            }
        })
    };

    //取消新增产品
    function cancelAddClassPackageAction(){
        resetFields();
        cancelAddClassPackage();
    };

    //删除课时分配
    function removeClassHourDevide( removeKey ){
        let classHourInfoDevide = getFieldValue('classHourInfoDevide') || [];
        let newClassHourInfoDevide = [];
        classHourInfoDevide && classHourInfoDevide.length > 0 && classHourInfoDevide.map(function(item ,index){
            if( item.key != removeKey){
                newClassHourInfoDevide.push(item)
            }
        })
        setFieldsValue({ 'classHourInfoDevide' : newClassHourInfoDevide });
    };

    //新增课时分配
    function addClassHourDevide(){
        let classHourInfoDevide = getFieldValue('classHourInfoDevide') || [];
        if( classHourInfoDevide && classHourInfoDevide.length > 0 ){
            let length = classHourInfoDevide.length;
            let maxItem = classHourInfoDevide[ length - 1 ] || {};
            let maxKey = maxItem.key;
            classHourInfoDevide.push({
                key : maxKey + 1,
                c_item : {}
            });
        }else {
            classHourInfoDevide.push({
                key : 0,
                c_item : {},
            })
        }
        setFieldsValue({ classHourInfoDevide });
    };

    let objClassHourInfo = [];
    if( classHourInfo !== '*' ){
        let init_classHourInfo = classHourInfo != '' ? JSON.parse(classHourInfo) : [{}];
        init_classHourInfo && init_classHourInfo.length > 0 && init_classHourInfo.map(function(item, index){
            objClassHourInfo.push({
                key : index,
                c_item : item,
            })
        });
    }else {
        objClassHourInfo.push({
            key : 0,
            c_item : {}
        })
    };
    getFieldDecorator('classHourInfoDevide',{
        initialValue : objClassHourInfo,
        rules : [
        ]
    });

    let classHourInfoDevide = getFieldValue('classHourInfoDevide');

    function checkCourseNum(rule, value, callback) {
        if( value == '' || value == undefined || value == null ){
            callback();
        }else if (!/^[0-9]+(.[0-9]{1,2})?$/.test(value)) {
            callback(new Error('数字格式不正确'));
        }else {
            callback();
        }
    }
    
    function checkCourseCountNum(rule, value, callback) {
        console.log(rule, value, callback, '--------------')
        if( value == '' || value == undefined || value == null ){
            callback();
        }else if (!/^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,7}$/.test(value)) {
            callback(new Error('数字格式不正确'));
        }else {
            callback();
        }
    }

    return(
       <Modal
            className = "zj_class_package_create_form"
            visible = { createClassPackageVisible }
            title = '产品信息'
            maskClosable = { false }
            width = '550px'
            onCancel = { cancelAddClassPackageAction }
            footer = {[
				<Button key = "cancelAddClassPackage"  onClick = { cancelAddClassPackageAction } >取消</Button>,
				<Button
					key = "confirmAddClassPackage"
					type = "primary"
					onClick = { confirmAddClassPackageAction }
					loading = { classPackageBtnLoading }
					disabled = { classPackageBtnLoading }
                    style = {{ marginLeft : 20 }}
				>保存</Button>
			]}
        >
            <Form>
                { !!createClassPackageVisible &&
                    <FormItem
                        label = "所属校区"
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('orgIds',{
                        })(
                            <div>
                                <Button size = 'small' type = 'primary' onClick = { OpenCloseChooseMgrOrgModal } style = {{ marginRight : 10 }}>
                                   选择校区
                                </Button>
                                <a onClick = { OpenCloseChooseMgrOrgModal }>已选{ selectCampus && selectCampus.length > 0 ? selectCampus.length : 0 }家</a>
                            </div>
                        )}
                    </FormItem>
                }
                <FormItem
                    label = "产品名称"
                    { ...formItemLayout }
                >
                    { getFieldDecorator('name',{
                        initialValue : signleClassPackageInfo.name || '',
                        rules : [
                            { required : true, message : '请输入产品名称', whitespace: true }
                        ]
                    })(
                        <Input size = 'default' placeholder = '请输入产品名称' />
                    )}
                </FormItem>
                <FormItem
                    label = "课时数量"
                    help = '正数，可精确到小数点后2位'
                    { ...formItemLayout }
                >
                    { getFieldDecorator('amount',{
                        initialValue : ( signleClassPackageInfo.amount === 0 ? '0' : !signleClassPackageInfo.amount ? '' : signleClassPackageInfo.amount + '') ,
                        rules : [
                            { required : true, message : '请输入课时数量', whitespace: true },
                            { validator :  checkCourseCountNum },
                        ]
                    })(
                        <Input size = 'default' placeholder = '请输入课时数量' />
                    )}
                </FormItem>
                <FormItem
					style = {{ lineHeight : '32px' }}
                    label = "课时类型"
                    { ...formItemLayout }
                >
                    { getFieldDecorator('cType',{
                        initialValue :  signleClassPackageInfo.cType || '1',
                        rules : [
                            { required : true, message : '请选择课时类型.' }
                        ]
                    })(

                        <RadioGroup style = {{ width : '390px'}} >
							<Radio value = '1' >通用课时 : 机构下所有课程都可以使用</Radio>
							<Radio value = '2' >专用课时 : 需要制定某个课程使用这种课时(需先在课程管理中新建课程)</Radio>
						</RadioGroup>
                    )}
                </FormItem>
            </Form>
            <QueueAnim
                    type={['top', 'top']}
                    ease={['easeOutQuart', 'easeInOutQuart']}
                    className="overview-content-item"
                    style={{width : '100%'}} >
                { !!getFieldValue('cType') && getFieldValue('cType') == 2 &&
                    <div key = 'classHourInfoDevideQueueAnim' >
                        { classHourInfoDevide && classHourInfoDevide.length > 0 && classHourInfoDevide.map(function(item, index){
                            let classHourFormItemLayout = {
                                labelCol   : { span : 10 },
                                wrapperCol : { span : 14 }
                            }
                            let canRemove = classHourInfoDevide.length !== 1;
                            return(
                                <Form className = { style.classHour_devide } key = { 'classHourInfoDevide_' + item.key } inline >
                                    <FormItem
                                        { ...classHourFormItemLayout }
                                        label = '分配课时'
                                        style = {{ width : '260px' }}
                                    >
                                        { getFieldDecorator('courseId_' + item.key,{
                                            initialValue : item.c_item.courseId && item.c_item.courseName && item.c_item.courseId + '_' + item.c_item.courseName || undefined,
                                            rules : [
                                                { required : true, message : '请选择课程' }
                                            ]
                                        })(
                                            <Select
                                                showSearch
                                                allowClear
                                                size = 'default'
                                                placeholder = "请选择课程"
                                            >
                                               { courseOptList && courseOptList.map(function(item, index){
                                                    return ( <Option key = { 'courseOptList_' + index } value = { item.id + '_' + item.title } >{ item.title }</Option> )
                                                }) }
                                            </Select>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        help = '正数, 可精确到小数点后2位'
                                        >
                                        { getFieldDecorator('courseCount_' + item.key,{
                                            initialValue : item.c_item.courseCount || '',
                                            rules : [
                                                { required : true, message : '请输入课时数', whitespace: true },
                                                { validator :  checkCourseNum }
                                            ]
                                        })(
                                            <Input size = 'default' placeholder = '请输入课时数' style = {{ width : '210px' }} />
                                        )}

                                        {!!canRemove &&
                                          <Icon
                                              style = {{ marginLeft : '10px' , cursor : 'pointer', fontSize : '18px' }}
                                              type  = "minus-circle-o"
                                              onClick = { () => removeClassHourDevide( item.key ) }
                                          />
                                        }
                                    </FormItem>
                                </Form>
                            )
                        }) }
                    </div>
                }
            </QueueAnim>
            <Form>
                { getFieldValue('cType') == '2' ?
                    <FormItem
                        wrapperCol = {{ offset : 5, span : 16 }}
                    >
                        <Button type = "dashed" onClick = { addClassHourDevide } style = {{ width : '346px' }} >
                            <Icon type="plus" />添加
                        </Button>
                    </FormItem>
                    : null
                }
                <FormItem
                    label = "产品描述"
                    { ...formItemLayout }
                >
                    { getFieldDecorator('intro',{
                        initialValue : signleClassPackageInfo.intro || '',
                        rules : [
                        ]
                    })(
                        <Input  size = 'default' type = 'textarea' placeholder = '请输入产品描述' autosize = {{ minRows : 3 , maxRows : 4 }}/>
                    )}
                </FormItem>
                <FormItem
                    label = "原价"
                    { ...formItemLayout }
					help = '可精确到小数点后2位'
                >
                    { getFieldDecorator('price',{
                        initialValue : ( signleClassPackageInfo.price === 0 ? '0' : !signleClassPackageInfo.price ? '' : signleClassPackageInfo.price + '' ),
                        rules : [
                            { required : true, message : '请输入原价', whitespace: true},
							{ validator :  checkCourseNum }
                        ]
                    })(
                        <Input size = 'default' placeholder = '请输入原价' />
                    )}
                </FormItem>
                <FormItem
                    label = "售卖价"
                    { ...formItemLayout }
					help = '可精确到小数点后2位'
                >
                    { getFieldDecorator('realPrice',{
                        initialValue : ( signleClassPackageInfo.realPrice === 0 ? '0' : !signleClassPackageInfo.realPrice ? '' : signleClassPackageInfo.realPrice + '' ),
                        rules : [
                            { required : true, message : '请输入售卖价', whitespace: true},
							{ validator :  checkCourseNum }
                        ]
                    })(
                        <Input size = 'default' placeholder = '请输入售卖价' />
                    )}
                </FormItem>
                <FormItem
                    label = "状态"
                    { ...formItemLayout }
                >
                    { getFieldDecorator('status',{
                        initialValue : signleClassPackageInfo.status || '1',
                        rules : [
                            { required : true, message : '请选择状态' }
                        ]
                    })(
                        <Select
                            size = 'default'
                            allowClear
                            placeholder = '请选择状态'
                        >
                            <Option value = '1' >上架</Option>
                            <Option value = '2' >下架</Option>
                        </Select>
                    )}
                </FormItem>
            </Form>
            <TreeOrgCheckSelect {...TreeOrgCheckSelectProps}/>
        </Modal>
	)
};

function mapPropsToFields(props) {
    return (
        {
            cType  : { value : props.cType },
        }
    )
}

export default Form.create({mapPropsToFields})(ClassPackageCreateForm);
