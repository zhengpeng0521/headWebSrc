import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Modal, Button, Popover, Icon, message } from 'antd';
import OrgSelectModalComponent from '../../../components/common/org-select/OrgSelectModalComponent';

function OrgSelectModalPage({ dispatch, orgSelectModel }) {
	let {
		orgSelectModalVisible,
		orgIdList

    } = orgSelectModel;

	function orgSelectChange( value, options ){
		window._init_data.cerp_orgId = value;
		dispatch({
            type: 'siderMenuModel/updateState',
            payload : {
                currentMenu    : 'cerp_homepage',
                selectedKeys   : ['cerp_homepage'],
                menuRenderInit : false,
            }
        });
        dispatch(routerRedux.push({
            pathname: 'cerp_homepage',
        }));
		dispatch({
			type : 'orgSelectModel/updateState',
			payload : {
				orgSelectModalVisible : false
			}
		})
	}

	let OrgSelectModalComponentProps = {
		orgSelectModalVisible,
		orgIdList,

		orgSelectChange

	}

	return (
		<OrgSelectModalComponent { ...OrgSelectModalComponentProps } />
	)
}
function mapStateToProps({ orgSelectModel }) {
  	return { orgSelectModel };
}

export default connect(mapStateToProps)(OrgSelectModalPage);
