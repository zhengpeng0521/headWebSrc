import React from 'react';
import style from '../summer_cultivate_template.less';

let SummerCultivatePageRenderComponent = React.createClass({

	render(){
		let { detailData } = this.props;

		let expContentArr = detailData && detailData.expContent.split('\n');
		let couContentArr = detailData && detailData.couContent.split('\n');
		let conContentArr = detailData && detailData.conContent.split('\n');


		return (
			<div className = 'summer_cultivate_wrap'>
				<div className = 'cultivate_content'>
					<div className = 'orgImg'>
						<div className = { style.orgImg_bg } >
							<div className = 'orgImg_box'>
								<img src = { !!detailData && detailData.headImgUrl || '' } />
							</div>
						</div>
						<div className = { style.balloon }></div>
						<div className = { style.flying_bird } ></div>
					</div>
					<div className = 'org_title'>
						<div className = 'title_box'>
							<p>
								{ !!detailData && detailData.orgTitle || '' }
							</p>
						</div>
					</div>
					<div className = 'act_title' >
						<div className = 'act_title_box'>
							<p>
								{ !!detailData && detailData.actiTitle || '' }
							</p>
						</div>
					</div>
					<div className = 'two_stus'></div>

					<div className = 'cultivate_title'>
						<p className = 'titleInit title1'>
							{ !!detailData && detailData.expTitle || '' }
						</p>
					</div>
					<div className = 'cultivate_box'>
						<div className = 'content_top top1'></div>
						<div className = 'content_middle middle1'>
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
						<div className = 'content_bottom bottom1'></div>
					</div>

					<div className = 'cultivate_title'>
						<p className = 'titleInit title2'>
							{ !!detailData && detailData.orgIntro || '' }
						</p>
					</div>
					<div className = 'cultivate_box'>
						<div className = 'content_top top2'></div>
						<div className = 'content_middle middle2'>
							{ detailData.orgImgs.length > 0 && ( !!detailData.orgImgs[0].imgurl || !!detailData.orgContent1 ) &&
								<div className = 'orgContent_item'>
									<div className = 'orgContent_img'>
										<img src = { detailData.orgImgs.length > 0 && detailData.orgImgs[0].imgurl  || '' } />
									</div>
									<div className = 'orgContent_text' >
										<p style = {{ paddingRight : 0 }}>
											{ !!detailData && detailData.orgContent1 || '' }
										</p>
									</div>
								</div>
							}
							{ detailData.orgImgs.length > 0 && ( !!detailData.orgImgs[1].imgurl || !!detailData.orgContent2 ) &&
								<div className = 'orgContent_item'>
									<div className = 'orgContent_text' >
										<p style = {{ paddingLeft : 0, paddingRight : '10px' }} >
											{ !!detailData && detailData.orgContent2 || '' }
										</p>
									</div>
									<div className = 'orgContent_img'>
										<img src = { detailData.orgImgs.length > 0 && detailData.orgImgs[1].imgurl  || '' } />
									</div>
								</div>
							}
							{ detailData.orgImgs.length > 0 && ( !!detailData.orgImgs[2].imgurl || !!detailData.orgContent3 ) &&
								<div className = 'orgContent_item'>
									<div className = 'orgContent_img'>
										<img src = { detailData.orgImgs.length > 0 && detailData.orgImgs[2].imgurl  || '' } />
									</div>
									<div className = 'orgContent_text' >
										<p style = {{ paddingRight : 0 }}>
											{ !!detailData && detailData.orgContent3 || '' }
										</p>
									</div>
								</div>
							}
						</div>
						<div className = 'content_bottom bottom2'></div>
					</div>

					<div className = 'cultivate_title'>
						<p className = 'titleInit title3'>
							{ !!detailData && detailData.couTitle || '' }
						</p>
					</div>
					<div className = 'cultivate_box'>
						<div className = 'content_top top3'></div>
						<div className = 'content_middle middle3'>
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
						<div className = 'content_bottom bottom3'></div>
					</div>

					<div className = 'cultivate_title'>
						<p className = 'titleInit title4'>
							{ !!detailData && detailData.conTitle || '' }
						</p>
					</div>
					<div className = 'cultivate_box'>
						<div className = 'content_top top4'></div>
						<div className = 'content_middle middle4'>
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
							<div className = 'codeImg'>
								<img src = { !!detailData && detailData.codeImgUrl || '' } />
							</div>
							<div className = 'remark' >
								{ !!detailData && detailData.remark || '' }
							</div>
						</div>
						<div className = 'content_bottom bottom4'></div>
					</div>

					<div className = 'cultivate_title'>
						<p className = 'titleInit title5'>
							{ !!detailData && detailData.apply || '' }
						</p>
					</div>
					<div className = 'input' style = {{ marginTop : '20px' }}>
						<p>请输入学员姓名</p>
					</div>
					<div className = 'input'>
						<p>请输入联系方式</p>
					</div>
					<div className = 'input'>
						<p>请输入学员生日</p>
					</div>
					<div className = 'btn'>
						<p>提交</p>
					</div>
				</div>
			</div>
		)
	}
});

export default SummerCultivatePageRenderComponent;
