import React from 'react';
import {Row, Col, Button,Tree,Select,Form,Input,message } from 'antd';
import classNames from 'classnames';
const InputGroup = Input.InputGroup;

let PageKsmx = React.createClass({
	getInitialState(){
		let orginfo = this.props.orgInfo?this.props.orgInfo:{};
		let isFee = orginfo.isFee;
		return {
			codeUrl : OMP_ORG+'h5/sign/'+orginfo.orgCode+'/StudentCourseDetail/1',
			isFee :isFee
		}
	},
	componentWillReceiveProps(nextProps) {
		let orginfo = nextProps.orgInfo?nextProps.orgInfo:{};
		let isFee = orginfo.isFee;
        this.setState({
        	codeUrl : OMP_ORG+'h5/sign/'+orginfo.orgCode+'/StudentCourseDetail/1',
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
			var qrcode = new QRCode(document.getElementById("wgw_ksmx"), {
	            width : 240,//设置宽高
	            height : 240
	        });
	        qrcode.makeCode(url);
		},
		copyUrl(){
			var obj = document.getElementById("ksmx_urlInput");
			obj.select();
			document.execCommand("Copy");
			message.success("课时明细链接已成功复制");
		},
	render(){
			let leftDiv;
			if(this.state.isFee){
				leftDiv = (
						<div>
						<div className="microweb_cfg_title">
							<span>
							课时明细链接
						</span>
					</div>
					<div className="microweb_cfg_left">
						<Input value={this.state.codeUrl?this.state.codeUrl:""} id="ksmx_urlInput" readOnly style={{width:'400px',marginRight:'10px',float:'left'}}/>
						<Button onClick={this.copyUrl} type="primary">复制</Button>
					</div>
					<div className="microweb_cfg_title">

					</div>
					<div id="wgw_ksmx" className="microweb_cfg_leftimg">
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
								<div id="wgw_ksmx" className="microweb_cfg_leftimg" style={{display:"none"}}>
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
						可以查看自己所有的课时记录，了解上课学习情况。
						</span>
					</div>
					</div>
				</Col>
			</Row>
				</div>
		)
	}
});

export default PageKsmx;
