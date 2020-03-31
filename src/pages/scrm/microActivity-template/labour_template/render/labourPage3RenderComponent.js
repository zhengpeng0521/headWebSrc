import React from 'react';

let LabourPage3RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design labour-page3-render-design">
				<div className="labour-page3-title">{ detailData ? detailData.title : ""}</div>
				<div className="labour-page3-content">
					<div className="labour-page3-content-total">
						{
							detailData.intro.map(function(value , index){
								return (
									<div className="labour-page3-content-item">
										<div className="labour-page3-content-item-label">
											{detailData ? detailData.intro[index].label : ""}
										</div>
										<div className="labour-page3-content-item-value">
											{detailData ? detailData.intro[index].value : ""}
										</div>
									</div>
								)
							})
						}
					</div>
				</div>
			</div>
		)
	}
});

export default LabourPage3RenderComponent;
