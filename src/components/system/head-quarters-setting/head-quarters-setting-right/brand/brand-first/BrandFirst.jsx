import React from 'react';
import { Form , Input , Button } from 'antd';
import styles from './BrandFirst.less';
import render from '../BrandItem.json';
const FormItem = Form.Item;
const formItemLayout = {
    labelCol : { span : 3 },
    wrapperCol : { span : 20 }
};

function BrandFirst({
    buttonLoading,                  //提交审核按钮加载状态
    BrandSubmit,                    //品牌信息提交
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        setFieldsValue,
        validateFieldsAndScroll,
    }
}){

    function submit(e){
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if (!!errors) {
                return;
            }
            BrandSubmit(values,resetFields,'create');
        });
    }

    return(
        <div className = { 'brand_setting_first ' + styles.all }>
            {/*Input的autosize只有type=textarea时生效*/}
            { render && render.map((item,index) =>
                <FormItem
                    key = { item.key }
                    label = { item.label }
                    {...formItemLayout}>
                    {getFieldDecorator(item.key,{
                        rules : [
                            { required : item.key == 'brandName' , message : `请输入${item.label}` }
                        ]
                    })(
                        <Input type = { item.type } autosize = {{ minRows : 4 , maxRows : 4 }} placeholder = { `请输入${item.label}` } style = {{ width : item.width }} size = 'default'/>
                    )}
                </FormItem>
            ) }
            <Button type = 'primary' className = { styles.submit } onClick = { submit } disabled = { buttonLoading } loading = { buttonLoading }>提交审核</Button>
        </div>
    )
}

export default Form.create()(BrandFirst);
