import React from 'react';
import style from '../autumn_template.less';

//引入渲染页面模板
let AutumnMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let AutumnPage1RenderComponent = require('./AutumnPage1RenderComponent');
let AutumnPage2RenderComponent = require('./AutumnPage2RenderComponent');
let AutumnPage3RenderComponent = require('./AutumnPage3RenderComponent');
let AutumnPage4RenderComponent = require('./AutumnPage4RenderComponent');
let AutumnPage5RenderComponent = require('./AutumnPage5RenderComponent');
let AutumnPage6RenderComponent = require('./AutumnPage6RenderComponent');
let AutumnPage7RenderComponent = require('./AutumnPage7RenderComponent');
let AutumnPage8RenderComponent = require('./AutumnPage8RenderComponent');

let ChildrenDayRenderComponent = React.createClass({
	getInitialState() {
		return {
			detailData      : this.props.detailData  || "",
			mainData        : this.props.mainData    || "",
			currentPage     : this.props.currentPage || "",
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
			mainData   : nextProps.mainData   || "",
		})
	},
	render(){

		let { detailData, currentPage, mainData } = this.state;

		detailData = detailData[currentPage-1] || "";

		let currentPageType = detailData ? detailData.type : "";

		return (
			<div>
				{
					currentPageType == '' ? <AutumnMainRenderComponent mainData = { mainData } />

					: currentPageType == 'Page1Component' ? <AutumnPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <AutumnPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page3Component' ? <AutumnPage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <AutumnPage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <AutumnPage5RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <AutumnPage6RenderComponent detailData = { detailData } />

					: currentPageType == 'Page7Component' ? <AutumnPage7RenderComponent detailData = { detailData } />

					: currentPageType == 'Page8Component' ? <AutumnPage8RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default ChildrenDayRenderComponent;
