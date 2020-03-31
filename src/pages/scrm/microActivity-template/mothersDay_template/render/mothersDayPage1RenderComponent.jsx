import React from 'react';

let MothersDayPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design mothersDay-page1-render-design">
				<div className = "mothersDay-page1-image">
					<img src={ detailData  ? detailData.imgUrl : ""} />
				</div>
				<div className = "mothersDay-page1-title">
					{ detailData ? detailData.title : "" }
				</div>
				<div className = "mothersDay-page1-subTitle">
					{ detailData ? detailData.sub_title : "" }
				</div>
			</div>
		)
	}
});

export default MothersDayPage1RenderComponent;
