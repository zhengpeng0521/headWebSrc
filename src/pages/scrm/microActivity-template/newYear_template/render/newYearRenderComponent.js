/**
 * 模板配置项主控制器
 * @author yhwu
 */
import React from 'react';
import '../newYear_template.css';

//引入渲染页面模板
let NewYearMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let NewYearPage1RenderComponent = require('./newYearPage1RenderComponent');
let NewYearPage2RenderComponent = require('./newYearPage2RenderComponent');
let NewYearPage3RenderComponent = require('./newYearPage3RenderComponent');
let NewYearPage4RenderComponent = require('./newYearPage4RenderComponent');
let NewYearPage5RenderComponent = require('./newYearPage5RenderComponent');

let NewYearRenderComponent = React.createClass({
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
					currentPageType == '' ? <NewYearMainRenderComponent mainData={ mainData } />

					: currentPageType == 'Page1Component' ? <NewYearPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <NewYearPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <NewYearPage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <NewYearPage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <NewYearPage5RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default NewYearRenderComponent;
