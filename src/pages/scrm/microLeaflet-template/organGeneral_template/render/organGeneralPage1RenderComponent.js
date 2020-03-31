import React from 'react';

let OrganGeneralPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design organGeneral-page1-render-design">
				<div className = "organGeneral-page1-head-img">
					<img className = "organGeneral-page1-head-img-content" src = { detailData ? detailData.head_imgUrl : "" } />
				</div>
				<div className = "organGeneral-page1-title">
					{ detailData ? detailData.title : "" }
				</div>
				<div className = "organGeneral-page1-subTitle">
					{ detailData ? detailData.sub_title : "" }
				</div>
				<div className = "organGeneral-page1-code-img">
					<img className = "organGeneral-page1-code-img-content" src = { detailData ? detailData.code_imgUrl : "" } />
				</div>
				<span className = "organGeneral-page1-contact-title">联系方式</span>
				<div className="organGeneral-page1-contact">
					{
						detailData.contact.map(function(value , index){
							return (
								<div className="organGeneral-page2-contact-item">
									<div className="organGeneral-page2-contact-item-label">
										{detailData ? detailData.contact[index].label+" :" : ""}
									</div>
									<div className="organGeneral-page2-contact-item-value">
										{detailData ? detailData.contact[index].value : ""}
									</div>
								</div>
							)
						})
					}
				</div>
			</div>
		)
	}
});

export default OrganGeneralPage1RenderComponent;
