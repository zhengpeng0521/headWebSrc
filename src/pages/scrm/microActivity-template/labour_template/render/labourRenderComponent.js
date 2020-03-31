import React from 'react';
import '../labour_template.css';

//引入渲染页面模板
let LabourMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let LabourPage1RenderComponent = require('./labourPage1RenderComponent');
let LabourPage2RenderComponent = require('./labourPage2RenderComponent');
let LabourPage3RenderComponent = require('./labourPage3RenderComponent');
let LabourPage4RenderComponent = require('./labourPage4RenderComponent');
let LabourPage5RenderComponent = require('./labourPage5RenderComponent');
let LabourPage6RenderComponent = require('./labourPage6RenderComponent');

let LabourRenderComponent = React.createClass({
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
					currentPageType == '' ? <LabourMainRenderComponent mainData={ mainData } />

					: currentPageType == 'Page1Component' ? <LabourPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <LabourPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page3Component' ? <LabourPage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <LabourPage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <LabourPage5RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <LabourPage6RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default LabourRenderComponent;
