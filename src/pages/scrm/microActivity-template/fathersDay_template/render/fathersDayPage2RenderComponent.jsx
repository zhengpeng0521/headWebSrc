import React from 'react';

let FathersDayPage2RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design fathersDay-page2-render-design">
				<div className="fathersDay-title">{ detailData ? detailData.title : ""}</div>
				<div  className="fathersDay-content">
					<div className = 'content'>
							{
								detailData.intro.map(function(value , index){
									return (
										<div className="fathersDay-content-item">
											<div className="fathersDay-content-item-label">
												{detailData ? detailData.intro[index].label : ""}
											</div>
											<div className="fathersDay-content-item-value">
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

export default FathersDayPage2RenderComponent;
