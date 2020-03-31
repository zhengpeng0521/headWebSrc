import React from 'react';
import QueueAnim from 'rc-queue-anim';
import style from './StudentTransModal.less';
import { Button , Modal , Form , Input , Select , Upload , Icon , Radio , DatePicker,Row, Col ,message, Checkbox} from 'antd';
import moment from 'moment';
let FormItem = Form.Item;
let Option = Select.Option;
let RadioGroup = Radio.Group;

function StudentManageTranslateModal({
    translateModalVisible,
    sellerList,
    selectedRows,

    confirmTranslate,
    cancelTranslate,
    studentDetailInfo,

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

    //确认转移
    function confirmTranslateAction(){
        validateFieldsAndScroll((err, values) => {
            if ( !!err ){
                return;
            }
            confirmTranslate(values);
            cancelTranslateAction();
        });
    };

    //取消转移
    function cancelTranslateAction(){
        resetFields();
        cancelTranslate();
    };

    var arr = [];
    if (selectedRows &&  selectedRows.length > 0) {
        arr.push(   <div key ='1' className = { style.translate_head }>
            <span>将</span>
            { selectedRows.length || '0' }
            <span>名学员 分配给</span>
        </div>);
    }else {
        arr.push(   <div key ='2' className = { style.translate_head }>
            <span>学员:</span>
            {studentDetailInfo.name }
            <span>转给哪位销售</span>
        </div>);
    }


    return (
        <Modal
            className = "zj_student_translate_modal"
            title = "转给他人"
            visible = { translateModalVisible }
            width = '550px'
            onCancel = { cancelTranslateAction }
            maskClosable = { false }
            footer = {[
                <Button key = "confirmStudent" type = "primary" onClick = { confirmTranslateAction } >确定</Button>
            ]}
        >
            <Form>
                { arr }
                <FormItem>
                    { getFieldDecorator('seller',{
//						initialValue : studentInfo.orgId || '',
                        rules : [
                            { required : true , message : '请选择要分配的对象' }
                        ]
                    })(
                        <Select
                            style = {{ marginBottom : 6 }}
                            size = 'default'
                            showSearch
                            optionFilterProp="children"
                            placeholder = '请选择分配对象'
                            notFoundContent = { '没有分配对象' }
                        >
                            {
                                sellerList && sellerList.map(function( item, index ){
                                    return ( <Option key = { 'translateId_' + item.key } value = { item.id + '' } >{ item.name }</Option> )
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                <div className={style.info_cont}>
                    <div className={style.info_text}>分配学员时，以下信息也会同时交接</div>
                    <Checkbox checked={true} className={style.info_check}>学员家长</Checkbox>
                    <Checkbox checked={true} className={style.info_check}>学员的退款单</Checkbox>
                </div>
            </Form>
        </Modal>
    )
}

export default Form.create({})(StudentManageTranslateModal);
