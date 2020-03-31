/**
 * 模板配置项主控制器
 * @author yhwu
 */
import React from 'react';
import '../doanngo_template.css';

//引入渲染页面模板
let DoanngoMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let DoanngoPage1RenderComponent = require('./doanngoPage1RenderComponent');
let DoanngoPage2RenderComponent = require('./doanngoPage2RenderComponent');
let DoanngoPage3RenderComponent = require('./doanngoPage3RenderComponent');
let DoanngoPage4RenderComponent = require('./doanngoPage4RenderComponent');
let DoanngoPage5RenderComponent = require('./doanngoPage5RenderComponent');

let DoanngoRenderComponent = React.createClass({
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
					currentPageType == '' ? <DoanngoMainRenderComponent mainData={ mainData } />

					: currentPageType == 'Page1Component' ? <DoanngoPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <DoanngoPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <DoanngoPage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <DoanngoPage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <DoanngoPage5RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default DoanngoRenderComponent;
