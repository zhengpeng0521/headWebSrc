import React from 'react';
import { Form , Input , Button , message } from 'antd';
import { ProgressBar } from '../../common/new-component/NewComponent';
import styles from './ClassScheduleTimeSet.less';

/*课程表时间设置*/
function ClassScheduleTimeSet({
    loading,                //整个页面loading状态
    buttonLoading,          //按钮loading状态
    startTime,              //时间范围开始时间
    endTime,                //时间范围结束时间
    initialArr,             //查询获取到的数据，提交时需要更新此数组[0]的key

    FormSubmit,             //提交保存
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
}) {

    function submit(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if (!!errors) {
                return;
            }
            if(parseFloat(values.begin) >= parseFloat(values.end)){
                return message.warn('起始时间不能晚于结束时间');
            }

            //处理key
            values.confKey = 'CPTIMESET';

            //处理数组
            initialArr[0].key = values.begin + '-' + values.end;
            values.value = JSON.stringify(initialArr);
            delete values.begin;
            delete values.end;

            FormSubmit(values)
        });
    }

    /*检验手机号码*/
    function checkMobile(rule, value, callback){
        if(!(/^(0|[1-9]\d*)$/.test(value))){
            callback('请输入0-23整数');
        }else if(parseFloat(value) < 0 || parseFloat(value) > 23){
            callback('请输入0-23整数');
        }else{
            callback();
        }
    }

    if(loading){
        return(
            <ProgressBar height = '80%'/>
        );
    }else{
        return(
            <div className={styles.all}>
                <div className={styles.title}>
                    <div className={styles.title_block}></div>
                    <div className={styles.title_content}>时段设置用来控制课程表显示的最早和最晚时间(可填范围为0-23)</div>
                </div>
                <Form className='zj_set_classScheduleTimeSet_form'>
                    <Form.Item
                        label = ""
                    >
                        { getFieldDecorator('begin',{
                            initialValue : startTime || undefined,
                            rules : [
                                { required : true , message : '请选择起始时间' , whitespace : true },
                                { validator: checkMobile }
                            ]
                        })(
                            <Input placeholder = '起始' size = 'default' style = {{ width : 80 }} addonAfter = ': 00'/>
                        )}
                    </Form.Item>
                    <Form.Item
                        label = ""
                    >
                        { getFieldDecorator('end',{
                            initialValue : endTime || undefined,
                            rules : [
                                { required : true , message : '请选择结束时间' , whitespace : true },
                                { validator: checkMobile }
                            ]
                        })(
                            <Input placeholder = '结束' size = 'default' style = {{ width : 80 }} addonAfter = ': 00'/>
                        )}
                    </Form.Item>
                </Form>
                <Button type = 'primary' size = 'default' onClick = { submit } loading = { buttonLoading } disabled = { buttonLoading } >提交</Button>
            </div>
        );
    }
}

export default Form.create()(ClassScheduleTimeSet);;
