/**
 * 模板配置项主控制器
 * @author yhwu
 */
import React from 'react';
import '../music_template.less';

//引入渲染页面模板
let MusicMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let MusicPage1RenderComponent = require('./musicPage1RenderComponent');
let MusicPage2RenderComponent = require('./musicPage2RenderComponent');
let MusicPage3RenderComponent = require('./musicPage3RenderComponent');
let MusicPage4RenderComponent = require('./musicPage4RenderComponent');
let MusicPage5RenderComponent = require('./musicPage5RenderComponent');
let MusicPage6RenderComponent = require('./musicPage6RenderComponent');
let MusicPage7RenderComponent = require('./musicPage7RenderComponent');

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
					currentPageType == '' ? <MusicMainRenderComponent mainData={ mainData } />

					: currentPageType == 'Page1Component' ? <MusicPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <MusicPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page3Component' ? <MusicPage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <MusicPage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <MusicPage5RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <MusicPage6RenderComponent detailData = { detailData } />

					: currentPageType == 'Page7Component' ? <MusicPage7RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default MusicRenderComponent;
