import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover } from 'antd';
import VisitRecordCreateComponent from '../../../components/crm/visit-record/VisitRecordCreate';

function VisitRecordCreatePage({ dispatch, visitRecordCreateModel, refreshList }){
    let {
		visitRecordCreateVisible,
		visitRecordInfo,
		studentList,
		id,
		stuId,
		orgId,

		source,
		visitRecordBtnLoading

    } = visitRecordCreateModel;
	/*取消新增到访记录*/
	function cancelAddVisitRecord(){
		dispatch({
			type : 'visitRecordCreateModel/updateState',
			payload : {
				visitRecordCreateVisible : false,
				studentList              : [],
				stuId                    : undefined,
				orgId                    : undefined,
				visitRecordInfo          : {},
	}
		})
	}

	/*确认新增到访记录*/
	function confirmAddVisitRecord( values ){
		dispatch({
			type : 'visitRecordCreateModel/confirmAddVisitRecord',
			payload : {
				values,
				refreshList
			}
		})
	}

	/*校区更换 获得学员下拉*/
	function TenantSelectOnSelect( value ){
		dispatch({
			type : 'visitRecordCreateModel/TenantSelectOnSelect',
			payload : {
				value
			}
		})
	}
	let visitRecordCreateProps = {
		visitRecordCreateVisible,
		visitRecordInfo,
		studentList,
		id,
		stuId,
		orgId,
		source,
		visitRecordBtnLoading,

		cancelAddVisitRecord,
		confirmAddVisitRecord,

		TenantSelectOnSelect,
	}

    return (
        <div>
			<VisitRecordCreateComponent { ...visitRecordCreateProps } />
        </div>
    )
};

function mapStateToProps ({ visitRecordCreateModel }){
	return { visitRecordCreateModel };
};

export default connect( mapStateToProps )( VisitRecordCreatePage );
