/**
 * 模板配置项主控制器
 * @author yhwu
 */
import React from 'react';
import '../summer_template.less';

//引入渲染页面模板
let SummerMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let SummerPage1RenderComponent = require('./summerPage1RenderComponent');
let SummerPage2RenderComponent = require('./summerPage2RenderComponent');
let SummerPage3RenderComponent = require('./summerPage3RenderComponent');
let SummerPage4RenderComponent = require('./summerPage4RenderComponent');
let SummerPage5RenderComponent = require('./summerPage5RenderComponent');
let SummerPage6RenderComponent = require('./summerPage6RenderComponent');
let SummerPage7RenderComponent = require('./summerPage7RenderComponent');

let SummerRenderComponent = React.createClass({
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

		let { detailData, currentPage, mainData } = this.state;

		detailData = detailData[currentPage-1] || "";

		let currentPageType = detailData ? detailData.type : "";

		return (
			<div>
				{
					currentPageType == '' ? <SummerMainRenderComponent mainData={ mainData } />

					: currentPageType == 'Page1Component' ? <SummerPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <SummerPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page3Component' ? <SummerPage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <SummerPage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <SummerPage5RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <SummerPage6RenderComponent detailData = { detailData } />

					: currentPageType == 'Page7Component' ? <SummerPage7RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default SummerRenderComponent;
