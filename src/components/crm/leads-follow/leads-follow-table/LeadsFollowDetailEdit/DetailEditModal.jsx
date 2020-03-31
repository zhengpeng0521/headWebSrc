import React from 'react';
import { Modal , Button , Form , Input , Select , Icon , Radio , DatePicker , Spin , message } from 'antd';
import { BlockTitle } from '../../../../common/new-component/NewComponent';
import { JusConstellation } from '../../../../../utils/dateFormat';
//import TenantOrgFilter from '../../../../../pages/common/tenant-org-filter/TenantOrgFilter';
import styles from './DetailEditModal.less';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const formItemLayout = {
    labelCol : { span : 4 },
    wrapperCol : { span : 19 }
}

/*leads编辑*/
function DetailEditModal({
    localOrgId,                             //分布系统当前校区orgId
    detailEditModalVisible,                 //leads左划框是否显示
    detailEditModalLoading,                 //leads编辑modal加载状态
    detailEditModalButtonLoading,           //leads编辑按钮加载状态
    detailEditModalBackMessage,             //leads编辑时当前leads的回填信息
    leadsFollowParentRelationship,          //leads编辑家长关系下拉列表内容
    leadsFollowFastSearchFollowState,       //快捷搜索栏跟进状态下拉列表内容，还可以用来格式化跟进状态
    leadsFollowFastSearchStuSource,         //快捷搜索栏一级来源下拉列表内容
    leadsFollowSecondChannel,               //二级来源
    detailEditModalRecommender,             //leads编辑推荐人信息下拉列表
    detailEditModalCollector,               //leads编辑收集人信息

    EditLeadsCheckSameOnBlur,               //leads编辑学员姓名，家长姓名，家长手机号
    DetailEditModalSubmit,                  //leads编辑提交
    DetailEditModalCancel,                  //leads编辑关闭
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

    let followType = [];        //跟进状态
    let parentRelation = [];    //家长关系
    let firstChannel = [];      //一级来源
    let secondChannel = [];     //二级来源
    let recommender = [];       //推荐人(家长)
    let collector = [];         //收集人(机构下所有员工)

    //渲染跟进状态下拉列表
    if(leadsFollowFastSearchFollowState && leadsFollowFastSearchFollowState.length > 0){
        followType = leadsFollowFastSearchFollowState.map((item,index) => {
            return(
                <Option key = { item.key + '' } value = { item.key + '' } >{ item.value + '' }</Option>
            );
        })
    }

    //渲染家长关系
    if(leadsFollowParentRelationship && leadsFollowParentRelationship.length > 0){
        parentRelation = leadsFollowParentRelationship.map((item,index) => {
            return(
                <Option key = { item.key + '' } value = { item.key + '' } >{ item.value + '' }</Option>
            );
        })
    }

    //渲染一级来源下拉列表
    if(leadsFollowFastSearchStuSource && leadsFollowFastSearchStuSource.length > 0){
        firstChannel = leadsFollowFastSearchStuSource.map((item,index) => {
            //其他一级来源不可以修改成微官网
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

    //渲染二级来源下拉列表
    if(leadsFollowSecondChannel && leadsFollowSecondChannel.length > 0){
        secondChannel = leadsFollowSecondChannel.map((item,index) => {
            return(
                <Option key = { item.key + '' } value = { item.key + '' } >{ item.value + '' }</Option>
            );
        })
    }

    //渲染推荐人(家长)
    if(detailEditModalRecommender && detailEditModalRecommender.length > 0){
        recommender = detailEditModalRecommender.map((item,index) => {
            return(
                <Option key = { item.id + '' } value = { item.id + '' } >{ item.name + '' }</Option>
            );
        })
    }

    //渲染收集人(机构下所有员工)
    if(detailEditModalCollector && detailEditModalCollector.length > 0){
        collector = detailEditModalCollector.map((item,index) => {
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
        }
    }

    //转化学员提交
    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if (!!errors) {
                return;
            }
            if(!(/^1[0-9]{10}$/.test(values.parentMobile))){
                message.warn('手机号不符合规范');
                return;
            }
            //编辑时需要附加当前leads的id
            values.id = detailEditModalBackMessage.id || undefined;
            if(values.birthday != '' && values.birthday != null &&values.birthday != undefined &&　!/^[\s]*$/.test(values.birthday)){
                values.birthday = values.birthday.format('YYYY-MM-DD');
            }
            DetailEditModalSubmit(values);
        });
    }

    //关闭
    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        DetailEditModalCancel();
    }

    //模态框的属性
    let modalOpts = {
        title: '名单编辑',
        maskClosable : false,
        visible : detailEditModalVisible,
        closable : true,
        width : 550,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : [
            <Button key="cancel" type="ghost" onClick={handleCancel}>取消</Button>,
            <Button key="submit" type="primary"
                    onClick={handleComplete}
                    disabled={detailEditModalButtonLoading}
                    loading={detailEditModalButtonLoading}
                    style={{marginLeft:20}}>保存</Button>
        ],
        className : 'DetailEditModal'
    };

    return(
        <Modal {...modalOpts}>
            <Spin spinning = { detailEditModalLoading }>
                <Form>
                    <FormItem style = {{ display : 'none' }}>
                        {getFieldDecorator('orgId', {
                            initialValue : detailEditModalBackMessage.orgId || localOrgId,
                        })(
                            <Input type = 'hidden'/>
                        )}
                    </FormItem>
                    <FormItem
                        label = "跟进状态"
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('studentFollowState', {
                            initialValue : detailEditModalBackMessage.studentFollowState || undefined,
                            rules : [
                                { required : true, message : '请选择跟进状态' }
                            ]
                        })(
                            <Select
                                notFoundContent = "未找到"
                                showSearch
                                allowClear
                                size = 'default'
                                optionFilterProp="children"
                                placeholder = '请选择跟进状态'>
                                { followType || [] }
                            </Select>
                        )}
                    </FormItem>
                    <BlockTitle content = '孩子信息'/>
                    <FormItem
                        label = "姓名"
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('name', {
                            initialValue : detailEditModalBackMessage.name || undefined,
                            rules : [
                                { required : true, message : '请输入孩子姓名' , whitespace : true }
                            ]
                        })(
                            <Input placeholder = '请输入孩子姓名' size = 'default' onBlur = {(e) => EditLeadsCheckSameOnBlur(e.target.value,detailEditModalBackMessage.id,'name',getFieldValue('orgId'))}/>
                        )}
                    </FormItem>
                    <FormItem
                        label = "性别"
                        { ...formItemLayout }
                        style = {{ lineHeight : '30px' }}
                    >
                        { getFieldDecorator('sex', {
                            initialValue : detailEditModalBackMessage.sex || undefined ,
                            rules : [
                                { required : true, message : '请选择性别' }
                            ]
                        })(
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
                        { getFieldDecorator('nation', {
                            initialValue : detailEditModalBackMessage.nation || undefined,
                        })(
                            <Input placeholder = '请输入民族' size = 'default'/>
                        )}
                    </FormItem>
                    <FormItem
                        label = "生日"
                        { ...formItemLayout }
                    >
                        {getFieldDecorator('birthday',{
                            initialValue : detailEditModalBackMessage && detailEditModalBackMessage.birthday ?
                                    moment(detailEditModalBackMessage.birthday, 'YYYY-MM-DD') : undefined,
                        })(
                            <DatePicker
                                placeholder = '请选择生日'
                                disabledDate = { disabledDate }
                                format = "YYYY-MM-DD"
                                size = 'default'
                                style = {{ width : 160 }}
                                onChange = { BirthdayOnChange }/>
                        )}
                    </FormItem>
                    <FormItem
                        label = "星座"
                        { ...formItemLayout }
                    >
                        {getFieldDecorator('constellation', {
                            initialValue : detailEditModalBackMessage.constellation || JusConstellation(getFieldValue('birthday')),
                        })(
                            <Select placeholder = '星座(选择生日后带出)' size = 'default' style = {{ width : 160 , color : '#666' }} disabled = { true }>
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
                        label = "昵称"
                        { ...formItemLayout }
                    >
                        {getFieldDecorator('nickName', {
                            initialValue : detailEditModalBackMessage.nickName || undefined,
                        })(
                             <Input placeholder = '请输入昵称' size = 'default'/>
                        )}
                    </FormItem>
                    <FormItem
                        label = "爱好"
                        { ...formItemLayout }
                    >
                        {getFieldDecorator('hobby', {
                            initialValue : detailEditModalBackMessage.hobby || undefined,
                        })(
                             <Input placeholder = '请输入爱好' size = 'default'/>
                        )}
                    </FormItem>
                    <FormItem
                        label = "年级"
                        { ...formItemLayout }
                    >
                        {getFieldDecorator('grade', {
                            initialValue : detailEditModalBackMessage.grade || undefined,
                        })(
                             <Input placeholder = '请输入年级' size = 'default' style = {{ width : 160 }}/>
                        )}
                    </FormItem>
                    <FormItem
                        label = "特长"
                        { ...formItemLayout }
                    >
                        {getFieldDecorator('speciality', {
                            initialValue : detailEditModalBackMessage.speciality || undefined,
                        })(
                             <Input placeholder = '请输入特长' size = 'default'/>
                        )}
                    </FormItem>
                    <FormItem
                        label = "血型"
                        { ...formItemLayout }
                    >
                        {getFieldDecorator('bloodType', {
                            initialValue : detailEditModalBackMessage.bloodType || undefined,
                        })(
                            <Select placeholder = '请选择血型' size = 'default' style = {{ width : 160 }}>
                                <Option value = 'A'>A</Option>
                                <Option value = 'B'>B</Option>
                                <Option value = 'AB'>AB</Option>
                                <Option value = 'O'>O</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        label = "学校"
                        { ...formItemLayout }
                    >
                        {getFieldDecorator('schaddress',{
                            initialValue : detailEditModalBackMessage.schaddress || undefined,
                        })(
                            <Input placeholder = '请输入学校' size = 'default'/>
                        )}
                    </FormItem>
                    <FormItem
                        label = "社保号码"
                        { ...formItemLayout }
                    >
                        {getFieldDecorator('socialSecurityNum', {
                            initialValue : detailEditModalBackMessage.socialSecurityNum || undefined,
                        })(
                            <Input placeholder = '请输入社保号码' size = 'default'/>
                        )}
                    </FormItem>
                    <FormItem
                        label = "联系地址"
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('conaddress', {
                            initialValue : detailEditModalBackMessage.conaddress || undefined,
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
                            <Input type = 'textarea' placeholder = '请输入联系地址' autosize = {{ minRows : 3 , maxRows : 3 }}/>
                        )}
                    </FormItem>
                    <FormItem
                        label = "备注"
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('remark', {
                            initialValue : detailEditModalBackMessage.remark || undefined,
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
                            <Input placeholder = '请输入备注' type = 'textarea' autosize = {{ minRows : 3 , maxRows : 3 }}/>
                        )}
                    </FormItem>
                    <BlockTitle content = '家长信息'/>
                    <FormItem
                        label = "姓名"
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('parentName', {
                            initialValue : detailEditModalBackMessage.parentName || undefined,
                            rules : [
                                { required : true, message : '请输入家长姓名' , whitespace : true }
                            ]
                        })(
                            <Input placeholder = '请输入家长姓名' size = 'default' /*onBlur = {(e) => EditLeadsCheckSameOnBlur(e.target.value,detailEditModalBackMessage.parentId,'parentName',getFieldValue('orgId'))}*//>
                        )}
                    </FormItem>
                    <FormItem
                        style={{display:'none'}}
                    >
                        { getFieldDecorator('parentId', {
                            initialValue : detailEditModalBackMessage.parentId || undefined,
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    {/*来源是微官网 不可修改*/}
                    <FormItem
                        label = "手机号码"
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('parentMobile', {
                            initialValue : detailEditModalBackMessage.parentMobile || undefined,
                            rules : [
                                { required : true, message : '请输入家长手机号码' , whitespace : true }
                            ]
                        })(
                            <Input placeholder = '请输入家长手机号码' size = 'default' disabled = { detailEditModalBackMessage.channel == '1' ? true : false } onBlur = {(e) => EditLeadsCheckSameOnBlur(e.target.value,detailEditModalBackMessage.parentId,'parentMobile',getFieldValue('orgId'))}/>
                        )}
                    </FormItem>
                    <FormItem
                        label = "家长关系"
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('relation', {
                            initialValue : detailEditModalBackMessage.relation || undefined
                        })(
                            <Select
                                notFoundContent = "未找到"
                                showSearch
                                allowClear
                                size = 'default'
                                placeholder = '请选择家长关系'
                                optionFilterProp = "children">
                                { parentRelation || [] }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        label = "QQ"
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('qqNumber', {
                            initialValue : detailEditModalBackMessage.qqNumber || undefined,
                        })(
                            <Input placeholder = '请输入QQ号' size = 'default'/>
                        )}
                    </FormItem>
                    <FormItem
                        label = "行业"
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('trade', {
                            initialValue : detailEditModalBackMessage.trade || undefined,
                        })(
                            <Input placeholder = '请输入行业' size = 'default'/>
                        )}
                    </FormItem>
                    <FormItem
                        label = "邮箱"
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('email', {
                            initialValue : detailEditModalBackMessage.email || undefined,
                        })(
                            <Input placeholder = '请输入邮箱' size = 'default'/>
                        )}
                    </FormItem>
                    <FormItem
                        label = "固定电话"
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('tel', {
                            initialValue : detailEditModalBackMessage.tel || undefined,
                        })(
                            <Input placeholder = '请输入电话号码' size = 'default'/>
                        )}
                    </FormItem>
                    <BlockTitle content = '来源'/>
                    <FormItem
                        label = '一级来源'
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('firstChannel', {
                            initialValue : detailEditModalBackMessage.channel || undefined,
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
                                disabled = { detailEditModalBackMessage.channel == '1' ? true : false }>
                                { firstChannel || [] }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        label = '二级来源'
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('secondChannel',{
                            initialValue : detailEditModalBackMessage.secondChannel || undefined,
                        })(
                            <Select
                                notFoundContent = "未找到"
                                showSearch
                                allowClear
                                size = 'default'
                                optionFilterProp="children"
                                placeholder = '请选择二级来源'>
                                { secondChannel || [] }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        label = '推荐人'
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('recommender',{
                            initialValue : detailEditModalBackMessage.recommender || undefined
                        })(
                            <Select
                                notFoundContent = "未找到"
                                showSearch
                                allowClear
                                size = 'default'
                                optionFilterProp="children"
                                placeholder = '请选择推荐人（家长）'>
                                { recommender || [] }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        label = '收集人'
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('collecterId',{
                            initialValue : detailEditModalBackMessage.collecterId || undefined
                        })(
                            <Select
                                notFoundContent = "未找到"
                                showSearch
                                allowClear
                                size = 'default'
                                optionFilterProp="children"
                                placeholder = '请选择收集人'>
                                { collector || [] }
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Spin>
        </Modal>
    );
}

export default Form.create()(DetailEditModal);
