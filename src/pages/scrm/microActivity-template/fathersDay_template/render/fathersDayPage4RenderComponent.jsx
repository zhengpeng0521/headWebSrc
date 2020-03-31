import React from 'react';

let FathersDayPage4RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design fathersDay-page4-render-design">
				<div className="fathersDay-title">
					{ detailData ? detailData.title : "" }
				</div>
				<div className = "fathersDay-content-item1">
					<img src={ (detailData && detailData.img_intro) ? detailData.img_intro[0].imgurl : ""} />
				</div>
				<div className = "fathersDay-content-item2">
					<img src={ (detailData && detailData.img_intro) ? detailData.img_intro[1].imgurl : ""} />
				</div>

				<div className="fathersDay-content">
					<div>
						{ detailData ? detailData.intro : "" }
					</div>
				</div>
			</div>
		)
	}
});

export default FathersDayPage4RenderComponent;
