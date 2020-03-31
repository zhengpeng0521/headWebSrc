import React from 'react';
import style from '../summer_camp_template.less';

let SummerCampPageRenderComponent = React.createClass({

	render(){
		let { detailData } = this.props;

		let content1Arr = !!detailData && !!detailData.content1 && detailData.content1.split('\n');
		let content4Arr = !!detailData && !!detailData.content4 && detailData.content4.split('\n');

		return (
			<div className = 'summer_camp_wrap'>
				<div className = 'camp_content'>
					<div className = 'page_one'>
						<p className = { style.cloud } ></p>
						<div className = 'head_img'>
							<img src = { !!detailData && detailData.headImgUrl || '' } />
						</div>
						<div className = 'header'>
							<p className = 'subTitle'>
								{ !!detailData && detailData.subTitle || '' }
							</p>
							<p className = 'headTitle'>
								{ !!detailData && detailData.headTitle || '' }
							</p>
							<p className = 'orgTitle'>
								{ !!detailData && detailData.orgTitle || '' }
							</p>
							{
								!!detailData && !!detailData.actiStartTime && !!detailData.actiEndTime &&
								<p className = 'actiTime'>
									{ !!detailData && !!detailData.actiStartTime && !!detailData.actiEndTime && detailData.actiStartTime + '~' + detailData.actiEndTime }
								</p>
							}
						</div>
						<p className = { style.school_bus } ></p>
						<p className = { style.yellow_winnower } >
						</p>
						<p className = { style.red_winnower } >
						</p>
					</div>
					<div className = 'page_two'>
						<div className = 'page_two_top'>
							<p className = { style.pendant1 } ></p>
							<p className = { style.pendant2 } ></p>
						</div>
						<div className = 'page_two_middle'>
							<p className = 'head_title' >
								{ !!detailData && detailData.title1 || '' }
							</p>
							<div className = 'content'>
								{
									content1Arr.map( ( item, index) => {
										return (
											<div className = "item">
												{ item || '' }
											</div>
										)
									})
								}
							</div>
						</div>
						<div className = 'page_two_bottom'>
							<p className = { style.flower1 } ></p>
							<p className = { style.flower2 } ></p>
						</div>
					</div>
					<div className = 'page_three' >
						<div className = 'page_three_top' ></div>
						<div className = 'page_three_middle' >
							<p className = 'head_title' >
								{ !!detailData && detailData.title2 || '' }
							</p>
							{ !!detailData && !!detailData.mainProcess && detailData.mainProcess.map( function( item, index ){
								return (
									<div className = { `content content${ index + 1 }` }>
										<p className = 'con_label'>
											<p>
												{ !!item && item.label || '' }
											</p>
										</p>
										<p className = 'con_value'>
											<p>{ !!item && item.value || '' }</p>
										</p>
									</div>
								)
							})}
						</div>
						<div className = 'page_three_bottom' >
							<div className = { style.giraffe } ></div>
						</div>
					</div>
					<div className = 'page_four'>
						<div className = 'page_four_top' ></div>
						<div className = 'page_four_middle' >
							<div className = { style.sun } ></div>
							<p className = 'head_title' >
								{ !!detailData && detailData.title3 || '' }
							</p>
							{ !!detailData && !!detailData.details && detailData.details.map( function( item, index ){
								return(
									<div className = { index%2 == 0 ? 'content content1' : 'content content2' }>
										<div className = 'arrow'></div>
										<div className = 'modal'>
											<p>{ item || '' }</p>
										</div>
									</div>
								)
							})}
						</div>
						<div className = 'page_four_bottom' >
							<div className = { style.boat } ></div>
							<div className = { style.fish }></div>
							<div className = { style.wave }></div>
							<div className = { style.balloon1 } ></div>
							<div className = { style.balloon2 } ></div>
						</div>
					</div>
					<div className = 'page_five' >
						<div className = 'page_five_top'></div>
						<div className = 'page_five_middle'>
							<p className = 'head_title' >
								{ !!detailData && detailData.title4 || '' }
							</p>
							<div className = 'content'>
								{
									content4Arr.map( ( item, index) => {
										return (
											<div className = "item">
												{ item || '' }
											</div>
										)
									})
								}
							</div>
						</div>
						<div className = 'page_five_bottom'>
							<div className = 'mushroom'></div>
							<div className = { style.mushRoom } ></div>
							<div className = { style.sun_flower } ></div>
							<div className = { style.animals }></div>
						</div>
					</div>
					<div className = 'page_six'>
						<div className = 'page_six_top'></div>
						<div className = 'page_six_middle'>
							<p className = 'head_title' >
								{ !!detailData && detailData.title5 || '' }
							</p>
							{ !!detailData && !!detailData.orgImgs && detailData.orgImgs.map(function( item, index ){
								if( !!item.imgurl ){
									return (
										<div className = 'org_img' style = {{ backgroundImage : `url(${ item.imgurl || '' })` }}>
										</div>
									)
								}
							})}
						</div>
						<div className = 'page_six_bottom'>
							<div className = { style.car } ></div>
						</div>
					</div>
					<div className = 'page_seven'>
						<div className = 'page_seven_top'></div>
						<div className = 'page_seven_middle'>
							<p className = 'head_title' >
								{ !!detailData && detailData.title6 || '' }
							</p>
							<p className = 'content'>学员姓名</p>
							<p className = 'content'>联系电话</p>
							<p className = 'content'>学员生日</p>
							<p className = 'content btn'>提交</p>
						</div>
						<div className = 'page_seven_bottom'>
							<div className = { style.person1 }>
								<p></p>
							</div>
							<div className = { style.person2 }>
								<p></p>
							</div>
							<div className = { style.person3 }>
								<p></p>
							</div>
							<div className = { style.person4 }>
								<p></p>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});

export default SummerCampPageRenderComponent;
