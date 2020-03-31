/**
 * 模板配置项主控制器
 * @author yhwu
 */
import React from 'react';
import '../spring_template.css';

//引入渲染页面模板
let SpringMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let SpringPage1RenderComponent = require('./springPage1RenderComponent');
let SpringPage2RenderComponent = require('./springPage2RenderComponent');
let SpringPage3RenderComponent = require('./springPage3RenderComponent');
let SpringPage4RenderComponent = require('./springPage4RenderComponent');
let SpringPage5RenderComponent = require('./springPage5RenderComponent');

let SpringRenderComponent = React.createClass({
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
					currentPageType == '' ? <SpringMainRenderComponent mainData={ mainData } />

					: currentPageType == 'Page1Component' ? <SpringPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <SpringPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <SpringPage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <SpringPage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <SpringPage5RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default SpringRenderComponent;
