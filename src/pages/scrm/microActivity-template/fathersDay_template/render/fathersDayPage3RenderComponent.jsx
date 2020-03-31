import React from 'react';

let FathersDayPage3RenderComponent = React.createClass({
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design fathersDay-page3-render-design">
				<div className = "fathersDay-title">
					{ detailData ? detailData.title : "" }
				</div>
				<div className = "fathersDay-content-item1">
					<img src = { (detailData && detailData.img_intro) ? detailData.img_intro[0].imgurl : ""} />
				</div>
				<div className = "fathersDay-content-item2">
					<img src = { (detailData && detailData.img_intro) ? detailData.img_intro[1].imgurl : ""} />
				</div>
				<div className = "fathersDay-content-item3">
					<img src = { (detailData && detailData.img_intro) ? detailData.img_intro[2].imgurl : ""} />
				</div>
				<div className = "fathersDay-content-item fathersDay-content-item4">
					{ detailData ? detailData.title1 : "" }
				</div>
				<div className = "fathersDay-content-item fathersDay-content-item5">
					{ detailData ? detailData.title2 : "" }
				</div>
				<div className = "fathersDay-content-item fathersDay-content-item6">
					{ detailData ? detailData.title3 : "" }
				</div>
			</div>
		)
	}
});

export default FathersDayPage3RenderComponent;
