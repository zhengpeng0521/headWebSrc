import React from 'react';

let EnrollmentPage2RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design enrollment-page2-render-design">
				<div className="enrollment-page2-title">{ detailData ? detailData.title : ""}</div>
				<div className="enrollment-page2-content">
						{
							detailData.intro.map(function(value , index){
								return (
									<div className="enrollment-page2-content-item">
										<div className="enrollment-page2-content-item-label">
											{detailData ? detailData.intro[index].label : ""}
										</div>
										<div className="enrollment-page2-content-item-value">
											{detailData ? detailData.intro[index].value : ""}
										</div>
									</div>
								)
							})
						}
				</div>
			</div>
		)
	}
});

export default EnrollmentPage2RenderComponent;
