/**
 * 模板配置项主控制器
 * @author yhwu
 */
import React from 'react';
import '../enrollment_template.css';

//引入渲染页面模板
let EnrollmentMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let EnrollmentPage1RenderComponent = require('./enrollmentPage1RenderComponent');
let EnrollmentPage2RenderComponent = require('./enrollmentPage2RenderComponent');
let EnrollmentPage3RenderComponent = require('./enrollmentPage3RenderComponent');
let EnrollmentPage4RenderComponent = require('./enrollmentPage4RenderComponent');
let EnrollmentPage5RenderComponent = require('./enrollmentPage5RenderComponent');

let EnrollmentRenderComponent = React.createClass({
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
					currentPageType == '' ? <EnrollmentMainRenderComponent mainData={ mainData } />

					: currentPageType == 'Page1Component' ? <EnrollmentPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <EnrollmentPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <EnrollmentPage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <EnrollmentPage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <EnrollmentPage5RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default EnrollmentRenderComponent;
