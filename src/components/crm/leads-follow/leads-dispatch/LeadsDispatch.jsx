import React from 'react';
import { Form, Input, Button, Select,  Radio, Checkbox, Row, Col, InputNumber, Spin, message } from 'antd';
import QueueAnim from 'rc-queue-anim';
import TenantOrgFilter from '../../../../pages/common/tenant-org-filter/TenantOrgFilter';
import { ProgressBarModal } from '../../../common/new-component/NewComponent';
import styles from './LeadsDispatch.less';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
    labelCol: {
        span: 3,
    },
    wrapperCol: {
        span: 17,
    },
};

/*leads分配*/
const LeadsFollowLeadsDispatch = ({
    leadsDispatchUsefulLeadsNum,                //可分配的leads数
    leadsDispatchAlreadyDispatchLeadsNum,       //已分配的leads数
    leadsDispatchDispatchType,                  //分配类型('1'自定义/'2'平均分配)
    leadsDispatchStaffContent,                  //员工摘要信息
    leadsDispatchStaffChooseArr,                //选中的员工ID数组
    leadsDispatchStaffOperationId,              //选中checkbox或者取消checkbox操作的当前员工id

    leadsDispatchDispatchLoading,               //是否在加载状态
    leadsDispatchDispatchButtonLoading,         //提交按钮是否加载状态
    leadsDispatchWetherSubmitSuc,               //是否提交成功
    leadsDispatchStaffMaxLeadsNum,              //每个员工最多分配leads数

    leadsDispatchRoleSelectContent,             //角色下拉列表内容

    leadsDispatchAlertModalWetherAlert,         //员工是否超额
    leadsDispatchAlertModalStaff,               //超额员工信息

    //LeadsDispatchOrgSelectOnChange,             //选择校区onChange事件
    LeadsDispatchTypeOnChange,                  //分类种类onChange事件
    LeadsDispatchSearchStaffByRoleId,           //角色下拉列表onChange事件
    LeadsDispatchCheckBoxOnChange,              //员工checkbox的onChange事件
    LeadsDispatchInputOnChange,                 //输入框onChange事件
    LeadsDispatchInputOnSubmit,                 //点击保存
    AfterSuccessChangeStatus,                   //提交成功后清除表单
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

    //如果提交成功，清空选中项
    if(leadsDispatchWetherSubmitSuc){
        resetFields();
        AfterSuccessChangeStatus();
    }

    function submit(e){
        e.preventDefault();
        if(leadsDispatchStaffChooseArr && leadsDispatchStaffChooseArr.length == 0){
            return message.warn('请分配员工完成后保存');
        }
        let users = [];
        if(leadsDispatchDispatchType == '1'){
            for(let i in leadsDispatchStaffChooseArr){
                //如果选中，未填写数字，则默认是0
                if(getFieldValue('sellerIdType1_'+leadsDispatchStaffChooseArr[i]) != undefined && getFieldValue('sellerIdType1_'+leadsDispatchStaffChooseArr[i]) != '' && getFieldValue('sellerIdType1_'+leadsDispatchStaffChooseArr[i]) != null){
                    if(getFieldValue('sellerNoType1_'+leadsDispatchStaffChooseArr[i]) != undefined && getFieldValue('sellerNoType1_'+leadsDispatchStaffChooseArr[i]) != '' && getFieldValue('sellerNoType1_'+leadsDispatchStaffChooseArr[i]) != null && !/^[\s]*$/.test(getFieldValue('sellerNoType1_'+leadsDispatchStaffChooseArr[i]))){
                        //如果数字不是正整数 报错
                        if(!/^\d+$/.test(getFieldValue('sellerNoType1_'+leadsDispatchStaffChooseArr[i]))){
                            return message.warn('名单数必须是非负整数');
                        }else{
                            users.push({
                                id : getFieldValue('sellerIdType1_'+leadsDispatchStaffChooseArr[i])[0],
                                num : getFieldValue('sellerNoType1_'+leadsDispatchStaffChooseArr[i])
                            })
                        }
                    }else{
                        users.push({
                            id : getFieldValue('sellerIdType1_'+leadsDispatchStaffChooseArr[i])[0],
                            num : 0
                        });
                    }
                }
            }
        }else if(leadsDispatchDispatchType == '2'){
            for(let i in leadsDispatchStaffChooseArr){
                //如果选中，未填写数字，则默认是0
                if(getFieldValue('sellerIdType2_'+leadsDispatchStaffChooseArr[i]) != undefined && getFieldValue('sellerIdType2_'+leadsDispatchStaffChooseArr[i]) != '' && getFieldValue('sellerIdType2_'+leadsDispatchStaffChooseArr[i]) != null){
                    if(getFieldValue('sellerNoType2_'+leadsDispatchStaffChooseArr[i]) != undefined && getFieldValue('sellerNoType2_'+leadsDispatchStaffChooseArr[i]) != '' && getFieldValue('sellerNoType2_'+leadsDispatchStaffChooseArr[i]) != null && !/^[\s]*$/.test(getFieldValue('sellerNoType2_'+leadsDispatchStaffChooseArr[i]))){
                        //平均分配自动填充数字，不必校验是否正整数
                        users.push({
                            id : getFieldValue('sellerIdType2_'+leadsDispatchStaffChooseArr[i])[0],
                            num : getFieldValue('sellerNoType2_'+leadsDispatchStaffChooseArr[i])
                        })
                    }else{
                        users.push({
                            id : getFieldValue('sellerIdType2_'+leadsDispatchStaffChooseArr[i])[0],
                            num : 0
                        });
                    }
                }
            }
        }
        //console.info(JSON.stringify(users))
        LeadsDispatchInputOnSubmit(JSON.stringify(users));
    }


    /*function OrgSelectOnChange(orgId){
        let obj = {};
        resetFields();
        LeadsDispatchOrgSelectOnChange(orgId);
    }*/

    //角色下拉列表onChange事件
    function SearchStaffByRoleId(roleId){
        resetFields();
        LeadsDispatchSearchStaffByRoleId(roleId);
    }

    //(如果取消checkbox，已分配数需要减去参数num,将num设为0即可；如果选中checkbox,num也可以设置0，不影响)
    function CheckBoxOnChange(e,id){
        let obj = {};
        let num = 0;
        if(leadsDispatchDispatchType == '1'){
            num = getFieldValue('sellerNoType1_'+id);
            obj['sellerNoType1_'+id] = 0;
            setFieldsValue(obj);
        }else if(leadsDispatchDispatchType == '2'){

        }
        LeadsDispatchCheckBoxOnChange(e,id,num);
    }

    function InputOnChange(e,id){
        //已分配的总数
        let num = 0;
        for(let i in leadsDispatchStaffChooseArr){
            if(id == leadsDispatchStaffChooseArr[i]){
                if(e != '' && e != null && e != undefined && !isNaN(parseInt(e))){
                    num += parseInt(e);
                }else{
                    num += 0;
                }
            }else if(leadsDispatchDispatchType == '1'){
                num += parseInt(getFieldValue('sellerNoType1_'+leadsDispatchStaffChooseArr[i]));
            }else if(leadsDispatchDispatchType == '2'){
                num += parseInt(getFieldValue('sellerNoType2_'+leadsDispatchStaffChooseArr[i]));
            }
        }
        //每个员工分配情况
        let flag = false;
        let index = 0;
        for(let i in leadsDispatchStaffContent){
            if(id == leadsDispatchStaffContent[i].id){
                index = i;
                if(e != '' && e != null && e != undefined && !isNaN(parseInt(e))){
                    leadsDispatchStaffContent[i].dispatchNum = parseInt(e);
                }else{
                    leadsDispatchStaffContent[i].dispatchNum = 0;
                }
                break;
            }
        }
        let alertContent = {};
        //如果当前修改的员工的已分配数+即将分配数超过最大分配数，flag = true
        for(let i in leadsDispatchStaffChooseArr){
            for(let j in leadsDispatchStaffContent){
                if(leadsDispatchStaffChooseArr[i] == leadsDispatchStaffContent[j].id){
                    if(parseInt(leadsDispatchStaffContent[j].hasNum) + parseInt(leadsDispatchStaffContent[j].dispatchNum) > parseInt(leadsDispatchStaffMaxLeadsNum)){
                        flag = true;
                        alertContent = leadsDispatchStaffContent[j];
                        break;
                    }
                }
            }
            if(flag){
                break;
            }
        }

        LeadsDispatchInputOnChange(num,flag,leadsDispatchStaffContent[index],index,alertContent);
    }

    //员工信息渲染
    let staffContent = [];     //自由选择
    if(leadsDispatchStaffContent && leadsDispatchStaffContent.length > 0){
        if(leadsDispatchDispatchType == '1'){
            staffContent = leadsDispatchStaffContent.map((item,index) => {
                return(
                    <Col span={ 8 } key={ index }>
                        <FormItem className = { styles.dispatch_input_num }>
                            {getFieldDecorator('sellerNoType1_' + item.id,{
                                initialValue : 0
                            })(
                               <InputNumber style = {{ width : 100 }} size = 'default' placeholder = '0' disabled = { getFieldValue('sellerIdType1_' + item.id) == undefined || getFieldValue('sellerIdType1_' + item.id) == '' || getFieldValue('sellerIdType1_' + item.id) == null ? true : false } onChange={(e) => InputOnChange(e,item.id)}/>
                            )}
                        </FormItem>

                        <FormItem className={ styles.dispatch_check_box }>
                            {getFieldDecorator('sellerIdType1_' + item.id , {
                                initialValue : []
                            })(
                                <CheckboxGroup options={[{ label : item.name + '' , value : item.id + '' }]} onChange={(e) => CheckBoxOnChange(e,item.id)}/>
                            )}
                        </FormItem>
                    </Col>
                );
            })
        }else if(leadsDispatchDispatchType == '2'){
            staffContent = leadsDispatchStaffContent.map((item,index) => {
                return(
                    <Col span={ 8 } key={ index }>
                        <FormItem className = { styles.dispatch_input_num }>
                            {getFieldDecorator('sellerNoType2_' + item.id,{
                                initialValue :
                                leadsDispatchStaffChooseArr.length == 0 ? 0 :
                                leadsDispatchStaffChooseArr.indexOf(item.id) > -1 ?
                                (parseInt(leadsDispatchUsefulLeadsNum)%leadsDispatchStaffChooseArr.length == 0 ?
                                    parseInt(leadsDispatchUsefulLeadsNum)/leadsDispatchStaffChooseArr.length :
                                    leadsDispatchStaffChooseArr.indexOf(item.id) < parseInt(leadsDispatchUsefulLeadsNum)%leadsDispatchStaffChooseArr.length ?
                                    parseInt(parseInt(leadsDispatchUsefulLeadsNum)/leadsDispatchStaffChooseArr.length) + 1 :
                                    parseInt(parseInt(leadsDispatchUsefulLeadsNum)/leadsDispatchStaffChooseArr.length)
                                ) : 0
                            })(
                               <InputNumber style = {{ width : 100 }} size = 'default' placeholder = '0' disabled = { true } onChange={(e) => InputOnChange(e,item.id)}/>
                            )}
                        </FormItem>

                        <FormItem className={ styles.dispatch_check_box }>
                            {getFieldDecorator('sellerIdType2_' + item.id , {
                                initialValue : []
                            })(
                                <CheckboxGroup options={[{ label : item.name + '' , value : item.id + '' }]} onChange={(e) => CheckBoxOnChange(e,item.id)}/>
                            )}
                        </FormItem>
                    </Col>
                );
            })
        }
    }

    return (
        <div className='dispatch_all_content'>
            <div className={styles.dispatch_leads_title}>
                <span>可分配数：<span>{ leadsDispatchUsefulLeadsNum }</span></span>
                <span>已分配数：{ !isNaN(leadsDispatchAlreadyDispatchLeadsNum) ? leadsDispatchAlreadyDispatchLeadsNum : 0 }</span>
                <span>剩余数：{ !isNaN(leadsDispatchAlreadyDispatchLeadsNum) && parseInt(leadsDispatchUsefulLeadsNum) - leadsDispatchAlreadyDispatchLeadsNum >= 0 ? parseInt(leadsDispatchUsefulLeadsNum) - leadsDispatchAlreadyDispatchLeadsNum : 0 }</span>
            </div>
            <div className={styles.dispatch_leads_content}>
                <div className={styles.dispatch_leads_alert}>
                    <span style={{fontSize:'1.16rem'}}>友情提醒：</span>
                    <p>1.若员工被选中而分配数未输入，则默认给此员工分配0个名单。</p>
                    <p>2.若使用平均分配模式，则由系统自动分配。若分配不合理，可选择自由分配。</p>
                    <p>注：已分配数≤可分配数{ parseInt(leadsDispatchAlreadyDispatchLeadsNum) > parseInt(leadsDispatchUsefulLeadsNum) ? '（已冲突）' : '' }。</p>
                </div>
                <Form className={styles.dispatch_leads_form}>
                    {/*<FormItem className={styles.dispatch_org_select}>
                        {getFieldDecorator('orgId', {
                            initialValue : (window._init_data.firstOrg).key,
                            rules : [
                                { required : true , message : '请选择所属校区' }
                            ]
                        })(
                            <TenantOrgFilter onChange={OrgSelectOnChange}/>
                        )}
                    </FormItem>*/}
                    <FormItem
                        label="分配方式"
                        className={styles.dispatch_radio_group}
                        {...formItemLayout}>
                        {getFieldDecorator('dispatchType',{
                            initialValue : leadsDispatchDispatchType
                        })(
                            <RadioGroup onChange={LeadsDispatchTypeOnChange}>
                                <Radio value='1'>自由分配</Radio>
                                <Radio value='2'>平均分配</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem
                        label="按角色筛选"
                        className={styles.dispatch_radio_group}
                        {...formItemLayout}>
                        {getFieldDecorator('roleId')(
                            <Select
                                allowClear = { true }
                                showSearch = { true }
                                optionFilterProp = 'children'
                                placeholder = '请选择角色'
                                style = {{ width : 155 }}
                                size = 'default'
                                onChange = {(e) => SearchStaffByRoleId(e)}>
                                { leadsDispatchRoleSelectContent && leadsDispatchRoleSelectContent.length > 0 ?
                                    leadsDispatchRoleSelectContent.map((item,index) => {
                                        return <Option value = { item.id + '' } key = { item.id + '' }>{ item.name }</Option>
                                    })
                                    :
                                    null
                                }
                            </Select>
                        )}
                    </FormItem>
                    <div className={styles.dispatch_leads_form_th}>
                        <div className={styles.dispatch_leads_form_th_inner}>
                            <p>操作/帐户名</p>
                            <p>数量</p>
                        </div>
                        <div className={styles.dispatch_leads_form_th_inner}>
                            <p>操作/帐户名</p>
                            <p>数量</p>
                        </div>
                    </div>
                    <CheckboxGroup>
                        <Row>
                            { staffContent || []}
                        </Row>
                    </CheckboxGroup>
                </Form>
                <QueueAnim
                    type={['top', 'top']}
                    ease={['easeOutQuart', 'easeInOutQuart']}>
                    { parseInt(leadsDispatchAlreadyDispatchLeadsNum) > parseInt(leadsDispatchUsefulLeadsNum) ?
                        <div key='dispatch_leads_alert' className={styles.dispatch_leads_alert}>
                            <span>温馨提示：</span>
                            <span>已分配数 > 可分配数，</span>
                            <span>请重新分配！</span>
                        </div>
                        :
                        null
                    }
                </QueueAnim>

                <QueueAnim
                    type={['top', 'top']}
                    ease={['easeOutQuart', 'easeInOutQuart']}>
                    { leadsDispatchAlertModalWetherAlert ?
                        <div key='dispatch_leads_staff_alert' className={styles.dispatch_leads_alert}>
                            <span style={{float:'left'}}>员工分配提醒：</span>
                            <div style={{float:'left'}}>
                                <p>员工姓名：{ leadsDispatchAlertModalStaff.name }</p>
                                <p>员工已有名单数：{ leadsDispatchAlertModalStaff.hasNum }</p>
                                <p>员工还能分配数：{ parseInt(leadsDispatchStaffMaxLeadsNum) - parseInt(leadsDispatchAlertModalStaff.hasNum)}</p>
                                <p>请重新分配！</p>
                            </div>
                        </div>
                        :
                        null
                    }
                </QueueAnim>
                {/*已分配数大于可分配数或者员工超过可分配数时不可提交*/}
                <div className={styles.dispatch_leads_submit_button}>
                    <Button style={{marginTop:20,float:'left'}} onClick={submit} type='primary' disabled = { parseInt(leadsDispatchAlreadyDispatchLeadsNum) > parseInt(leadsDispatchUsefulLeadsNum) || leadsDispatchAlertModalWetherAlert || leadsDispatchDispatchButtonLoading ? true : false } loading={leadsDispatchDispatchButtonLoading}>保存</Button>
                </div>
            </div>
            <ProgressBarModal content = '名单分配中，请耐心等待' type = 'fixed' visible = { leadsDispatchDispatchLoading }/>
        </div>
    );
};

export default Form.create()(LeadsFollowLeadsDispatch);
