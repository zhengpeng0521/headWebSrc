import React from 'react';
import { Form , Input , Button , Upload , Icon , message } from 'antd';
import styles from './HeadDetail.less';
import render from './HeadDetailItem.json';
const FormItem = Form.Item;
const formItemLayout = {
    labelCol : { span : 3 },
    wrapperCol : { span : 20 }
};

function HeadDetail({
    dp,                                 //dispatch方法
    headDetailData,                     //总部信息数据
    headDetailSubmitButtonLoading,      //总部信息提交按钮加载状态
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
        validateFieldsAndScroll((errors,data) => {
            if (!!errors) {
                return;
            }
            //处理图片上传
            if(!!data && !!data.imgurl && data.imgurl.length > 0){
                data.imgurl = !!data.imgurl[0] && !!data.imgurl[0].url ? data.imgurl[0].url : data.imgurl[0].response.data.url
            }else{
                data.imgurl = undefined;
            }
            dp('headQuartersSetting/HeadDetailSubmit',{ data , clear : resetFields  })
        });
    }

    let logoImgurlUploadProps = {
        name: 'file',
        action : '/thinknode/upload/image',
        listType: 'picture-card',
        headers: {
            authorization: 'authorization-text',
        },
        beforeUpload:(file,fileList) => {
            if((file.size / 1024 / 1024) > 1){
                message.warn('上传图片超过限制');
                return false;
            }
        },
        onChange:(info) => {
            if(info.file.status != 'uploading' && info.file.status != 'removed' && info.file.response && info.file.response.errorCode != 9000) {
                message.error(info.file.response.errorMessage || `${info.file.name} 上传失败`);
            }
            if(info.file.status === 'done' && info.file.response.errorCode == 9000) {
                message.success(`${info.file.name} 上传成功`);
            }
            if(info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败`);
            }
        }
    };

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    return(
        <div className = { 'head_detail_setting ' + styles.all }>
            { render && render.map((item,index) => {
                if(item.type == 'upload'){
                    return(
                        <FormItem
                            key = { item.key }
                            label = { item.label }
                            extra = "支持png、jpg、jpeg、gif格式的图片，建议尺寸240*50，大小不超过1M!"
                            className = 'head_detail_setting_logo_upload'
                            {...formItemLayout}
                        >
                            {getFieldDecorator(item.key, {
                                initialValue : !!headDetailData && !!headDetailData.imgurl ? [{
                                    uid : -1,
                                    url : headDetailData.imgurl
                                }] : [],
                                valuePropName : 'fileList',
                                normalize : normFile,
                            })(
                                <Upload {...logoImgurlUploadProps}>
                                     { getFieldValue(item.key) && getFieldValue(item.key).length > 0 ?
                                        null
                                        :
                                        <div>
                                            <Icon type = 'plus' style = {{ fontSize : '27px' }}/>
                                            <div>总部LOGO</div>
                                        </div>
                                     }
                                </Upload>
                            )}
                        </FormItem>
                    )
                }else{
                    return(
                        <FormItem
                            key = { item.key }
                            label = { item.label }
                            {...formItemLayout}>
                            {getFieldDecorator(item.key,{
                                initialValue : !!headDetailData && headDetailData[item.key] ? headDetailData[item.key] : undefined,
                                rules : [
                                    { required : !!item.required ? item.required : false , message: `${item.label}不能为空` , whitespace : !!item.required ? item.required : false },
                                ]
                            })(
                                <Input placeholder = { `请输入${item.label}` } style = {{ width : item.width }} size = 'default'/>
                            )}
                        </FormItem>
                    )
                }
            }) }
            <Button type = 'primary' className = { styles.submit } onClick = { submit } disabled = { headDetailSubmitButtonLoading } loading = { headDetailSubmitButtonLoading }>保存</Button>
        </div>
    )
}

export default Form.create()(HeadDetail);
