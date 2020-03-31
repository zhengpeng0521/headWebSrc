import React from 'react';
import  { message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import OfflinebookingComponent from '../../../components/crm/offline-booking/OfflinebookingComponent';
import SuperSearch from '../../../components/common/new-component/super-search/SuperSearch';

function OfflinebookingPage({ dispatch, crmOfflineBookingModel }) {
	let {
		reset,
		commonReset,

		isChecked,
		isPickOn,

		loading,
		dataSource,
		resultCount,
		pageIndex,
		pageSize,
		source,
		TableNewColumns,                      //table设置

		FastSearchContent,                    //快捷搜索栏搜索内容
		/*高级搜索*/
		superSearchVisible,                   //高级搜索是否显示
		SuperSearchContent,                   //高级搜索栏内容

	} = crmOfflineBookingModel;


	//常用搜索
    function searchFunction( values, reset ) {
		let dept_org = values.dept_org;
		if( !!values && !!values.dept_org ){
			values.tenantIds = values.dept_org.split('-')[0];
			values.orgIds = values.dept_org.split('-')[1];
			values.orgId = values.dept_org.split('-')[1];
			delete values.dept_org;
		}
		dispatch({
			type : 'crmOfflineBookingModel/onSearch',
			payload : {
				values
			}
		})
		dispatch({
			type : 'crmOfflineBookingModel/updateState',
			payload : {
				commonReset : reset
			}
		})
    }

	//常用搜索 重置
    function clearFunction(){
		dispatch({
			type : 'crmOfflineBookingModel/onSearch',
			payload : {
				values : {}
			}
		});
    }

    function TableChangeColumns( newColumns ){
        dispatch({
            type : 'crmOfflineBookingModel/updateState',
            payload:{
                TableNewColumns : newColumns,
            }
        });
    }

	//点击切换至名单试听
	function handleleadsrecord(){
		if( source === '1' ){
			dispatch({
				type : 'crmOfflineBookingModel/changeLeadsOrStu',
				payload : {
					source : '2',
					isChecked : true,
					isPickOn  : false
				}
			})
			dispatch({
				type : 'crmOfflineBookingModel/updateState',
				payload : {
					isChecked : true,
					isPickOn  : false
				}
			})
		}
	}

	//点击切换至学员试听
	function handlesturecord(){
		if( source === '2' ){
			!!reset && reset();
			!!commonReset && commonReset();
			dispatch({
				type : 'crmOfflineBookingModel/changeLeadsOrStu',
				payload : {
					source : '1',
				}
			})
			dispatch({
				type : 'crmOfflineBookingModel/updateState',
				payload : {
					isChecked : false,
					isPickOn  : true
				}
			})
		}
	}

	//点击控制 高级搜索显隐
	function superSearch(){
		!!reset && reset();
		!!commonReset && commonReset();
		dispatch({
			type : 'crmOfflineBookingModel/updateState',
			payload : {
				superSearchVisible : !superSearchVisible
			}
		})
	}

	//高级搜索
	function onSuperSearch( values, reset ){
		if( !!values && !!values.time && values.time.length > 0 ){
			values.startAuditionTime = values.time[0].format('YYYY-MM-DD HH:mm');
			values.endAuditionTime = values.time[1].format('YYYY-MM-DD HH:mm');
		}
		delete values.time;
		dispatch({
			type : 'crmOfflineBookingModel/onSuperSearch',
			payload : {
				values
			}
		})
		dispatch({
			type : 'crmOfflineBookingModel/updateState',
			payload : {
				reset
			}
		})
	}

	//高级重置
	function onSuperClear(){
		dispatch({
			type : 'crmOfflineBookingModel/onSuperSearch',
			payload : {
				values : {}
			}
		})
	}

	//分页 功能
	function pageIndexChange( pageIndex ) {
		dispatch({
			type : 'crmOfflineBookingModel/pagination',
			payload : {
				pageIndex,
				pageSize
			}
		})
	}

	function pageSizeChange( pageIndex, pageSize ) {
         dispatch({
			type : 'crmOfflineBookingModel/pagination',
			payload : {
				pageIndex,
				pageSize
			}
		})
	}

    let componProps = {
        table : {
            isChecked,
            isPickOn,
            loading,
            pageIndex,
            pageSize,
            dataSource,
            resultCount,

            TableNewColumns,    //table设置
            pageSizeChange,
            pageIndexChange,
            TableChangeColumns,
        },
        search : {
            searchFunction,
            clearFunction
        },
		handleleadsrecord,           //点击切换到名单试听
		handlesturecord,             //点击切换到学员试听
		superSearchVisible,          //高级搜索是否显示
		superSearch                  //点击显示高级搜索
    };

	let superSearchProps = {
		searchVisible  : superSearchVisible,
		closeSearch    : superSearch,
		onSearch       : onSuperSearch,
		onClear        : onSuperClear,
		fields        : [
			{
				key     : 'sellerName',
				type    : 'input',
				label   : '跟进人',
                placeholder : '跟进人',
			},{
				key     : 'time',
				type    : 'rangePicker',
				label   : '到访时间',
				startPlaceholder : '开始时间',
				endPlaceholder : '结束时间',
			},
			{
				key         : 'sourceType',
				type        : 'select',
				label       : '学员类型',
				placeholder : '请选择学员类型',
				initialValue: '0',
				options : [
					{ key : '0' , label : '潜在学员' },
					{ key : '1' , label : '在读学员' },
					{ key : '2' , label : '往期学员' }
				]
			}
		]
	}

    return (
        <div style = {{ overflowX : 'hidden', height : '100%' }}>
			<OfflinebookingComponent { ...componProps } />
       		<SuperSearch { ...superSearchProps } />
        </div>
    );
}

function mapStateToProps({ crmOfflineBookingModel }) {
  	return { crmOfflineBookingModel };
}

export default connect( mapStateToProps )( OfflinebookingPage );
