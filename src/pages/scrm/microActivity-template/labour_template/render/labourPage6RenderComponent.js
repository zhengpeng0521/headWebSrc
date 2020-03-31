import React from 'react';

let LabourPage6RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="page-render-design labour-page6-render-design">
				<div className="labour-page6-title">{ detailData ? detailData.title : ""}</div>
				<p className="labour-page6-name">学员姓名</p>
				<p className="labour-page6-phone">联系电话</p>
			</div>
		)
	}
});

export default LabourPage6RenderComponent;
