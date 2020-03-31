/**
 * 模板配置项主控制器
 * @author yhwu
 */
import React from 'react';
import '../leaflets_template.less';

//引入渲染页面模板
let LeafletsMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let LeafletsPage1RenderComponent = require('./leafletsPage1RenderComponent');
let LeafletsPage2RenderComponent = require('./leafletsPage2RenderComponent');
let LeafletsPage3RenderComponent = require('./leafletsPage3RenderComponent');
let LeafletsPage4RenderComponent = require('./leafletsPage4RenderComponent');
let LeafletsPage5RenderComponent = require('./leafletsPage5RenderComponent');
let LeafletsPage6RenderComponent = require('./leafletsPage6RenderComponent');
let LeafletsPage7RenderComponent = require('./leafletsPage7RenderComponent');

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
					currentPageType == '' ? <LeafletsMainRenderComponent mainData={ mainData } />

					: currentPageType == 'Page1Component' ? <LeafletsPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <LeafletsPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page3Component' ? <LeafletsPage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <LeafletsPage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <LeafletsPage5RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <LeafletsPage6RenderComponent detailData = { detailData } />

					: currentPageType == 'Page7Component' ? <LeafletsPage7RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});


export default EnglishRenderComponent;
