import React from 'react';

let EnrollmentPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design enrollment-page1-render-design">
				<div className = "enrollment-page1-title">
					{ detailData ? detailData.title : "" }
				</div>
				<div className = "enrollment-page1-subTitle">
					{ detailData ? detailData.sub_title : "" }
				</div>
			</div>
		)
	}
});

export default EnrollmentPage1RenderComponent;
