import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { Button, Input, Form, Icon, message } from 'antd';
import style from './WOfficeSetCodeUrlComponent.less';
import QRCode from 'qrcode.react';

function WOfficeSetCodeUrlComponent({
	url,
	code_tip,
	type,
}){

	//复制地址
    function copyLink(){
        var copyobject=document.getElementById( "copy-content" + type );
        copyobject.select();
        document.execCommand("Copy");
        message.success('复制成功');
    };

	return (
		<div className = 'wOffice_set_code_page'>
			<div className = 'wOffice_set_code_title' >
				<span></span>
				链接地址
			</div>
			<div>
				<div className = 'qr_code' >
					<QRCode value = { url || '' } size = { 200 } />
				</div>
				<div className = 'code_url'>
					<Input type = 'text' id = { 'copy-content' + type } value = { url } />
					<p className = 'code_url_tip'>{ code_tip }</p>
					<Button type = 'primary' id = "copyLink" onClick = { copyLink }>复制地址</Button>
				</div>
			</div>
		</div>
	)
};

export default WOfficeSetCodeUrlComponent;
