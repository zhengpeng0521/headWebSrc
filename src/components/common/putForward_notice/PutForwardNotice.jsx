import React from 'react';
import {  Modal, Button,Carousel } from 'antd';
import styles from './PutForwardNotice.less';
import QRCode from 'qrcode.react';

class PutForwardNotice extends React.Component {

	constructor(props){
        super(props);
        this.state = {
            putForwardModalVisible: false,
        };
        this.onClose = this.onClose.bind(this);
        this.onOpen = this.onOpen.bind(this);
    }
   componentWillReceiveProps(nextProps) {
       if(nextProps.putForwardModalVisible == false)
       {
           this.setState({
    		  putForwardModalVisible: nextProps.putForwardModalVisible
    	   });
       }
    }
    onOpen() {
    	this.setState({
    		putForwardModalVisible: true
    	});
    }

    onClose() {
    	this.setState({
    		putForwardModalVisible: false
    	});
    }

	componentDidMount() {
		//判断本地缓存是否打开过
        let storage = window.localStorage;
        if(storage) {
        	let saas_guide_checkstand = storage.getItem('isZBPutForward_notice');
        	if(saas_guide_checkstand == "false" ||saas_guide_checkstand==null ) {
        		this.onOpen();
        		storage.setItem('isZBPutForward_notice', true)
        	}
        }
	}


	render() {
		return (
            <Modal
                className = 'putForward'
                visible = {  this.state.putForwardModalVisible }
                onCancel = { this.onClose }
                maskClosable = { false }
                width = '595px'
                height = '300px'
                footer = {null}
            >
                <div >
                    <p className = {styles.title}>清凉一夏，提现费率低至冰点</p>
                     <div className = {styles.con}>
                         <p>限时感恩回馈，招生宝营收提现手续费</p>
                         <p style={{marginTop:'10px'}}>从原来的2%，降至冰点<span>6‰</span></p>
                         <p style={{marginTop:'20px',color:'#999'}}>活动时间：2018年5月25日0点—8月25日0点</p>
                    </div>
                    <Button type="primary" className = { styles.lookBtn }  onClick={this.props.putForwardLookFun}>我要创建活动</Button>
                </div>
            </Modal>
		)
	}

}

export default PutForwardNotice;
