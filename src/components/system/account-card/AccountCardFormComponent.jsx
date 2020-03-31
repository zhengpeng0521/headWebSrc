import React from 'react';
import styles from './AccountCardFormComponent.less';
import {Modal, Button,Form,Input,Select,InputNumber} from 'antd';
import TenantOrgSelect from '../../../pages/common/tenant-org-select/TenantOrgSelect';
import moment from 'moment';
let Option = Select.Option;

const FormItem = Form.Item;

function AccountCardFormComponent ({
    visible,                 //表单窗口是否显示
    loading,
    paymentList,
    formData,

    onClose,
    onSubmit,

    orgSelectVisible,
    openSelectOrg, //打开选择校区
    closeOrgSelect,//关闭选择校区
    onSelectFun,
    selectValue,
    form: {
        getFieldDecorator,
        getFieldValue,
        setFieldsValue,
        validateFields,
        resetFields,
        validateFieldsAndScroll,
    }
}) {

    //关闭窗口
    function onCloseClick() {
        resetFields();
        onClose && onClose();
    }
    //保存按钮
    function onSaveClick() {
        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
            onSubmit(values, onCloseClick);
        });
    }

    //查询当前已选择校区数量
    function currentOrgNum() {
        let organs = getFieldValue('organs');
        let num = 0;
        if(organs != undefined && organs != '') {
            let organ_arr = organs.split(',');
            if(organ_arr && organ_arr.length > 0) {
                num = organ_arr.length;
            }
        }
        return num;
    }

    //查询当前已选择校区
    function getCurrentOrg() {
        let organs = getFieldValue('organs');
        let organ_arr = [];
        if(organs != undefined && organs != '') {
            organ_arr = organs.split(',');
        }
        return organ_arr;
    }

    //修改校区选择
    function changeOrgSelect(orgSelect) {
        if(orgSelect && orgSelect.length > 0) {
            setFieldsValue({organs: orgSelect.join(',')});
        } else {
            setFieldsValue({organs: ''});
        }
        validateFields(['organs']);
        closeOrgSelect();
    }

    let formItemLayout = {
        labelCol: { span : 5 },
        wrapperCol: { span: 19 },
    };

    let orgSelectProps = {
        visible: orgSelectVisible,
        onClose: closeOrgSelect,
        afterSubmit: changeOrgSelect,
        init_org_select: getCurrentOrg(),
    };

    /*检验费率*/
    function checkRate(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(!/^[0-9]+(.[0-9]{1,3})?$/.test(value)) {
            callback(new Error('数字格式不正确'));
        }else if(parseFloat(value) >= 100 || parseFloat(value) < 0){
            callback('范围：[0,100)');
        }else {
            callback();
        }
    }

    return (
        <Modal
            title={(formData.id == undefined || formData.id == '') ? '新增收付款账号' : '编辑收付款账号'}
            visible={visible}
            maskClosable={false}
            closable={true}
			onCancel = { onCloseClick }
            width={550}
			className = 'account_card_modal'
			footer = {[
				<Button key = "accountCancelAction" onClick = { onCloseClick } >取消</Button>,
				<Button key = "accountConfirmAction" type = 'primary' onClick = { onSaveClick } style = {{ marginLeft : 10 }} >保存</Button>
			]}
        >
           <div className = 'account_card_form_cont' >
               <Form>
                    {getFieldDecorator('id', {
                        initialValue: formData.id,
                      })(
                        <Input type="hidden" />
                      )}
                    <FormItem
                      {...formItemLayout}
                      label="支付方式"
                    >
                    {getFieldDecorator('paymentkey', {
                        initialValue: formData.paymentkey,
                        rules: [{
                          required: true, message: '请选择支付方式',
                        }],
                      })(
                        <Select
                           placeholder="请选择支付方式"
                           allowClear
                           showSearch
                           optionFilterProp="children"
                           notFoundContent="没有支付方式"
                           disabled={getFieldValue('id') != undefined}
                           onSelect={onSelectFun}
                           style={{width: '100%'}}
                           size='default'>
                            {paymentList && paymentList.map(function(item) {
                                return (<Option key={item.key+''} value={item.key+''} >{item.value}</Option>);
                            })}
                        </Select>
                      )}
                    </FormItem>

                    <FormItem
                          {...formItemLayout}
                          label="支付方式名称"
                    >
                    {getFieldDecorator('name', {
                        initialValue: formData.name,
                        rules: [{
                          required: true, message: '请输入支付方式名称', whitespace: true,
                        }],
                      })(
                        <Input placeholder="请输入支付方式名称" size='default'/>
                      )}
                    </FormItem>

                   { selectValue == 'bank' ?
                        <FormItem
                              {...formItemLayout}
                              label="户名"
                        >
                        {getFieldDecorator('accountName', {
                            initialValue: formData.accountName,
                            rules: [{
                              required: true, message: '请输入户名', whitespace: true,
                            }],
                          })(
                            <Input placeholder="请输入户名" size='default' disabled={getFieldValue('id') != undefined}/>
                          )}
                        </FormItem>
                       :''
                    }

                    <FormItem
                          {...formItemLayout}
                          label="账号/卡号"
                    >
                    {getFieldDecorator('acctNo', {
                        initialValue: formData.acctNo,
                        rules: [{
                          required: true, message: '请输入账号/卡号', whitespace: true,
                        }],
                      })(
                        <Input placeholder="请输入账号/卡号" disabled={getFieldValue('id') != undefined} size='default'/>
                      )}
                    </FormItem>

                   { selectValue == 'alipay' ?
                       <FormItem
                              {...formItemLayout}
                              label="账号名称"
                        >
                        {getFieldDecorator('mPayAccount', {
                            initialValue: formData.mPayAccount,
                            rules: [{
                              required: true, message: '请输入支付宝账号名称', whitespace: true,
                            }],
                          })(
                            <Input placeholder="请输入支付宝账号名称" size='default' disabled={getFieldValue('id') != undefined}/>
                          )}
                        </FormItem>
                       : ''
                   }

                   { selectValue == 'bank' ?
                       <FormItem
                            {...formItemLayout}
                            label="开户行"
                            style={{lineHeight:'12px'}}>
                        {getFieldDecorator('ourBank', {
                            initialValue: formData.ourBank,
                            rules: [{
                              required: true, message: '请输入开户行', whitespace: true,
                            }],
                          })(
                            <Input placeholder="请输入开户行" size='default' disabled={getFieldValue('id') != undefined}/>
                          )}
                        </FormItem>
                       :
                       ''
                   }
                    <FormItem
                        {...formItemLayout}
                        label="费率"
                        extra='此费率用于合同订单中计算实际到账金额'
                    >
                        {getFieldDecorator('rate', {
                            initialValue: !isNaN(formData.rate + '') ? (formData.rate * 100).toFixed(3) + '' : undefined,
                            rules: [
                                { required : true , message : '请输入费率' , whitespace : true },
                                { validator : checkRate },
                            ],
                        })(
                            <Input style = {{ width : '100%' }} size='default' placeholder = '请输入费率[0,100),可精确到小数点后3位，不填则默认0' addonAfter = '%'/>
                        )}
                    </FormItem>

                   {!!false &&
                    <FormItem
                          {...formItemLayout}
                          label="覆盖校区"
                          style={{lineHeight:'12px'}}
                    >
                    {getFieldDecorator('organs', {
                        initialValue: formData.organs,
                        rules: [{
                          required: true, message: '请选择覆盖校区',
                        }],
                      })(
                        <div>
                            <span className={styles.current_org_num}>当前已选择{currentOrgNum()}家校区</span>
                            <Button type="primary" onClick={()=>openSelectOrg()}>选择校区</Button>
                        </div>
                      )}
                    </FormItem>
                   }
               </Form>

              <TenantOrgSelect {...orgSelectProps}/>
           </div>

        </Modal>
    );
}

export default Form.create()(AccountCardFormComponent);
