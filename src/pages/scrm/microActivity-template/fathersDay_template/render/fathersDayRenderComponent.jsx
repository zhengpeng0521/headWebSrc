import React from 'react';
import '../fathersDay_template.less';

//引入渲染页面模板
let FathersDayMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let FathersDayPage1RenderComponent = require('./fathersDayPage1RenderComponent');
let FathersDayPage2RenderComponent = require('./fathersDayPage2RenderComponent');
let FathersDayPage3RenderComponent = require('./fathersDayPage3RenderComponent');
let FathersDayPage4RenderComponent = require('./fathersDayPage4RenderComponent');
let FathersDayPage5RenderComponent = require('./fathersDayPage5RenderComponent');

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
					currentPageType == '' ? <FathersDayMainRenderComponent mainData = { mainData } />

					: currentPageType == 'Page1Component' ? <FathersDayPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <FathersDayPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <FathersDayPage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <FathersDayPage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <FathersDayPage5RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default MothersDayRenderComponent;
