/**
 * 模板配置项主控制器
 * @author yhwu
 */
import React from 'react';
import '../yuanxiao_template.css';

//引入渲染页面模板
let YuanxiaoMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let YuanxiaoPage1RenderComponent = require('./yuanxiaoPage1RenderComponent');
let YuanxiaoPage2RenderComponent = require('./yuanxiaoPage2RenderComponent');
let YuanxiaoPage3RenderComponent = require('./yuanxiaoPage3RenderComponent');
let YuanxiaoPage4RenderComponent = require('./yuanxiaoPage4RenderComponent');
let YuanxiaoPage5RenderComponent = require('./yuanxiaoPage5RenderComponent');
let YuanxiaoPage6RenderComponent = require('./yuanxiaoPage6RenderComponent');

let YuanxiaoRenderComponent = React.createClass({
	getInitialState() {
		return {
			detailData : this.props.detailData || "",
			mainData : this.props.mainData || "",
			currentPage : this.props.currentPage || "",
			currentPageType : '',
		}
	},
	componentWillReceiveProps(nextProps) {
		if( this.props.currentPage !== nextProps.currentPage ){
			this.setState({
				currentPage : nextProps.currentPage || "",
			})
		}
		this.setState({
			detailData : nextProps.detailData || "",
			mainData : nextProps.mainData || "",
		})
	},
	render(){

		let { detailData ,currentPage ,mainData } = this.state;

		detailData = detailData[currentPage-1] || "";

		let currentPageType = detailData ? detailData.type : "";

		return (
			<div>
				{
					currentPageType == '' ? <YuanxiaoMainRenderComponent mainData={ mainData } />

					: currentPageType == 'Page1Component' ? <YuanxiaoPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <YuanxiaoPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page3Component' ? <YuanxiaoPage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <YuanxiaoPage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <YuanxiaoPage5RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <YuanxiaoPage6RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default YuanxiaoRenderComponent;
