import React from 'react';
import styles from './PrintSmallTicket.less';
import { Modal , Spin , Form , Select , DatePicker , Input , Rate , Checkbox , Button , Icon , message } from 'antd';
import { StatusFlag , BlockHelp , StatusLegend } from '../../common/new-component/NewComponent';
import { lodopPrintAttendance } from '../../../utils/lodopPrintUtils';
import moment from 'moment';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const formItemLayoutTeacher = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
const formItemLayoutCommon = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
}
const formItemLayoutCheckbox = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
}

function PrintSmallTicket({
    teacherDetail,                          //主教和助教信息
    printSmallTicketVisible,                //补打小票modal是否显示
    printSmallTicketLoading,                //补打小票modal加载状态
    printSmallTicketButtonLoading,          //按钮加载状态
    printSmallTicketData,                   //打印小票获取到的数据

    ClosePrintSmallTicketModal,             //补打小票modal关闭
    form: {
        getFieldDecorator,
        getFieldValue,
        getFieldsValue,
        setFieldsValue,
        validateFields,
        resetFields,
        validateFieldsAndScroll,
    }
}) {

    //渲染主教和助教下拉列表
    let teacher = [];
    if(teacherDetail && teacherDetail.length){
        teacher = teacherDetail.map((item,index) => {
            return(
                <Option key = { index } value = { item.userId + '' }>{ item.userName }</Option>
            );
        })
    }

    //checkbox内容格式化
    function formatCheckbox(stuArr,type,returnArr){
        //sign_type: 1.预约 2.排队, 3出勤, 4请假 5.旷课,6.取消 (3的时候才可以选择补打小票)
        if(stuArr && stuArr.length > 0){
            stuArr.map((item,index) => {
                if(type != '试听'){
                    returnArr.push({
                        label : <div className = { styles.checkbox_item }>
                                    <div>
                                        <span>{ item.stuName }：</span>
                                        <StatusFlag type = { type == '补课' ? 'green' : 'blue' }>{ type }</StatusFlag>
                                    </div>
                                    { item.sign_type == '3' ?
                                        <StatusLegend iconType = 'check' iconStyle = {{ color : '#88c70a' }}/>
                                        :
                                        <StatusLegend iconType = 'cross' iconStyle = {{ color : '#ff7f75' }}/>
                                    }
                                </div>,
                        value : item.id,
                        disabled : item.sign_type == '3' ? false : true,
                        object : item,          //如若需要打印，则去此对象中的信息去打印
                    })
                }else{
                    returnArr.push({
                        label : <div className = { styles.checkbox_item }>
                                    <div>
                                        <span>{ item.name }：</span><StatusFlag type = 'yellow'>试听</StatusFlag>
                                    </div>
                                    <StatusLegend iconType = 'cross' iconStyle = {{ color : '#ff7f75' }}/>
                                </div>,
                        value : item.id,
                        disabled : true,
                        object : item
                    })
                }
            })
        }
        return returnArr;
    }
    let checkboxGroup = [];
    let { stuArr , mulStuArr , tryStuArr } = printSmallTicketData;
    checkboxGroup = formatCheckbox(stuArr,'上课',checkboxGroup);
    checkboxGroup = formatCheckbox(mulStuArr,'补课',checkboxGroup);
    checkboxGroup = formatCheckbox(tryStuArr,'试听',checkboxGroup);

    //点击全选
    function ClickChooseAll(flag){
        let checkbox = [];
        if(!!flag){
            checkboxGroup.map((item,index) => {
                //只有出勤状态才可以选中，生成复选框的时候已经做出判断，现在只需要针对disabled判断即可
                if(!item.disabled){ checkbox.push(item.value) }
            })
        }
        setFieldsValue({
            checkbox
        })
    }

    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if( !!errors ){
                return;
            }
            let printArr = [];
            let checkbox = values.checkbox;
            if(checkbox && checkbox.length > 0){
                checkbox.map((item,index) => {
                    for(let i in checkboxGroup){
                        if(item == checkboxGroup[i].value){
                            printArr.push(checkboxGroup[i].object);
                            break;
                        }
                    }
                });
            }else{
                return message.error('无学员信息可打印');
            }
            if(!!printArr && printArr.length > 0){
                let obj = { checkedConfArray : printSmallTicketData.checkedConfArray , content : [] }
                printArr.map((item,index) => {
                    obj.content.push(item);
                });
                lodopPrintAttendance(obj);
            }else{
                return message.error('无学员信息可打印');
            }
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        ClosePrintSmallTicketModal();
    }

    //模态框的属性
    let modalOpts = {
        title : '补办考勤小票',
        maskClosable : false,
        visible : printSmallTicketVisible,
        closable : true,
        width : 550,
        onOk : handleComplete,
        onCancel : handleCancel,
        footer : [
            <div key = 'stu_attendance_print_small_ticket'>
                <BlockHelp
                    className = { styles.block_help }
                    content = {
                        <div>
                            <div>1.学员只有处于出勤状态才可以补办考勤小票</div>
                            <div>2.处于试听、未出勤、旷课、请假、取消状态都无法补办小票</div>
                            <div>3.补办功能无时间限制，比如今天可以补办以前的小票</div>
                            <div>4.可多选进行打印，点击打印，可以把考勤小票打印出来</div>
                        </div>
                    }
                />
            </div>,
            <Button key="cancel" type="ghost" onClick={handleCancel}>取消</Button>,
            <Button key="submit" type="primary"
                    onClick={handleComplete}
                    disabled={printSmallTicketButtonLoading}
                    loading={printSmallTicketButtonLoading}
                    style={{marginLeft:20}}>打印</Button>
        ],
        className : 'zj_stu_attendance_print_small_ticket'
    };

    return (
        <Modal {...modalOpts}>
            <Spin spinning = { printSmallTicketLoading }>
                <Form className = { styles.all }>
                    <div className = { styles.teacher_area }>
                        <FormItem
                            label = "主教"
                            {...formItemLayoutTeacher}
                        >
                            {getFieldDecorator('mtids',{
                                initialValue : !!printSmallTicketData && !!printSmallTicketData.mtids ? printSmallTicketData.mtids.split(',') : []
                            })(
                                <Select
                                    mode = 'multiple'
                                    placeholder = '请选择主教'
                                    size = 'default'
                                    allowClear
                                    showSearch
                                    optionFilterProp = "children"
                                    notFoundContent = "未找到"
                                    disabled = { true }>
                                    { teacher || [] }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label = "助教"
                            {...formItemLayoutTeacher}
                        >
                            {getFieldDecorator('atids',{
                                initialValue : !!printSmallTicketData && !!printSmallTicketData.atids ? printSmallTicketData.atids.split(',') : []
                            })(
                                <Select
                                    mode = 'multiple'
                                    placeholder = '请选择助教'
                                    size = 'default'
                                    allowClear
                                    showSearch
                                    optionFilterProp = "children"
                                    notFoundContent = "未找到"
                                    disabled = { true }>
                                    { teacher || [] }
                                </Select>
                            )}
                        </FormItem>
                    </div>
                    <FormItem
                        label = "上课时间"
                        style = {{ paddingBottom : 15 , borderBottom : '1px solid #ddd' }}
                        {...formItemLayoutCommon}
                    >
                        {getFieldDecorator('studyTime',{
                            initialValue : printSmallTicketData && printSmallTicketData.startTime != null && printSmallTicketData.endTime != null ?
                            `${printSmallTicketData.startTime}~${printSmallTicketData.endTime}` : undefined
                        })(
                            <Input placeholder = '请填写上课时间' disabled = { true } size = 'default'/>
                        )}
                    </FormItem>
                    <div className = { styles.status_legend }>
                        <StatusLegend content = '出勤，可补办' iconType = 'check' iconStyle = {{ color : '#88c70a' }}/>
                        <StatusLegend content = '未考勤，无法补办' iconType = 'cross' iconStyle = {{ color : '#ff7f75' }} />
                    </div>
                    <Checkbox onChange = {(e) => ClickChooseAll(e.target.checked)} style = {{ marginBottom : 20 }}>全选</Checkbox>
                    <FormItem
                        label = ""
                        {...formItemLayoutCheckbox}
                    >
                        {getFieldDecorator('checkbox')(
                            <CheckboxGroup options = { checkboxGroup }/>
                        )}
                    </FormItem>
                </Form>
            </Spin>
        </Modal>
    );
}
export default Form.create()(PrintSmallTicket);
