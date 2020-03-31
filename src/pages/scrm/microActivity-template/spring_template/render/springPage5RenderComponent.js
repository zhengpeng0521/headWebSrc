import React from 'react';

let EnrollmentPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="page-render-design spring-page5-render-design">
				<div className="spring-page5-title">{ detailData ? detailData.title : ""}</div>
				<p className="spring-page5-name">学员姓名</p>
				<p className="spring-page5-phone">联系电话</p>
			</div>
		)
	}
});

export default EnrollmentPage5RenderComponent;
