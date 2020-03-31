import React from 'react';
import {Row, Col, Button,Tree,Select,Form,Input,message } from 'antd';
import classNames from 'classnames';
const InputGroup = Input.InputGroup;

let PageQdxk = React.createClass({
	getInitialState(){
		let orginfo = this.props.orgInfo?this.props.orgInfo:{};
		let isFee = orginfo.isFee;
		return {
			codeUrl : OMP_ORG+'h5/sign/'+orginfo.orgCode+'/SignResults/1',
			isFee :isFee
		}
	},
	componentWillReceiveProps(nextProps) {
		let orginfo = nextProps.orgInfo?nextProps.orgInfo:{};
		let isFee = orginfo.isFee;
        this.setState({
        	codeUrl : OMP_ORG+'h5/sign/'+orginfo.orgCode+'/SignResults/1',
        	isFee :isFee
		});
    },
	componentDidMount() {
		let url = this.state.codeUrl;
			this.buildQRcode(url)
		this.setState({
			codeUrl : url
		});
	},
	//构造二维码图片
		buildQRcode(url) {
			var qrcode = new QRCode(document.getElementById("wgw_qdxk"), {
	            width : 240,//设置宽高
	            height : 240
	        });
	        qrcode.makeCode(url);
		},
		copyUrl(){
			var obj = document.getElementById("qdxk_urlInput");
			obj.select();
			document.execCommand("Copy");
			message.success("签到消课链接已成功复制");
		},
	render(){
			let leftDiv;
			if(this.state.isFee){
				leftDiv = (
						<div>
						<div className="microweb_cfg_title">
						<span>
							签到消课链接
						</span>
					</div>
					<div className="microweb_cfg_left">
						<Input value={this.state.codeUrl?this.state.codeUrl:""} id="qdxk_urlInput" readOnly style={{width:'400px',marginRight:'10px',float:'left'}}/>
						<Button onClick={this.copyUrl} type="primary">复制</Button>
					</div>
					<div className="microweb_cfg_title">

					</div>
					<div id="wgw_qdxk" className="microweb_cfg_leftimg">
					     <div className="wgw_gfewm">链接二维码</div>
					</div>
					</div>)
			}else{
				leftDiv = (
						<div style={{width:550,height:600,border:'1px solid #666'}}>
							<div style={{"margin-left":"160px","margin-top":"200px","font-size":"18px",color:"#111"}}>
								升级成付费版才能使用
							</div>
							<div style={{"margin-left":"150px","margin-top":"30px","font-size":"18px",color:"#111"}}>
								升级热线：0571-56000087
							</div>
								<div id="wgw_qdxk" className="microweb_cfg_leftimg" style={{display:"none"}}>
								</div>
						</div>
						)
			}
		return (
				<div>
				<Row>
				<Col span={10} >
				{leftDiv}
				</Col>
				<Col  span={12}>
				<div>
					<div className="microweb_cfg_title">
						<span >
							功能说明
						</span>
					</div>
					<div className="microweb_cfg_intro">
						<span>
						实现学员自助签到。家长点击链接或者扫描二维码后进行签到，系统自动扣除当天的课时。
						</span>
					</div>
					</div>
				</Col>
			</Row>
			</div>
		)
	}
});

export default PageQdxk;
