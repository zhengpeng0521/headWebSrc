import React from 'react';
import { Form, Input, Button, Select,  Radio, InputNumber, Spin, message, DatePicker , TimePicker , Popover } from 'antd';
import { BlockTitle } from '../../../common/new-component/NewComponent';
import { BlockPicker } from 'react-color';
import TenantOrgFilter from '../../../../pages/common/tenant-org-filter/TenantOrgFilter';
import styles from './CreateArrangeCourse.less';
import { getWeekDays } from '../../../../utils/dateFormat';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { MonthPicker, RangePicker } = DatePicker;


const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 15,
    },
};

/*新增排课*/
const CreateArrangeCourse = ({
    loading,                            //整个页面是否加载状态
    buttonLoading,                      //新增提交按钮加载状态
    wetherCreateSuccess,                //是否新增成功(用来清空表单)
    defaultOrgId,                       //cerp默认选中的校区
    courseSelectContent,                //课程信息下拉列表数据
    courseDetailContent,                //课程详情信息
    teacherSelectContent,               //主教和助教下拉列表数据
    classRoomSelectContent,             //教室下拉列表数据

    CreateArrangeOrgOnChange,           //选择校区onChange事件
    CreateArrangeCourseOnChange,        //选择课程onChange事件
    CreateNewCourse,                    //点击生成排课
    ChangeCreateStatus,                 //新增成功之后清空表单并且修改wetherCreateSuccess状态
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        setFieldsValue,
        validateFieldsAndScroll,
    },
  }) => {

    //是否新增成功
    if(wetherCreateSuccess){
        resetFields();
        ChangeCreateStatus();
    }

    let course = [];        //课程信息
    let teacher = [];       //主教和助教
    let classRoom = [];     //教室信息

    //渲染课程信息
    if(courseSelectContent && courseSelectContent.length > 0){
        course = courseSelectContent.map((item,index) => {
            return(
                <Option key = { item.id + '' } value = { item.id + '' }>{ item.title + '' }</Option>
            );
        })
    }

    //渲染主教和助教下拉列表
    if(teacherSelectContent && teacherSelectContent.length > 0){
        teacher = teacherSelectContent.map((item,index) => {
            return(
                <Option key = { item.userId + '' } value = { item.userId + '' }>{ item.userName + '' }</Option>
            );
        })
    }

    //渲染教室信息
    if(classRoomSelectContent && classRoomSelectContent.length > 0){
        classRoom = classRoomSelectContent.map((item,index) => {
            return(
                <Option key = { item.id + '' } value = { item.id + '' }>{ item.name + '' }</Option>
            );
        })
    }

    //渲染周信息
    let weekOption  = [
        { label: '周一', value: 1 },
        { label: '周二', value: 2 },
        { label: '周三', value: 3 },
        { label: '周四', value: 4 },
        { label: '周五', value: 5 },
        { label: '周六', value: 6 },
        { label: '周日', value: 7 },
    ];

    //排课颜色选择器
    let scheduleColorPick = (
        <BlockPicker
            triangle="hide"
            color={getFieldValue('color') || '#1dafe4'}
            colors={[
                '#523d87', '#8e4090', '#db3387', '#e776c8', '#7976e7',
                '#1dafe4', '#0b7a3b', '#169f4e', '#97c24a', '#fbbc3c',
                '#e76d39', '#d62436', '#d9c585', '#9e612f', '#772c1d'
            ]}
            onChangeComplete={scheduleColorChange}/>
    );

    function scheduleColorChange(color) {
        setFieldsValue({'color': color.hex});
    }

    //上课日期选择器时间范围限制
    function disabledDate(current) {
        return current && current.valueOf() < Date.now() - 24*60*60*1000;
    }

    //循环条件下日期选择onChange事件
    function RepeatDateOnChange(data, dateString){
        let weekChoose = getFieldValue('weekChoose');
        if(dateString != '' &&　dateString != null &&　dateString != undefined &&
            weekChoose != '' &&　weekChoose != null &&　weekChoose != undefined){
            let num = getWeekDays(dateString[0],dateString[1],weekChoose);
            setFieldsValue({ courseNum : num })
        }
    }

    //周radio选择onChange事件
    function WeekChooseOnChange(e){
        let weekChoose = e.target.value;
        let repeatDate = getFieldValue('repeatDate');
        if(repeatDate != '' &&　repeatDate != null &&　repeatDate != undefined &&
            weekChoose != '' &&　weekChoose != null &&　weekChoose != undefined){
            let num = getWeekDays(repeatDate[0].format('YYYY-MM-DD'),repeatDate[1].format('YYYY-MM-DD'),weekChoose);
            setFieldsValue({ courseNum : num })
        }
    }

    //校验上课，补课和试听人数
    function checkNum(rule, value, callback){
        if(value == '' || value == undefined || value == null) {
			callback();
		}else if(!/^(0|[1-9]\d*)$/.test(value)){
            callback(new Error('人数必须是非负整数'));
        }else if(parseInt(value) > 99){
            callback(new Error('人数最多为99人'));
        }else{
			callback();
		}
    }

    //校验进度
    function checkProcess(rule, value, callback){
        if(value == '' || value == undefined || value == null) {
			callback();
		}else if(!/^(0|[1-9]\d*)$/.test(value)){
            callback(new Error('进度内容必须是非负整数'));
        }else{
			callback();
		}
    }

    function submit(e){
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            if( !!err ){
                return;
            }

            //处理机构id
            values.orgId = defaultOrgId || '';

            //处理主教和助教
            for(let i in values.mtids){
                for(let j in values.atids){
                    if(values.mtids[i] == values.atids[j]){
                        message.warn('主教和助教不能包含同一人');
                        return;
                    }
                }
            }

            if(values.mtids != '' && values.mtids != null && values.mtids != undefined){
                values.mtids = values.mtids.join(',');
            }

            if(values.atids != '' && values.atids != null && values.atids != undefined){
                values.atids = values.atids.join(',');
            }

            //处理单次排课还是循环排课
            if(values.repeatable == '0' && values.singleDate != '' && values.singleDate != null && values.singleDate != undefined){
                //单次排课
                values.startDate = values.singleDate.format('YYYY-MM-DD');
                values.endDate = values.singleDate.format('YYYY-MM-DD');
                delete values.singleDate;
            }else if(values.repeatable == '1' && values.repeatDate != '' && values.repeatDate != null && values.repeatDate != undefined){
                //循环排课
                values.startDate = values.repeatDate[0].format('YYYY-MM-DD');
                values.endDate = values.repeatDate[1].format('YYYY-MM-DD');
                //循环排课需要传cron表达式
                if(values.weekChoose == 7){
                    values.cronExp =`0 0 0 ? * 1 *`;
                }else{
                    values.cronExp =`0 0 0 ? * ${values.weekChoose + 1} *`;
                }
                delete values.repeatDate;
            }

            //处理上课时间
            let startTime = new Date(values.classTimeStart._d).getTime();
            let endTime = new Date(values.classTimeEnd._d).getTime();
            if(startTime >= endTime){
                message.warn('结束时间不能早于或等于开始时间');
                return;
            }
            values.startTime = values.classTimeStart.format('HH:mm');
            values.endTime = values.classTimeEnd.format('HH:mm');
            delete values.classTimeStart;
            delete values.classTimeEnd;

            //删除上课节数
            delete values.courseNum;
            //console.info(values)
            CreateNewCourse(values);
        })
    }

    function CreateArrangeCourseOnSelect(value,option){
        setFieldsValue({
            title : option.props.children
        });
    }

    return (
        <div className={styles.all}>
            <div className='create_arrange_course'>
                <Spin spinning = { loading }>
                    <Form>
                        <BlockTitle content = '课程信息' className={styles.block_title}/>
                        <div className={styles.form_item_course_message}>
                             <FormItem
                                label = "所属校区"
                                { ...formItemLayout }
                             >
                                { getFieldDecorator('orgId', {
                                    initialValue : defaultOrgId || undefined,
                                    rules : [
                                        { required : true, message : '请选择校区' }
                                    ]
                                })(
                                    <TenantOrgFilter width = { 220 } onChange = { CreateArrangeOrgOnChange } disabled = { true }/>
                                )}
                            </FormItem>
                            <FormItem
                                label = "课程名称"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('courseId', {
                                    rules : [
                                        { required : true, message : '请选择课程名称' }
                                    ]
                                })(
                                    <Select
                                        notFoundContent = "未找到"
                                        showSearch
                                        allowClear
                                        size = 'default'
                                        placeholder = '请选择课程名称'
                                        optionFilterProp="children"
                                        style = {{ width : 220 }}
                                        onChange = { CreateArrangeCourseOnChange }
                                        onSelect = { CreateArrangeCourseOnSelect }>
                                        { course || [] }
                                    </Select>
                                )}
                            </FormItem>
                            <p>
                                <Input style = {{ width : 90 }} value = { courseDetailContent && courseDetailContent.cost && courseDetailContent.cost + '课时' || '' } placeholder = '课时' disabled = { true }/>
                            </p>
                            <p>
                                <Input style = {{ width : 90 }} value = {
                                        courseDetailContent.minMa != null && courseDetailContent.minMa != undefined &&
                                        courseDetailContent.maxMa != null && courseDetailContent.minMa != undefined ?
                                        `${courseDetailContent.minMa}~${courseDetailContent.maxMa}个月` : '' } placeholder = '月龄' disabled = { true }/>
                            </p>
                            <FormItem
                                label = "主教"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('mtids', {
                                    rules : [
                                        { required : true, message : '请选择主教' }
                                    ]
                                })(
                                    <Select
                                        mode = 'multiple'
                                        notFoundContent = "未找到"
                                        showSearch
                                        allowClear
                                        size = 'default'
                                        placeholder = '请选择主教'
                                        optionFilterProp="children"
                                        style = {{ width : 220 }}>
                                        { teacher || [] }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label = "助教"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('atids')(
                                    <Select
                                        mode = 'multiple'
                                        notFoundContent = "未找到"
                                        showSearch
                                        allowClear
                                        size = 'default'
                                        placeholder = '请选择助教'
                                        optionFilterProp="children"
                                        style = {{ width : 220 }}>
                                        { teacher || [] }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label = "教室"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('roomId', {
                                    rules : [
                                        { required : true, message : '请选择教室' }
                                    ]
                                })(
                                    <Select
                                        notFoundContent = "未找到"
                                        showSearch
                                        allowClear
                                        size = 'default'
                                        placeholder = '请选择教室'
                                        optionFilterProp="children"
                                        style = {{ width : 220 }}>
                                        { classRoom || [] }
                                    </Select>
                                )}
                            </FormItem>
                        </div>
                        <BlockTitle content = '标题颜色' className={styles.block_title}/>
                        <div className={styles.form_item_color_set}>
                            <FormItem
                                label = "排课标题"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('title', {
                                    rules : [
                                        { required : true, message : '请输入标题' , whitespace : true },
                                    ]
                                })(
                                    <Input placeholder = '请输入标题' size = 'default' style = {{ width : 220 }}/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="颜色"
                            >
                                {getFieldDecorator('color', {
                                    initialValue: '#1dafe4',
                                    rules : [
                                        { required : true, message : '请选择颜色' , whitespace : true },
                                    ]
                                })(
                                    <Popover content = { scheduleColorPick } title = { null } trigger = "click" >
                                        <div style={{backgroundColor: getFieldValue('color') , width : 150 , height : 30 , lineHeight : '30px' , color : '#fff' , borderRadius : 5 , textAlign : 'center' , cursor : 'pointer' }}>
                                            可点击更改
                                        </div>
                                    </Popover>
                                )}
                            </FormItem>
                        </div>
                        <BlockTitle content = '人数上限设置' className={styles.block_title}/>
                        <div className={styles.form_item_peo_lim}>
                            <FormItem
                                label = "上课人数"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('maxNum', {
                                    rules : [
                                        { required : true, message : '请输入最大上课人数' , whitespace : true },
                                        { validator: checkNum },
                                    ]
                                })(
                                    <Input placeholder = '请输入最大上课人数' size = 'default' style = {{ width : 220 }}/>
                                )}
                            </FormItem>
                            <FormItem
                                label = "补课人数"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('maxMulNum', {
                                    rules : [
                                        { required : true, message : '请输入最大补课人数' , whitespace : true },
                                        { validator: checkNum },
                                    ]
                                })(
                                    <Input placeholder = '请输入最大补课人数' size = 'default' style = {{ width : 220 }}/>
                                )}
                            </FormItem>
                            <FormItem
                                label = "试听人数"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('maxTryNum', {
                                    rules : [
                                        { required : true, message : '请输入最大试听人数' , whitespace : true },
                                        { validator: checkNum },
                                    ]
                                })(
                                    <Input placeholder = '请输入最大试听人数' size = 'default' style = {{ width : 220 }}/>
                                )}
                            </FormItem>
                        </div>
                        <BlockTitle content = '时间设置' className={styles.block_title}/>
                        <div className={styles.form_item_time_set}>
                            <FormItem
                                label = "排课方式"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('repeatable', {
                                    initialValue : '0',
                                    rules : [
                                        { required : true, message : '请选择排课方式' }
                                    ]
                                })(
                                    <RadioGroup>
                                        <Radio value = '0' >单次</Radio>
                                        <Radio value = '1' >循环</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            { getFieldValue('repeatable') == '0' ?
                                <FormItem
                                    label = "上课日期"
                                    { ...formItemLayout }
                                >
                                    {getFieldDecorator('singleDate',{
                                        rules : [
                                            { required : true, message : '请选择上课日期' }
                                        ]
                                    })(
                                        <DatePicker
                                            placeholder = '请选择上课日期'
                                            disabledDate = { disabledDate }
                                            format = "YYYY-MM-DD"
                                            size = 'default'
                                            showToday
                                            style = {{ width : 220 }}/>
                                    )}
                                </FormItem>
                                :
                                <FormItem
                                    label = "上课日期"
                                    { ...formItemLayout }
                                >
                                    {getFieldDecorator('repeatDate',{
                                        rules : [
                                            { required : true, message : '请选择上课日期' }
                                        ]
                                    })(
                                        <RangePicker
                                            disabledDate = { disabledDate }
                                            size = 'default'
                                            format="YYYY-MM-DD"
                                            style = {{ width : 220 }}
                                            onChange = { RepeatDateOnChange }/>
                                    )}
                                </FormItem>
                            }
                            <FormItem
                                  {...formItemLayout}
                                  label="上课时间"
                            >
                            {getFieldDecorator('classTimeStart', {
                                rules: [
                                    { required: true, message: '请选择上课时间'},
                                ],
                              })(
                                    <TimePicker style={{ width : 105 }} format="HH:mm" placeholder = '上课时间' size = 'default'/>
                              )}
                            </FormItem>
                            <FormItem
                                  {...formItemLayout}
                            >
                            {getFieldDecorator('classTimeEnd', {
                                rules: [
                                    { required: true, message: '请选择下课时间'},
                                ],
                              })(
                                    <TimePicker style={{ width : 105 }} format="HH:mm" placeholder = '下课时间' size = 'default'/>
                              )}
                            </FormItem>
                            { getFieldValue('repeatDate') != '' && getFieldValue('repeatDate') != null && getFieldValue('repeatDate') != undefined ?
                                <FormItem
                                    lable = '星期'
                                    {...formItemLayout}
                                >
                                {getFieldDecorator('weekChoose', {
                                    rules: [
                                        { required: true, message: '请选择时间范围内在周几上课'},
                                    ],
                                })(
                                    <RadioGroup options={weekOption} onChange = { WeekChooseOnChange }/>
                                )}
                                </FormItem>
                                :
                                null
                            }
                        </div>
                        <div className = {styles.course_num} style = { getFieldValue('repeatDate') != undefined && getFieldValue('repeatDate') != null && getFieldValue('repeatDate') != '' && getFieldValue('weekChoose') != undefined && getFieldValue('weekChoose') != null && getFieldValue('weekChoose') != '' ? { display : 'block' } : { display : 'none' } } key = 'courseNum'>
                            <FormItem
                                label = "上课次数"
                                labelCol = {{ span : 12 }}
                                wrapperCol = {{ span: 5 }}
                            >
                                {getFieldDecorator('courseNum')(
                                    <Input size = 'default' style = {{ width : 80 }} disabled = { true }/>
                                )}
                            </FormItem>
                        </div>
                        <div className={styles.course_process}>
                            <FormItem
                                {...formItemLayout}
                                label="课程进度"
                            >
                                {getFieldDecorator('processPre')(
                                    <Input size = 'default' placeholder = '进度前缀' style = {{ width : 105 }}/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                            >
                                {getFieldDecorator('processSuf',{
                                    rules : [
                                        { validator: checkProcess },
                                    ]
                                })(
                                    <Input size = 'default' placeholder = { getFieldValue('repeatable') == '0' ? '当前进度' : getFieldValue('repeatable') == '1' ?  '起始进度' : '' } style = {{ width : 105 }}/>
                                )}
                            </FormItem>
                        </div>
                    </Form>
                </Spin>
            </div>
            <Button type='primary' onClick = { submit } className={styles.submit_button} loading = { buttonLoading } disabled = { buttonLoading }>生成</Button>
        </div>
    );
};

export default Form.create()(CreateArrangeCourse);
