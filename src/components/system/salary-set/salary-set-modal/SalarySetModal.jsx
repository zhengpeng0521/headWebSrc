import React from 'react';
import { Modal , Button , Form , Spin , Input , InputNumber, Select , Icon , Popconfirm , Radio } from 'antd';
import { BlockTitle } from '../../../common/new-component/NewComponent';
import QueueAnim from 'rc-queue-anim';
import styles from './SalarySetModal.less';
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
const formItemLayoutSpecial = {
    labelCol: { span: 10  },
    wrapperCol: { span: 14 },
}
/*工资设置modal*/
function SalarySetModal({
    courseSelectContent,                //课程下拉列表内容

    setSalaryModalVisible,              //modal是否显示
    setSalaryModalLoading,              //modal加载状态
    setSalaryModalButtonLoading,        //modal按钮加载状态
    setSalaryModalData,                 //编辑时回填数据
    setSalaryCourseCommission,          //课时提成渲染数组

    CourseSelectOnChange,               //课程下拉列表onChange事件
    CourseCommissionAdd,                //新增课程设置项
    CourseCommissionDelete,             //删除课程设置项
    RoyaltyMethodOnChange,              //提成方式单选框onChange事件
    PayMethodOnChange,                  //计算方式单选框onChange事件
    GradientAdd,                        //点击新增梯度
    GradientDelete,                     //点击删除梯度
    SignleFixInputOnChange,             //固定金额/比例input框onChange事件
    GradientTimeOnChange,               //梯度人次/课次内容onChange事件
    GradientMoneyOnChange,              //梯度金额内容onChange事件

    SetSalaryModalSubmit,               //modal提交
    SetSalaryModalCancel,               //modal关闭
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        setFieldsValue,
        validateFieldsAndScroll,
    },
}){

    function handleComplete(e){
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if (!!errors) {
                return;
            }
            for(let i in setSalaryCourseCommission){
                if(!!setSalaryCourseCommission[i].showErrorBorder){
                    return
                }
            }
            SetSalaryModalSubmit(values);
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        SetSalaryModalCancel();
    }

    //模态框的属性
    let modalOpts = {
        title: '工资设置',
        maskClosable : false,
        visible : setSalaryModalVisible,
        closable : true,
        width : 550,
        onCancel : handleCancel,
        footer : [
            <Button key="cancel" type="ghost" onClick = { handleCancel }>取消</Button>,
            <Button key="submit" type="primary"
                    onClick = { handleComplete }
                    disabled = { setSalaryModalButtonLoading }
                    loading = { setSalaryModalButtonLoading }
                    style = {{ marginLeft : 20 }}>保存</Button>
        ],
        className : 'salary_set_modal_common',
    };

    //校验金额和课时数(数字，非负数，最多保留2位小数)
    function checkMoneyOrCourse(rule,value,callback,content){
        if(value == '' || value == null || value == undefined){
            callback();
        }else if(!!isNaN(value)){
            callback(content + '必须为数字');
        }else if(parseFloat(value) < 0){
            callback(content + '必须为大于等于0的数字');
        }else if(!/^\d+(?:\.\d{1,2})?$/.test(value)){
            callback(content + '最多保留2位小数');
        }else{
            callback();
        }
    }

    //校验人次
    function checkPerson(rule,value,callback){
        if(value == '' || value == null || value == undefined){
            callback();
        }else if(!/^[0-9]*$/.test(value)){
            callback('人次必须为整数');
        }else if(parseFloat(value) < 0){
            callback('人次不能为负数');
        }else{
            callback();
        }
    }

    //校验比例
    function checkRate(rule,value,callback){
        if(value == '' || value == null || value == undefined){
            callback();
        }else if(!!isNaN(value)){
            callback('比例必须为数字');
        }else if(parseFloat(value) < 0){
            callback('比例必须为大于等于0的数字');
        }else if(parseFloat(value) >100){
            callback('比例不能大于100');
        }else{
            callback();
        }
    }

    return (
        <Modal {...modalOpts}>
            <Spin spinning = { setSalaryModalLoading }>
                <BlockTitle content = '固定工资'/>
                <FormItem
                    label = "基本工资"
                    {...formItemLayout}
                >
                    {getFieldDecorator('baseSalary', {
                        initialValue : !isNaN(setSalaryModalData.baseSalary + '') ? setSalaryModalData.baseSalary + '' : undefined,
                        rules : [
                            { required : true , message : '请输入基本工资' , whitespace : true },
                            { validator: (rule, value, callback) => checkMoneyOrCourse(rule, value, callback,'基本工资') }
                        ]
                    })(
                        <Input placeholder = '请输入基本工资' size = 'default'/>
                    )}
                </FormItem>
                <FormItem
                    label = "补贴"
                    {...formItemLayout}
                >
                    {getFieldDecorator('subsidy', {
                        initialValue : !isNaN(setSalaryModalData.subsidy + '') ? setSalaryModalData.subsidy + '' : undefined,
                        rules : [
                            { required : true , message : '请输入补贴' , whitespace : true },
                            { validator: (rule, value, callback) => checkMoneyOrCourse(rule, value, callback,'补贴') }
                        ]
                    })(
                        <Input placeholder = '请输入补贴' size = 'default'/>
                    )}
                </FormItem>
                <BlockTitle
                    content = '课时提成'
                    popoverContent = {
                        <div>
                            <div>1.该提成为老师上课的提成，可为每一个老师设置不同课程的提成方式</div>
                            <div>2.若上课老师既有主教和助教，则会给主教和助教分别计算提成</div>
                        </div>
                    }
                />
                <QueueAnim
                    type={['right', 'right']}
                    ease={['easeOutQuart', 'easeInOutQuart']}>
                    { setSalaryCourseCommission && setSalaryCourseCommission.length > 0 ?
                        setSalaryCourseCommission.map(function(item,index){
                            return(
                                <div key = { item.zj_parent_index } className={styles.course_commission} style = {{ border : item.showErrorBorder ? '1px solid #f04134' : '0' }} data-errorMessage = { item.showErrorBorder ? '梯度设置有误，请重新设置（依次递增）' : '' }>
                                    <Popconfirm placement = "top" title = '确定要删除此项吗' okText = "是" cancelText = "否" onConfirm = {() => CourseCommissionDelete(item.zj_parent_index,getFieldValue('course_' + item.zj_parent_index))} >
                                        <Icon type="close" className={styles.course_commission_close}/>
                                    </Popconfirm>
                                    <FormItem
                                        label = "授课课程"
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('course_' + item.zj_parent_index, {
                                            initialValue : item.courseId || undefined,
                                            rules : [
                                                { required : true , message : '请选择授课课程' },
                                            ]
                                        })(
                                            <Select
                                                notFoundContent = "未找到"
                                                showSearch
                                                allowClear
                                                size = 'default'
                                                placeholder = '请选择授课课程'
                                                optionFilterProp = "children"
                                                onChange = {(currentId) => CourseSelectOnChange(currentId,getFieldValue('course_' + item.zj_parent_index),item.zj_parent_index)}
                                                style = {{ minWidth : 160 , maxWidth : 390 , width : 'auto' }}>
                                                { courseSelectContent && courseSelectContent.length > 0 ?
                                                    courseSelectContent.map(function(item,index){
                                                        return (<Option key = { item } value = { item.id } disabled = { !item.display }>{ item.title }</Option>)
                                                    }) : null
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        label = "提成方式"
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('RoyaltyMethod_' + item.zj_parent_index, {
                                            initialValue : item.royaltyMethod || undefined,
                                            rules: [
                                                { required: true, message: '请选择提成方式' },
                                            ],
                                        })(
                                            <Radio.Group onChange = {(e) => RoyaltyMethodOnChange(e.target.value,item.zj_parent_index)}>
                                                <Radio value='1'>按到课人次</Radio>
                                                <Radio value='2'>按授课次数</Radio>
                                                <Radio value='3'>按消课金额</Radio>
                                            </Radio.Group>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        label = "计算方式"
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('payMethod_' + item.zj_parent_index, {
                                            initialValue : item.payMethod || undefined,
                                            rules: [
                                                { required: true, message: '请选择计算方式' },
                                            ],
                                        })(
                                            <Radio.Group onChange = {(e) => PayMethodOnChange(e.target.value,item.zj_parent_index)}>
                                                <Radio value='1'>{ item.royaltyMethod == '3' ? '固定比例' : '固定金额' }</Radio>
                                                <Radio value='2'>{ item.royaltyMethod == '3' ? '梯度比例' : '梯度金额' }</Radio>
                                            </Radio.Group>
                                        )}
                                    </FormItem>
                                    <QueueAnim
                                        type={['right', 'right']}
                                        ease={['easeOutQuart', 'easeInOutQuart']}>
                                    { item.royaltyMethod == '1' && item.payMethod == '1' ?
                                        <FormItem
                                            key = { item.royaltyMethod + '-' + item.payMethod }
                                            label = "提成金额"
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('1-1_commissionMoney_' + item.zj_parent_index, {
                                                initialValue : !isNaN(item.personMoney[0].money) ? item.personMoney[0].money + '' : undefined,
                                                rules : [
                                                    { required : true , message : '请输入提成金额' , whitespace : true },
                                                    { validator: (rule, value, callback) => checkMoneyOrCourse(rule, value, callback,'提成金额') }
                                                ]
                                            })(
                                                <Input size = 'default' style = {{ width : 145 }} addonBefore = '每人次' addonAfter = '元' onChange = {(e) => SignleFixInputOnChange('1-1_fix',e.target.value,item.zj_parent_index)}/>
                                            )}
                                        </FormItem> :
                                      item.royaltyMethod == '1' && item.payMethod == '2' ?
                                        <div key = { item.royaltyMethod + '-' + item.payMethod } className='salary_set_gradient_group'>
                                            <QueueAnim
                                                type={['right', 'right']}
                                                ease={['easeOutQuart', 'easeInOutQuart']}>
                                                {/*只需要对数组长度大于0处理即可，在modals里已做了无数据的初始化*/}
                                                { item.gradientOne && item.gradientOne.length > 0 ?
                                                    item.gradientOne.map(function(son_item,son_index){
                                                        return(
                                                            <div className = 'salary_set_gradient_group_item' key = { 'one_salary_set_gradient_group_item_' + son_item.zj_parent_index + son_item.zj_son_index }>
                                                                <FormItem
                                                                    label = "提成金额"
                                                                    {...formItemLayoutSpecial}
                                                                >
                                                                    {getFieldDecorator(item.royaltyMethod + '-' + item.payMethod + '_commissionTime_' + son_item.zj_parent_index + son_item.zj_son_index, {
                                                                        initialValue : !isNaN(son_item.time) ? son_item.time + '' : undefined,
                                                                        rules : [
                                                                            { required : true , message : '请输入人次' , whitespace : true },
                                                                            { validator: checkPerson }
                                                                        ]
                                                                    })(
                                                                        <Input disabled = { son_index == '0' ? true : false } size = 'default' style = {{ width : 120 }} addonBefore = '满' addonAfter = '人次' onChange = {(e) => GradientTimeOnChange('gradientOne',son_item.zj_parent_index,son_item.zj_son_index,e.target.value)}/>
                                                                    )}
                                                                </FormItem>
                                                                <FormItem>
                                                                    {getFieldDecorator(item.royaltyMethod + '-' + item.payMethod + '_commissionMoney_' + son_item.zj_parent_index + son_item.zj_son_index, {
                                                                        initialValue : !isNaN(son_item.money) ? son_item.money + '' : undefined,
                                                                        rules : [
                                                                            { required : true , message : '请输入金额' , whitespace : true },
                                                                            { validator: (rule, value, callback) => checkMoneyOrCourse(rule, value, callback,'金额') }
                                                                        ]
                                                                    })(
                                                                        <Input size = 'default' style = {{ width : 145}} addonBefore = '每人次' addonAfter = '元' onChange = {(e) => GradientMoneyOnChange('gradientOne',son_item.zj_parent_index,son_item.zj_son_index,e.target.value)}/>
                                                                    )}
                                                                </FormItem>
                                                                {/*从最后一项删除*/}
                                                                { son_index == item.gradientOne.length - 1 && item.gradientOne.length > 1 ?
                                                                    <a style = {{ lineHeight : '30px' }} onClick = {() => GradientDelete('gradientOne',son_item.zj_parent_index,son_item.zj_son_index)}>移除</a>
                                                                    : null
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                    :
                                                    null
                                                }
                                            </QueueAnim>
                                            <a style = {{ marginLeft : 80 }} onClick = {() => GradientAdd('gradientOne',item.zj_parent_index)}>新增梯度</a>
                                        </div> :
                                      item.royaltyMethod == '2' && item.payMethod == '1' ?
                                        <FormItem
                                            key = { item.royaltyMethod + '-' + item.payMethod }
                                            label = "提成金额"
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('2_1_commissionMoney_' + item.zj_parent_index, {
                                                initialValue : !isNaN(item.courseMoney[0].money) ? item.courseMoney[0].money + '' : undefined,
                                                rules : [
                                                    { required : true , message : '请输入提成金额' , whitespace : true },
                                                    { validator: (rule, value, callback) => checkMoneyOrCourse(rule, value, callback,'提成金额') }
                                                ]
                                            })(
                                                <Input size = 'default' style = {{ width : 145 }} addonBefore = '每次课' addonAfter = '元' onChange = {(e) => SignleFixInputOnChange('2-1_fix',e.target.value,item.zj_parent_index)}/>
                                            )}
                                        </FormItem> :
                                      item.royaltyMethod == '2' && item.payMethod == '2' ?
                                        <div key = { item.royaltyMethod + '-' + item.payMethod } className='salary_set_gradient_group'>
                                            <QueueAnim
                                                type={['right', 'right']}
                                                ease={['easeOutQuart', 'easeInOutQuart']}>
                                                {/*只需要对数组长度大于0处理即可，在modals里已做了无数据的初始化*/}
                                                { item.gradientTwo && item.gradientTwo.length > 0 ?
                                                    item.gradientTwo.map(function(son_item,son_index){
                                                        return(
                                                            <div className = 'salary_set_gradient_group_item' key = { 'two_salary_set_gradient_group_item_' + son_item.zj_parent_index + son_item.zj_son_index }>
                                                                <FormItem
                                                                    label = "提成金额"
                                                                    {...formItemLayoutSpecial}
                                                                >
                                                                    {getFieldDecorator(item.royaltyMethod + '-' + item.payMethod + '_commissionTime_' + son_item.zj_parent_index + son_item.zj_son_index, {
                                                                        initialValue : !isNaN(son_item.time) ? son_item.time + '' : undefined,
                                                                        rules : [
                                                                            { required : true , message : '请输入课时数' , whitespace : true },
                                                                            { validator: (rule, value, callback) => checkMoneyOrCourse(rule, value, callback,'课时数') }
                                                                        ]
                                                                    })(
                                                                        <Input disabled = { son_index == '0' ? true : false } size = 'default' style = {{ width : 120 }} addonBefore = '满' addonAfter = '次课' onChange = {(e) => GradientTimeOnChange('gradientTwo',son_item.zj_parent_index,son_item.zj_son_index,e.target.value)}/>
                                                                    )}
                                                                </FormItem>
                                                                <FormItem>
                                                                    {getFieldDecorator(item.royaltyMethod + '-' + item.payMethod + '_commissionMoney_' + son_item.zj_parent_index + son_item.zj_son_index, {
                                                                        initialValue : !isNaN(son_item.money) ? son_item.money + '' : undefined,
                                                                        rules : [
                                                                            { required : true , message : '请输入金额' , whitespace : true },
                                                                            { validator: (rule, value, callback) => checkMoneyOrCourse(rule, value, callback,'金额') }
                                                                        ]
                                                                    })(
                                                                        <Input size = 'default' style = {{ width : 145 }} addonBefore = '每次课' addonAfter = '元' onChange = {(e) => GradientMoneyOnChange('gradientTwo',son_item.zj_parent_index,son_item.zj_son_index,e.target.value)}/>
                                                                    )}
                                                                </FormItem>
                                                                {/*从最后一项删除*/}
                                                                { son_index == item.gradientTwo.length - 1 && item.gradientTwo.length > 1 ?
                                                                    <a style = {{ lineHeight : '30px' }} onClick = {() => GradientDelete('gradientTwo',son_item.zj_parent_index,son_item.zj_son_index)}>移除</a>
                                                                    : null
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                    :
                                                    null
                                                }
                                            </QueueAnim>
                                            <a style = {{ marginLeft : 80 }} onClick = {() => GradientAdd('gradientTwo',item.zj_parent_index)}>新增梯度</a>
                                        </div> :
                                      item.royaltyMethod == '3' && item.payMethod == '1' ?
                                        <FormItem
                                            key = { item.royaltyMethod + '-' + item.payMethod }
                                            label = "提成比例"
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('3_1_commissionRate_' + item.zj_parent_index, {
                                                initialValue : !isNaN(item.rate[0].money) ? item.rate[0].money + '' : undefined,
                                                rules : [
                                                    { required : true , message : '请输入提成比例' , whitespace : true },
                                                    { validator: checkRate }
                                                ]
                                            })(
                                                <Input size = 'default' style = {{ width : 90 }} addonAfter = '%' onChange = {(e) => SignleFixInputOnChange('3-1_fix',e.target.value,item.zj_parent_index)}/>
                                            )}
                                        </FormItem> :
                                      item.royaltyMethod == '3' && item.payMethod == '2' ?
                                        <div key = { item.royaltyMethod + '-' + item.payMethod } className='salary_set_gradient_group'>
                                            <QueueAnim
                                                type={['right', 'right']}
                                                ease={['easeOutQuart', 'easeInOutQuart']}>
                                                {/*只需要对数组长度大于0处理即可，在modals里已做了无数据的初始化*/}
                                                { item.gradientThree && item.gradientThree.length > 0 ?
                                                    item.gradientThree.map(function(son_item,son_index){
                                                        return(
                                                            <div className = 'salary_set_gradient_group_item' key = { 'three_salary_set_gradient_group_item_' + son_item.zj_parent_index + son_item.zj_son_index }>
                                                                <FormItem
                                                                    label = "提成金额"
                                                                    {...formItemLayoutSpecial}
                                                                >
                                                                    {getFieldDecorator(item.royaltyMethod + '-' + item.payMethod + '_commissionTime_' + son_item.zj_parent_index + son_item.zj_son_index, {
                                                                        initialValue : !isNaN(son_item.time) ? son_item.time + '' : undefined,
                                                                        rules : [
                                                                            { required : true , message : '请输入金额' , whitespace : true },
                                                                            { validator: (rule, value, callback) => checkMoneyOrCourse(rule, value, callback,'金额') }
                                                                        ]
                                                                    })(
                                                                        <Input disabled = { son_index == '0' ? true : false } size = 'default' style = {{ width : 120 }} addonBefore = '满' addonAfter = '元' onChange = {(e) => GradientTimeOnChange('gradientThree',son_item.zj_parent_index,son_item.zj_son_index,e.target.value)}/>
                                                                    )}
                                                                </FormItem>
                                                                <FormItem>
                                                                    {getFieldDecorator(item.royaltyMethod + '-' + item.payMethod + '_commissionMoney_' + son_item.zj_parent_index + son_item.zj_son_index, {
                                                                        initialValue : !isNaN(son_item.money) ? son_item.money + '' : undefined,
                                                                        rules : [
                                                                            { required : true , message : '请输入比例' , whitespace : true },
                                                                            { validator: checkRate }
                                                                        ]
                                                                    })(
                                                                        <Input size = 'default' style = {{ width : 90 }} addonAfter = '%' onChange = {(e) => GradientMoneyOnChange('gradientThree',son_item.zj_parent_index,son_item.zj_son_index,e.target.value)}/>
                                                                    )}
                                                                </FormItem>
                                                                {/*从最后一项删除*/}
                                                                { son_index == item.gradientThree.length - 1 && item.gradientThree.length > 1 ?
                                                                    <a style = {{ lineHeight : '30px' }} onClick = {() => GradientDelete('gradientThree',son_item.zj_parent_index,son_item.zj_son_index)}>移除</a>
                                                                    : null
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                    :
                                                    null
                                                }
                                            </QueueAnim>
                                            <a style = {{ marginLeft : 80 }} onClick = {() => GradientAdd('gradientThree',item.zj_parent_index)}>新增梯度</a>
                                        </div>
                                        :
                                        null
                                    }
                                    </QueueAnim>
                                </div>
                            )
                        })
                        :
                        null
                    }
                </QueueAnim>
                <Button size = 'small' type = 'primary' onClick = {() => CourseCommissionAdd(setSalaryCourseCommission[setSalaryCourseCommission.length-1].zj_parent_index)}>新增授课</Button>
            </Spin>
        </Modal>
    );
};

export default Form.create()(SalarySetModal);
