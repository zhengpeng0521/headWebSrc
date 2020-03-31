import React from 'react';
import styles from './ModuleBarComponent.less';
import {Button,Form,Input,Upload,Icon,message,} from 'antd';

const FormItem = Form.Item;

/**
 * 自定义模板-基本属性表单
 * 表单组件
 */
function ShareInfoBar ({
    formData, resetShareImage,
    form: {
        getFieldDecorator,
        getFieldValue,
        setFieldsValue,
        validateFields,
        resetFields,
        getFieldError,
        setFields,
        validateFieldsAndScroll,
    }
}) {

    //分享图片还原默认
    function handleResetShareImage() {
        resetFields(['shareImgList']);
        resetShareImage && resetShareImage();
    }

    function normFile(e) {
        let fileList = [];
        if (Array.isArray(e)) {
            fileList = e;
        } else {
            fileList = e && e.fileList;
        }

        fileList && fileList.length > 0 && fileList.map(function(item, index) {

            if(item.response && (item.response.errorCode == 9000) && item.response.data && item.response.data.url) {
                item.url = item.response.data.url;
            } else if(item.response && item.response.errorCode == 5000){

                setFields({
                    musicList: {
                        value: [],
                        errors: [new Error((item.response && item.response.errorMessage) || '文件上传失败!')],
                    }
                });
                fileList = [];
            }
        });

        return fileList;
    }

    /*校验图片*/
    function beforeUpload(file) {
		if(file.size > 1232896) {
			message.error('文件大小不能超过1M');
			return false;
		}
		return true;
    }

    let formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 18 },
    };

    let info_input_style = {
        width: '100%',
        float: 'inherit',
        marginTop: 'auto',
        marginRight: 'auto'
    };

    let uploadMusicProps = {
        // action: BASE_URL+'/uploadController/upload',
        action : '/thinknode/upload/image',
        listType: "picture-card",
        beforeUpload : beforeUpload,
        withCredentials: true,//上传请求时是否携带 cookie
    };

    let initFileList = [];
    if(formData && formData.share_img && formData.share_img.length > 0) {
        initFileList.push({
            uid: -1,
            name: 'share_img',
            status: 'done',
            url: formData.share_img,
        });
    }

    let share_max_title_word = formData.share_max_title_word || 10;
    let share_max_intro_word = formData.share_max_intro_word || 50;

    return (
        <div className={styles.bar_info_cont}>

            <FormItem
              {...formItemLayout}
              label='分享标题'
              help={(
                <div>
                    <p>分享标题, 不超过{share_max_title_word}字</p>
                    <span className={styles.form_validate_msg}>{(getFieldError('share_title') || []).join(', ')}</span>
                </div>
               )}
             >
                 {getFieldDecorator('share_title', {
                    initialValue: formData && formData.title,
                    rules: [{ required: true, max: share_max_title_word, message: '请输入分享标题!' }],
                  })(
                    <Input placeholder="请输入分享的标题" style={info_input_style} />
                  )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='分享简介'
              help={(
                <div>
                    <p>分享简介, 不超过{share_max_intro_word}字</p>
                    <span className={styles.form_validate_msg}>{(getFieldError('share_intro') || []).join(', ')}</span>
                </div>
               )}
             >
                 {getFieldDecorator('share_intro', {
                    initialValue: formData && formData.intro,
                    rules: [{ required: true, max: share_max_intro_word, message: '请输入分享简介!' }],
                  })(
                    <Input placeholder="请输入分享简介" style={info_input_style} />
                  )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='分享图片'
              help={(
                <div style={{marginTop: '-5px', display: 'block', width: '100%', float: 'left'}}>
                    <p>图片大小≤1M, 支持png,jpeg,gif格式</p>
                    <span className={styles.form_validate_msg}>{(getFieldError('shareImgList') || []).join(', ')}</span>
                    <Button type="ghost" className={styles.upload_reset_btn} onClick={()=>handleResetShareImage()}>还原默认</Button>
                </div>
               )}
             >
                 {getFieldDecorator('shareImgList', {
                    initialValue: initFileList,
                    valuePropName: 'fileList',
                    getValueFromEvent: normFile,
                    rules: [{ required: true, message: '请选择分享图片!' }],
                  })(
                     <Upload {...uploadMusicProps} >
                     {(getFieldValue('shareImgList') && getFieldValue('shareImgList').length > 0) ?
                        null
                        :
                        <div>
                            <Icon type="plus" />
                            <div >选择图片</div>
                        </div>
                     }
                    </Upload>
                  )}
            </FormItem>


        </div>
    );
}

export default ShareInfoBar;
