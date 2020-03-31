/**
 * 模板配置项主控制器
 * @author yhwu
 */
import React from 'react';
import '../dance_template.less';

//引入渲染页面模板
let DanceMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let DancePage1RenderComponent = require('./dancePage1RenderComponent');
let DancePage2RenderComponent = require('./dancePage2RenderComponent');
let DancePage3RenderComponent = require('./dancePage3RenderComponent');
let DancePage4RenderComponent = require('./dancePage4RenderComponent');
let DancePage5RenderComponent = require('./dancePage5RenderComponent');
let DancePage6RenderComponent = require('./dancePage6RenderComponent');

let MusicRenderComponent = React.createClass({
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
					currentPageType == '' ? <DanceMainRenderComponent mainData={ mainData } />

					: currentPageType == 'Page1Component' ? <DancePage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <DancePage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page3Component' ? <DancePage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <DancePage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <DancePage5RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <DancePage6RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default MusicRenderComponent;
