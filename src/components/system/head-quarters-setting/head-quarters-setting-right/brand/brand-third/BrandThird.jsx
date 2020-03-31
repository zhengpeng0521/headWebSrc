import React from 'react';
import { Form , Input , Button } from 'antd';
import styles from './BrandThird.less';
import render from '../BrandItem.json';
const FormItem = Form.Item;
const formItemLayout = {
    labelCol : { span : 3 },
    wrapperCol : { span : 20 }
};

function BrandThird({
    brandData,                      //品牌审核和成功后的回显品牌信息
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
            values.brandId = brandData.brandId || undefined;
            BrandSubmit(values,resetFields,'update');
        });
    }

    return(
        <div className = { 'brand_setting_third ' + styles.all }>
            {/*Input的autosize只有type=textarea时生效*/}
            { render && render.map((item,index) =>
                <FormItem
                    key = { item.key }
                    label = { item.label }
                    {...formItemLayout}>
                    {getFieldDecorator(item.key,{
                        initialValue : brandData[item.key],
                        rules : [
                            { required : item.key == 'brandName' , message : `请输入${item.label}` }
                        ]
                    })(
                        <Input type = { item.type } autosize = {{ minRows : 4 , maxRows : 4 }} placeholder = { `请输入${item.label}` } style = {{ width : item.width }} size = 'default' disabled = { item.key == 'brandName' }/>
                    )}
                </FormItem>
            ) }
            <Button type = 'primary' className = { styles.submit } onClick = { submit } disabled = { buttonLoading } loading = { buttonLoading }>修改</Button>
        </div>
    )
}

export default Form.create()(BrandThird);
