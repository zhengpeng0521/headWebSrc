import React from 'react';

//引入渲染页面模板
let AutumnTwoMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let AutumnTwoPage1RenderComponent = require('./AutumuTwoPage1RenderComponent');
let AutumnTwoPage2RenderComponent = require('./AutumuTwoPage2RenderComponent');
let AutumnTwoPage3RenderComponent = require('./AutumuTwoPage3RenderComponent');
let AutumnTwoPage4RenderComponent = require('./AutumuTwoPage4RenderComponent');
let AutumnTwoPage5RenderComponent = require('./AutumuTwoPage5RenderComponent');
let AutumnTwoPage6RenderComponent = require('./AutumuTwoPage6RenderComponent');

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
					currentPageType == '' ? <AutumnTwoMainRenderComponent mainData = { mainData } />

					: currentPageType == 'Page1Component' ? <AutumnTwoPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <AutumnTwoPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page3Component' ? <AutumnTwoPage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <AutumnTwoPage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <AutumnTwoPage5RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <AutumnTwoPage6RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default ChildrenDayRenderComponent;
