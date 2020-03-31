import React from 'react';
import styles from './Classroom.less';
import { Table, Icon, Button, Form, Select, Input, Row, Col, Modal, Popconfirm } from 'antd';
import QueueAnim from 'rc-queue-anim';
import TenantOrgFilter from '../../../pages/common/tenant-org-filter/TenantOrgFilter';

const FormItem = Form.Item;
let Option = Select.Option;
function classRoomAdd({
    loading,
    addFormVisible,
    formLoading,
    classroomEditCancel,    //关闭
    classroomAddOk ,       //保存

    modalAllDetailContent,  //详情数据

    classroomEditVisible,    //是否显示
    classRomeSelectOrgId,    //校区id
    formType,

    selectContent,
    selectChange,
    modalValue,             //每次改变下拉框获得名称
    modalValueId,             //每次改变下拉框获得名称

   //打开校区选择框
    selectOrgs,
    onOpenSelectOrgModal,
    selectModalVisible,     //校区选择框是否可见
    onSelectOrgModalClose,  //关闭校区选择框
    afterSelectOrgModal,
    form: {
        getFieldDecorator,
        validateFields,
        getFieldValue,
        getFieldsValue,
        resetFields,
        validateFieldsAndScroll,
        setFieldsValue,
    },
  }){
     /*校区选择框属性*/
    let tenantOrgSearchSelectProps = {
        width : 300,
    };

    let tenantOrgFormSelectProps = {
        width : 383,
    };
    const addFormItemLayout = {
		labelCol	: { span: 4 },
      	wrapperCol	: { span: 20 },
    };
    //关闭取消事件
    function classroomAddCancelBtn (){
        classroomEditCancel();
        resetFields();
    }
    //新增框保存按钮 up
    function classroomAddOkBtn (e) {
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
            values.id=modalAllDetailContent.id;
            values.orgId=modalAllDetailContent.orgId;
            classroomAddOk(values);
            resetFields();
        });
    }

    //    //表单校验
    function check(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(/^[\s]*$/.test(value)){
            callback(new Error('输入内容不能为空'));
        }else{
            callback();
        }
    }
    return(
          <Modal
                className = "zj_classroom_modal"
                title = "编辑教室"
                visible = { classroomEditVisible }
                width = '550px'
                onCancel = { classroomAddCancelBtn }
                maskClosable = { false }
                footer = {[
                    <Button key = "cancel" onClick = { classroomAddCancelBtn } >取消</Button>,
                    <Button key = "confirm" type = "primary" onClick = { classroomAddOkBtn } style = {{ marginLeft : 20 }}>保存</Button>,
                ]}
            >
                <Form>

                    <FormItem
                        label="教室名称"
                        {...addFormItemLayout}
                        style={{ lineHeight : '12px' }}
                    >
                      {getFieldDecorator('name', {
                            initialValue :modalAllDetailContent.name ||'',
                            rules : [
                                { required : true , message : '请输入教室名称'},{validator: check},
                            ]
                      })(
                        <Input placeholder="请输入教室名称" size='default'/>
                      )}
                    </FormItem>
                    <FormItem
                        label="大致方位"
                        {...addFormItemLayout}
                        style={{ lineHeight : '12px' }}
                    >
                      {getFieldDecorator('intro', {
                            initialValue :modalAllDetailContent.intro || undefined,
                      })(
                        <Input placeholder="请输入大致方位" size='default'/>
                      )}
                    </FormItem>

                </Form>
            </Modal>
    )
}
export default Form.create()(classRoomAdd);
