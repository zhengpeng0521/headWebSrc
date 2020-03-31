import React from 'react';
import style from '../school_template.less';

//引入渲染页面模板
let SchoolMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let SchoolPage1RenderComponent = require('./SchoolPage1RenderComponent');
let SchoolPage2RenderComponent = require('./SchoolPage2RenderComponent');
let SchoolPage3RenderComponent = require('./SchoolPage3RenderComponent');
let SchoolPage4RenderComponent = require('./SchoolPage4RenderComponent');
let SchoolPage5RenderComponent = require('./SchoolPage5RenderComponent');
let SchoolPage6RenderComponent = require('./SchoolPage6RenderComponent');
let SchoolPage7RenderComponent = require('./SchoolPage7RenderComponent');

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
					currentPageType == '' ? <SchoolMainRenderComponent mainData = { mainData } />

					: currentPageType == 'Page1Component' ? <SchoolPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <SchoolPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page3Component' ? <SchoolPage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <SchoolPage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <SchoolPage5RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <SchoolPage6RenderComponent detailData = { detailData } />

					: currentPageType == 'Page7Component' ? <SchoolPage7RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default ChildrenDayRenderComponent;
