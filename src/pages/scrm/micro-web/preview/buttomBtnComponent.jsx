import React from 'react';
import {Popover, Button, Affix} from 'antd';

const ButtonBtnComponent = React.createClass({

	getInitialState() {
	    return {
	      v: false,
	      dis: 'nodisabled'
	    };
	},

	makeAnAppointment() {
		this.props.pro.history.replaceState(null, "/audition");
	},

	sign() {
		this.props.pro.history.replaceState(null, "/signResults");
	},

	courseDetail() {
		this.props.pro.history.replaceState(null, "/studentCourseDetail");
	},

	studentWorks() {
		this.props.pro.history.replaceState(null, "/studentWorks");
	},

	visible(e) {
			this.setState({
				v: e,
				dis : e==true? 'disabled' : 'nodisabled'
			});
	},

    render:function(){
    	var d = this.state.dis=="disabled" ? true:false;
    	let moreBtn;
    	if(this.props.isFee){
    		let content = (
      			  <div>
      			    <p  className="popover_content">签到消课</p>
      			    <hr className="line_hr" />
      			    <p  className="popover_content">课时明细</p>
      			    <hr className="line_hr" />
      			    <p  className="popover_content">学员作品</p>
      			  </div>
      			);
    		moreBtn = (<Popover placement="topRight" trigger="click" content={content} onVisibleChange={this.visible} overlayClassName="wgw-preview"
				style={{hieght : '100'}}>
 			<div className="buttomBtnDiv">
	 			<div type="primary" className="vipAgencyInfo_buttomBtn_right_div">
	 				<div className="more"></div>
	 				<p className="moreText">更多</p>
	 			</div>
	 		</div>
			</Popover>
			)
    	}else{
    		moreBtn = "";
    	}
    	var height = '535';
    	return (
    				<div className="buttomBtn_affix_div" style={{top: height}} >
	 			     	<Button type="primary" disabled={d} className="vipAgencyInfo_buttomBtn"
	 			     	style={{width: this.props.isFee?"calc(100% - 110px)":"calc(100% - 30px)"}}
	 			     	>预约试听</Button>
	 			     	{moreBtn}
		 			 </div>
    	)
    }
});
/*
 *
 * 		    	<div style={{
		    		backgroundColor: '#131212',
			        opacity: '0.5',
			        position: 'fixed',
			        top: '0%',
			        left: '0%',
			        width: '100%',
			        height: '100%',
			        zIndex: '1001',
			        display: 'none'
		    	}}> </div>*/
export default ButtonBtnComponent;
