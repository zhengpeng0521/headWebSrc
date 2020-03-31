import React from 'react';
import { Form, Upload, Icon, Button, message, Popconfirm } from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './OrgLogo.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 18,
  },
};

/*机构logo*/
function OrgLogo({
    componentsExist,            //组件是否挂载
    imgUrl,                     //图片地址
    saveButtonLoading,          //保存按钮加载状态
    UpdateOrgLogo,              //点击保存校区logo图片
    UseDefaultPic,              //点击使用默认图
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

    let imgurlUploadProps = {
        name: 'file',
        // action: `${BASE_URL}/uploadController/upload`,
        action : '/thinknode/upload/image',
        listType: 'picture-card',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if(info.file.status != 'uploading' && info.file.response && info.file.response.errorCode != 9000) {
                return message.error(info.file.response.errorMessage || `${info.file.name} 上传失败`);
    		}
            if (info.file.status === 'done') {
                message.success(`${info.file.name} 上传成功`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败`);
            }
        },
        beforeUpload(file) {
            let imgurl_list = getFieldValue('imgUrl');
            if(imgurl_list && imgurl_list.length > 0) {
                message.error('只能选择一张logo图');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('图片大小不大于2M!');
                return false;
            }
            return true;
        },
    };

    let url = imgUrl == '' || imgUrl == null || imgUrl == undefined ? 'https://img.ishanshan.com/gimg/img/fa78332e0d89045a645a31c6f34ef223' : imgUrl
    let displayImg = [{
        uid : -1,
        url : url,
        name : 'orgLogo',
        thumbUrl : url,
    }];

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    let uploadButton = (
    	<div>
    		<Icon type = 'plus' />
    		<div>选择LOGO</div>
    	</div>
    );

    return(
        <div style={{width:'100%',padding:'20px'}}>
            <FormItem
                className='zj_org_logo'
                {...formItemLayout}
            >
                {getFieldDecorator('imgUrl', {
                    initialValue: displayImg,
                    valuePropName: 'fileList',
                    normalize: normFile,
                })(
                    <Upload {...imgurlUploadProps} >
                         { getFieldValue('imgUrl') && getFieldValue('imgUrl').length >= 1 ?  null : uploadButton }
                    </Upload>
                )}
            </FormItem>
            <div style={{marginBottom:'40px',color:'#000000'}}>支持png、jpg、jpeg、gif格式的图片（建议使用透明png图片），尺寸240x50，大小不超过2M!</div>
            <div>
                <Button type='primary' style={{marginRight:'10px'}} disabled = { saveButtonLoading } loading={saveButtonLoading} onClick={() => UpdateOrgLogo(getFieldValue('imgUrl'))} >保存</Button>
                <Popconfirm placement="bottomLeft" title={<span>默认图将直接替换并保存，是否继续</span>} onConfirm={UseDefaultPic} okText="是" cancelText="否">
                    <Button type='ghost' disabled = { saveButtonLoading } loading={saveButtonLoading}>使用默认图</Button>
                </Popconfirm>
            </div>
        </div>
    );
}

export default Form.create()(OrgLogo);
