import React from 'react';

//引入渲染页面模板
let ChristmasMainRenderComponent = require('./ChristmasMainRenderComponent');
let ChristmasPage1RenderComponent = require('./ChristmasPage1RenderComponent');
let ChristmasPage2RenderComponent = require('./ChristmasPage2RenderComponent');
let ChristmasPage3RenderComponent = require('./ChristmasPage3RenderComponent');
let ChristmasPage4RenderComponent = require('./ChristmasPage4RenderComponent');
let ChristmasPage5RenderComponent = require('./ChristmasPage5RenderComponent');
let ChristmasPage6RenderComponent = require('./ChristmasPage6RenderComponent');

let ChristmasRenderComponent = React.createClass({
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

		//console.log(detailData , currentPage , mainData);

		detailData = detailData[currentPage-1] || "";

		let currentPageType = detailData ? detailData.type : "";

		return (
			<div>
				{
					currentPageType == '' ? <ChristmasMainRenderComponent mainData={ mainData } />

					: currentPageType == 'Page1Component' ? <ChristmasPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <ChristmasPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page3Component' ? <ChristmasPage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <ChristmasPage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <ChristmasPage5RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <ChristmasPage6RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default ChristmasRenderComponent;
