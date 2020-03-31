import React from 'react';

let EnrollmentPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="page-render-design newYear-page5-render-design">
				<div className="newYear-page5-title">{ detailData ? detailData.title : ""}</div>
				<p className="newYear-page5-name">学员姓名</p>
				<p className="newYear-page5-phone">联系电话</p>
			</div>
		)
	}
});

export default EnrollmentPage5RenderComponent;
