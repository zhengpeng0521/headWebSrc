import React from 'react';
import { Form, Input, Button, Select,  Radio, InputNumber, Spin, message, DatePicker , AutoComplete } from 'antd';
import { BlockTitle } from '../../../../common/new-component/NewComponent';
import QueueAnim from 'rc-queue-anim';
import TenantOrgFilter from '../../../../../pages/common/tenant-org-filter/TenantOrgFilter';
import { JusConstellation } from '../../../../../utils/dateFormat';
import styles from './LeadsAdd.less';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 15,
    },
};

/*新建leads*/
const LeadsAdd = ({
    localOrgId,                         //分布系统当前校区orgId
    leadsAddLoading,                    //整个页面是否加载状态
    leadsAddButtonLoading,              //新增提交按钮加载状态
    leadsAddType,                       //名单添加类型('1'公海池/'2'选择销售)
    leadsAddCurrentStaffId,             //当前操作用户的ID，用来选择销售时填写到默认值
    leadsAddFollowType,                 //跟进状态下拉列表内容
    leadsAddParentRelationship,         //获取数据字典家长关系下拉列表
    leadsAddOrgStaff,                   //选中机构下员工下拉列表内容
    leadsAddfirstChannel,               //一级来源下拉列表内容
    leadsAddSecondChannel,              //二级来源下拉列表内容
    leadsAddRecommender,                //推荐人(家长)下拉列表内容
    leadsAddCollector,                  //收集人(租户下所有员工)下拉列表内容
    wetherAddSuccess,                   //是否新增成功(用来清空表单)

    OrgSelectOnChange,                  //选择校区onChange事件
    AddTypeRadioGroupOnChange,          //录入区域onChange事件
    AddLeadsNameOnChange,               //孩子姓名输入框onChange事件
    AddLeadsCheckSameOnBlur,            //孩子姓名，家长姓名，手机号输入框onBlur事件，用来即时查重
    LeadsAddCheckSameName,              //点击查重(orgId,name)
    AddNewLeads,                        //点击新增保存
    AddLeadsTelOnChange,
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

    let followType = [];        //跟进状态下
    let staff = [];             //员工
    let parentRelation = [];    //家长关系
    let firstChannel = [];      //一级来源
    let secondChannel = [];     //二级来源
    let recommender = [];       //推荐人(家长)
    let collector = [];         //收集人(机构下所有员工)

    //渲染跟进状态下拉列表
    if(leadsAddFollowType && leadsAddFollowType.length > 0){
        followType = leadsAddFollowType.map((item,index) => {
            return(
                <Option key = { item.key + '' } value = { item.key + '' } >{ item.value + '' }</Option>
            );
        })
    }

    //渲染员工下拉列表信息
    if(leadsAddOrgStaff && leadsAddOrgStaff.length > 0){
        staff = leadsAddOrgStaff.map((item,index) => {
            return(
                <Option key = { item.id + '' } value = { item.id + '' } >{ item.name + '' }</Option>
            );
        })
    }

    //渲染家长关系
    if(leadsAddParentRelationship && leadsAddParentRelationship.length > 0){
        parentRelation = leadsAddParentRelationship.map((item,index) => {
            return(
                <Option key = { item.key + '' } value = { item.key + '' } >{ item.value + '' }</Option>
            );
        })
    }

    //渲染一级来源
    if(leadsAddfirstChannel && leadsAddfirstChannel.length > 0){
        firstChannel = leadsAddfirstChannel.map((item,index) => {
            if(item.key == '1'){
                return(
                    <Option key = { item.key + '' } value = { item.key + '' } disabled = { true }>{ item.value + '' }</Option>
                );
            }else{
                return(
                    <Option key = { item.key + '' } value = { item.key + '' }>{ item.value + '' }</Option>
                );
            }
        })
    }

    //渲染二级来源
    if(leadsAddSecondChannel && leadsAddSecondChannel.length > 0){
        secondChannel = leadsAddSecondChannel.map((item,index) => {
            return(
                <Option key = { item.key + '' } value = { item.key + '' } >{ item.value + '' }</Option>
            );
        })
    }

    //渲染推荐人(家长)
    if(leadsAddRecommender && leadsAddRecommender.length > 0){
        recommender = leadsAddRecommender.map((item,index) => {
            return(
                <Option key = { item.id + '' } value = { item.id + '' } >{ item.name + '' }</Option>
            );
        })
    }

    //渲染收集人(机构下所有员工)
    if(leadsAddCollector && leadsAddCollector.length > 0){
        collector = leadsAddCollector.map((item,index) => {
            return(
                <Option key = { item.id + '' } value = { item.id + '' } >{ item.name + '' }</Option>
            );
        })
    }

    //时间选择器时间范围限制
    function disabledDate(current) {
        return current && current.valueOf() > Date.now() - 24*60*60*100;
    }

    //通过生日判断星座
    function BirthdayOnChange(date,dateString){
        if(!!date){
            let constellation = JusConstellation(dateString);
            setFieldsValue({
                constellation
            })
        }else{
            setFieldsValue({
                constellation : undefined
            })
        }
    }

    function submit(e){
        e.preventDefault();
        validateFieldsAndScroll((err, values ) => {
            if( !!err ){
                return;
            }
            //格式化孩子生日
            if(values.birthday != '' && values.birthday != null &&values.birthday != undefined &&　!/^[\s]*$/.test(values.birthday)){
                values.birthday = values.birthday.format('YYYY-MM-DD');
            }

            AddNewLeads(values,resetFields);
        })
    }

    /*检验手机号码*/
    function checkMobile(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(!(/^1[0-9]{10}$/.test(value))){
            callback('请输入正确格式的手机号');
        }else{
            callback();
        }
    }

	function AddLeadsNameOnChangeAction(e){
		setFieldsValue({ 'parentName' : e.target.value + '家长' })
		AddLeadsNameOnChange(e);
	}

    function AddLeadsTelAction(e){
        AddLeadsTelOnChange(e)
    }
    return (
        <div className={styles.leads_add_all}>
            <div className='leads_add_first'>
                <Spin spinning = { leadsAddLoading }>
                    <Form>
                        <div className={styles.form_item_one}>
                            <FormItem style = {{ display : 'none' }}>
                                { getFieldDecorator('orgId', {
                                    initialValue : localOrgId,
                                })(
                                    <Input type = 'hidden'/>
                                )}
                            </FormItem>
                            <FormItem
                                label = "跟进状态"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('studentFollowState', {
                                    rules : [
                                        { required : true, message : '请选择跟进状态' }
                                    ]
                                })(
                                    <Select
                                        notFoundContent = "未找到"
                                        showSearch
                                        allowClear
                                        size = 'default'
                                        placeholder = '请选择跟进状态'
                                        optionFilterProp="children"
                                        style = {{ width : 220 }}>
                                        { followType || [] }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label = "录入区域"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('addType', {
                                    initialValue : '1',
                                    rules : [
                                        { required : true, message : '请选择录入区域' }
                                    ]
                                })(
                                    <RadioGroup onChange = { AddTypeRadioGroupOnChange }>
                                        <Radio value = '1' >放入公海</Radio>
                                        <Radio value = '2' >分配销售</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            { leadsAddType == '2' ?
                                <FormItem
                                    { ...formItemLayout }
                                    style = {{ marginLeft : -130 }}
                                >
                                    { getFieldDecorator('sellerId', {
                                        initialValue : leadsAddCurrentStaffId || '',
                                        rules : [
                                            { required : true, message : '请选择销售' }
                                        ]
                                    })(
                                        <Select
                                            notFoundContent = "未找到"
                                            showSearch
                                            allowClear
                                            size = 'default'
                                            placeholder = '请选择销售'
                                            optionFilterProp="children"
                                            style = {{ width : 120 }}
                                            disabled = { leadsAddType == '2' ? false : true }>
                                            { staff || [] }
                                        </Select>
                                    )}
                                </FormItem>
                                :
                                null
                            }
                        </div>
                        <BlockTitle content = '孩子信息' className={styles.block_title}/>
                        <div className={styles.form_item_two}>
                            <FormItem
                                label = "姓名"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('name', {
                                    rules : [
                                        { required : true, message : '请输入孩子姓名' , whitespace : true }
                                    ]
                                })(
                                    <Input placeholder = '请输入孩子姓名' size = 'default' style = {{ width : 220 }} onChange = { AddLeadsNameOnChangeAction } onBlur = {(e) => AddLeadsCheckSameOnBlur(e.target.value,'name',getFieldValue('orgId'))}/>
                                )}
                            </FormItem>
                            <span onClick = {() => LeadsAddCheckSameName('name',getFieldValue('orgId'),getFieldValue('name'))} style = {{ cursor : 'pointer' }}>查重</span>

                            <FormItem
                                label = "性别"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('sex')(
                                    <RadioGroup>
                                        <Radio value = '1' >男</Radio>
                                        <Radio value = '2' >女</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            <FormItem
                                label = "民族"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('nation')(
                                    <Input placeholder = '请输入民族' size = 'default' style = {{ width : 220 }}/>
                                )}
                            </FormItem>
                            <FormItem
                                label = "生日"
                                { ...formItemLayout }
                            >
                                {getFieldDecorator('birthday')(
                                    <DatePicker
                                        placeholder = '请选择生日'
                                        disabledDate = { disabledDate }
                                        format = "YYYY-MM-DD"
                                        size = 'default'
                                        style = {{ width : 220 }}
                                        onChange = { BirthdayOnChange }/>
                                )}
                            </FormItem>
                            <FormItem
                                label = "昵称"
                                { ...formItemLayout }
                            >
                                {getFieldDecorator('nickName')(
                                     <Input placeholder = '请输入昵称' size = 'default' style = {{ width : 220 }}/>
                                )}
                            </FormItem>
                            <FormItem
                                label = "星座"
                                { ...formItemLayout }
                            >
                                {getFieldDecorator('constellation')(
                                    <Select placeholder = '星座(选择生日后带出)' size = 'default' style = {{ width : 220 , color : '#666' }} disabled = { true }>
                                        <Option value = '白羊座'>白羊座</Option>
                                        <Option value = '金牛座'>金牛座</Option>
                                        <Option value = '双子座'>双子座</Option>
                                        <Option value = '巨蟹座'>巨蟹座</Option>
                                        <Option value = '狮子座'>狮子座</Option>
                                        <Option value = '处女座'>处女座</Option>
                                        <Option value = '天秤座'>天秤座</Option>
                                        <Option value = '天蝎座'>天蝎座</Option>
                                        <Option value = '射手座'>射手座</Option>
                                        <Option value = '摩羯座'>摩羯座</Option>
                                        <Option value = '水瓶座'>水瓶座</Option>
                                        <Option value = '双鱼座'>双鱼座</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label = "血型"
                                { ...formItemLayout }
                            >
                                {getFieldDecorator('bloodType')(
                                    <Select placeholder = '请选择血型' size = 'default' style = {{ width : 220 }}>
                                        <Option value = 'A'>A</Option>
                                        <Option value = 'B'>B</Option>
                                        <Option value = 'AB'>AB</Option>
                                        <Option value = 'O'>O</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label = "爱好"
                                { ...formItemLayout }
                            >
                                {getFieldDecorator('hobby')(
                                     <Input placeholder = '请输入爱好' size = 'default' style = {{ width : 220 }}/>
                                )}
                            </FormItem>
                            <FormItem
                                label = "年级"
                                { ...formItemLayout }
                            >
                                {getFieldDecorator('grade')(
                                     <Input placeholder = '请输入年级' size = 'default' style = {{ width : 220 }}/>
                                )}
                            </FormItem>
                            <FormItem
                                label = "特长"
                                { ...formItemLayout }
                            >
                                {getFieldDecorator('speciality')(
                                     <Input placeholder = '请输入特长' size = 'default' style = {{ width : 220 }}/>
                                )}
                            </FormItem>
                            <FormItem
                                label = "学校"
                                { ...formItemLayout }
                            >
                                {getFieldDecorator('schaddress')(
                                    <Input placeholder = '请输入学校' size = 'default' style = {{ width : 220 }}/>
                                )}
                            </FormItem>
                            <FormItem
                                label = "社保号码"
                                { ...formItemLayout }
                            >
                                {getFieldDecorator('socialSecurityNum')(
                                    <Input placeholder = '请输入社保号码' size = 'default' style = {{ width : 220 }}/>
                                )}
                            </FormItem>
                            <FormItem
                                label = "联系地址"
                                labelCol = {{ span : 6 }}
                                wrapperCol = {{ span: 18 }}
                            >
                                { getFieldDecorator('conaddress',{
                                    rules : [
                                        { validator :
                                            ( rule, value, callback) => {
                                                if( (value + '').length > 200 ){
                                                    return callback('联系地址不能超过200字');
                                                }else{
                                                    return callback();
                                                }
                                            }
                                        }
                                    ]
                                })(
                                    <Input placeholder = '请输入联系地址' type = 'textarea' style = {{ width : 232 }} autosize = {{ minRows : 3 , maxRows : 3 }}/>
                                )}
                            </FormItem>
                            <FormItem
                                label = "备注"
                                labelCol = {{ span : 5 }}
                                wrapperCol = {{ span: 19 }}
                            >
                                { getFieldDecorator('remark',{
                                    rules : [
                                        { validator :
                                            ( rule, value, callback) => {
                                                if( (value + '').length > 200 ){
                                                    return callback('备注不能超过200字');
                                                }else{
                                                    return callback();
                                                }
                                            }
                                        }
                                    ]
                                })(
                                    <Input placeholder = '请输入备注' type = 'textarea' style = {{ width : 220 }} autosize = {{ minRows : 3 , maxRows : 3 }}/>
                                )}
                            </FormItem>
                        </div>
                        <BlockTitle content = '家长信息' className={styles.block_title}/>
                        <div className={styles.form_item_three}>
                            <FormItem
                                label = "姓名"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('parentName', {
                                    rules : [
                                        { required : true, message : '请输入家长姓名' , whitespace : true }
                                    ]
                                })(
                                    <Input placeholder = '请输入家长姓名' size = 'default' style = {{ width : 220 }} /*onBlur = {(e) => AddLeadsCheckSameOnBlur(e.target.value,'parentName',getFieldValue('orgId'))}*//>
                                )}
                            </FormItem>
                            <FormItem
                                label = "手机号码"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('parentMobile', {
                                    rules : [
                                        { required : true, message : '请输入家长手机号码' , whitespace : true },
                                        { validator: checkMobile },
                                    ]
                                })(
                                    <Input placeholder = '请输入家长手机号码' size = 'default' style = {{ width : 220 }} onBlur = {(e) => AddLeadsCheckSameOnBlur(e.target.value,'parentMobile',getFieldValue('orgId'))} onChange = { AddLeadsTelAction }/>
                                )}
                            </FormItem>
                            <span onClick = {() => LeadsAddCheckSameName('tel',getFieldValue('orgId'),getFieldValue('parentMobile'))} style = {{ cursor : 'pointer' }}>查重</span>
                            <FormItem
                                label = "家长关系"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('relation')(
                                    <Select
                                        notFoundContent = "未找到"
                                        showSearch
                                        allowClear
                                        size = 'default'
                                        placeholder = '请选择家长关系'
                                        optionFilterProp = "children"
                                        style = {{ width : 220 }}>
                                        { parentRelation || [] }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label = "QQ"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('qqNumber')(
                                    <Input placeholder = '请输入QQ号' size = 'default' style = {{ width : 220 }}/>
                                )}
                            </FormItem>
                            <FormItem
                                label = "行业"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('trade')(
                                    <Input placeholder = '请输入行业' size = 'default' style = {{ width : 220 }}/>
                                )}
                            </FormItem>
                            <FormItem
                                label = "邮箱"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('email')(
                                    <Input placeholder = '请输入邮箱' size = 'default' style = {{ width : 220 }}/>
                                )}
                            </FormItem>
                            <FormItem
                                label = "固定电话"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('tel')(
                                    <Input placeholder = '请输入固定电话' size = 'default' style = {{ width : 220 }}/>
                                )}
                            </FormItem>
                        </div>
                        <BlockTitle content = '来源' className={styles.block_title}/>
                        <div className={styles.form_item_four}>
                            <FormItem
                                label = '一级来源'
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('firstChannel', {
                                    rules : [
                                        { required : true, message : '请选择一级来源' }
                                    ]
                                })(
                                    <Select
                                        notFoundContent = "未找到"
                                        showSearch
                                        allowClear
                                        size = 'default'
                                        placeholder = '请选择一级来源'
                                        optionFilterProp="children"
                                        style = {{ width : 220 }}>
                                        { firstChannel || [] }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label = '二级来源'
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('secondChannel')(
                                    <Select
                                        notFoundContent = "未找到"
                                        showSearch
                                        allowClear
                                        size = 'default'
                                        placeholder = '请选择二级来源'
                                        optionFilterProp="children"
                                        style = {{ width : 220 }}>
                                        { secondChannel || [] }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label = '推荐人'
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('recommender')(
                                    <Select
                                        notFoundContent = "未找到"
                                        showSearch
                                        allowClear
                                        size = 'default'
                                        placeholder = '请选择推荐人（家长）'
                                        optionFilterProp="children"
                                        style = {{ width : 220 }}>
                                        { recommender || [] }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label = '收集人'
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('collecterId')(
                                    <Select
                                        notFoundContent = "未找到"
                                        showSearch
                                        allowClear
                                        size = 'default'
                                        placeholder = '请选择收集人'
                                        optionFilterProp="children"
                                        style = {{ width : 220 }}>
                                        { collector || [] }
                                    </Select>
                                )}
                            </FormItem>
                        </div>
                    </Form>
                </Spin>
            </div>
            <Button type='primary' onClick = { submit } className={styles.submit_button} loading = { leadsAddButtonLoading } disabled = { leadsAddButtonLoading }>提交</Button>
        </div>
    );
};

export default Form.create()(LeadsAdd);
