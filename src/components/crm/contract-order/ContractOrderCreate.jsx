import React from 'react';
import { Form, Modal, Button, Popconfirm, Icon, Select, Upload, Input, DatePicker, Radio, Checkbox, InputNumber, message } from 'antd';
import moment from 'moment';
import styles from './ContractOrderCreate.less';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

function ContractOrderCreate({
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
	changeStuOldNew,        //改变签约类型

	changeTotalPrice,       //改变总合计与总实收


	confirmAddContractOrder,            //保存合同并收款
	confirmAddContractOrderOnly,        //保存合同
	cancelAddContractOrder,             //取消新增合同

    form : {
		getFieldDecorator,
        validateFieldsAndScroll,
        validateFields,
        getFieldsValue,
        getFieldValue,
        getFieldError,
        setFieldsValue,
        resetFields,
	}

}){

	let editDisabled = !!contractOrderInfo && contractOrderInfo.orderId || false;

	//改变校区时清空所选课程
    function TenantSelectOnSelectAction( value ){
		resetFields();
		let teachTools = [{ key  : 0, item : {} }];
		let classpkg = [{ key : 0, item : {} }];
		let saleUser = [{ key : 0, item : {} }];
        setFieldsValue({ 'teachTools' : teachTools })
		setFieldsValue({ parentId  : undefined });
		setFieldsValue({ stuCardId : undefined });
		setFieldsValue({ stuId     : undefined });
		setFieldsValue({ saleUser });
		setFieldsValue({ classpkg });
		setFieldsValue({ teachTools });
        if( !!value ){
            TenantSelectOnSelect( value );
        }
    };

	//改变家长
	function parentIdChangeAction( value ){
		setFieldsValue({ stuCardId : undefined });
		setFieldsValue({ stuId     : undefined });
		let stuOldNew = getFieldValue('stuOldNew');
		if( !!value ){
			parentIdChange( value, stuOldNew )
		}
	}

	//改变签约类型
	function changeStuOldNewAction(){
		let saleUser = [{
			key : 0,
			item : {}
		}]
		setFieldsValue({ parentId : undefined });
		setFieldsValue({ saleUser : saleUser });
		changeStuOldNew();
	}

    //校区下拉列表属性
    let tenantOrgSelectProps = {
        width        : 308,
        onChange     : TenantSelectOnSelectAction,            //改变机构触发事件
    };

    function cancelAddContractOrderAction(){
		cancelAddContractOrder();
	};

    function confirmAddContractOrderAction( status ){
        validateFieldsAndScroll( (err, values ) => {
            if( !!err ){
				return;
            }
			if( !values.stuId ){
				let stuId = [];
				let stuInfo = undefined;
				if( !!vipCardList && vipCardList.length > 0 ){
					let stuCardId = getFieldValue( 'stuCardId' );
					vipCardList.forEach(function( item, index ){
						if( stuCardId == item.id ){
							stuInfo = item.stuInfo;
						}
					})
				}
				!!stuInfo && stuInfo.map( function( item, index ){
					stuId.push( item.stuId );
				})
				values.stuId = stuId;
			}
			/*课时包购买*/
			if( getFieldValue('orderType') == '2' ){
				/*课时包*/
				let classpkgArr = getFieldValue('classpkg');
				let classpkg = [];
				let oriMoney = 0;          //课时包原价
				let dictMoney = 0;         //课时包折扣
				if( !!classpkgArr ){
					for( let i = 0; i < classpkgArr.length; i++ ){
						let item = classpkgArr[i];
						if( !getFieldValue('productId_' + item.key )){
							message.error( '课时包必选' );
							return;
						}
						classpkg.push({
							pid               : getFieldValue( 'productId_' + item.key ),
							amount            : Number(getFieldValue( 'product_amount_' + item.key )),
							price             : getFieldValue('productUnit_' + item.key )+'',
							money             : getFieldValue('productRealityPrice_' + item.key )+'',
							aTotalPrice       : getFieldValue('product_total_' + item.key )+'',
							preferentialPrice : getFieldValue('product_preferentialPrice_' + item.key )
						})
						oriMoney += Number(getFieldValue('product_total_' + item.key ));
						dictMoney += Number(item.item.money);
					}
				}

				/*教材*/
				let teachToolsArr = getFieldValue('teachTools');
				let teachTools = [];
				let taMoney = 0;          //教材折扣
				let taOriMoney = 0;       //教材原价
				if( !!teachToolsArr ){
					for( let i = 0; i < teachToolsArr.length; i++ ){
						let item = teachToolsArr[i];
						if( !getFieldValue('classPackage_' + item.key )){
							message.error( '请选择物资; 如果不需要请删除物资输入项' );
							return
						}
						teachTools.push({
							taId : getFieldValue('classPackage_' + item.key ),
							amount : Number(getFieldValue('teach_amount_' + item.key )),
							money : getFieldValue( 'realityPrice_' + item.key )+'',
							price : getFieldValue( 'teachToolUnit_' + item.key )+'',
							aTotalPrice : getFieldValue( 'teach_total_' + item.key )+'',
							preferentialPrice : getFieldValue( 'teach_preferentialPrice_' + item.key )
						})
						taMoney += Number(getFieldValue('realityPrice_' + item.key ));
						taOriMoney += Number(getFieldValue('teach_total_' + item.key ));
					}
				}
				values.oriMoney = oriMoney;
				values.dictMoney = dictMoney;
				values.taMoney = taMoney;
				values.taOriMoney = taOriMoney;
				values.classpkg = classpkg;
				values.teachTools = teachTools;
			}
			/*销售*/
			let saleUserArr = getFieldValue('saleUser');
			let saleUser = [];
			let rateTotal = 0;
			let newSaleUserArr = [];
			if( !!saleUserArr ){
				for( let i = 0; i < saleUserArr.length; i++ ){
					let item = saleUserArr[i];
					if( newSaleUserArr.indexOf( getFieldValue('salesName_' + item.key )) == -1 ){
                        newSaleUserArr.push( getFieldValue('salesName_' + item.key ) )
                    } else {
                        message.error('不能选择相同的销售');
                        return;
                    }
					rateTotal += Number(getFieldValue('salesRate_' + item.key ));
					saleUser.push({
						userId : getFieldValue('salesName_' + item.key ),
						rate : getFieldValue('salesRate_' + item.key )
					})
				}
			}
			if( rateTotal != 100 ){
				message.error( '销售占比之和必须等于100%');
				return;
			}
			values.saleUser = saleUser;
			let imgUrl = [];
			if ( values.imgUrl && values.imgUrl.length > 0 ) {
				!!values.imgUrl && values.imgUrl.map(function( item, index ){
					let head_img_item = item;
					let head_img_item_res = item.response;
					if( head_img_item_res && head_img_item_res.errorCode == 9000 ){
						imgUrl.push(head_img_item_res.data.url);
					}else{
						imgUrl.push(head_img_item.url || '');
					}
				})
            }
			values.imgUrl = ( imgUrl.length > 0 && imgUrl.join(',') ) || undefined;
			if( status == 'save' ){
				confirmAddContractOrderOnly( values );
			}else if( status == 'receipt' ){
            	confirmAddContractOrder( values );
			}
        })
    }

	/*模态框关闭之后*/
	function afterColse(){
		resetFields();
	}

	let time = [];
	if( !!contractOrderInfo && !!contractOrderInfo.startTime ){
		time.push( moment(new Date( contractOrderInfo.startTime )) )
	}
	if( !!contractOrderInfo && !!contractOrderInfo.endTime ){
		time.push( moment(new Date( contractOrderInfo.endTime )) )
	}

	/*订单类型变化*/
	function orderTypeChange( value ){
		let orderType = value.target.value;
		setFieldsValue({ 'orderType' : orderType } );
	}

	/*计算实收价格 以及总合计 和 总实收*/
	function countTotalPrice(){
		let teachTools = getFieldValue('teachTools');
		let classpkg = getFieldValue('classpkg');
		let teachTotal = 0;
		let classpkgTotal = 0;
		let teachMoney = 0;
		let classpkgMoney = 0;
		!!teachTools && teachTools.map(function( item, index ){
			if( !!item.item.aTotalPrice ){
				teachTotal += Number(item.item.aTotalPrice);
			}
			if( !!item.item.atotalprice ){
				teachTotal += Number(item.item.atotalprice);
			}
			if( !!item.item.money ){
				teachMoney += Number( item.item.money );
			}
		})
		!!classpkg && classpkg.map( function( item, index ){
			if( !!item.item.aTotalPrice ){
				classpkgTotal += Number( item.item.aTotalPrice );
			}
			if( !!item.item.atotalprice ){
				classpkgTotal += Number(item.item.atotalprice);
			}
			if( !!item.item.money ){
				classpkgMoney += Number( item.item.money );
			}
		})
		changeTotalPrice( teachTotal + classpkgTotal, teachMoney + classpkgMoney )
	}

	/*选择教材*/
	function teachToolSelect( value, option ){
		let currentKey = option.props.currentKey;
		let stock = option.props.stock;
		let teachTools = getFieldValue('teachTools');          //得到教材所有数据
		let currentTeachTool = undefined;
		!!teachTools && teachTools.map(function( item, index ){
			if( item.key == currentKey ){
				currentTeachTool = item
			}
		})
		let unitPrice = option.props.price;                    //单价
		let amount = getFieldValue( 'teach_amount_' + currentKey );  //数量
		let totalPrice = unitPrice * amount;                   //总计
		let money = (unitPrice * amount).toFixed(2);                        //实收
		currentTeachTool.item = {
			taId        : value,
			stock       : stock,
			price       : unitPrice.toFixed(2),
			amount      : amount,
			aTotalPrice : totalPrice.toFixed(2),
			money       : Number(money),
			preferentialPrice : '0.00元/10.0折',
		}
		setFieldsValue({ 'teachTools' : teachTools });
		setFieldsValue({ ['realityPrice_' + currentKey] : Number(money) });

		countTotalPrice();
	}

	/*教材数量改变*/
	function teachToolNumChange( currentKey ){
		let teachTools = getFieldValue('teachTools');
		let currentTeachTool = undefined;
		!!teachTools && teachTools.map(function( item, index ){
			if( item.key == currentKey ){
				currentTeachTool = item
			}
		})
		let taId = currentTeachTool.item.taid || currentTeachTool.item.taId;
		let stock = currentTeachTool.item.stock;
		let unitPrice = currentTeachTool.item.price || 0;
		let amount = getFieldValue( 'teach_amount_' + currentKey );
		if( amount > stock ){
			message.error( '数量超出库存, 请重新输入' );
			amount = 1;
		}
		if( !(/^[1-9][0-9]*$/.test(amount)) ){
			amount = 1;
		}
		let totalPrice = (unitPrice * amount).toFixed(2);
		let money = unitPrice * amount;
		currentTeachTool.item = {
			taId        : taId,
			stock       : stock,
			price       : Number(unitPrice).toFixed(2),
			amount      : amount,
			aTotalPrice : Number(totalPrice).toFixed(2),
			money       : Number(money),
			preferentialPrice : '0.00元/10.0折',
		}
		setFieldsValue({ 'teachTools' : teachTools });
		setFieldsValue({ ['realityPrice_' + currentKey] : Number(money) });
		setFieldsValue({ ['teach_amount_' + currentKey] : amount });
		countTotalPrice();
	}

	/*实收价格变化*/
	function realityPriceChange( currentKey ){
		let teachTools = getFieldValue('teachTools');
		let currentTeachTool = undefined;
		!!teachTools && teachTools.map(function( item, index ){
			if( item.key == currentKey ){
				currentTeachTool = item
			}
		})
		let taId = currentTeachTool.item.taid || currentTeachTool.item.taId;
		let stock = currentTeachTool.item.stock;
		let money = getFieldValue('realityPrice_' + currentKey );
		let unitPrice = currentTeachTool.item.price;
		let amount = currentTeachTool.item.amount;
		let totalPrice = unitPrice * amount;
		if( !(/^\d+(\.\d{1,2})?$/.test(money)) ){
			message.error( '只能输入整数和两位小数' )
			money = 0;
		}
		if( !!totalPrice && money < totalPrice || money == totalPrice ){
			let favorable = totalPrice - money;                        //优惠金额
			let rate =( money * 10/totalPrice ).toFixed(2);                               //折率
			currentTeachTool.item = {
				taId        : taId,
				stock       : stock,
				price       : Number(unitPrice).toFixed(2),
				amount      : amount,
				aTotalPrice : totalPrice.toFixed(2),
				money       : Number(money).toFixed(2),
				preferentialPrice : favorable.toFixed(2) + '元/' + rate + '折'
			}

			setFieldsValue({ 'teachTools' : teachTools });
			setFieldsValue({ ['realityPrice_' + currentKey] : Number(money).toFixed(2) });
			countTotalPrice();
		}else{
			message.error( '实收价格不能大于合计价格' );
			currentTeachTool.item = {
				price       : unitPrice,
				amount      : amount,
				aTotalPrice : totalPrice,
				money       : 0,
			}
			setFieldsValue({ 'teachTools' : teachTools });
			setFieldsValue({ ['realityPrice_' + currentKey] : 0 });
			return;
		}
	}

	/*新增教具*/
	function addTeachTools(){
		let teachTools = getFieldValue('teachTools') || [];
        if( !!teachTools && teachTools.length > 0 ){
            let maxItem = teachTools[ teachTools.length - 1 ] || {};
            let maxKey = maxItem.key;
            teachTools.push({
                key  : maxKey + 1,
                item : {}
            })
        }else {
            teachTools.push({
                key  : 0,
                item : {}
            })
        }
        setFieldsValue({ 'teachTools' : teachTools })
	}
	/*删减教具*/
	function deleteTeachTools( removeKey ){
		let teachTools = getFieldValue('teachTools') || [];
        let newTeachTools = [];
        teachTools && teachTools.length > 0 && teachTools.map(function( item, index ){
            if( item.key != removeKey ){
                newTeachTools.push( item )
            }
        })
        setFieldsValue({ 'teachTools' : newTeachTools });
		countTotalPrice();
	}
	/*教材数组*/
	let objTeachTools = [];
    if( !!contractOrderInfo.teachToolsSale ){
        let initTeachTools = JSON.parse( contractOrderInfo.teachToolsSale ) || [{}];
        initTeachTools && initTeachTools.length >0 && initTeachTools.map(function( item, index ){
            objTeachTools.push({
                key  : index,
                item : item,
            })
        })
    } else{
        objTeachTools.push({
            key  : 0,
            item : {},
        })
    };

    getFieldDecorator('teachTools',{
        initialValue : objTeachTools,
        rules : []
    });
    let teachTools = getFieldValue('teachTools');
    let TeachToolsComponents = [];
	!!teachTools && teachTools.length > 0 && teachTools.map(function( item, index ){
		let currentKey = item.key;
		let packageId = item.item.taid || item.item.taId;    //产品id
		let unitPrice = item.item.price;                     //单价
		let amount = item.item.amount;                       //数量
		let totalPrice = item.item.atotalprice || item.item.aTotalPrice;              //总计
		let preferentialPrice = item.item.preferentialprice || item.item.preferentialPrice; //优惠信息
		let money = item.item.money;                         //实收价格
		TeachToolsComponents.push(
			<div key = { 'teach_tools_' + item.key } className = { index == 0 ? 'contract_order_class_package_content first' : 'contract_order_class_package_content' } >
				<a className = 'contract_order_delete_text' onClick = { () => deleteTeachTools( item.key ) }>删除</a>
				<Form layout = 'inline'>
					<div style = {{ width : '140px' }} className = 'class_package_content_item'>
						<FormItem>
							{ getFieldDecorator('classPackage_' + item.key, {
								initialValue : packageId || undefined,
								rules : [
								]
							})(
								<Select
									showSearch
									placeholder = '请选择教材等其他物资'
									size = 'default'
									notFoundContent = "没有教材"
									optionFilterProp = 'children'
									style = {{ width : '128px' }}
									onSelect = { teachToolSelect }
									>
									{
										!!teachingList && teachingList.map(function( item, index ){
											return ( <Option
														 key = { 'contract_order_teach_' + item.id }
														 value = { item.id }
														 price = { item.price }
														 stock = { item.stock }
														 currentKey = { currentKey }
													 >
															{ item.name }
													</Option>)
										})
									}
								</Select>
							)}
						</FormItem>
					</div>
					<div style = {{ width : '100px' }} className = 'class_package_content_item'>
						{ getFieldDecorator('teachToolUnit_' + item.key, {
							initialValue : unitPrice || undefined,
							rules : [
							]
						})(
							<span>{ ( unitPrice || '0.00' ) + '元'}</span>
						)}
					</div>
					<div style = {{ width : '70px' }} className = 'class_package_content_item'>
						<FormItem>
							{ getFieldDecorator('teach_amount_' + item.key, {
								initialValue : amount || '1',
								rules : [
								]
							})(
								<Input size = 'default' onBlur = { () => teachToolNumChange( currentKey ) } />
							)}
						</FormItem>
					</div>
					<div style = {{ width : '100px' }} className = 'class_package_content_item'>
						{ getFieldDecorator('teach_total_' + item.key, {
							initialValue : totalPrice || undefined,
							rules : [
							]
						})(
							<span>{ ( totalPrice || '0.00' ) + '元'}</span>
						)}
					</div>
					<div style = {{ width : '120px' }} className = 'class_package_content_item'>
						{ getFieldDecorator('teach_preferentialPrice_' + item.key, {
							initialValue : preferentialPrice || undefined,
							rules : [
							]
						})(
							<span>{ preferentialPrice || '0.00元/10.0折' }</span>
						)}
					</div>
					<div style = {{ width : '121px' }} className = 'class_package_content_item'>
						<FormItem>
							{ getFieldDecorator('realityPrice_' + item.key, {
								initialValue : money || 0,
								rules : [
								]
							})(
								<Input style = {{ marginTop : '5px' }} onBlur = { () => realityPriceChange( currentKey ) } size = 'default' placeholder = '输入实收价格' addonAfter = '元' />
							)}
						</FormItem>
					</div>
				</Form>
			</div>
		)
	})

	/*选择产品*/
	function productIdSelect( value, option ){
		let currentKey = option.props.currentKey;
		let classpkg = getFieldValue('classpkg');          //得到教材所有数据
		let currentClasspkg = undefined;
		!!classpkg && classpkg.map(function( item, index ){
			if( item.key == currentKey ){
				currentClasspkg = item
			}
		})
		let unitPrice = option.props.price;                            //单价
		let amount = getFieldValue( 'product_amount_' + currentKey );  //数量
		let totalPrice = unitPrice * amount;                           //总计
		let money = (unitPrice * amount).toFixed(2);                   //实收
		currentClasspkg.item = {
			pid         : value,
			price       : unitPrice.toFixed(2),
			amount      : amount,
			aTotalPrice : totalPrice.toFixed(2),
			money       : Number(money),
			preferentialPrice : '0.00元/10.0折',
		}
		setFieldsValue({ 'classpkg' : classpkg });
		setFieldsValue({ ['productRealityPrice_' + currentKey] : Number(money) });
		countTotalPrice();
	}

	/*产品数量改变*/
	function productNumChange( currentKey ){
		let classpkg = getFieldValue('classpkg');
		let currentClasspkg = undefined;
		!!classpkg && classpkg.map(function( item, index ){
			if( item.key == currentKey ){
				currentClasspkg = item
			}
		})
		let pid = currentClasspkg.item.pid;
		let unitPrice = currentClasspkg.item.price || 0;
		let amount = getFieldValue( 'product_amount_' + currentKey );
		if( !(/^[1-9][0-9]*$/.test(amount)) ){
			amount = '1';
		}
		let totalPrice = unitPrice * amount;
		let money = (unitPrice * amount).toFixed(2);
		currentClasspkg.item = {
			pid         : pid,
			price       : Number(unitPrice).toFixed(2),
			amount      : amount,
			aTotalPrice : totalPrice.toFixed(2),
			money       : Number(money),
			preferentialPrice : '0.00元/10.0折',
		}
		setFieldsValue({ 'classpkg' : classpkg });
		setFieldsValue({ ['productRealityPrice_' + currentKey] : Number(money) });
		setFieldsValue({ ['product_amount_' + currentKey] : amount });

		countTotalPrice();
	}

	/*实收价格变化*/
	function productRealityPriceChange( currentKey ){
		let classpkg = getFieldValue('classpkg');
		let currentClasspkg = undefined;
		!!classpkg && classpkg.map(function( item, index ){
			if( item.key == currentKey ){
				currentClasspkg = item
			}
		})
		let pid = currentClasspkg.item.pid;
		let unitPrice = currentClasspkg.item.price;
		let amount = currentClasspkg.item.amount;
		let totalPrice = unitPrice * amount;
		let money = getFieldValue('productRealityPrice_' + currentKey );
		if( !(/^\d+(\.\d{1,2})?$/.test(money)) ){
			message.error( '只能输入整数和两位小数' )
			money = 0;
		}
		if( !!totalPrice && money < totalPrice || money == totalPrice ){
			let favorable = totalPrice - money;                        //优惠金额
			let rate =( money * 10 / totalPrice ).toFixed(2);                               //折率
			currentClasspkg.item = {
				pid         : pid,
				price       : Number(unitPrice).toFixed(2),
				amount      : amount,
				aTotalPrice : totalPrice.toFixed(2),
				money       : Number(money).toFixed(2),
				preferentialPrice : favorable.toFixed(2) + '元/' + rate + '折'
			}

			setFieldsValue({ 'classpkg' : classpkg });
			setFieldsValue({ ['productRealityPrice_' + currentKey] : Number(money).toFixed(2) });
			countTotalPrice();
		}else{
			message.error( '实收价格不能大于合计价格' );
			money = 0;
			currentClasspkg.item = {
				price       : unitPrice,
				amount      : amount,
				aTotalPrice : totalPrice,
				money       : money,
			}
			setFieldsValue({ 'classpkg' : classpkg });
			setFieldsValue({ ['productRealityPrice_' + currentKey] : money });
			return;
		}
	}

	/*新增产品*/
	function addclasspkg(){
		let classpkg = getFieldValue('classpkg') || [];
        if( !!classpkg && classpkg.length > 0 ){
            let maxItem = classpkg[ classpkg.length - 1 ] || {};
            let maxKey = maxItem.key;
            classpkg.push({
                key  : maxKey + 1,
                item : {}
            })
        }else {
            classpkg.push({
                key  : 0,
                item : {}
            })
        }
        setFieldsValue({ 'classpkg' : classpkg })
	}

	/*删减产品*/
	function deleteclasspkg( removeKey ){
		let classpkg = getFieldValue('classpkg') || [];
        let newClasspkg = [];
        classpkg && classpkg.length > 0 && classpkg.map(function( item, index ){
            if( item.key != removeKey ){
                newClasspkg.push( item )
            }
        })
        setFieldsValue({ 'classpkg' : newClasspkg });
		countTotalPrice();
	}

	/*产品数组*/
	let objClasspkg = [];
    if( !!contractOrderInfo.classpkg ){
        let initClasspkg = JSON.parse( contractOrderInfo.classpkg ) || [{}];
        initClasspkg && initClasspkg.length >0 && initClasspkg.map(function( item, index ){
            objClasspkg.push({
                key  : index,
                item : item,
            })
        })
    } else{
        objClasspkg.push({
            key  : 0,
            item : {},
        })
    };

    getFieldDecorator('classpkg',{
        initialValue : objClasspkg,
        rules : []
    });
    let classpkg = getFieldValue('classpkg');
    let ClasspkgComponents = [];
	!!classpkg && classpkg.length > 0 && classpkg.map(function( item, index ){
		let currentKey = item.key;
		let productId =  item.item.pid;                             //产品id
		let productUnitPrice = item.item.price;                     //单价
		let productAmount = item.item.amount;                       //数量
		let productTotalPrice = item.item.atotalprice || item.item.aTotalPrice;              //总计
		let productPreferentialPrice = item.item.preferentialprice || item.item.preferentialPrice; //优惠信息
		let productMoney = item.item.money;                         //实收价格
		ClasspkgComponents.push(
			<div key = { 'class_pkg_' + item.key } className = { index == 0 ? 'contract_order_class_package_content first' : 'contract_order_class_package_content' } >
				{ classpkg.length != 1 &&
					<a className = 'contract_order_delete_text' onClick = { () => deleteclasspkg( item.key ) }>删除</a>
				}
				<Form layout = 'inline'>
					<div style = {{ width : '140px' }} className = 'class_package_content_item'>
						<FormItem>
							{ getFieldDecorator('productId_' + currentKey, {
								initialValue : productId || undefined,
								rules : [
								]
							})(
								<Select
									showSearch
									placeholder = '请选择课时包'
									size = 'default'
									notFoundContent = "没有课时包"
									optionFilterProp = 'children'
									style = {{ width : '128px' }}
									onSelect = { productIdSelect }
									>
									{
										!!productList && productList.map(function( item, index ){
											return (
												<Option
													 key = { 'contract_order_product_' + item.id }
													 value = { item.id }
													 price = { item.price }
													 currentKey = { currentKey }
												 >
														{ item.name }
												</Option>
											)
										})
									}
								</Select>
							)}
						</FormItem>
					</div>
					<div style = {{ width : '100px' }} className = 'class_package_content_item'>
						{ getFieldDecorator('productUnit_' + currentKey, {
							initialValue : productUnitPrice || undefined,
							rules : [
							]
						})(
							<span>{ ( productUnitPrice || '0.00' ) + '元'}</span>
						)}
					</div>
					<div style = {{ width : '70px' }} className = 'class_package_content_item'>
						<FormItem>
							{ getFieldDecorator('product_amount_' + currentKey, {
								initialValue : productAmount || '1',
								rules : [
								]
							})(
								<Input size = 'default' onBlur = { () => productNumChange( currentKey ) } />
							)}
						</FormItem>
					</div>
					<div style = {{ width : '100px' }} className = 'class_package_content_item'>
						{ getFieldDecorator('product_total_' + currentKey, {
							initialValue : productTotalPrice || undefined,
							rules : [
							]
						})(
							<span>{ ( productTotalPrice || '0.00' ) + '元'}</span>
						)}
					</div>
					<div style = {{ width : '120px' }} className = 'class_package_content_item'>
						{ getFieldDecorator('product_preferentialPrice_' + currentKey, {
							initialValue : productPreferentialPrice || undefined,
							rules : [
							]
						})(
							<span>{ productPreferentialPrice || '0.00元/10.0折' }</span>
						)}
					</div>
					<div style = {{ width : '121px' }} className = 'class_package_content_item'>
						<FormItem>
							{ getFieldDecorator('productRealityPrice_' + currentKey, {
								initialValue : productMoney || 0,
								rules : [
								]
							})(
								<Input style = {{ marginTop : '5px' }} onBlur = { () => productRealityPriceChange( currentKey ) } size = 'default' placeholder = '输入实收价格' addonAfter = '元' />
							)}
						</FormItem>
					</div>
				</Form>
			</div>
		)
	})


	/*选择学员*/
	function selectStudent( values ){
		let selectedStuId = values.length > 0 && values[0] || undefined;
		let selectedStuItem = {};
		stuIdList && stuIdList.map(function( item, index ){
			if( selectedStuId == item.id ){
				selectedStuItem = item
			}
		})
		let seller = selectedStuItem.seller;
		let sellerItem = {};
		salesList && salesList.map( function( item, index ){
			if( seller == item.id ){
				sellerItem = item
			}
		})
		let saleUser = [];
		saleUser.push({
			key : 0,
			item : sellerItem || {}
		})
		setFieldsValue({ 'saleUser' :  saleUser })
	}

	/*选择会员卡*/
	function selectVipCard( e ){
		let seller = e.target.seller;
		console.log( salesList, seller, 'lll' )
		let sellerItem = [];
		salesList && salesList.map( function( item, index ){
			for( let i = 0; i < seller.length; i++ ){
				if( seller[i] == item.id ){
					sellerItem.push(item)
				}

			}
		})
		let saleUser = [];
		if( sellerItem.length > 0 ){
			!!sellerItem && sellerItem.map(function( item, index ){
				saleUser.push({
					key : index,
					item : item || {}
				})
			})
		}else{
			saleUser.push({
				key : 0,
				item : {}
			})
		}
		setFieldsValue({ 'saleUser' :  saleUser })
	}

	/*删除销售*/
	function deleteSalesMan( removeKey ){
		let saleUser = getFieldValue('saleUser') || [];
        let newSaleUser = [];
        saleUser && saleUser.length > 0 && saleUser.map(function( item, index ){
            if( item.key != removeKey ){
                newSaleUser.push( item )
            }
        })
        setFieldsValue({ 'saleUser' : newSaleUser });
	}
	/*新增销售*/
	function addSalesMan(){
		let saleUser = getFieldValue('saleUser') || [];
        if( !!saleUser && saleUser.length > 0 ){
            let maxItem = saleUser[ saleUser.length - 1 ] || {};
            let maxKey = maxItem.key;
            saleUser.push({
                key  : maxKey + 1,
                item : {}
            })
        }else {
            saleUser.push({
                key  : 0,
                item : {}
            })
        }
        setFieldsValue({ 'saleUser' : saleUser })
	}
	/*检查占比是否超过100%*/
	function checkSaleRate( currentKey ){
		let saleUser = getFieldValue('saleUser');
		let currentSaleUser = saleUser[ currentKey ];
		let rateTotal = 0;
		!!saleUser && saleUser.length > 0 && saleUser.map(function( item, index ){
			let rate = getFieldValue( 'salesRate_' + item.key );
			if( rate < 100 || rate == 100 ){
				rateTotal += Number( rate );
			}else{
				message.error('销售占比不能超过100%');
				setFieldsValue({ ['salesRate_' + currentKey ] : 0 });
			}
		})
		if( rateTotal > 100 ){
			message.error( '销售占比之和不能超过100%' );
			currentSaleUser.item = {
				rate : 0
			}
			setFieldsValue({ 'saleUser' : saleUser })
			setFieldsValue({ ['salesRate_' + currentKey ] : 0 });
			return;
		}
	}

	/*销售数组*/
	let objSaleUser = [];
	if( !!contractOrderInfo.saleUser ){
        let initSaleUser = JSON.parse( contractOrderInfo.saleUser ) || [{}];
        initSaleUser && initSaleUser.length >0 && initSaleUser.map(function( item, index ){
            objSaleUser.push({
                key  : index,
                item : item,
            })
        })
    } else{
        objSaleUser.push({
            key  : 0,
            item : {},
        })
    };
 	getFieldDecorator('saleUser',{
        initialValue : objSaleUser,
        rules : []
    });
	let saleUser = getFieldValue('saleUser');
    let SaleUserComponents = [];
	!!saleUser && saleUser.length > 0 && saleUser.map(function( item, index ){
		let canRemove = saleUser.length != 1;
		let initSaleId = item.item.userId || item.item.id;
		let initsaleRate = !!item.item.rate || item.item.rate === 0 ? item.item.rate + '' : undefined;
		SaleUserComponents.push(
			<Form key = { 'contract_order_sale_' + item.key } layout = 'inline' style = {{ marginLeft : '102.25px', marginTop : '5px' }}>
				<FormItem>
					{ getFieldDecorator('salesName_' + item.key, {
						initialValue : !!initSaleId && initSaleId + '' || undefined,
						rules : [
							{ required : true, message : '请选择销售' }
						]
					})(
						<Select
							showSearch
							size = 'default'
							placeholder = '请选择销售'
							notFoundContent = "没有销售"
							optionFilterProp = 'children'
							style = {{ width : '100px' }} >
							{ !!salesList && salesList.map( function( item, index ){
								return ( <Option key = { 'contract_order_sales_' + item.id } value = { item.id + '' } >{ item.name }</Option>)
							})}
						</Select>
					)}
				</FormItem>
				<FormItem style = {{ marginLeft : '10px' }}>
					{ getFieldDecorator('salesRate_' + item.key, {
						initialValue : initsaleRate || (index == 0 ? 100 : 0),
						rules : [
							{ required : true, message : '请输入占比' }
						]
					})(
							<Input onBlur = { () => checkSaleRate( item.key ) } placeholder = '输入占比' size = 'default' style = {{ width : '70px', marginRight : '5px' }} />
					)}
					<div style = {{ display : 'inline-block' }} >
						<span style = {{ marginRight : '10px'}} >%</span>
						{ !!canRemove && <a onClick = { () => deleteSalesMan( item.key ) } >删除</a> }
					</div>
				</FormItem>
			</Form>
		)
	})

//	/*删除收款单*/
//	function deletePayway( removeKey ){
//		let payway = getFieldValue('payway') || [];
//        let newPayway = [];
//        payway && payway.length > 0 && payway.map(function( item, index ){
//            if( item.key != removeKey ){
//                newPayway.push( item )
//            }
//        })
//        setFieldsValue({ 'payway' : newPayway });
//	}
//	/*新增收款单*/
//	function addPayway(){
//		let payway = getFieldValue('payway') || [];
//        if( !!payway && payway.length > 0 ){
//            let maxItem = payway[ payway.length - 1 ] || {};
//            let maxKey = maxItem.key;
//            payway.push({
//                key  : maxKey + 1,
//                item : {}
//            })
//        }else {
//            payway.push({
//                key  : 0,
//                item : {}
//            })
//        }
//        setFieldsValue({ 'payway' : payway })
//	}
//	/*收款单数组*/
//	let objPayway = [];
//	if( !!contractOrderInfo.payway ){
//        let initPayway = JSON.parse( contractOrderInfo.payway ) || [{}];
//        initPayway && initPayway.length >0 && initPayway.map(function( item, index ){
//            objPayway.push({
//                key  : index,
//                item : item,
//            })
//        })
//    } else{
//        objPayway.push({
//            key  : 0,
//            item : {},
//        })
//    };
//	getFieldDecorator('payway',{
//        initialValue : objPayway,
//        rules : []
//    });
//	let payway = getFieldValue('payway');
//    let PaywayComponents = [];
//	!!payway && payway.length > 0 && payway.map(function( item, index ){
//		PaywayComponents.push(
//			<div key = { 'contract_order_payway_' + item.key } className = 'contract_order_class_package_content' style = {{ borderTop : '1px solid #ddd', height : '41px', marginTop : '20px' }}>
//				<a className = 'contract_order_delete_text' onClick = { () => deletePayway( item.key ) }>删除</a>
//				<span style = {{ position : 'absolute', top : '10px', left : '-52px' }}>收款单 : </span>
//				<Form layout = 'inline'>
//					<div style = {{ width : '160px' }} className = 'class_package_content_item'>
//						<FormItem>
//							{ getFieldDecorator('payway_' + item.key, {
//								initialValue : undefined,
//								rules : [
//								]
//							})(
//								<Select
//									placeholder = '收款方式'
//									size = 'default'
//									style = {{ width : '148px' }} >
//									{ !!paywayList && paywayList.map(function( item, index ){
//										return ( <Option key = { 'contract_order_pay_' + item.id } value = { item.id } >{ item.name }</Option>)
//									})}
//								</Select>
//							)}
//						</FormItem>
//					</div>
//					<div style = {{ width : '140px' }} className = 'class_package_content_item'>
//						<FormItem>
//							{ getFieldDecorator('payMoney_' + item.key, {
//								initialValue : undefined,
//								rules : [
//								]
//							})(
//								<Input size = 'default' placeholder = '金额' />
//							)}
//						</FormItem>
//					</div>
//					<div style = {{ width : '150px' }} className = 'class_package_content_item'>
//						<FormItem>
//							{ getFieldDecorator('realityPrice_' + item.key, {
//								initialValue : undefined,
//								rules : [
//								]
//							})(
//								<Input style = {{ width : '100px' }} size = 'default' placeholder = '手续费率' />
//							)}
//						</FormItem>
//						<span style = {{ marginLeft : '5px' }}>%</span>
//					</div>
//					<div style = {{ width : '201px' }} className = 'class_package_content_item'>
//						<span>实际到账 : 100.00元</span>
//					</div>
//				</Form>
//			</div>
//		)
//	})
    let formItemLayout = {
        labelCol : { span : 3 },
		wrapperCol : { span : 20 }
    }

	function checkNum( rule, value, callback ){
		if(value == '' || value == undefined || value == null){
            callback();
        }else if (!/^[0-9]+(.[0-9]{1,2})?$/.test(value)) {
            callback(new Error('数字格式不正确'));
        }else {
            callback();
        }
	}

	/*校验跟进记录 字数*/
	function checkRemark( rule, value, callback ){
		if( !(/^[^\n]{1,200}$/.test(value)) ){
    		callback('不能超过200个字');
    	}else if((/^[\s]{1,200}$/.test(value))){
			callback("不能全为空格")
    	} else {
    		callback();
    	}
	}

	//校验赠课原因 字数
	function checkSendReason( rule, value, callback ){
		if( !(/^[^\n]{1,20}$/.test(value)) ){
    		callback('不能超过20个字');
    	}else if((/^[\s]{1,20}$/.test(value))){
			callback("不能全为空格")
    	} else {
    		callback();
    	}
	}

	//上课日期选择器时间范围限制
    function disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }

	function imgMaxSize( file , fileList , size , title){
        let fileSize = file.size;
        if ( fileSize > 1048576 * size ){
            message.error( title + '大小不能超过' + size + 'M')
            return false;
        }
    };

	let uploadButton = (
        <div>
            <Icon type = 'plus' />
            <div>选择图片</div>
        </div>
    );

	//学员头像
    let initContractImg = [];
	let imgUrlArrs = !!contractOrderInfo && !!contractOrderInfo.imgUrl && contractOrderInfo.imgUrl.split(',') || [];
	imgUrlArrs.length > 0 && imgUrlArrs.map(function( item, index ){
		initContractImg.push({
			uid    : - (index + 1),
            url    :  item,
            status : 'done'
		})
	})

	function normFile( e ) {
        if( Array.isArray( e ) ){
            return e;
        }
        return e && e.fileList;
    };


	//赠课原因快速选择
	function setIntoExtPeriodReason( value ){
		setFieldsValue({ 'extPeriodReason' : value })
	}

	return(
       <Modal
		    className = 'contract_order_modal'
            visible = { contractOrderCreateVisible }
            title = '合同订单'
            maskClosable = { false }
            width = '850px'
            onCancel = { cancelAddContractOrderAction }
		   	afterClose = { afterColse }
            footer = {[
				<Button key = "cancelAddFollowUpRecordAction" onClick = { cancelAddContractOrderAction } >取消</Button>,
				<Button key = "cancelAddFollowUpRecordAction1" type = 'primary' onClick = { () => confirmAddContractOrderAction( 'save' ) } style = {{ marginLeft : '20px' }} disabled = { btnLoading }
						loading = { btnLoading }>保存</Button>,
				<Button key = "confirmAddFollowUpRecordAction" type = "primary" onClick = { () => confirmAddContractOrderAction( 'receipt' ) } style = {{ marginLeft : '20px' }} disabled = { btnLoading }
						loading = { btnLoading } >保存并收款</Button>
			]}
        >
            <Form>
				<FormItem
					label = '所属校区'
					{ ...formItemLayout }
				>
					{ getFieldDecorator('orgId', {
						initialValue : orgId || undefined,
						rules : [
							{ required : true, message : '请选择校区' }
						]
					})(
						<TenantOrgSelect { ...tenantOrgSelectProps } />
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '合同编号'
					help = '合同保存之后不可修改，请仔细核对！'
				>
					{ getFieldDecorator('orderNum', {
						initialValue : orderNum || contractOrderInfo.orderNum || undefined,
						rules : [
							{ required : true, message : '请输入合同编号' }
						]
					})(
			   			<Input disabled = { editDisabled } size = 'default' placeholder = { '请输入合同编号' } style = {{ width : '308px' }} />
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '学员类型'
				>
					{ getFieldDecorator('stuOldNew', {
						initialValue : contractOrderInfo.stuOldOrNew || '0',
						rules : [
							{ required : true, message : '请选择学员类型' }
						]
					})(
			   			<RadioGroup style = {{ marginTop : '7px' }} onChange = { changeStuOldNewAction } >
							<Radio value = '0' >新学员</Radio>
        					<Radio value = '1' >老学员</Radio>
						</RadioGroup>
					)}
				</FormItem>
				<FormItem
					label = '签约家长'
					{ ...formItemLayout }
					extra = { ( getFieldValue( 'stuOldNew' ) == '0' && stuIdList.length == 0 && !!getFieldValue('parentId') ) ? '该家长没有相关学员，无法新签合同'
								: ( getFieldValue('stuOldNew') == '1' && vipCardList.length == 0 && !!getFieldValue('parentId') ) ? '该家长未开通会员卡，无法续费' : ''  }
				>
					{ getFieldDecorator('parentId', {
						initialValue : contractOrderInfo.parentId || undefined,
						rules : [
							{ required : true, message : '请选择家长' }
						]
					})(
						<Select
                            showSearch
                            size = 'default'
							placeholder = '输入家长姓名或手机号进行搜索'
                            notFoundContent = "没有家长"
							optionFilterProp = 'children'
							style = {{ width : '308px' }}
							onChange = { parentIdChangeAction }
						>
							{ parentIdList && parentIdList.map(function( item, index ){
								return ( <Option key = { 'contract_order_parent_' + item.id } value = { item.id } >{ ( item.name || '' ) + ( ( !!item.mobile && ' (' + item.mobile + ')' ) || '' ) }</Option>)
							}) }
						</Select>
					)}
				</FormItem>
				{ getFieldValue( 'stuOldNew' ) == '0' && stuIdList.length > 0 &&
					<FormItem
						label = '选择学员'
						{ ...formItemLayout }
                        style = {{ lineHeight : '28px' }}
					>
						{ getFieldDecorator('stuId', {
							initialValue : !!contractOrderInfo.stuId && contractOrderInfo.stuId.split(',') || undefined,
							rules : [
								{ required : true, message : '请选择学员' }
							]
						})(
							<CheckboxGroup onChange = { selectStudent } >
								{ stuIdList && stuIdList.map(function( item, index ){
									let value = undefined;
									if( !!item.cardId ){
										value = item.name + ' (' + item.cardId + ')';
									}else{
										value = item.name
									}
									return (
										<Checkbox
											key = { 'contract_order_stu_' + item.id }
											disabled = { !!item && !!item.cardId }
											value = { item.id }>
											{ value }
										</Checkbox>
									)
								})}
							</CheckboxGroup>
						)}
					</FormItem>
				}
				{ getFieldValue('stuOldNew') == '1' && vipCardList.length > 0 &&
					<FormItem
						label = '选择会员卡'
						{ ...formItemLayout }
					>
						{ getFieldDecorator('stuCardId',{
							initialValue : contractOrderInfo.stuCardId || undefined,
							rules : [
								{ required : true, message : '请选择会员卡' }
							]
						})(
							<RadioGroup style = {{ marginTop : '7px' }} onChange = { selectVipCard }>
								{ vipCardList && vipCardList.map(function( item, index ){
									let stuInfo = item.stuInfo;
									let stuInfoName = [];
									let stuInfoIds = [];
									let seller = [];
									let value = undefined;
									if( !!stuInfo && stuInfo.length > 0 ){
										stuInfo.map( function( item, index ){
											seller.push( item.seller || undefined);
											stuInfoName.push( item.stuName )
											stuInfoIds.push( item.stuId )
										})
										value = item.id + ' (' + stuInfoName.join(',') + ')';
									}else {
										value = item.id;
									}
									return ( <Radio key = { 'contract_order_vip_' + item.id } ids = { stuInfoIds.join(',') } seller = { seller } value = { item.id }>{ value }</Radio> )
								})}
							</RadioGroup>
						)}
					</FormItem>
				}
				<FormItem
					{ ...formItemLayout }
					label = '签约类型'
				>
					{ getFieldDecorator('signType', {
						initialValue : contractOrderInfo.signType || '0',
						rules : [
							{ required : true, message : '请选择签约类型' }
						]
					})(
			   			<RadioGroup style = {{ marginTop : '7px' }} >
							<Radio value = '0' >新签约</Radio>
        					<Radio value = '1' >续约</Radio>
						</RadioGroup>
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '合同期限'
				>
					{ getFieldDecorator('time', {
						initialValue : time || undefined,
						rules : [
							{ required : true, message : '请选择合同期限' }
						]
					})(
			   			<RangePicker
							showTime
							size = 'default'
						  	format = 'YYYY-MM-DD HH:mm'
						  	placeholder = {[ '开始时间', '结束时间' ]}
							style = {{ width : '308px' }}
						/>
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '合同签订日期'
					help = '合同保存之后不可修改，请仔细核对！'
				>
					{ getFieldDecorator('signTime', {
						initialValue : !!contractOrderInfo.signTime && moment( contractOrderInfo.signTime ) || undefined,
						rules : [
							{ required : true, message : '请选择合同期限' }
						]
					})(
						<DatePicker
							disabled = { editDisabled }
							disabledDate = { disabledDate }
							size = 'default'
							format = 'YYYY-MM-DD'
							style = {{ width : '308px' }}
							placeholder = {'请选择合同签订日期'}
						/>
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '订单类型'
				>
					{ getFieldDecorator('orderType', {
						initialValue : contractOrderInfo.orderType || '2',
						rules : [
							{ required : true, message : '请选择订单类型' }
						]
					})(
			   			<RadioGroup style = {{ marginTop : '7px' }} onChange = { orderTypeChange } >
        					<Radio value = '2' >课时包</Radio>
						</RadioGroup>
					)}
				</FormItem>
				{ getFieldValue('orderType') == '2' &&
					<FormItem
						label = '商品'
						{ ...formItemLayout }
					>
						<ul className = 'contract_order_class_package' >
							<li style = {{ width : '140px' }}>课时包</li>
							<li style = {{ width : '100px' }}>标准价格</li>
							<li style = {{ width : '70px' }}>数量</li>
							<li style = {{ width : '100px' }}>合计价格</li>
							<li style = {{ width : '120px' }}>优惠</li>
							<li style = {{ width : '120px' }}>实收价格</li>
						</ul>
					</FormItem>
				}

			</Form>
			{ getFieldValue('orderType') == '2' &&
				<div>
					{ ClasspkgComponents }
					<a className = 'contract_order_add_text' onClick = { addclasspkg }>新增</a>
					<Form style = {{ marginTop : '20px' }}>
						<FormItem
							labelCol = {{ span : 3 }}
							wrapperCol = {{ span : 20, offset : 3 }}
						>
							<ul className = 'contract_order_class_package' >
								<li style = {{ width : '140px' }}>物资</li>
								<li style = {{ width : '100px' }}>标准价格</li>
								<li style = {{ width : '70px' }}>数量</li>
								<li style = {{ width : '100px' }}>合计价格</li>
								<li style = {{ width : '120px' }}>优惠</li>
								<li style = {{ width : '120px' }}>实收价格</li>
							</ul>
						</FormItem>
					</Form>
					{ TeachToolsComponents }
					<a className = 'contract_order_add_text' onClick = { addTeachTools }>新增</a>
				</div>
			}
			<Form style = {{ marginTop : '20px' }}>
				{ getFieldValue('orderType') == '2' &&
					<FormItem
						labelCol = {{ span : 3 }}
						wrapperCol = {{ span : 20, offset : 3 }}
					>
						<ul className = 'contract_order_class_package' >
							<li style = {{ width : '310px' }}>总合计</li>
							<li style = {{ width : '100px', background : '#fff', height : '38px' }}>{ totalPrice.toFixed(2) + ' 元' }</li>
							<li style = {{ width : '120px' }}>总实收</li>
							<li style = {{ width : '120px', background : '#fff', height : '38px' }}>{ totalMoney.toFixed(2) + ' 元' }</li>
						</ul>
					</FormItem>
				}
				{ ( getFieldValue('orderType') == '1' || contractOrderInfo.orderType == '1' ) &&
					<FormItem
						label = '充值金额'
						{ ...formItemLayout }
					>
						{ getFieldDecorator('money',{
							initialValue : contractOrderInfo.money || undefined,
							rules : [
								{ required : true, message : '输入充值金额' }
							]
						})(
							<InputNumber size = 'default' placeholder = '输入充值金额' style = {{ width : '308px' }} />
						)}
					</FormItem>
				}
				<FormItem
					style = {{ marginBottom : '0' }}
					label = '关联销售'
					{ ...formItemLayout }
				>
					<div>
						<span style = {{ display : 'inline-block', marginTop : '7px', width : '120px' }}>姓名</span>
						<span>占比</span>
					</div>
				</FormItem>
			</Form>
			{ SaleUserComponents }
			<a className = 'contract_order_add_text' onClick = { addSalesMan } >新增</a>
			<Form>
				{ getFieldValue('orderType') == '2' &&
					<FormItem
						style = {{ marginTop : '20px' }}
						label = '赠送课时'
                        help = '非负数，可精确到小数点后2位'
						{ ...formItemLayout }
					>
						{ getFieldDecorator('extPeriod', {
							initialValue : contractOrderInfo.extPeriod || 0,
							rules : [
								{ validator : checkNum }
							]
						})(
							<Input size = 'default' style = {{ width : '308px' }} />
						)}
					</FormItem>
				}
				{ getFieldValue('orderType') == '2' &&
					<FormItem
						style = {{ marginTop : '20px' }}
						label = '赠课总成本'
                        help = '(用于统计赠课消耗的成本，不计入合同总额，也不计入消课统计)'
						{ ...formItemLayout }
					>
						{ getFieldDecorator('extPeriodMoney', {
							initialValue : contractOrderInfo.extPeriodMoney || 0,
							rules : [
								{ validator : checkNum }
							]
						})(
							<Input size = 'default' style = {{ width : '308px' }} />
						)}
					</FormItem>
				}
				{ getFieldValue('orderType') == '2' &&
					<div style = {{ position : 'relative' }}>
						<FormItem
							style = {{ marginTop : '20px' }}
							label = '赠课原因'
							{ ...formItemLayout }
						>
							{ getFieldDecorator('extPeriodReason', {
								initialValue : contractOrderInfo.extPeriodReason || undefined,
								rules : [
									{ validator : checkSendReason }
								]
							})(
								<Input size = 'default' placeholder = '请输入赠课原因, 限20字' style = {{ width : '308px' }} />
							)}
						</FormItem>
						<p className = { styles.quick_send_class }>
							<span>快速选择 : </span>
							<span className = { styles.quick_send_class_item } onClick = { () => setIntoExtPeriodReason( '课时包赠送' ) } >课时包赠送</span>
							<span className = { styles.quick_send_class_item } onClick = { () => setIntoExtPeriodReason( '转介绍赠课' ) } >转介绍赠课</span>
							<span className = { styles.quick_send_class_item } onClick = { () => setIntoExtPeriodReason( '活动奖励赠课' ) } style = {{ marginRight : '0' }}>活动奖励赠课</span>
						</p>
					</div>
				}
				<FormItem
					{ ...formItemLayout }
					label = '合同附件'
					help = '最多3张, 支持png, jpeg, gif格式的图片, 不大于5M'
				>
					{ getFieldDecorator('imgUrl', {
						initialValue  : initContractImg || [],
						valuePropName : 'fileList',
						// action        : `${ BASE_URL }/uploadController/upload`,
						action: `/thinknode/upload/image`,
						normalize     : normFile,
//						rules : [
//							{ type : 'array' , message : '请上传合同附件' }
//						]
					})(
						<Upload
							// action = { BASE_URL + '/uploadController/upload' }
							action = '/thinknode/upload/image'
							listType = "picture-card"
							beforeUpload = {( file , fileList ) => imgMaxSize( file , fileList , 5, '合同附件')}
						>
							{ getFieldValue('imgUrl') && getFieldValue('imgUrl').length >= 3 ?  null : uploadButton }
						</Upload>
					)}
				</FormItem>
				<FormItem
					label = '备注'
					{ ...formItemLayout }
					style = {{ marginTop : '20px' }}
				>
					{ getFieldDecorator('remark', {
						initialValue : contractOrderInfo.remark || undefined,
						rules : [
							{ validator : checkRemark }
						]
					})(
						<Input type = 'textarea' autosize = {{ minRows : 3 , maxRows : 4 }} style = {{ width : '308px' }} />
					)}
				</FormItem>
			</Form>
        </Modal>
	)
};

export default Form.create({})(ContractOrderCreate);
