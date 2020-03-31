import React from 'react';
import { Form , Input , Modal , Button , message , Select , Popover , Radio , Spin } from 'antd';
import { NullData } from '../../../common/new-component/NewComponent';
import styles from './TransCourseModal.less';
import QueueAnim from 'rc-queue-anim';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const formItemLayout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};

/*转移课时modal*/
const TransCourseModal = ({
    transCourseModalVisible,            //转课modal是否显示
    transCourseModalLoading,            //转课modal加载状态
    transCourseModalButtonLoading,      //转课modal按钮加载状态
    orderList,                          //合同下拉列表内容
    courseOutMessage,                   //合同下的转出课程信息
    courseInMessage,                    //合同下的转进课程信息
    courseInDetail,                     //转进课程的详细信息
    courseOutDetail,                    //转出课程的详细信息
    typeRadioItem,                      //选择类型(1平价/2补缴/3退费)

    TransCourseModalOrderOnChange,      //合同下拉列表onChange事件
    TransCourseModalCourseOnChange,     //课程名称转进onChange
    TypeRadioOnChange,                  //处理方式onChange
    TransCourseModalSubmit,
    TransCourseModalCancel,
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

    function OrderOnChange(value){
        resetFields();
        TransCourseModalOrderOnChange(value);
    }

    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if (!!errors) {
                return;
            }
            if(!values.outCourse){
                return message.warn('请选择转出课程');
            }
            if(!values.outNum){
                return message.warn('请输入转出数');
            }
            if(isNaN(values.outNum)){
                return message.warn('转出数不合规范');
            }
            if(values.outNum <= 0){
                return message.warn('转出数必须大于0');
            }
            if(!/^\d+(?:\.\d{1,2})?$/.test(values.outNum)){
                return message.warn('转出数最多2位小数');
            }
            if(!!values.outNum && values.outNum > courseOutDetail.periodAvailable ){
                return message.warn('转出数量不能大于可转数量');
            }
            if(!values.inCourse){
                return message.warn('请选择转进课程');
            }
            if(!values.inNum){
                return message.warn('请输入转进数');
            }
            if(isNaN(values.inNum)){
                return message.warn('转进数不合规范');
            }
            if(values.inNum <= 0){
                return message.warn('转进数必须大于0');
            }
            if(!/^\d+(?:\.\d{1,2})?$/.test(values.inNum)){
                return message.warn('转进数最多2位小数');
            }
            //处理课程id和name
            values.inCourseId = values.inCourse.substr(0,values.inCourse.indexOf('-'));
            values.inCourseName = values.inCourse.substr(values.inCourse.indexOf('-')+1);
            values.outCourseId = values.outCourse.substr(0,values.outCourse.indexOf('-'));
            values.outCourseName = values.outCourse.substr(values.outCourse.indexOf('-')+1);
            delete values.inCourse;
            delete values.outCourse;
            delete values.outMoney;

            //处理平价金额
            if(typeRadioItem == '1'){
                values.money = '0';
            }
            TransCourseModalSubmit(values);
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        TransCourseModalCancel();
    }

    //模态框的属性
    let modalOpts = {
        title: '转移课时',
        maskClosable : false,
        visible : transCourseModalVisible,
        closable : true,
        width : 600,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : [
            <Button key="cancel" type="ghost" onClick={handleCancel}>取消</Button>,
            <Button key="submit" type="primary"
                    onClick={handleComplete}
                    disabled={transCourseModalButtonLoading}
                    loading={transCourseModalButtonLoading}
                    style={{marginLeft:20}}>确认转课</Button>
        ],
        className : 'card_transform_course_modal'
    };

    /*检验是否只输入了空格*/
    function checkWetherNum(rule, value, callback){
        if(isNaN(value)){
            callback('金额不合法');
        }else if(value < 0){
            callback('金额不能小于0');
        }else{
            callback();
        }
    }

    /*课时名称onChange事件
     *value 本次选中的课程id
     *lastValue 上次选中的课程id
     *type 类型('in'转进课程/'out'转出课程)
     */
    function CourseOnChange(value,lastValue,type){
        //清空转出/转进课时和转出/转进金额
        if(type == 'in'){
            setFieldsValue({
                inNum : undefined,
            })
        }else if(type == 'out'){
            setFieldsValue({
                outNum : undefined,
                outMoney : undefined
            })
        }
        TransCourseModalCourseOnChange(value,lastValue,type)
    }

    //根据转出课时课时数计算转出总金额
    function OutNumOnChange(num,price){
        if(!!getFieldValue('outCourse') && num != '' && num != null && num != undefined && !/^[\s]*$/.test(num) && !isNaN(num)){
            setFieldsValue({
                outMoney : (parseFloat(num) * parseFloat(price)).toFixed(2)
            })
        }else{
            setFieldsValue({
                outMoney : undefined
            })
        }
    }

    return (
        <Modal {...modalOpts}>
            <Spin spinning = { transCourseModalLoading }>
                <FormItem
                    label = "合同编号"
                    {...formItemLayout}
                >
                    {getFieldDecorator('purchaseId', {
                        rules : [
                            { required : true , message : '请选择合同编号' }
                        ]
                    })(
                        <Select placeholder = '请选择合同编号'
                                size = 'default'
                                allowClear
                                showSearch
                                optionFilterProp = "children"
                                notFoundContent = "未找到"
                                onChange = { OrderOnChange }
                                style = {{ width : 220 }}>
                            { orderList && orderList.length > 0 ? orderList.map(function(item,index){
                                return(
                                    <Option value = { item.id + '' } key = { item.id + '' }>{ item.id }</Option>
                                )
                            }) : [] }
                        </Select>
                    )}
                </FormItem>
                <QueueAnim
                    type={['top', 'top']}
                    ease={['easeOutQuart', 'easeInOutQuart']}>
                    { courseOutMessage && courseOutMessage.length > 0 && courseInMessage && courseInMessage.length > 0 ?
                        <div key = 'all_queueanim'>
                            <div className={styles.roll_out_course}>
                                <div className={styles.roll_course_title}>转出课程</div>
                                <div className={styles.roll_out_course_detail_thead}>
                                    <div>课时名称</div>
                                    <div>剩余课时</div>
                                    <div>可转数量</div>
                                    <div>转出数量</div>
                                    <div>转出金额</div>
                                </div>
                                <div className={styles.roll_out_course_detail_trow}>
                                    <div>
                                        {getFieldDecorator('outCourse')(
                                            <Select placeholder = '课时名称'
                                                    size = 'default'
                                                    allowClear
                                                    showSearch
                                                    optionFilterProp = "children"
                                                    notFoundContent = "未找到"
                                                    onChange = { (e) => CourseOnChange(e,getFieldValue('outCourse'),'out') }
                                                    style = {{ width : '100%' }}>
                                                { courseOutMessage && courseOutMessage.length > 0 ? courseOutMessage.map(function(item,index){
                                                    return(
                                                        <Option value = { item.courseId + '-' + item.courseName } key = { item.courseId + '' } disabled = { !item.display }>{ item.courseName }</Option>
                                                    )
                                                }) : [] }
                                            </Select>
                                        )}
                                    </div>
                                    <div>{ courseOutDetail.periodLeft || 0 }</div>
                                    <div>{ courseOutDetail.periodAvailable || 0 }</div>
                                    <div>
                                        {getFieldDecorator('outNum')(
                                            <Input placeholder = '转出数量' style = { !!getFieldValue('outNum') && getFieldValue('outNum') > (courseOutDetail.periodAvailable || 0) ? { color : 'red' } : null } size = 'default' onChange = {(e) => OutNumOnChange(e.target.value,courseOutDetail.price)}/>
                                        )}
                                    </div>
                                    <div>
                                        {getFieldDecorator('outMoney')(
                                            <Input placeholder = '转出金额' size = 'default' disabled = { true } style = {{ color : '#666' }}/>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.roll_in_course}>
                                <div className={styles.roll_course_title}>转进课程</div>
                                <div className={styles.roll_in_course_detail_thead}>
                                    <div>课时名称</div>
                                    <div>剩余课时</div>
                                    <div>转进数量</div>
                                </div>
                                <div className={styles.roll_in_course_detail_trow}>
                                    <div>
                                        {getFieldDecorator('inCourse')(
                                            <Select placeholder = '课时名称'
                                                    size = 'default'
                                                    allowClear
                                                    showSearch
                                                    optionFilterProp = "children"
                                                    notFoundContent = "未找到"
                                                    onChange = { (e) => CourseOnChange(e,getFieldValue('inCourse'),'in') }
                                                    style = {{ width : '100%' }}>
                                                { courseInMessage && courseInMessage.length > 0 ? courseInMessage.map(function(item,index){
                                                    return(
                                                        <Option value = { item.courseId + '-' + item.courseName } key = { item.courseId + '' } disabled = { !item.display }>{ item.courseName }</Option>
                                                    )
                                                }) : [] }
                                            </Select>
                                        )}
                                    </div>
                                    <div>{ courseInDetail.periodLeft || 0 }</div>
                                    <div>
                                        {getFieldDecorator('inNum')(
                                            <Input placeholder = '转进数量' size = 'default'/>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <FormItem
                                label = "处理方式"
                                {...formItemLayout}
                                style = {{ lineHeight : '30px' }}
                            >
                                {getFieldDecorator('type', {
                                    rules : [
                                        { required : true , message : '请选择处理方式' }
                                    ]
                                })(
                                    <RadioGroup onChange = { TypeRadioOnChange }>
                                        <Radio value = '1'>平价</Radio>
                                        <Radio value = '2'>补缴</Radio>
                                        <Radio value = '3'>退费</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            <QueueAnim
                                type={['top', 'top']}
                                ease={['easeOutQuart', 'easeInOutQuart']}>
                                    { typeRadioItem == '2' || typeRadioItem == '3' ?
                                        <FormItem
                                            key = 'money'
                                            label = { typeRadioItem == '2' ? "补缴金额" : typeRadioItem == '3' ? "退费金额" : '--' }
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('money', {
                                                rules : [
                                                    { required : true , message : typeRadioItem == '2' ? "请输入金额" : typeRadioItem == '3' ? "请输入金额" : '--' , whitespace : true },
                                                    { validator : checkWetherNum }
                                                ]
                                            })(
                                                <Input placeholder = { typeRadioItem == '2' ? "请输入补缴金额" : typeRadioItem == '3' ? "请输入退费金额" : '--' } size = 'default' style = {{ width : 220 }}/>
                                            )}
                                        </FormItem>
                                        :
                                        null
                                    }
                            </QueueAnim>
                        </div>
                        :
                        <NullData height = '100px' content = '暂无转入或转出课程信息'/>
                    }
                </QueueAnim>
            </Spin>
        </Modal>
    );
};

export default Form.create()(TransCourseModal);
