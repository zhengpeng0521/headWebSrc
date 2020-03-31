import React from 'react';

let DoanngoPage4RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design doanngo-page4-render-design">
				<div className="doanngo-page4-title">
					{ detailData ? detailData.title : "" }
				</div>
				<div className = "doanngo-page4-content-item1">
					<img className="doanngo-page4-content-item-image" src={ (detailData && detailData.img_intro) ? detailData.img_intro[0].imgurl : ""} />
				</div>
				<div className = "doanngo-page4-content-item2">
					<img className="doanngo-page4-content-item-image" src={ (detailData && detailData.img_intro) ? detailData.img_intro[1].imgurl : ""} />
				</div>

				<div className="doanngo-page4-content-value">
					{ detailData ? detailData.intro : "" }
				</div>
			</div>
		)
	}
});

export default DoanngoPage4RenderComponent;
