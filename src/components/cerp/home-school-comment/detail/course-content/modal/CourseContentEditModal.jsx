import React from 'react';
import { Modal , Form , Button , Rate , Input , Upload , Icon , Spin , message } from 'antd';
import styles from './CourseContentEditModal.less';
const FormItem = Form.Item;
const formItemLayout = {
    labelCol : { span : 3 },
    wrapperCol : { span : 21 }
}

/*上课内容编辑*/
function CourseContentEditModal({
    courseContentEditModalVisible,          //上课内容编辑modal是否显示
    courseContentEditModalLoading,          //上课内容编辑modal加载状态
    courseContentEditModalData,             //上课内容编辑modal回填数据

    CloseContentEditModal,                  //上课内容编辑modal关闭
    SubmitContentEditModal,                 //上课内容编辑modal提交
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
}){
    //转化学员提交
    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if (!!errors) {
                return;
            }
            //处理orgId
            values.orgId = courseContentEditModalData.orgId;

            //处理cpdId和cpmId
            values.cpdId = courseContentEditModalData.cpdId;
            values.cpmId = courseContentEditModalData.cpmId;

            //处理课堂图片
            let pictures = [];
            if(values.pictures && values.pictures.length > 0){
                values.pictures.map((item,index) => {
                    if(item.url){
                        pictures.push(item.url);
                    }else if(!!item.response.data && item.response.data.url){
                        pictures.push(item.response.data.url);
                    }
                })
            }
            values.pictures = JSON.stringify(pictures);
            values.picNum = pictures.length;

            SubmitContentEditModal(values);
        });
    }

    //关闭
    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        CloseContentEditModal();
    }

    //模态框的属性
    let modalOpts = {
        title: `${courseContentEditModalData.courseName || '--'}`,
        maskClosable : false,
        visible : courseContentEditModalVisible,
        closable : true,
        width : 550,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : [
            <Button key = "cancel" type = "ghost" onClick = { handleCancel }>取消</Button>,
            <Button key = "submit" type = "primary"
                    onClick = { handleComplete }
                    disabled = { courseContentEditModalLoading }
                    loading = { courseContentEditModalLoading }
                    style = {{ marginLeft : 20 }}>保存</Button>
        ],
        className : 'home_and_school_course_content_edit_modal'
    };

    //检查字数(不超过300字)
    function checkWordLength(rule, value, callback){
        if(!!value && value.length > 300){
            callback('字数不能超过300');
        }else{
            callback();
        }
    }

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    let imgurlUploadProps = {
        name: 'file',
        action : '/thinknode/upload/image',
        // action: `${BASE_URL}/uploadController/upload`,
        listType: 'picture-card',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if(info.file.status != 'uploading' && info.file.response && info.file.response.errorCode != '9000') {
                return message.error(info.file.response.errorMessage || `${info.file.name} 上传失败`);
                message.error(info.file.response.errorMessage || `${info.file.name} 上传失败`);
    		}
            if(info.file.status == 'done') {
                if(info.file.response && info.file.response.errorCode == '9000'){
                    return message.success(`${info.file.name} 上传成功`);
                    message.success(`${info.file.name} 上传成功`);
                }else{
                    return message.error(`${info.file.name} 上传失败`);
                    message.error(`${info.file.name} 上传失败`);
                }
            }
            if(info.file.status == 'error') {
                return message.error(`${info.file.name} 上传失败`);
                message.error(`${info.file.name} 上传失败`);
            }
            if(info.file.status == 'remove'){
                return message.error(`${info.file.name} 移除成功`);
            }
        },
        beforeUpload(file) {
            const imgLimit = file.size / 1024 / 1024 < 5;
            if (!imgLimit) {
                message.error('图片大小不大于5M!');
                return false;
            }
            return true;
        },
    };

    return(
        <Modal {...modalOpts}>
            <Spin spinning = { courseContentEditModalLoading }>
                <FormItem
                    label = "课堂内容"
                    {...formItemLayout}
                >
                    {getFieldDecorator('content' , {
                        initialValue : courseContentEditModalData.content || undefined,
                        rules : [
                            { validator : checkWordLength },
                        ]
                    })(
                        <Input placeholder = '请填写课堂内容（限300字）' size = 'default' type = 'textarea' autosize = {{ minRows : 3 , maxRows : 4 }}/>
                    )}
                </FormItem>
                <FormItem
                    label = "课后作业"
                    {...formItemLayout}
                >
                    {getFieldDecorator('homework' , {
                        initialValue : courseContentEditModalData.homework || undefined,
                        rules : [
                            { validator : checkWordLength },
                        ]
                    })(
                        <Input placeholder = '请填写课后作业（限300字）' size = 'default' type = 'textarea'  autosize = {{ minRows : 3 , maxRows : 4 }}/>
                    )}
                </FormItem>
                <FormItem
                    label = "课堂图片"
                    help = "最多3张，支持png、jpg、jpeg、gif格式的图片，不大于5M!"
                    className = 'home_and_school_course_content_edit_modal_upload_pic'
                    {...formItemLayout}
                >
                    {getFieldDecorator('pictures' , {
                        initialValue: courseContentEditModalData.picList && courseContentEditModalData.picList.length > 0 ? courseContentEditModalData.picList.slice(0,3) : [],
                        valuePropName: 'fileList',
                        normalize: normFile,
                    })(
                        <Upload {...imgurlUploadProps}>
                             { getFieldValue('pictures') && getFieldValue('pictures').length >= 3 ?
                                null
                                :
                                <div>
                                    <Icon type = 'plus' />
                                    <div>选择图片</div>
                                </div>
                             }
                        </Upload>
                    )}
                </FormItem>
            </Spin>
        </Modal>
    );
}

export default Form.create()(CourseContentEditModal);
