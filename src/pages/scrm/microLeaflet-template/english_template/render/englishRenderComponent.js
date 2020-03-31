/**
 * 模板配置项主控制器
 * @author yhwu
 */
import React from 'react';
import '../english_template.css';

//引入渲染页面模板
let EnglishMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let EnglishPage1RenderComponent = require('./englishPage1RenderComponent');
let EnglishPage2RenderComponent = require('./englishPage2RenderComponent');
let EnglishPage3RenderComponent = require('./englishPage3RenderComponent');

let EnglishRenderComponent = React.createClass({
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
					currentPageType == '' ? <EnglishMainRenderComponent mainData={ mainData } />

					: currentPageType == 'Page1Component' ? <EnglishPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <EnglishPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page3Component' ? <EnglishPage3RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default EnglishRenderComponent;
