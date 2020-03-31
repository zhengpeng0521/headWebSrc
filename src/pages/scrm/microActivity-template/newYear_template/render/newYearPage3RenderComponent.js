import React from 'react';

let NewYearPage3RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design newYear-page3-render-design">
				<div className = "newYear-page3-title">
					{ detailData ? detailData.title : "" }
				</div>
				<div className = "newYear-page3-content-item1">
					<img className="newYear-page3-content-item-image" src = { (detailData && detailData.img_intro) ? detailData.img_intro[0].imgurl : ""} />
				</div>
				<div className = "newYear-page3-content-item2">
					<img className="newYear-page3-content-item-image" src = { (detailData && detailData.img_intro) ? detailData.img_intro[1].imgurl : ""} />
				</div>
				<div className = "newYear-page3-content-item3">
					<img className="newYear-page3-content-item-image" src = { (detailData && detailData.img_intro) ? detailData.img_intro[2].imgurl : ""} />
				</div>
				<div className = "newYear-page3-content-item newYear-page3-content-item4">
					{ detailData ? detailData.title1 : "" }
				</div>
				<div className = "newYear-page3-content-item newYear-page3-content-item5">
					{ detailData ? detailData.title2 : "" }
				</div>
				<div className = "newYear-page3-content-item newYear-page3-content-item6">
					{ detailData ? detailData.title3 : "" }
				</div>
			</div>
		)
	}
});

export default NewYearPage3RenderComponent;
