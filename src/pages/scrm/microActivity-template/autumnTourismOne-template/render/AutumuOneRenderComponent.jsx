import React from 'react';

//引入渲染页面模板
let AutumnOneMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let AutumnOnePage1RenderComponent = require('./AutumuOnePage1RenderComponent');
let AutumnOnePage2RenderComponent = require('./AutumuOnePage2RenderComponent');
let AutumnOnePage3RenderComponent = require('./AutumuOnePage3RenderComponent');
let AutumnOnePage4RenderComponent = require('./AutumuOnePage4RenderComponent');
let AutumnOnePage5RenderComponent = require('./AutumuOnePage5RenderComponent');
let AutumnOnePage6RenderComponent = require('./AutumuOnePage6RenderComponent');

let ChildrenDayRenderComponent = React.createClass({
	getInitialState() {
		return {
			detailData      : this.props.detailData  || "",
			mainData        : this.props.mainData    || "",
			currentPage     : this.props.currentPage || "",
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
			mainData   : nextProps.mainData   || "",
		})
	},
	render(){

		let { detailData, currentPage, mainData } = this.state;

		detailData = detailData[currentPage-1] || "";

		let currentPageType = detailData ? detailData.type : "";

		return (
			<div>
				{
					currentPageType == '' ? <AutumnOneMainRenderComponent mainData = { mainData } />

					: currentPageType == 'Page1Component' ? <AutumnOnePage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <AutumnOnePage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page3Component' ? <AutumnOnePage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <AutumnOnePage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <AutumnOnePage5RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <AutumnOnePage6RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default ChildrenDayRenderComponent;
