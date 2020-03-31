import React from 'react';
import style from '../science_template.less';

let SciencePageRenderComponent = React.createClass({

	render(){
		let { detailData } = this.props;

//		headImgUrl


		let expContentArr = detailData && detailData.expContent.split('\n');
		let orgContentArr = detailData && detailData.orgContent.split('\n');
		let couContentArr = detailData && detailData.couContent.split('\n');
		let conContentArr = detailData && detailData.conContent.split('\n');

		return (
			<div className = 'science_wrap' >
				<div className = 'science_bg' >
					<div className = 'science_content' >
						<div className = 'ship' >
						</div>
						<div className = 'orgTitle' >
							{ !!detailData && detailData.orgTitle || '' }
						</div>
						<div className = 'headImgUrl' >
							<img src = { !!detailData && detailData.headImgUrl || '' } />
						</div>
						<div className = 'actiTitle' >
							<div className = 'actiTitleTop' >
								<div className = 'actiTitleTopCon' >
									<p>
										{ !!detailData && detailData.actiTitle || '' }
									</p>
								</div>
							</div>
						</div>
						<div className = 'explain_bg' ></div>
						<div className = 'explain_content' >
							<div className = 'content_top'>
								<p>
									{ !!detailData && detailData.expTitle || '' }
								</p>
							</div>
							<div className = 'content_middle'>
								<p>
									{
										expContentArr.map( ( item, index) => {
											return (
												<div className = "item">
													&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ item || '' }
												</div>
											)
										})
									}
								</p>
							</div>
							<div className = 'content_bottom'>
							</div>
						</div>
						<div className = { style.orgIntro_bg }></div>
						<div className = 'explain_content org_content' >
							<div className = 'content_top'>
								<p>
									 { !!detailData && detailData.orgIntro || '' }
								</p>
							</div>
							<div className = 'content_middle'>
								<p>
									{
										orgContentArr.map( ( item, index) => {
											return (
												<div className = "item">
													&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ item || '' }
												</div>
											)
										})
									}
								</p>
								<ul className = 'org_img'>
									{ !!detailData && detailData.orgImgs.length > 0 &&
										detailData.orgImgs.map( ( item, index ) => {
											if( !!item.imgurl ){
												return (
													<li className = 'org_img_item'>
														<img src = { item.imgurl || '' } />
													</li>
												)
											}
										})
									}
								</ul>
							</div>
							<div className = 'content_bottom bottom'>
							</div>
						</div>
						<div className = { style.course_bg } ></div>
						<div className = 'explain_content course_content' >
							<div className = 'content_top'>
								<p>
									{ !!detailData && detailData.couTitle || '' }
								</p>
							</div>
							<div className = 'content_middle'>
								<p>
									{
										couContentArr.map( ( item, index) => {
											return (
												<div className = "item">
													&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ item || '' }
												</div>
											)
										})
									}
								</p>
							</div>
							<div className = 'content_bottom'>

							</div>
						</div>
						<div className = { style.contact_bg } ></div>
						<div className = { style.footer_bg } ></div>
						<div className = 'explain_content contact_content' >
							<div className = 'content_top'>
								<p>
									{ !!detailData && detailData.conTitle || '' }
								</p>
							</div>
							<div className = 'content_middle'>
								<p>
									{
										conContentArr.map( ( item, index) => {
											return (
												<div className = "item">
													&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ item || '' }
												</div>
											)
										})
									}
								</p>
								<div className = 'remark_wrap' >
									<div className = 'code_img' >
										<img src = { !!detailData && detailData.codeImgUrl || '' }  />
									</div>
									<div className = 'robot' ></div>
								</div>
								<div className = 'remark' >
									{ !!detailData && detailData.remark || '' }
								</div>
							</div>
							<div className = 'content_bottom bottom'>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});

export default SciencePageRenderComponent;
