import React from 'react';

let ChristmasPage6RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="page-render-design page6-render-design">
				<div className="page6-title">{ detailData ? detailData.title : ""}</div>
				<p className="page6-name">学员姓名</p>
				<p className="page6-phone">联系电话</p>
				<div className="page6-submit-button"></div>
			</div>
		)
	}
});

export default ChristmasPage6RenderComponent;
