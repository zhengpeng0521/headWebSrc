import React from "react"
import {
    Form,
    Input,
    Modal,
    Button,
    Select,
    Spin,
    DatePicker,
    Table,
    Radio,
    message,
    TimePicker
} from "antd"
import moment from 'moment';
import style from './stuOrderModal.less';
import TenantOrgFilter from '../../../pages/common/tmk-org-select/TenantOrgFilter';
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const { MonthPicker } = DatePicker

const formItemLayout = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 19
    }
}

/*学员预约modal*/
const stuOrderModal = ({
    stuOrderModalVisible, //学员预约modal是否显示
    stuOrderModalLoading, //学员预约modal加载状态
    stuOrderModalButtonLoading, //学员预约modal按钮加载状态
    stuOrderModalCancel, // 取消
    stuOrderModalSubmit, // 确定
    orderTypeChange, // 预约类型change
    stuOrderData, // 学员预约表单数据
    dayList,                   //有课日期列表
 	courseList,                //课程下拉列表
 	courseDataSource,          //当日有课列表
	selectYearToDate,          //选择年月得到有课的日期
    selectDate,                //选择日期
    selectCouseandtimeAction, // 选择表格中的课程
    OnCourseListreset,
    OnCourseListAction,
    selectCourseTime, // 选中的课程
    selectModalVisible, // 校区选择框是否可见
    selectOrgs, // 机构选择- 选择的机构列表
    afterSelectOrgModal,
    onSelectOrgModalClose,
    recordItem,
    orgIdChange, // 机构选择change
    tryOrgId,  //试听校区
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        setFieldsValue,
        validateFieldsAndScroll
    }
}) => {
    function afterSelectOrgModalSubmit( org_select ){
        setFieldsValue({ 'orgId' : org_select.join(',') });
        afterSelectOrgModal(org_select);
    };
    //校区选择框属性
    let tenantOrgSelectProps = {
        visible    : selectModalVisible,
        onClose    : onSelectOrgModalClose,
        afterSubmit: afterSelectOrgModalSubmit,
        init_org_select: selectOrgs,
        width : 390,
    };
    function orderTypeOnChange(e) {
        setFieldsValue({ 'orgId' : '' });
        orderTypeChange(e)
    }
    /* 确定 */
    function handleComplete(e) {
        e.preventDefault()
        validateFieldsAndScroll((err, values) => {
            if(values.orderType == '1') {
                if ( !!err ){
                    return;
                };
                if(values.visitTime != '' && values.visitTime != null &&values.visitTime != undefined &&　!/^[\s]*$/.test(values.visitTime)){
                    values.visitTime = values.visitTime.format('YYYY-MM-DD HH:mm');
                }
                stuOrderModalSubmit( values );
				resetFields()
            }else if(values.orderType == '2') {
                if( selectCourseTime && selectCourseTime.startTime && selectCourseTime.endTime ){
                    if ( !!err ){
                        return;
                    };
                    if(values.year != '' && values.year != null &&values.year != undefined &&　!/^[\s]*$/.test(values.year)){
                        values.year = values.year.format('YYYY-MM');
                    }
                    var data = values;
                    data.selectCourseTime = selectCourseTime;
                    data.auditionTime = selectCourseTime.studyDate + ' ' +selectCourseTime.startTime ;
                    data.auditionEndTime = selectCourseTime.studyDate + ' ' + selectCourseTime.endTime ;
                    data.courseName = selectCourseTime.courseName
                    data.cpmId = selectCourseTime.cpmId
                    data.cpdId = selectCourseTime.cpdId
                    data.pcId = selectCourseTime.courseId
                    stuOrderModalSubmit( data, resetFields );
                }else{
                    message.warn( '请选择预约排课' );
                    return;
                }
            }
        })
    }
    /* 取消 */
    function handleCancel(e) {
        e.preventDefault()
        resetFields()
        stuOrderModalCancel()
    }

    /*检验是否只输入了空格*/
    function checkWetherSpace(rule, value, callback) {
        if (value == "" || value == undefined || value == null) {
            callback()
        } else if (/^[\s]*$/.test(value)) {
            callback(new Error("请输入跟进内容，限制30字"))
        } else {
            callback()
        }
    }
    /* 选择校区 -- 试听 */
    function orgIdChangeAction(val) {
        setFieldsValue({ 'year' : undefined });
        setFieldsValue({ 'studyDate' : undefined });
		setFieldsValue({ 'courseId' : undefined });
        orgIdChange(val)
    }
    /* 选择课程 */
    function handleSelectChange( value ) {
        OnCourseListreset();
		let time = getFieldValue('studyDate');
		OnCourseListAction( value, time )
    }
    //选择年月得到有课日期
	function selectYearToDateAction( date ){
		setFieldsValue({ 'studyDate' : undefined });
		setFieldsValue({ 'courseId' : undefined });
		let month = moment( date ).format('YYYY-MM');
		selectYearToDate( month )
	}
	//选择日期得到课程列表 以及课程信息
	function selectDateAction( value ){
		setFieldsValue({ 'courseId' : undefined });
		selectDate( value )
    }
    const rowSelection = {
        type : 'radio',
        onChange : ( selectedRowKeys, selectedRows ) => {
            var data = selectedRows[0];
            selectCouseandtimeAction(data);
        },
    };
	/* 禁止时间 */
    function disabledDate(current) {
        return current && current.valueOf() < Date.now() - 24 * 60 * 60 * 1000
    }
    //模态框的属性
    let modalOpts = {
        title: "学员预约",
        maskClosable: false,
        visible: stuOrderModalVisible,
        closable: true,
        width: 600,
        onOk: handleComplete,
        onCancel: handleCancel,
        footer: [
            <Button key="cancel" type="ghost" onClick={handleCancel}>
                取消
            </Button>,
            <Button
                key="submit"
                type="primary"
                onClick={handleComplete}
                disabled={stuOrderModalLoading}
                loading={stuOrderModalLoading}
                style={{ marginLeft: 20 }}>
                确定
            </Button>
        ],
        className: "stuOrder_modal"
    }
    return (
        <Modal {...modalOpts}>
            <Spin spinning={stuOrderModalLoading}>
                <Form>
                    <FormItem label="预约类型" {...formItemLayout}>
                        {getFieldDecorator("orderType", {
                            initialValue: stuOrderData.orderType || "1",
                            rules: [
                                { required: true, message: "请选择预约类型" }
                            ]
                        })(
                            <RadioGroup
                                onChange={e => orderTypeOnChange(e)}
                                style={{ marginTop: "6px" }}>
                                <Radio value="1">预约到访</Radio>
                                <Radio value="2">预约试听</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    {stuOrderData.orderType == "1" ? (
                        <div>
                            <FormItem label="选择校区" {...formItemLayout}>
                                {getFieldDecorator("orgId", {
                                    initialValue:
                                        stuOrderData.orgId || undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: "请选择校区"
                                        }
                                    ]
                                })(
                                    <TenantOrgFilter {...tenantOrgSelectProps}/>
                                )}
                            </FormItem>
                            <FormItem label="名单姓名" {...formItemLayout}>
                                {getFieldDecorator("stuName", {
                                    initialValue:
                                    recordItem.name || undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: "请选择名单姓名"
                                        }
                                    ]
                                })(<Input disabled />)}
                            </FormItem>
                            <FormItem {...formItemLayout} label="到访时间">
                                {getFieldDecorator("visitTime", {
                                    initialValue:
                                        stuOrderData.visitTime || undefined,
                                    rules: [{ required: true, type: "object" ,message:'请选择到访时间'}]
                                })(
                                    <DatePicker
                                        showTime
                                        disabledDate={disabledDate}
                                        size="default"
                                        style={{ width: "100%" }}
                                        format="YYYY-MM-DD HH:mm"
                                        placeholder="请选择到访时间"
                                    />
                                )}
                            </FormItem>
                            <FormItem label="到访内容" {...formItemLayout}>
                                {getFieldDecorator("content", {
                                    initialValue:
                                        stuOrderData.visitContent || undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: "请输入到访内容",
                                            max: 30
                                        },
                                        { validator: checkWetherSpace }
                                    ]
                                })(
                                    <Input
                                        type="textarea"
                                        placeholder="请输入跟进内容，限制30字"
                                        autosize={{ minRows: 3, maxRows: 3 }}
                                    />
                                )}
                            </FormItem>
                        </div>
                    ) : (
                        <div>
                            <FormItem label="选择校区" {...formItemLayout}>
                                {getFieldDecorator("orgId", {
                                    initialValue:tryOrgId || undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: "请选择校区"
                                        }
                                    ]
                                })(
                                    <TenantOrgFilter {...tenantOrgSelectProps} onChange={orgIdChangeAction}/>
                                )}
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label = { '试听年月' }
                            >
                                { getFieldDecorator( 'year', {
                                    initialValue : undefined,
                                    rules : [
                                        { required : true, message : '选择年月得到课程日期' },
                                    ]
                                })(
                                    <MonthPicker disabledDate={disabledDate} allowClear = { false } style = {{ width : 180 }} size = 'default' format = { 'YYYY-MM' } onChange = { selectYearToDateAction } placeholder = '请选择试听年月' />
                                )}
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label = { '可选日期' }
                            >
                                { getFieldDecorator( 'studyDate', {
                                    initialValue :  undefined,
                                    rules : [
                                        { required : true, message : '可安排试听日期' },
                                    ]
                                })(
                                    <Select
                                        size = 'default'
                                        showSearch
                                        placeholder = '请选择可安排试听日期'
                                        optionFilterProp = "children"
                                        notFoundContent = { '暂无可安排试听日期' }
                                        onChange = { selectDateAction }
                                    >
                                        { dayList && dayList.map(function( item, index ){
                                            return ( <Option key = { 'able_date_' + item } value = { item } >{ item }</Option> )
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label = "选择课程"
                            >
                                { getFieldDecorator('courseId',{
                                    initialValue :  undefined,
                                    rules : [
                                    ]
                                })(
                                    <Select
                                        size = 'default'
                                        showSearch
                                        allowClear={false}
                                        optionFilterProp = "children"
                                        placeholder = '请选择当前校区下的课程'
                                        notFoundContent = { '当前校区下没有学员课程' }
                                        onChange = { handleSelectChange }
                                    >
                                        {
                                            courseList &&  courseList.map(function( item, index ){
                                                return ( <Option key = { 'intention_' + item.courseId } value = { item.courseId + '' } >{ item.courseName }</Option> )
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            { courseDataSource && courseDataSource.length > 0 ?
                                <div className = { style.OfflineBook_lesson } >
                                    <Table
                                    dataSource = { courseDataSource}
                                    rowKey = 'cpdId'
                                    pagination = { false }
                                    rowSelection = {rowSelection}
                                    bordered
                                    size = 'small'
                                    columns = {
                                        [{
                                            title     : '时段',
                                            dataIndex : 'startTime',
                                            key       : 'startTime',
                                            width     : 100,
                                            render    : ( text, record ) => (
                                                <p>{ record.startTime + '-' + record.endTime }</p>
                                            ),
                                        },{
                                            title     : '课程名称',
                                            dataIndex : 'courseName',
                                            key       : 'courseName',
                                            width     : 82,
                                        },{
                                                title     : '排课标题',
                                                dataIndex : 'title',
                                                key       : 'title',
                                                width     : 82,
                                        },{
                                            title     : '预约人数',
                                            dataIndex : 'maxTryNum',
                                            key       : 'maxTryNum',
                                            width     : 82,
                                            render    : ( text, record ) => (
                                                <p>{ record.maxTryNum == -1 ? record.tryNum+ '/'+(record.maxNum-record.mulStuArr.length-record.stuArr.length) :
                                                    record.tryNum+ '/'+record.maxTryNum }</p>
                                            ),
                                        }, {
                                            title     : '教室',
                                            dataIndex : 'roomName',
                                            key       : 'roomName',
                                            width     : 100

                                        }, {
                                            title     : '主教',
                                            dataIndex : 'mtNames',
                                            key       : 'mtNames',
                                            width     : 82
                                        }]
                                    }
                                    />
                                </div> : ""
                            }
                            <FormItem label="备注" {...formItemLayout}>
                                {getFieldDecorator("remark", {
                                    initialValue:
                                        stuOrderData.remark || undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: "请输入备注，限制30字",
                                            max: 30
                                        },
                                        { validator: checkWetherSpace }
                                    ]
                                })(
                                    <Input
                                        type="textarea"
                                        placeholder="请输入备注，限制30字"
                                        autosize={{ minRows: 3, maxRows: 3 }}
                                    />
                                )}
                            </FormItem>
                        </div>
                    )}
                </Form>
            </Spin>
        </Modal>
    )
}

export default Form.create()(stuOrderModal)
