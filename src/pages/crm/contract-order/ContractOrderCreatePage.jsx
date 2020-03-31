import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Popover, Icon, message } from 'antd';
import ContractOrderCreateComponent from '../../../components/crm/contract-order/ContractOrderCreate';
import { StatusFlag, NewModal } from '../../../components/common/new-component/NewComponent';

function ContractOrderCreatePage({ dispatch, contractOrderCreateModel, refreshList }) {
	let {
		orderNum,
		contractOrderCreateVisible,

		parentIdList,                 //家长下拉
		vipCardList,                  //会员卡下拉
		stuIdList,                    //学员下拉
		productList,                  //产品下拉
		teachingList,                 //教材下拉
		salesList,					  //销售下拉
		paywayList,                   //收款方式下拉

		contractOrderInfo,

		totalPrice,
		totalMoney,

		orgId,

		btnLoading,


    } = contractOrderCreateModel;

	/*选择校区*/
	function TenantSelectOnSelect( value ){
		dispatch({
			type : 'contractOrderCreateModel/TenantSelectOnSelect',
			payload : {
				value
			}
		})
		dispatch({
			type : 'contractOrderCreateModel/updateState',
			payload : {
				stuIdList    : [],
				vipCardList  : [],
				parentIdList : [],
				totalPrice   : 0,
				totalMoney   : 0
			}
		})
	}

	/*选择家长*/
	function parentIdChange( value, stuOldNew ){
		dispatch({
			type : 'contractOrderCreateModel/parentIdChange',
			payload : {
				value,
				stuOldNew
			}
		})
	}

	/*改变签约类型*/
	function changeStuOldNew(){
		dispatch({
			type : 'contractOrderCreateModel/updateState',
			payload : {
				stuIdList   : [],
				vipCardList : []
			}
		})
	}

	/*改变总合计与总实收*/
	function changeTotalPrice( total, money ){
		dispatch({
			type : 'contractOrderCreateModel/updateState',
			payload : {
				totalPrice : total,
				totalMoney : money,
			}
		})
	}

	/*保存合同并收款*/
	function confirmAddContractOrder( values ){
		dispatch({
			type : 'contractOrderCreateModel/confirmAddContractOrder',
			payload : {
				values,
				refreshList
			}
		})
	}

	/*保存合同*/
	function confirmAddContractOrderOnly( values ){
		dispatch({
			type : 'contractOrderCreateModel/confirmAddContractOrderOnly',
			payload : {
				values,
				refreshList
			}
		})
	}

	function cancelAddContractOrder(){
		dispatch({
			type : 'contractOrderCreateModel/updateState',
			payload : {
				contractOrderCreateVisible : false,
				contractOrderInfo          : {},
				parentIdList               : [],
				vipCardList                : [],
				stuIdList                  : [],
				productList                : [],
				teachingList               : [],
				salesList                  : [],
				paywayList                 : [],
				orderId                    : undefined,
                totalPrice                 : 0,
                totalMoney                 : 0,
                orderNum                   : undefined
			}
		})
	}

	let contractOrderCreateProps = {
		orderNum,

		contractOrderCreateVisible,
		parentIdList,                 //家长下拉
		vipCardList,                  //会员卡下拉
		stuIdList,                    //学员下拉
		productList,                  //产品下拉
		teachingList,                 //教材下拉
		salesList,   				  //销售下拉
		paywayList,                   //收款方式下拉

		contractOrderInfo,
		totalPrice,
		totalMoney,

		orgId,

		btnLoading,

		/*方法*/
		TenantSelectOnSelect,
		parentIdChange,
		changeStuOldNew,
		changeTotalPrice,

		confirmAddContractOrder,
		confirmAddContractOrderOnly,
		cancelAddContractOrder
	}
	return (
        <div>
            { !!contractOrderCreateVisible ? <ContractOrderCreateComponent { ...contractOrderCreateProps } /> : null }
        </div>
	)
}
function mapStateToProps({ contractOrderCreateModel }) {
  	return { contractOrderCreateModel };
}

export default connect(mapStateToProps)(ContractOrderCreatePage);
