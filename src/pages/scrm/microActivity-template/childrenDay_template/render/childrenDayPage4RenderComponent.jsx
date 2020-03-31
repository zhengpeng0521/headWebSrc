import React from 'react';

let ChildrenDayPage4RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design childrenDay-page4-render-design">
				<div className="childrenDay-page4-title">
					{ detailData ? detailData.title : "" }
				</div>
				<div className = "childrenDay-page4-content-item1">
					<img className="childrenDay-page4-content-item-image" src={ (detailData && detailData.img_intro) ? detailData.img_intro[0].imgurl : ""} />
				</div>
				<div className = "childrenDay-page4-content-item2">
					<img className="childrenDay-page4-content-item-image" src={ (detailData && detailData.img_intro) ? detailData.img_intro[1].imgurl : ""} />
				</div>

				<div className="childrenDay-page4-content-value">
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ detailData ? detailData.intro : "" }
				</div>
				<div className = 'childrenDay-page4-bg1'>
				</div>
				<div className = 'childrenDay-page4-bg2'></div>
			</div>
		)
	}
});

export default ChildrenDayPage4RenderComponent;
