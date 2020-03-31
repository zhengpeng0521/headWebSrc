import React from 'react';

let NewYearPage2RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design newYear-page2-render-design">
				<div className="newYear-page2-title">{ detailData ? detailData.title : ""}</div>
				<div className="newYear-page2-content">
						{
							detailData.intro.map(function(value , index){
								return (
									<div className="newYear-page2-content-item">
										<div className="newYear-page2-content-item-label">
											{detailData ? detailData.intro[index].label : ""}
										</div>
										<div className="newYear-page2-content-item-value">
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

export default NewYearPage2RenderComponent;
