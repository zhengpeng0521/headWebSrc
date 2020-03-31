import React from 'react';
import '../mothersDay_template.css';

//引入渲染页面模板
let MothersDayMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let MothersDayPage1RenderComponent = require('./mothersDayPage1RenderComponent');
let MothersDayPage2RenderComponent = require('./mothersDayPage2RenderComponent');
let MothersDayPage3RenderComponent = require('./mothersDayPage3RenderComponent');
let MothersDayPage4RenderComponent = require('./mothersDayPage4RenderComponent');
let MothersDayPage5RenderComponent = require('./mothersDayPage5RenderComponent');

let MothersDayRenderComponent = React.createClass({
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
					currentPageType == '' ? <MothersDayMainRenderComponent mainData = { mainData } />

					: currentPageType == 'Page1Component' ? <MothersDayPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <MothersDayPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <MothersDayPage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <MothersDayPage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <MothersDayPage5RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default MothersDayRenderComponent;
