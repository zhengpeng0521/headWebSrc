import React from 'react';
const ScoreStarsComponent = require('./scoreStarsComponent');

const TopHeaderComponent = React.createClass({

	render() {

		return(
			<div>
		    		<div className="shanshan_vipAgencyInfo_baseDiv">
	    				<div className="shanshan_vipAgengsyInfo_fuzzyImage"/>
	    			</div>

	    			<div className="shanshan_vipAgencyInfo_baseDiv_AtTheSameLevel_xingxing_big_background" >

			      	<div>
			      		<img className="shanshan_vipAgencyInfo_baseDiv_AtTheSameLevel_xingxing_big_background_imageIcon" src={this.props.subData.imgurl} />
			      	</div>

		     		<div className="topHeader_intro_div">
		      			<p className="shanshan_vipAgencyInfo_baseDiv_AtTheSameLevel_xingxing_big_background_info" > 机构简介:{this.props.subData.intro}</p>
			      	</div>
				</div>
			</div>
		)
	}
});


export default TopHeaderComponent;

/*
 *

				<div className="shanshan_vipAgencyInfo_baseDiv_AtTheSameLevel_xingxing_big_background_subDiv" >
	  				<ScoreStarsComponent ref="scoreStarsComponent" rater={this.props.subData.score} />
	  			</div>

	  			<div>
					<p className="shanshan_vipAgencyInfo_baseDiv_AtTheSameLevel_xingxing_big_background_score">{this.props.subData.score}分</p>
				</div>

			      	<div>
			      		<img className="shanshan_vipAgencyInfo_baseDiv_AtTheSameLevel_xingxing_big_background_vipjigouIcon" src={BASE_URL+'images/view-vipjigou-103x19@3x.png'}  />
			      	</div>

	      			<div style={{height: '20', display : 'black'}}>
	      				<div className="shanshan_vipAgencyInfo_baseDiv_AtTheSameLevel_xingxing_big_background_left_divimg">
		      				<img src={BASE_URL+'images/view-shidirenz-12x15@3x.png'}
		      					 className = "div_vipAgencyInfo_left_image" />
		      				<p className="vipAgencyInfi_p">&nbsp;实地认证</p>
		      			</div>

	      				<div className="div_vipAgencyInfo_center">
		      				<img src={BASE_URL+'images/view-7days-11x13@3x.png'}
		      					 className="div_vipAgencyInfo_center_image" />
		      				<p className="vipAgencyInfi_p">&nbsp;7天无理由退款</p>
	      				</div>

	      				<div className="div_vipAgencyInfo_right" >
			      			<img src={BASE_URL+'images/view-zhizhaorenz-16x11@3x.png'}
			      				 className="div_vipAgencyInfo_right_image" />
			      			<p className="vipAgencyInfi_p">&nbsp;营业执照认证</p>
		      			</div>
		      		</div>
 */
