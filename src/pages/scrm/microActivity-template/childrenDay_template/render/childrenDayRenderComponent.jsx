import React from 'react';
import style from '../childrenDay_template.less';

//引入渲染页面模板
let ChildrenDayMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let ChildrenDayPage1RenderComponent = require('./childrenDayPage1RenderComponent');
let ChildrenDayPage2RenderComponent = require('./childrenDayPage2RenderComponent');
let ChildrenDayPage3RenderComponent = require('./childrenDayPage3RenderComponent');
let ChildrenDayPage4RenderComponent = require('./childrenDayPage4RenderComponent');
let ChildrenDayPage5RenderComponent = require('./childrenDayPage5RenderComponent');

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
					currentPageType == '' ? <ChildrenDayMainRenderComponent mainData = { mainData } />

					: currentPageType == 'Page1Component' ? <ChildrenDayPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <ChildrenDayPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <ChildrenDayPage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <ChildrenDayPage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <ChildrenDayPage5RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default ChildrenDayRenderComponent;
