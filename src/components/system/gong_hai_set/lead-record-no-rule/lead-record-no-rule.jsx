import React from 'react';
import { Checkbox , Input , Form, InputNumber, Button , Spin ,Radio } from 'antd';
import styles from './lead-record-no-rule.less';
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
/*考勤小票预览*/
function LeadRecordNoRule({
    loading,                    //是否加载状态
    SaveLeadRecordNoRule,         //保存按钮事件
    dataKey,
    checkedstatus,
    stopStatus,

    tmkStatus,
    stopTmkStatus,
    tmkTimeOut,
    form : {
		getFieldDecorator,
        validateFields,
        getFieldValue,
        getFieldsValue,
        resetFields,
        validateFieldsAndScroll,
	},
}) {

    //表单布局
	let formItemLayout = {
		labelCol : { span : 20 },
		wrapperCol : { span : 40 },
	};


    //点击保存
    function SaveLeadRecordNoRuleFunction(){

        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
            values.status = checkedstatus;
            SaveLeadRecordNoRule(values);
        });
    }
    //校验天数
    function validator(rule, value, callback) {
		if (!/^(0|[1-9][0-9]*)$/.test(value)) {
            callback(new Error('请填写≥0的整数'));
        }else {
            callback();
        }
	}

    return(
        <div className={styles.small_ticket_all_content}>
            <Spin spinning={loading}>
                <div className={styles.small_ticket_preview}>
                    <div className={styles.small_ticket_title}>
                        <div className={styles.small_ticket_title_block}></div>
                        <div className={styles.small_ticket_title_content}>校区名单回收</div>
                    </div>
                    <div className={styles.lead_record_content}>

                        <Form className={styles.lead_record_form} >
                            <RadioGroup onChange={stopStatus} value={checkedstatus+''} className={styles.lead_record_form_radio}>
                                <Radio value='1'>启用</Radio>
                                <Radio value='2'>停用</Radio>
                            </RadioGroup>
                             { checkedstatus == '1' &&
                                <FormItem
                                  {...formItemLayout}
                                  style={{paddingLeft: 20}}
                                >
                                  超过&nbsp;&nbsp;
                                  {getFieldDecorator('timeOut', {
                                   rules: [
                                            { required:checkedstatus == '1' ? true : false , message: '请填写天数' },
                                            { validator : validator },
                                        ],
                                    initialValue: dataKey || undefined,
                                  })(
                                       <InputNumber
                                            size="default"
                                            min={0}
                                            max={30}
                                            step={1}
                                            disabled={checkedstatus == '1' ? false : true}
                                        />
                                  )}&nbsp;&nbsp;天校区公海池没有进行分配或跟进操作，自动回收至总部公海
                                </FormItem>
                            }

                            {/* <div className={styles.small_ticket_title}>
                                <div className={styles.small_ticket_title_block}></div>
                                <div className={styles.small_ticket_title_content}>TMK名单回收</div>
                            </div>

                            <RadioGroup onChange={stopTmkStatus} value={tmkStatus+''} className={styles.lead_record_form_radio}>
                                <Radio value='1'>启用</Radio>
                                <Radio value='2'>停用</Radio>
                            </RadioGroup>
                             { tmkStatus == '1' &&
                                <FormItem
                                  {...formItemLayout}
                                  style={{paddingLeft: 20}}
                                >
                                  超过&nbsp;&nbsp;
                                  {getFieldDecorator('tmkTimeOut', {
                                   rules: [
                                            { required:tmkStatus == '1' ? true : false , message: '请填写天数' },
                                            { validator : validator },
                                        ],
                                    initialValue: tmkTimeOut || undefined,
                                  })(
                                       <InputNumber
                                            size="default"
                                            min={0}
                                            max={30}
                                            step={1}
                                            disabled={tmkStatus == '1' ? false : true}
                                        />
                                  )}&nbsp;&nbsp;天TMK个人池没有进行预约、分配、跟进操作，自动回收至TMK公海池
                                </FormItem>
                            } */}
                        </Form>
                        <Button type="primary" onClick={SaveLeadRecordNoRuleFunction}>保存</Button>
                    </div>
                </div>

            </Spin>
        </div>
    );
}

export default Form.create()(LeadRecordNoRule);
