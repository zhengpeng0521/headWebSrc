/**
 * 模板配置项主控制器
 * @author yhwu
 */
import React from 'react';
import '../organGeneral_template.css';

//引入渲染页面模板
let OrganGeneralMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let OrganGeneralPage1RenderComponent = require('./organGeneralPage1RenderComponent');
let OrganGeneralPage2RenderComponent = require('./organGeneralPage2RenderComponent');
let OrganGeneralPage3RenderComponent = require('./organGeneralPage3RenderComponent');

let OrganGeneralRenderComponent = React.createClass({
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
					currentPageType == '' ? <OrganGeneralMainRenderComponent mainData={ mainData } />

					: currentPageType == 'Page1Component' ? <OrganGeneralPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <OrganGeneralPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page3Component' ? <OrganGeneralPage3RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default OrganGeneralRenderComponent;
