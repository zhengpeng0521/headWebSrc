import React from 'react';
import { Form , Icon , Button , Input , Spin } from 'antd';
import { BlockTitle } from '../../common/new-component/NewComponent';
import QueueAnim from 'rc-queue-anim';
import styles from './CourseNumAlert.less';
const formItemLayout = {
  labelCol : { span : 15 },
  wrapperCol : { span: 4 },
};

/*课时预警提醒*/
function CourseNumAlert({
    information,                //课时信息
    loading,                    //按钮和整个页面加载状态

    SaveCourseLeastNum,         //点击保存
    form: {
        getFieldDecorator,
        validateFields,
        setFieldsValue,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
    },
  }) {

    return(
        <div className={styles.all}>
            <Spin spinning = { loading }>
                <BlockTitle content = '续费提醒'/>
                <div className = {styles.course}>
                    <span>课时小于(包括)</span>
                    <Form.Item
                        {...formItemLayout}>
                        {getFieldDecorator('course', {
                            initialValue : information.key || '10',
                        })(
                            <Input size = 'default' style = {{ width : 60 }}/>
                        )}
                    </Form.Item>
                    <span>进行提醒</span>
                </div>
                <Button type = 'primary' onClick = { () => SaveCourseLeastNum(getFieldValue('course')) } loading = { loading } disabled = { loading } >保存</Button>
            </Spin>
        </div>
    );
}

export default Form.create()(CourseNumAlert);
