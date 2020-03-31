import React from 'react';
import { Checkbox , Input , Form, InputNumber, Button , Spin ,Radio } from 'antd';
import styles from './have-max-list.less';
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
/*考勤小票预览*/
function HaveMaxList({
    loading,                    //是否加载状态
    Status,                     //是否停用
    SaveHaveMaxList,         //保存按钮事件
    dataKey,
    checkedstatus,
    stopStatus,
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
    let arr=[];
    function SaveHaveMaxListFunction(){
        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
            let arr = [];
            let obj = {};
            obj.status = '1';
            obj.value = '销售最大名单数';
            if(checkedstatus == '1'){
                obj.key = values.num;
            }else if(checkedstatus == '-1'){
                obj.key = '-1';
            }
            arr.push(obj);
            SaveHaveMaxList(JSON.stringify(arr))
        });
    }
    //是否停用

    function stopStatusFunction(e){
       let data=e.target.value;
       stopStatus(data);
    }

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
                        <div className={styles.small_ticket_title_content}>最大拥有名单数是销售可以保有的最大名单数，已是会员的客户学员和家长不占用额度</div>
                    </div>
                    <div className={styles.lead_record_content}>

                        <Form className={styles.lead_record_form} >
                            <RadioGroup onChange={stopStatusFunction} value={checkedstatus} style={{paddingBottom:'10px'}}>
                                <Radio value='1'>使用</Radio>
                                <Radio value='-1'>停用</Radio>
                            </RadioGroup>
                            { checkedstatus == '1' &&
                                <FormItem
                                  {...formItemLayout}
                                >
                                  每个销售拥有的最大名单数为&nbsp;&nbsp;
                                  {getFieldDecorator('num', {
                                    initialValue:dataKey=='-1'?100 : dataKey,
                                    rules: [
                                            { required: checkedstatus == '1' ? true : false, message: '请填写最大名单数' },
                                            { validator :  validator },
                                        ],
                                  })(
                                       <InputNumber
                                            size="default"
                                            min={0}
                                            step={1}
                                            disabled={checkedstatus == '1' ? false : true}
                                        />
                                  )}
                                </FormItem>
                            }
                        </Form>
                        <Button type="primary" onClick={SaveHaveMaxListFunction}>保存</Button>
                    </div>
                </div>

            </Spin>
        </div>
    );
}

export default Form.create()(HaveMaxList);
