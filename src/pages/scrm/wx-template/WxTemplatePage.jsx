import React, { PropTypes } from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { Icon, Popover, Input } from 'antd';
import WxTemplateComponent from '../../../components/scrm/wx-template/WxTemplateComponent';


function WxTemplatePage({ dispatch, wx_template }){

    let {

		title,
		organId,
		formVisible,
		activityCode,
		activityTypeId,
		currentSelectCampus,
		automatedCompletion,
		changeTempletInstanceFormVisible,

    } = wx_template;


	function dp(name, param) {
		dispatch({
			type : `wx_template/${name}`,
			payload : {
				...param
			}
		})
	}

	let props = {
		dp,
		title,
		organId,
		formVisible,
		activityCode,
		activityTypeId,
		currentSelectCampus,
		automatedCompletion,
		changeTempletInstanceFormVisible,
	}

    return (
        <WxTemplateComponent {...props} />
    )
};

function mapStateToProps ({ wx_template }){
	return { wx_template };
};

export default connect( mapStateToProps )( WxTemplatePage );
