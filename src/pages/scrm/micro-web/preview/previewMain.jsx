import React from 'react';
import {Table, Icon, Row, Col, Modal, Button, Rate, Tabs, Affix} from 'antd';
const VipAgencyInfo_homePage 		= require('./vipAgencyInfo_homePage');
const ButtomBtnComponent 		= require('./buttomBtnComponent');
const TopHeaderComponent 		= require('./topHeaderComponent');
const TabPane 				= Tabs.TabPane;

const VipAgencyInfo = React.createClass({

	getInitialState: function() {

	    return {
	    	subData		: [],
	    	imageUrl	: '',
	    	info 		: '',
	    	rater 		: '',
	    };
	},
	componentWillReceiveProps(nextProps) {
			var subData=nextProps.data?nextProps.data:[];
			var	theme=nextProps.theme?nextProps.theme:"default";
			var	blocks=nextProps.blocks?nextProps.blocks:"tabs,dzsj";
			subData.cfgIntro = '{"theme":"'+theme+'","blocks":"'+blocks+'"}';
        this.setState({
        	subData : subData
		});
    },
	render :function() {
		var blocksDic	= JSON.parse(this.state.subData.cfgIntro != null && this.state.subData.cfgIntro);
		return (
			<div>
			<TopHeaderComponent ref="topHeaderComponent" pro = {this.props} subData={this.state.subData}/>
			<Tabp subData = {this.state.subData} />
		    	{blocksDic.blocks&&blocksDic.blocks.indexOf('dban') > 0 ? <ButtomBtnComponent ref="buttomBtnComponent" pro = {this.props} isFee={this.state.subData.isFee} /> : ''}
		    </div>
		)
	},
})

const Tabp = React.createClass({
	render() {
		return(
	  		  <Tabs defaultActiveKey="perview_home" className="wgw-preview">
	  		  	<TabPane tab="主页" key="perview_home" className="vip_home">
	  		  		<VipAgencyInfo_homePage ref="vipAgencyInfo_homePage" homeData={this.props.subData} />
	  		  	</TabPane>
	  		  		<TabPane tab="环境" key="perview_enviroment" className="vip_home" disabled >
	  		  		</TabPane>
			  </Tabs>
		)
	},
});

export default VipAgencyInfo;
