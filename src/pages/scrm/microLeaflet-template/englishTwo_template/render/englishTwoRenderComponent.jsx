/**
 * 模板配置项主控制器
 * @author yhwu
 */
import React from 'react';
import '../englishTwo_template.less';

//引入渲染页面模板
let EnglishMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let EnglishPage1RenderComponent = require('./englishTwoPage1RenderComponent');
let EnglishPage2RenderComponent = require('./englishTwoPage2RenderComponent');
let EnglishPage3RenderComponent = require('./englishTwoPage3RenderComponent');
let EnglishPage4RenderComponent = require('./englishTwoPage4RenderComponent');
let EnglishPage5RenderComponent = require('./englishTwoPage5RenderComponent');
let EnglishPage6RenderComponent = require('./englishTwoPage6RenderComponent');
let EnglishPage7RenderComponent = require('./englishTwoPage7RenderComponent');

let EnglishRenderComponent = React.createClass({
	getInitialState() {
		return {
			detailData      : this.props.detailData   || "",
			mainData        : this.props.mainData     || "",
			currentPage     : this.props.currentPage  || "",
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

					: currentPageType == 'Page4Component' ? <EnglishPage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <EnglishPage5RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <EnglishPage6RenderComponent detailData = { detailData } />

					: currentPageType == 'Page7Component' ? <EnglishPage7RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default EnglishRenderComponent;
