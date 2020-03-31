import React from 'react';

let OrganCommonPageRenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className = "organ-common-wrap">
				<div className="organCommon-page-render-design organCommon-page1-render-design">
					<div className = "organCommon-page-headImg">
						<img className = "organCommon-page-headImg-content" src = { detailData ? detailData.head_imgUrl : "" } />
					</div>
					<div className = "organCommon-page-title">
						{ detailData ? detailData.title : '' }
					</div>
					<div className ="organCommon-page-intro">
						{ detailData ? detailData.intro : '' }
					</div>
					<div className = "organCommon-page-img1">
						<img className = "organCommon-page-imgContent" src = { detailData && detailData.organImgs ? detailData.organImgs[0].imgurl : "" } />
					</div>
					<div className = "organCommon-page-img2">
						<img className = "organCommon-page-imgContent" src = { detailData && detailData.organImgs ? detailData.organImgs[1].imgurl : "" } />
					</div>
					<div className = "organCommon-page-img3">
						<img className = "organCommon-page-imgContent" src = { detailData && detailData.organImgs ? detailData.organImgs[2].imgurl : "" } />
					</div>
					<div className = "organCommon-page-img4">
						<img className = "organCommon-page-imgContent" src = { detailData && detailData.organImgs ? detailData.organImgs[3].imgurl : "" } />
					</div>
					<div className = "organCommon-page-courseIntro">
						{
							detailData.course_intro.map(function(value , index){
								return (
									<div className="organCommon-page-courseIntro-item">
										{ detailData ? detailData.course_intro[index] : "" }
									</div>
								)
							})
						}
					</div>
					<div className = "organCommon-page-codeImg">
						<img className = "organCommon-page-codeImg-content" src = { detailData ? detailData.code_imgUrl : "" } />
					</div>
					<span className = "organCommon-page-contact-title">联系方式</span>
					<div className="organCommon-page-contact">
						{
							detailData.contact.map(function(value , index){
								return (
									<div className="organCommon-page2-contact-item">
										<div className="organCommon-page-contact-item-label">
											{detailData ? detailData.contact[index].label : ""}
										</div>
										<div className="organCommon-page-contact-item-value">
											{detailData ? detailData.contact[index].value : ""}
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

export default OrganCommonPageRenderComponent;
