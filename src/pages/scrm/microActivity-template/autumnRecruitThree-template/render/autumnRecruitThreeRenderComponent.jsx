import React from 'react';

//引入渲染页面模板
let AutumnRecruitThreeMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let AutumnRecruitThreePage1RenderComponent = require('./autumnRecruitThreePage1RenderComponent');
let AutumnRecruitThreePage2RenderComponent = require('./autumnRecruitThreePage2RenderComponent');
let AutumnRecruitThreePage3RenderComponent = require('./autumnRecruitThreePage3RenderComponent');
let AutumnRecruitThreePage4RenderComponent = require('./autumnRecruitThreePage4RenderComponent');
let AutumnRecruitThreePage5RenderComponent = require('./autumnRecruitThreePage5RenderComponent');
let AutumnRecruitThreePage6RenderComponent = require('./autumnRecruitThreePage6RenderComponent');
let AutumnRecruitThreePage7RenderComponent = require('./autumnRecruitThreePage7RenderComponent');
let AutumnRecruitThreePage8RenderComponent = require('./autumnRecruitThreePage8RenderComponent');

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
					currentPageType == '' ? <AutumnRecruitThreeMainRenderComponent mainData = { mainData } />

					: currentPageType == 'Page1Component' ? <AutumnRecruitThreePage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <AutumnRecruitThreePage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page3Component' ? <AutumnRecruitThreePage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <AutumnRecruitThreePage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <AutumnRecruitThreePage5RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <AutumnRecruitThreePage6RenderComponent detailData = { detailData } />

					: currentPageType == 'Page7Component' ? <AutumnRecruitThreePage7RenderComponent detailData = { detailData } />

					: currentPageType == 'Page8Component' ? <AutumnRecruitThreePage8RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default ChildrenDayRenderComponent;
