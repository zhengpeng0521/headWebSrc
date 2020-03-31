import React from 'react';
import {Modal, Button, Icon, Input, message,} from 'antd';
import styles from './GameInstPreviewModal.less';

import QRCode from 'qrcode.react';

/**
 * 微游戏管理界面
 */
function GameInstPreviewModal ({
    visible, instId, gameInstData,
    inst_h5_url, inst_h5_preview_url,
    
    handleOnClose,
    handleOnEditAgain,
}) {
	
	function copyInputContent() {
		let copyobject = document.getElementById("inst_h5_preview_url_5210");
        copyobject.select();
        document.execCommand("Copy");
        message.success('复制成功');
	}
	
	function downloadQrcode() {
		let qrcode_cont_dom = document.getElementById("inst_h5_preview_qrcode_cont_342");
		let qrcode_dom_arr = qrcode_cont_dom.getElementsByTagName('canvas');
		
		let qrcode_dom = qrcode_dom_arr && qrcode_dom_arr.length > 0 && qrcode_dom_arr[0];
		
		//文件保存
	    function saveFile(data, filename){  
		    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');  
		    save_link.href = data;  
		    save_link.download = filename;  
		     
		    var event = document.createEvent('MouseEvents');  
		    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);  
		    save_link.dispatchEvent(event);  
		}; 
		
	    html2canvas(qrcode_dom).then(function(canvas) {
			let img_data = Canvas2Image.saveAsPNG(canvas, true).getAttribute('src');  
			saveFile(img_data, '二维码.png'); 
		});
	}
	
	return (
		<Modal
        	title="游戏保存成功"
          	visible={visible}
          	maskClosable={false}
          	onCancel={handleOnClose}
          	width="712px"
          	className={styles.game_inst_preview_modal}
          	footer={null}
        >
        	<div className={styles.inst_preview_cont}>
          		<div className={styles.h5_preview_cont}>
				  {
					visible ? 
						<iframe 
							src={inst_h5_preview_url} 
							className={styles.h5_preview_iframe} 
							frameBorder="0" width="350" height="460" 
							marginHeight="0" marginWidth="0" scrolling="auto" >
						</iframe>
						: ''
				  }
          		</div>
          		
          		<div className={styles.preview_bar_cont}>
          			
          			<div className={styles.preview_icon_cont}>
          				<Icon type="check-circle-o" className={styles.preview_icon}/>
          				<div className={styles.status_text}>保存成功</div>
          			</div>
          			
          			<div className={styles.inst_title_cont}>
						{gameInstData.gameTitle || ''}
          			</div>
          			
          			<div className={styles.inst_qrcode_cont}>
          				<div className={styles.qrcode_cont} id="inst_h5_preview_qrcode_cont_342">
          					<QRCode value = {inst_h5_url} size = { 120 } />
          					<div className={styles.qrcode_bar_cont}>
          						<div className={styles.weixin_bar_cont}>微信扫一扫</div>
          						<div className={styles.down_bar_cont} onClick={downloadQrcode}>下载二维码</div>
          					</div>
          				</div>
          			</div>
          			
          			<div className={styles.inst_input_cont}>
          				<Input value={inst_h5_url} className={styles.isnt_input} id="inst_h5_preview_url_5210"/>
          				<Button type="primary" className={styles.input_copy_btn} onClick={copyInputContent}>复制</Button>
          			</div>
          			
          			<div className={styles.bar_button_cont}>
          				<Button className={styles.bar_button_item} onClick={handleOnClose}>关闭</Button>
          				<Button className={styles.bar_button_item} onClick={handleOnEditAgain} type="primary">再次编辑</Button>
          			</div>
          			
          		</div>
        	</div>
        	
        </Modal>
	)
}

export default GameInstPreviewModal;