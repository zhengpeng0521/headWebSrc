import React from 'react';
import { Form, Modal, Button, Popconfirm, Icon, Select, Upload, Input, DatePicker, TimePicker , Table , message } from 'antd';
import moment from 'moment';
import style from './AddOrEditReservationModal.less';
import TenantOrgFilter from '../../../../../../pages/common/tenant-org-filter/TenantOrgFilter';
let Option = Select.Option;
let FormItem = Form.Item;
const formItemLayout = {
    labelCol : { span : 4 },
    wrapperCol : { span : 20 }
}
const { MonthPicker } = DatePicker;

//新增编辑预约试听modal
function AddOrEditReservationModal({
    leadsFollowDetailLeadMessage,                       //选中leads名单查看详情时当前人的信息
    leadsFollowReservationModalType,                    //新增编辑预约试听表单类型('add','edit')
    leadsFollowReservationModalVisible,                 //新增编辑预约试听表单是否显示
    leadsFollowReservationModalButtonLoading,           //新增编辑预约试听表单按钮是否加载
    leadsFollowReservationModalCourseContent,           //新增早教类机构预约试听时获取的排课信息
    leadsFollowReservationSelfDetail,                   //新增预约试听当前操作人信息作为跟进人
    leadsFollowReservationCourseMessage,                //预约试听当前校区下的课程下拉列表内容
    leadsFollowReservationCourseSelectRowKeys,          //早教类下选择排课信息数组
    leadsFollowReservationCourseSelectRows,             //早教类下选择排课信息数组

    CheckZJLReservationCourseDetail,                    //早教类预约试听查看课程信息
    ChooseZJLCourseArrange,                             //早教类预约试听下课程单选框onChange事件
    LeadsFollowReservationModalCancel,                  //预约试听modal关闭
    LeadsFollowReservationModalSubmit,                  //预约试听modal提交

	dayList,                                            //选择年月得到的有课日期列表
	courseList,                                         //预约试听课程下拉列表
	courseDataSource,                                   //排课信息
	selectYearToDate,
	selectDate,

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

    //如果是早教类下预约试听排课列表单选框
    let rowSelection = {
        type : 'radio',
        onChange : ChooseZJLCourseArrange
    };

    //如果是早教类下预约试听排课列表表头
    let columns=[{
           title: '时段',
           dataIndex: 'startTime',
           key:'startTime',
           width:100,
           render    : ( text, record ) => (
               <p >{ record.startTime + '-' + record.endTime }</p>
           ),
       },{
           title: '课程名称',
           dataIndex: 'courseName',
           key  :'courseName',
           width : 82,
       }, {
           title: '预约人数',
           dataIndex: 'maxTryNum',
           key:'maxTryNum',
           width:82,
           render    : ( text, record ) => (
               <p >{ record.tryNum + '/' + record.maxTryNum }</p>
           ),
       }, {
           title: '教室',
           dataIndex: 'roomName',
           key:'roomName',
           width:82
       }, {
           title: '主教',
           dataIndex: 'mtNames',
           key:'mtNames',
           width:82
       }];

    //当前租户下所有的机构(预约试听需要判断机构类型orgKind，是1早教类还是2培训类)
    let tenantOrgId = window._init_data.orgIdList;
    let orgKind = undefined;

    //当前校区下课程信息渲染
    let course = [];

    //当前租户下所有的机构(预约试听需要判断机构类型orgKind，是1早教类还是2培训类)
    for(let i in tenantOrgId){
        if(tenantOrgId[i].orgId == leadsFollowDetailLeadMessage.orgId){
            orgKind = tenantOrgId[i].orgKind;
            break;
        }
    }

    //当前校区下课程信息渲染
    if(leadsFollowReservationCourseMessage && leadsFollowReservationCourseMessage.length > 0){
        course = courseList.map((item,index) => {
            return(
                <Option key = { item.courseId + '' } value = { item.courseId + '' }>{ item.courseName }</Option>
            );
        })
    }

    //早教类预约试听查看课程信息
    function CheckCourseDetail(time,course){
        if(orgKind == '1' && time != null && time != undefined && time != '' && course != null && course != undefined && course != ''){
            let obj = {};
            obj.orgId = leadsFollowDetailLeadMessage.orgId;
            obj.courseId = course;
            obj.startDate = time;
            obj.endDate = time;
            obj.pageIndex = 0;
            obj.pageSize = 99999;
            CheckZJLReservationCourseDetail(obj)
        }
    }

    function handleCancel(){
        resetFields();
        LeadsFollowReservationModalCancel();
    };

    function handleComplete(){
        validateFieldsAndScroll((err, values ) => {
            if( !!err ){
                return
            }
            if(orgKind == '1'){     //早教类
                if(leadsFollowReservationCourseSelectRows.length == 0){
                    return message.warn('当前时间无排课信息或未选择排课');
                }else if(leadsFollowReservationCourseSelectRows.length > 1){        //单选不会出现，还是判断一下比价好
                    return message.warn('只能选择一项排课');
                }else{
                    if(values.ableDate){
                        values.auditionTime = values.ableDate + ' ' + leadsFollowReservationCourseSelectRows[0].startTime + ':00';
                        values.auditionEndTime = values.ableDate + ' ' + leadsFollowReservationCourseSelectRows[0].endTime + ':00';
                    }
                }
                values.courseName = leadsFollowReservationCourseSelectRows[0].courseName;
                values.cpdId = leadsFollowReservationCourseSelectRows[0].cpdId;
                values.cpmId = leadsFollowReservationCourseSelectRows[0].cpmId;
            }else if(orgKind = '2'){    //培训类
                //处理上课时间
                let startTime = new Date(values.classBeginTime._d).getTime();
                let endTime = new Date(values.classEndTime._d).getTime();
                if(startTime >= endTime){
                    return message.warn('结束时间不能早于或等于开始时间');
                }
                if(values.reservationTime &&　values.classBeginTime && values.classEndTime ){
                    values.auditionTime = values.reservationTime.format('YYYY-MM-DD') + ' ' + values.classBeginTime.format('HH:mm:00');
                    values.auditionEndTime = values.reservationTime.format('YYYY-MM-DD') + ' ' + values.classEndTime.format('HH:mm:00');
                }

                delete values.classBeginTime;
                delete values.classEndTime;
            }
            delete values.ableDate;
			delete values.year;

            //处理来源(1学员/2名单)
            values.source = '2';

            LeadsFollowReservationModalSubmit(values);
        })
    }

    //时间选择器时间范围限制
    function disabledDate(current) {
        return current && current.valueOf() < Date.now() - 24*60*60*100;
    }

	//选择年月得到有课日期
	function selectYearToDateAction( date ){
		setFieldsValue({ 'ableDate' : undefined });
		setFieldsValue({ 'courseId' : undefined });
		let month = moment( date ).format('YYYY-MM');
		let orgId = getFieldValue( 'orgId' );
		selectYearToDate( month, orgId )
	}

	//选择日期得到课程列表 以及课程信息
	function selectDateAction( value ){
		setFieldsValue({ 'courseId' : undefined });
		let orgId = getFieldValue('orgId');
		selectDate( value, orgId )
	}

	return(
       <Modal
            className = "leadsfollow_reservation_addedit_modal"
            visible = { leadsFollowReservationModalVisible }
            title = '新增预约试听'
            maskClosable = { false }
            width = { 550 }
            onOK = { handleComplete }
            onCancel = { handleCancel }
            footer = {[
				<Button key = "cancelAddFollowUpRecordAction" onClick = { handleCancel } >取消</Button>,
				<Button
                    key = "confirmAddFollowUpRecordAction"
                    type = "primary"
                    style = {{ marginLeft : 20 }}
                    loading = { leadsFollowReservationModalButtonLoading }
                    disabled = { leadsFollowReservationModalButtonLoading }
                    onClick = { handleComplete } >确定</Button>
			]}
        >
            <Form>
                <FormItem style = {{ display : 'none' }}>
                    { getFieldDecorator('orgId', {
                        initialValue : leadsFollowDetailLeadMessage.orgId + '' || undefined,
                    })(
                        <Input type = 'hidden'/>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = '名单姓名'
                >
                    { getFieldDecorator('stuId', {
                        initialValue : leadsFollowDetailLeadMessage.id + '' || undefined,
                        rules : [
                            { required : true, message : '请选择名单姓名' }
                        ]
                    })(
                        <Select placeholder = '请填写名单姓名' size = 'default' disabled = { true }>
                            <Option value = { leadsFollowDetailLeadMessage.id }>{ leadsFollowDetailLeadMessage.name }</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = '跟进人'
                >
                    { getFieldDecorator('sellerId', {
                        initialValue : leadsFollowReservationSelfDetail.uid + '' || undefined,
                        rules : [
                            { required : true, message : '请选择跟进人' }
                        ]
                    })(
                        <Select
                            disabled = { true }
                            placeholder = '请选择跟进人'
                            size = 'default'
                            showSearch
                            allowClear
                            optionFilterProp = "children"
                            notFoundContent = '未找到'>
                            <Option value = { leadsFollowReservationSelfDetail.uid + '' }>{ leadsFollowReservationSelfDetail.uName + '' }</Option>
                        </Select>
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
						<MonthPicker allowClear = { false } style = {{ width : 180 }} size = 'default' format = { 'YYYY-MM' } onChange = { selectYearToDateAction } placeholder = '请选择试听年月' />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = { '可选日期' }
                >
                    { getFieldDecorator( 'ableDate', {
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
					label = '选择课程'
				>
					{ getFieldDecorator('courseId', {
					})(
						<Select
							placeholder = '请选择课程'
							size = 'default'
							onChange = {(e) => CheckCourseDetail(getFieldValue('ableDate'),e)}
							showSearch
							allowClear
							optionFilterProp = "children"
							notFoundContent = '未找到'>
							{ course || [] }
						</Select>
					)}
				</FormItem>
                { courseDataSource && courseDataSource.length > 0 ?
                    <Table
                        dataSource = { courseDataSource }
                        rowKey = 'cpdId'
                        pagination = { false }
                        rowSelection = { rowSelection }
                        bordered
                        size = 'small'
                        columns = { columns }
                        style = {{ marginBottom : 20 }}
                        />
                    :
                    null
                }
                <FormItem
                    { ...formItemLayout }
                    label = '试听备注'
                >
                    { getFieldDecorator('remark', {
                        rules : [
                            { required : true, message : '请填写预约试听备注(最多200字)' , max: 200 , whitespace : true },
                        ]
                    })(
                        <Input type = 'textarea' placeholder = '请填写预约试听备注(最多200字)' autosize = {{ minRows : 4 , maxRows : 4 }}/>
                    )}
                </FormItem>
            </Form>
        </Modal>
	)

};
export default Form.create()(AddOrEditReservationModal);
