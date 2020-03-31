import React from 'react';
import { Form, Modal, Input, Button, message } from 'antd';
import QRCode from 'qrcode.react';
import style from './WxActivityCodeUrlModal.less';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
const FormItem = Form.Item;

function WxActivityCodeUrlModal({
    url,
    urlOrgId,
    urlOrgIds,
    codeUrlModalVisible,

    TenantOrgFilterAction,
    closeWxActivityCodeUrlModal,

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
    function itemDisabledFunc( key ){
        if( urlOrgIds && urlOrgIds.indexOf( key ) != -1 ){
            return false;
        }else {
            return true;
        }
    };

    //校区下拉列表属性
    let tenantOrgSelectProps = {
        width            : 300,
        onChange         : TenantOrgFilterAction,            //改变机构触发事件
        itemDisabledFunc : itemDisabledFunc,
    };

    //模态框关闭后的回调
    function afterClose(){
        resetFields();
    };

    //复制地址
    function copyLink(){
        var copyobject=document.getElementById("copy-content");
        copyobject.select();
        document.execCommand("Copy");
        message.success('复制成功');
    };

	return(
       <Modal
            className = "yhwu_wx_activity_code"
            visible   = { codeUrlModalVisible }
            maskClosable = { false }
            width     = '330px'
            onCancel  = { closeWxActivityCodeUrlModal }
            afterClose = { afterClose }
            footer    = { null }
        >
            <Form style = {{ marginTop: '25px' }} >
                <FormItem>
					{ getFieldDecorator('orgId',{
						initialValue : urlOrgId || '',
						rules : [
							{ required : true , message : '选择校区' }
						]
					})(
                        <TenantOrgSelect { ...tenantOrgSelectProps } />
					)}
				</FormItem>
            </Form>
            <QRCode value = { url || '' } size = { 300 } />
            <p style = {{ marginBottom : '10px' }} className="game_search_base_create_ui_div_po_qr_code_div_wx_title">请用微信扫一扫</p>
            <Input  style = {{ width : '72%' }} type = 'text' id = 'copy-content' value = { url } />
            <Button type = 'primary' style = {{ width : '26%' ,marginLeft : '2%' }} id = "copyLink" onClick = { copyLink }>复制</Button>
        </Modal>
	)
};

export default Form.create({})(WxActivityCodeUrlModal);
