import React from 'react';
import style from '../summer_template.less';

let SummerPage4RenderComponent = React.createClass({

	render(){
		let { detailData } = this.props;

		return (
			<div className="page-render-design summer-page3-render-design">
				<div className = 'summer_wrap' >
					<div className = 'summer_content' >
						<header className = 'summer_title' >
							{ detailData ? detailData.title : '' }
						</header>
						{ detailData.img_intro &&
							<div className = 'summer_items' >
								{ detailData.img_intro && ( !!detailData.img_intro[0].imgurl || !!detailData.title1 ) &&
									<div className = 'summer_item' >
										<div className = 'summer_item_con'>
											<div>
												{ detailData ? detailData.title1 : "" }
											</div>
										</div>
										<div className = 'summer_item_img' >
											<img src = { (detailData && detailData.img_intro) ? detailData.img_intro[0].imgurl : ""} />
										</div>
									</div>
								}
								{ detailData.img_intro  && ( !!detailData.img_intro[1].imgurl || !!detailData.title2 ) &&
								   <div className = 'summer_item' >
										<div className = 'summer_item_img' >
											<img src = { ( detailData && detailData.img_intro ) ? detailData.img_intro[1].imgurl : ""} />
										</div>
										<div className = 'summer_item_con'>
											<div className = 'con1'>
												{ detailData ? detailData.title2 : "" }
											</div>
										</div>
									</div>
								}
								{ detailData.img_intro && ( !!detailData.img_intro[2].imgurl || !!detailData.title3 ) &&
									<div className = 'summer_item' >
										<div className = 'summer_item_con'>
											<div>
												{ detailData ? detailData.title3 : "" }
											</div>
										</div>
										<div className = 'summer_item_img' >
											<img src = { (detailData && detailData.img_intro) ? detailData.img_intro[2].imgurl : ""} />
										</div>
									</div>
								}
							</div>
						}
					</div>
					<div className = { style.meirenyu } ></div>
				</div>

			</div>
		)
	}
});

export default SummerPage4RenderComponent;
