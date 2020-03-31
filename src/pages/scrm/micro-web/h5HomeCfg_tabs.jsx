import React from 'react';
import {Row, Col, Button,Tree,Select,Form,Input,Tabs,Modal } from 'antd';
const TabPane = Tabs.TabPane;

let ModuleSet = require("./h5HomeCfg_mgr");
let PageGwlj = require("./h5HomeCfg_gwlj");
let PageYyst = require("./h5HomeCfg_yyst");
let PageQdxk = require("./h5HomeCfg_qdxk");
let PageKsmx = require("./h5HomeCfg_ksmx");
let PageXyzp = require("./h5HomeCfg_xyzp");

const HomeCfgTabs = React.createClass({
	getInitialState(){
		return {
			orgInfo : {},
			cfgIntro: {},
			theme : "default",
			blocks : ""
		}
	},
	componentDidMount(){
		let me = this;
		//加载微官网配置信息
		 serviceRequest(BASE_URL+'/microwebController/list', {},
					function(result) {
				let cfgIntro = result.data.cfgIntro;
				let theme="default",blocks=["tabs"];
				if(cfgIntro && cfgIntro.length>0){
					let intro = JSON.parse(cfgIntro);
					if(intro){
						theme = intro.theme;
						blocks = intro.blocks.split(",");
					}else{
						theme = "default";
						blocks = ["tabs"];
					}
				}else{
					theme = "default";
					blocks = ["tabs"];
				}
						me.setState({
							cfgIntro: result.data.cfgIntro,
							theme : theme,
							blocks : blocks
						});
						dynamicLoading.css(BASE_URL+"resources/css/"+theme+".css");
				  });
		//加载机构信息
			serviceRequest(BASE_URL+'microwebController/orginfo', {funcKey: 'microweb-list'},
					function(result) {
						me.setState({
							orgInfo : result.data
						});
						if(!result.data.isFee){
							dynamicLoading.css(BASE_URL+"resources/css/default.css");
						}
				  });
	},
	changeTipVisible(){
		this.setState({
			tipVisible : !this.state.tipVisible
		})
	},
	render(){

		return (
				<div className="page-content">
			<Tabs type="card" defaultActiveKey="wgw_pageSet" className="mainTabs" tabBarExtraContent={<span onClick={this.changeTipVisible}><Button type="primary" shape="circle" className="navbar-tip-icon" style={{"margin-top":"5px"}}>?</Button>使用说明</span>}>
			    <TabPane tab="模板设置" key="wgw_pageSet"><ModuleSet orgInfo={this.state.orgInfo} cfgIntro={this.state.cfgIntro} theme={this.state.theme} blocks={this.state.blocks} /></TabPane>
			    <TabPane tab="官网链接" key="wgw_pageGwlj"><PageGwlj orgInfo={this.state.orgInfo}/></TabPane>
			    <TabPane tab="预约试听链接" key="wgw_pageYyst"><PageYyst orgInfo={this.state.orgInfo}/></TabPane>
			    <TabPane tab="签到消课链接" key="wgw_pageQdxk"><PageQdxk orgInfo={this.state.orgInfo}/></TabPane>
			    <TabPane tab="课时明细链接" key="wgw_pageKsmx"><PageKsmx orgInfo={this.state.orgInfo}/></TabPane>
			    <TabPane tab="学员作品链接" key="wgw_pageStuwork"><PageXyzp orgInfo={this.state.orgInfo} /></TabPane>
			</Tabs>

			<Modal
				wrapClassName="navbar-tip-modal"
				visible={this.state.tipVisible}
				title={null}
				closable={true}
			    onCancel={this.changeTipVisible}
				maskClosable={false}
			    footer={null}
			    width="800px"
			    >
			    <div style={{height:"800px","overflow-y":"scroll"}}>
			    <img src="./resources/images/wgw-intro.png" alt="" style={{width:"750px"}} />
			    </div>
		    </Modal>
		    </div>
		)
	}
});

export default HomeCfgTabs;
