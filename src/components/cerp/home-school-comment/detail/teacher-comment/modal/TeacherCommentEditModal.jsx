import React from 'react';
import { Modal , Form , Button , Rate , Input , Upload , Icon , Spin , message } from 'antd';
import styles from './TeacherCommentEditModal.less';
const FormItem = Form.Item;
const formItemLayout = {
    labelCol : { span : 3 },
    wrapperCol : { span : 21 }
}

/*老师评价编辑*/
function TeacherCommentEditModal({
    teacherCommentEditModalVisible,         //老师评价编辑modal是否显示
    teacherCommentEditModalLoading,         //老师评价编辑modal加载状态
    teacherCommentEditModalData,            //老师评价编辑modal回填数据

    CloseCommentEditModal,                  //老师评价编辑modal关闭
    SubmitCommentEditModal,                 //老师评价编辑modal提交
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
            values.orgId = teacherCommentEditModalData.org_id;

            //处理cpStuId
            values.cpStuId = teacherCommentEditModalData.cp_stu_id;

            //处理type
            values.type = teacherCommentEditModalData.type;

            //处理cpdId和cpmId
            values.cpdId = teacherCommentEditModalData.cpd_id;
            values.cpmId = teacherCommentEditModalData.cpm_id;
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

            SubmitCommentEditModal(values);
        });
    }

    //关闭
    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        CloseCommentEditModal();
    }

    //模态框的属性
    let modalOpts = {
        title: `老师评价（${teacherCommentEditModalData.stu_name || '--'}）`,
        maskClosable : false,
        visible : teacherCommentEditModalVisible,
        closable : true,
        width : 550,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : [
            <Button key = "cancel" type = "ghost" onClick = { handleCancel }>取消</Button>,
            <Button key = "submit" type = "primary"
                    onClick = { handleComplete }
                    disabled = { teacherCommentEditModalLoading }
                    loading = { teacherCommentEditModalLoading }
                    style = {{ marginLeft : 20 }}>保存</Button>
        ],
        className : 'home_and_school_teacher_comment_edit_modal'
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
        // action: `${BASE_URL}/uploadController/upload`,
        action : '/thinknode/upload/image',
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


     let initialValueImg3 = [
        { uid : -1,
          url : 'https://img.ishanshan.com/gimg/img/fa78332e0d89045a645a31c6f34ef223',
          thumbUrl : 'https://img.ishanshan.com/gimg/img/fa78332e0d89045a645a31c6f34ef223',
        },
//        { uid : -2,
//          url : 'https://img.ishanshan.com/gimg/img/fa78332e0d89045a645a31c6f34ef223',
//          thumbUrl : 'https://img.ishanshan.com/gimg/img/fa78332e0d89045a645a31c6f34ef223',
//        },
//        { uid : -3,
//          url : 'https://img.ishanshan.com/gimg/img/fa78332e0d89045a645a31c6f34ef223',
//          thumbUrl : 'https://img.ishanshan.com/gimg/img/fa78332e0d89045a645a31c6f34ef223',
//        },
//        { uid : -4,
//          url : 'https://img.ishanshan.com/gimg/img/fa78332e0d89045a645a31c6f34ef223',
//          thumbUrl : 'https://img.ishanshan.com/gimg/img/fa78332e0d89045a645a31c6f34ef223',
//        }
    ]

    return(
        <Modal {...modalOpts}>
            <Spin spinning = { teacherCommentEditModalLoading }>
                <FormItem
                    label = "综合评分"
                    {...formItemLayout}
                >
                    {getFieldDecorator('score', {
                        initialValue : teacherCommentEditModalData && teacherCommentEditModalData.score && !isNaN(teacherCommentEditModalData.score + '') ? parseFloat(teacherCommentEditModalData.score) : 0,
                    })(
                        <Rate/>
                    )}
                </FormItem>
                <FormItem
                    label = "上课图片"
                    help = "最多3张，支持png、jpg、jpeg、gif格式的图片，不大于5M!"
                    className = 'home_and_school_teacher_comment_edit_modal_upload_pic'
                    {...formItemLayout}
                >
                    {getFieldDecorator('pictures' , {
                        initialValue: teacherCommentEditModalData.picList.slice(0,3),
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
                <FormItem
                    label = "老师点评"
                    {...formItemLayout}
                >
                    {getFieldDecorator('comment',{
                        initialValue : teacherCommentEditModalData && !!teacherCommentEditModalData.comment ? teacherCommentEditModalData.comment + '' : undefined,
                        rules : [
                            { validator : checkWordLength },
                        ]
                    })(
                        <Input type = 'textarea' placeholder = '请填写老师点评（限300字）' autosize = {{ minRows : 3 , maxRows : 4 }} />
                    )}
                </FormItem>
            </Spin>
        </Modal>
    );
}

export default Form.create()(TeacherCommentEditModal);
