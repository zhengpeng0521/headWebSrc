import React from 'react';
import { Form, Modal, Button, Popconfirm, Icon, Row, Col, Select, Upload, Input, Table  } from 'antd';
import style from './ToClassModalComponent.less';
let Option = Select.Option;
let FormItem = Form.Item;

function ToClassModalComponent({
    toClassModalVisible,
    step,

    courseList,
    resultCount,

    clickToClass,

    classOptionList,
    courseName,
    perNum,
    maxProgress,

    backToCourseList,
    confirmToClass,
    selectClass,

    closeToClassModal,

	form : {
		getFieldDecorator,
        validateFieldsAndScroll,
        validateFields,
        getFieldsValue,
        getFieldValue,
        getFieldError,
        setFieldsValue,
        resetFields,
	},
}){

    courseList && courseList.map(function( item, index ){
        item.key = index;
    });

    function confirmToClassAction(){
        validateFields( ( err, values ) => {
            if( err ){
                return;
            }
            confirmToClass( values )
        })
    };

    let columns = [
        {
            title     : '课程名称',
            dataIndex : 'courseName',
            key       : 'courseName',
            width     : '150px'
        },{
            title     : '剩余专用课时',
            dataIndex : 'specialKs',
            key       : 'specialKs',
            render    : ( text, record ) => (
                <span>
                    { text || '0' }
                </span>
            )
        },{
            title     : '剩余共用课时',
            dataIndex : 'globalKs',
            key       : 'globalKs',
            render    : ( text, record ) => (
                <span>
                    { text || '0' }
                </span>
            )
        },{
            title     : '班级数量',
            dataIndex : 'clsCount',
            key       : 'clsCount',
            render    : ( text, record ) => (
                <span>
                    { text || '0' }
                </span>
            )
        },{
            title     : '操作',
            dataIndex : 'operate',
            key       : 'operate',
            render    : (text, record) => (
                <span>
                    <a disabled = { record.specialKs && record.globalKs && ( Number(record.specialKs) + Number(record.globalKs) ) == 0 || !record.clsCount } onClick={ () => clickToClass(record.courseId)}>报班</a>
                </span>
            )
    }];

    let ClassListComponent = (
        <Table columns = { columns } size = { 'middle' } dataSource = { courseList } pagination = { false }  bordered />
    )

    let formItemLayout = {
        labelCol : { span : 4 },
		wrapperCol : { span : 20 }
    };

    let ToClassFormComponent = (
        <div>
            <Form>
                <FormItem
                    label = '报读课程'
                    { ...formItemLayout }
                    style = {{ lineHeight : '32px' }}
                >
                    { courseName || '' }
                </FormItem>
                <FormItem
                    label = '报读班级'
                    { ...formItemLayout }
                >
                    { getFieldDecorator('clsId',{
                        rules : [
                            { required : true, message : '请选择报读班级' }
                        ]
                    })(
                        <Select
                            notFoundContent = "未找到"
                            showSearch
                            allowClear
                            size = 'default'
                            placeholder = '请选择报读班级'
                            optionFilterProp = "children"
                            onSelect = { selectClass }
                        >
                            {
                                classOptionList && classOptionList.map(function( item, index ){
                                    return ( <Option key = { 'toClassOption_' + item.id } maxProgress = { item.maxProgress } value = { item.id } >{ item.name }</Option> )
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    label = '锁定课时'
                    { ...formItemLayout }

                >
                    { getFieldDecorator('cost',{
                        initialValue : Number(perNum) * Number( maxProgress ) && (Number(perNum) * Number( maxProgress )).toFixed(2)  || 0,
                        rules : [
                            { required : true, message : '必须输入课时数' }
                        ]
                    })(
                        <Input size = 'default'/>
                    )}
                </FormItem>
            </Form>
            <div className = { style.to_class_btnGroup }>
                <Button onClick = { backToCourseList } >返回</Button>
                <Button onClick = { confirmToClassAction } type = 'primary' style = {{ marginLeft : '10px' }} >确定</Button>
            </div>
        </div>
    )
	return(
       <Modal
            className = "yhwu_to_class_modal"
            visible = { toClassModalVisible }
            title = '报班'
            maskClosable = { false }
            width = '550px'
            onCancel = { closeToClassModal }
            footer = { null }
        >
            <div style = {{ marginRight : '10px' }}>
                {
                    step == '1'?
                        ClassListComponent
                    :
                    step == '2'?
                        ToClassFormComponent
                    :
                    null
                }
            </div>
        </Modal>

	)
};

export default Form.create({})(ToClassModalComponent);
