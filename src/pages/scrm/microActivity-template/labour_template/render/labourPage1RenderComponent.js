import React from 'react';

let LabourPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design labour-page1-render-design">
				<div className = "labour-page1-image">
					<img src={ detailData  ? detailData.imgUrl : ""} />
				</div>
				<div className = "labour-page1-title">
					{ detailData ? detailData.title : "" }
				</div>
				<div className = "labour-page1-subTitle">
					{ detailData ? detailData.sub_title : "" }
				</div>
			</div>
		)
	}
});

export default LabourPage1RenderComponent;
