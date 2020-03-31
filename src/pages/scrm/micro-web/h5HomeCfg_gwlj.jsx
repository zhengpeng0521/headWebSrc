import React from 'react';
import {Row, Col, Button,Tree,Select,Form,Input,message } from 'antd';
import classNames from 'classnames';
const InputGroup = Input.InputGroup;

let PageGwlj = React.createClass({
	getInitialState(){
		let orginfo = this.props.orgInfo?this.props.orgInfo:{};
		return {
			codeUrl : OMP_ORG+'h5/sign/'+orginfo.orgCode+'/Main/1'
		}
	},
	componentWillReceiveProps(nextProps) {
		let orginfo = nextProps.orgInfo?nextProps.orgInfo:{};
        this.setState({
        	codeUrl : OMP_ORG+'h5/sign/'+orginfo.orgCode+'/Main/1'
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
			var qrcode = new QRCode(document.getElementById("wgw_gwlj"), {
	            width : 240,//设置宽高
	            height : 240
	        });
	        qrcode.makeCode(url);
		},
		copyUrl(){
			var obj = document.getElementById("gwlj_urlInput");
			obj.select();
			document.execCommand("Copy");
			message.success("官网链接已成功复制");
		},
	render(){
		return (
				<div>
					<Row>
						<Col span={10} >
							<div className="microweb_cfg_title">
								<span>
									官网链接
								</span>
							</div>
							<div className="microweb_cfg_left">
								<Input value={this.state.codeUrl?this.state.codeUrl:""} id="gwlj_urlInput" readOnly style={{width:'400px',marginRight:'10px',float:'left'}}/>
								<Button onClick={this.copyUrl} type="primary">复制</Button>
							</div>
							<div className="microweb_cfg_title">

							</div>
							<div id="wgw_gwlj" className="microweb_cfg_leftimg">
							    <div className="wgw_gfewm">官网二维码</div>
							</div>
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
								家长可以查看机构信息，详细真实的信息会增加家长兴趣；官网可以根据机构自身的喜好，选择不同模板，展现个性化。
								</span>
							</div>
							</div>
						</Col>
					</Row>
				</div>
		)
	}
});

export default PageGwlj;
