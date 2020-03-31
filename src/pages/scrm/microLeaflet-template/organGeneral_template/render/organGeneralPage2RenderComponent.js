import React from 'react';

let OrganGeneralPage2RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="page-render-design organGeneral-page2-render-design">
				<div className = "organGeneral-page2-backgroundImage"></div>
				<div className="organGeneral-page2-title">
					{ detailData ? detailData.title : "" }
				</div>
				<div className = "organGeneral-page2-intro">
					{ detailData ? detailData.intro : "" }
				</div>
				<div className = "organGeneral-page2-img1">
					<img className = "organGeneral-page2-imgContent" src = { detailData && detailData.img_intro ? detailData.img_intro[0].imgurl : "" } />
				</div>
				<div className = "organGeneral-page2-img2">
					<img className = "organGeneral-page2-imgContent" src = { detailData && detailData.img_intro ? detailData.img_intro[1].imgurl : "" } />
				</div>
				<div className="organGeneral-page2-courseIntro">
					{
						detailData.course_intro.map(function(value , index){
							return (
								<div className="organGeneral-page2-courseIntro-item">
									{ detailData ? detailData.course_intro[index] : "" }
								</div>
							)
						})
					}
				</div>
			</div>
		)
	}
});

export default OrganGeneralPage2RenderComponent;
