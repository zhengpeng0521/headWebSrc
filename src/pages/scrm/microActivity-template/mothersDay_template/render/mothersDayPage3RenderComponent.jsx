import React from 'react';

let MothersDayPage3RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design mothersDay-page3-render-design">
				<div className = "mothersDay-page3-title">
					{ detailData ? detailData.title : "" }
				</div>
				<div className = "mothersDay-page3-content-item1">
					<img className="mothersDay-page3-content-item-image" src = { (detailData && detailData.img_intro) ? detailData.img_intro[0].imgurl : ""} />
				</div>
				<div className = "mothersDay-page3-content-item2">
					<img className="mothersDay-page3-content-item-image" src = { (detailData && detailData.img_intro) ? detailData.img_intro[1].imgurl : ""} />
				</div>
				<div className = "mothersDay-page3-content-item3">
					<img className="mothersDay-page3-content-item-image" src = { (detailData && detailData.img_intro) ? detailData.img_intro[2].imgurl : ""} />
				</div>
				<div className = "mothersDay-page3-content-item mothersDay-page3-content-item4">
					{ detailData ? detailData.title1 : "" }
				</div>
				<div className = "mothersDay-page3-content-item mothersDay-page3-content-item5">
					{ detailData ? detailData.title2 : "" }
				</div>
				<div className = "mothersDay-page3-content-item mothersDay-page3-content-item6">
					{ detailData ? detailData.title3 : "" }
				</div>
			</div>
		)
	}
});

export default MothersDayPage3RenderComponent;
