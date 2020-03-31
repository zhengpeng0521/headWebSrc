import React from 'react';
import QueueAnim from 'rc-queue-anim';
import styles from './MicroGameComponent.less';
import { Button, Input, Spin, Modal, Icon, Popconfirm, Select } from 'antd';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import { NullData } from '../../../components/common/new-component/NewComponent';
import QRCode from 'qrcode.react';
import moment from 'moment';
import GameCreatePage from '../../../pages/scrm/game-create/GameCreatePage';
import PageModal from '../../../components/scrm/micro-module/page-modal/PageModal';

let Option = Select.Option;

/**
 * 微游戏管理界面
 */
function MicroGameComponent ({
    dataSource, pageIndex, pageSize, loading, hasMore,
    query, 
    gameFrameVisible, gameFrameUrl, 
    handleOrgChange,//机构选择切换
    handleGameNameChange,//检索的游戏名称改变时
    handleQueryMore,
    openCreateGame,//打开创建游戏窗口
	closeGameCreateModal,//关闭创建游戏窗口
	openGameModalVisible,
	openCreateGameModal,
	closeCreateGameModal,
	gameItem,
	gameTypeListFun,
	gameTypeList,
	labelIds,//存放列表数据
	otherGameListFun,
	queryGameItemFun,
	gameOtherList,
	checkOrPickup,
	checkMoreOrPickup,
}) {
	function openBuyModal() {
		closeCreateGameModal();
		Modal.info({
		    title: '游戏开通',
		    content: (
		      <div className={styles.buy_text_cont}>
		        <p className={styles.buy_text_p}>您可以拨打400-660-5733进行游戏开通。</p>
		      </div>
		    ),
		    onOk() {},
		  });
	}

	function gameListScroll() {
		let list_cont = document.getElementById('zsb_micro_game_list_cont_9212');
		if((list_cont.clientHeight + list_cont.scrollTop + 50) >= list_cont.scrollHeight && list_cont.scrollTop > 0 && hasMore && !loading) {
			handleQueryMore && handleQueryMore();
		}
	}

	function onSubmitModal(){
		let ifr = document.getElementById("ifr");
		ifr.contentWindow.postMessage({
			type : 'game'
		}, '*')
	}

	let organId = window._init_data.firstOrg && window._init_data.firstOrg.key;

	//选择标签
    function changeLabels(beforeId, labelId, parentId, flag) {
        if (!flag) {
            singleGetActivityList({
                pageIndex: 0,
                pageSize: pageSize,
                organId: organId,
                // defMsg: defMsg,
                labelId,
                parentId,
                beforeId
            });
        }
	}

	//切换游戏
	function changeGameItem(gameId){
		if(!!gameId){
			queryGameItemFun(gameId);
		}
	}

	//点击单个标签获取活动列表
    function singleGetActivityList(obj) {
		// this.setState({ loading: true });
		let self = this;
		dataSource = dataSource || [];
		labelIds = labelIds || [];
        let labelId = obj.labelId;
        let parentId = obj.parentId;
        let beforeId = obj.beforeId;
		let flag = false;
        //说明当前行未选中
		if (!labelId) {
			//说明点击全部
            for (let i in gameTypeList) {
                if (gameTypeList[i].parentId == parentId) {
                    gameTypeList[i].wetherChooseAll = true;
                }
			}
            for (let i in labelIds) {
                if (labelIds[i].parentId == parentId) {
					labelIds[i].labelId = undefined;
				}
				flag = true;
            }
        } else {
            for (let i in gameTypeList) {
                if (gameTypeList[i].parentId == parentId) {
                    gameTypeList[i].wetherChooseAll = false;
                }
			}
            for (let i in labelIds) {
                if (labelIds[i].parentId == parentId && labelIds[i].labelId != labelId) {
                    //选中同行未选中的，顶掉前面选中的
					labelIds[i].labelId = labelId;
					flag = true;
                    break;
                }
            }
		} 
		if (!flag) {
            labelIds.push({
                parentId,
                labelId: obj.labelId
            })
		}
		
        let formatLabelIds = [];
        let new_labelIds = [];
        for (let i in labelIds) {
            if (labelIds[i].labelId != null && labelIds[i].labelId != undefined && labelIds[i].labelId != '') {
                formatLabelIds.push(labelIds[i].labelId);
                new_labelIds.push(labelIds[i]);
            }
		}
		if(formatLabelIds.length){
			obj.formatLabelIds = formatLabelIds.join(',');
		}else{
			obj.formatLabelIds = '';//formatLabelIds 为传过去的字符串
		}
		obj.new_labelIds = new_labelIds //new_labelIds 为保存的新的列表数据
        delete obj.labelId;
        delete obj.parentId;
		delete obj.beforeId;
		handleOrgChange(obj.organId,obj.formatLabelIds,obj.new_labelIds);
	}

	let labelList = [];
	let selectOptions = [];
	let orgListDataSource = [];
	labelIds = labelIds;
	if (orgListDataSource && orgListDataSource.length > 0) {
		selectOptions = orgListDataSource.map(function (item, index) {
			return <Option key={"activityOrg_" + index} value={item.id + ''} id={item.id}>{item.name}</Option>
		});
	};
	labelList = gameTypeList.map(function (item, index) {
		let parentId = item.parentId;
		let labelValue = item.value || [];
		let div = labelValue.map((valueLabel, indexLabel) => {
			let flag = false;
			for (let i in labelIds) {
				if (labelIds[i].labelId == valueLabel.id) {
					flag = true;
					break;
				}
			}
			//若此次也是选中同一行，则beforeId为上一次本行选中项的id(beforeId在请求失败后才有用)
			let beforeId = undefined;
			for (let i in labelIds) {
				if (labelIds[i].parentId == parentId) {
					beforeId = labelIds[i].labelId;
					break;
				}
			}
			if (!!gameTypeList[index].wetherChooseAll && !valueLabel.id && valueLabel.labelName == '全部') {
				return (
					<span
						key={'laberlChild_' + indexLabel}
						className={styles.labelChild}
						style={{ color: '#fff', background: '#5D9CEC', borderRadius: '5px' }}
						onClick={() => changeLabels(beforeId, valueLabel.id, parentId)}>
						{valueLabel.labelName}
					</span>
				)
			} else{
				return (
					<span
						key={'laberlChild_' + indexLabel}
						className={styles.labelChild}
						style={{ color: !!flag ? '#fff' : '#666', background: !!flag ? '#5D9CEC' : '', borderRadius: !!flag ? '5px' : '' }}
						onClick={() => changeLabels(beforeId, valueLabel.id, parentId, flag)}>
						{valueLabel.labelName}
					</span>
				)
			}
		});
		return (
			<div key={'label_' + index} className={styles.labeGroup}>
				<div className={styles.labeTitle}>{item.group}：</div>
				<div className={styles.labeContent}>
					{div || []}
				</div>
			</div>
		)
	});

	//根据屏幕宽度计算右间距
    let sc_width = "";
	let game_list_width = "";
    window.onload = function(){
        sc_width = window.innerWidth;//屏幕宽度
	    game_list_width = sc_width - 200 - 35;//游戏列表展示的区域宽度
    }
//	let sc_width = window.innerWidth;//屏幕宽度
//	let game_list_width = sc_width - 200 - 35;//游戏列表展示的区域宽度
	let column_num = Math.floor(game_list_width / 220);

	let left_width = game_list_width - column_num * 220;//剩余宽度
	let left_with_item = left_width / (column_num - 1) + 10;
	
	let gameItemListRender = [];
	if(dataSource && dataSource.length > 0){
		dataSource && dataSource.map(function(item, index) {
		
			let bg_img_url = (item.icon && item.icon.length > 0) ? item.icon : '';
			
			let {btnType, expireTime} = item;
			let flg = btnType != 'OFF';
			if(flg) {
				flg = moment(expireTime, 'YYYY-MM-DD HH:mm:ss') > moment();
			}
			
			gameItemListRender.push(
				<div className={styles.game_item_cont} key={'game_item_cont_' + index}
					style={{marginRight: ((index + 1) % column_num == 0) ? '10px' : left_with_item + 'px'}}
				>
					{
						index && index == 0 || index < 4
						? 	<div className={styles.game_item_rightHot}>
								<img src="https://img.ishanshan.com/gimg/n/20181008/b98bf7b1365be8676ec3985c0691add8" />
							</div>
						:   null
					}
							
					<div className={styles.game_item_top_cont}
						style={{backgroundImage: 'url("' + bg_img_url + '")'}}
					>
						{/* <div className={styles.data_info_cont}>
							<span style={{color: '#5D9CEC'}}>{item.allUsers || 0}</span>家机构已经创建
						</div> */}
						
						<div className={styles.qrcode_modal_warp}>
							{!!(item.demoUrl && item.demoUrl.length > 0) &&
							<QRCode 
								size={140}
								value={item.demoUrl} /> }
						</div>
					</div>
					
					<div className={styles.game_item_bottom_cont}>
						
						<div className={styles.game_item_info}>
							<div className={styles.game_item_title}>
								{item.gameTitle}
							</div>
							
							{/* <div className={styles.game_item_intro} title={item.gameIntro}>
								{item.gameIntro}
							</div> */}
						</div>
						
						<div className={styles.game_item_buy_cont}>
							<div className={styles.game_item_price}
								
							>
								{/* ￥{item.price} */}
								<Icon type="eye"  className={styles.activity_icon_usernum} />{item.allUsers || 0}
							</div>
							
							<div className={styles.game_item_btn_cont}>
								{/* flg ?
								<Button type="primary" className={styles.game_item_btn} onClick={()=>openCreateGame(item)}>创建</Button>
								:
								<Button type="primary" className={styles.game_item_btn} onClick={openBuyModal}><span>￥{item.price}</span><span style={{marginLeft: '5px'}}>购买</span></Button>
								 */}
								{flg ?
								<Button type="primary" className={styles.game_item_btn} onClick={()=>openCreateGameModal(item)}>创建</Button>
								:
								<Button type="primary" className={styles.game_item_btn} onClick={()=>openCreateGameModal(item)}><span>￥{item.price}</span><span style={{marginLeft: '5px'}}>购买</span></Button>
								}
							</div>
						</div>
					</div>
				</div>
			);
		});
	}else{
		// gameItemListRender.push( <NullData height='200px' content='抱歉 没有符合相应条件的模板' /> )
		gameItemListRender = <NullData height = '200px' content = '抱歉 没有符合相应条件的模板'/>
	}
	
return (
	<div className={styles.center_content} onScroll={gameListScroll}
				style={{height: 'calc(100% - 50px)'}}
				id="zsb_micro_game_list_cont_9212"
				>
		<div className={styles.business_page_content} style={{background:'#fff'}} >
			
			<div className={styles.top_content}>
				{/*
				<div className={styles.filter_org_cont}>
					<TenantOrgSelect 
						style={{marginLeft: '10px', width : '100%'}} 
						value = { query.selectOrgId } 
						onSelect = { handleOrgChange }/>
				</div>
				*/}
				{!!false &&
				<div className={styles.filter_name_cont}>
					<Input 
						style={{width : '140px'}} 
						placeholder="游戏名称" value={query.moduleName} onChange={handleGameNameChange} />
				</div>}
				
				{!!false &&
				<div className={styles.top_handle_btn_cont}>
					<Button icon="search" type="primary" className={styles.handle_btn}></Button>
					<Button icon="reload" className={styles.handle_btn}></Button>
				</div>}
			</div>
			

			<div className={styles.activity_label}>
				<QueueAnim
					type={['top', 'top']}
					ease={['easeOutQuart', 'easeInOutQuart']}>
					{	
						checkOrPickup == 'check' ? labelList.slice(0, 3) :
						checkOrPickup == 'pickup' ? labelList : []
					}
				</QueueAnim>
			</div>
			
			 <div className={styles.active_main}>
				{gameTypeList.length > 3 ?
					<div className={styles.zyf_micro_activity_check_or_pickup_more_tag} onClick={() => checkMoreOrPickup(checkOrPickup)}>
						{
							checkOrPickup == 'check' ?
							<div>
								<div className={styles.zyf_micro_activity_check_or_pickup_more_tag_font}>更多</div>
								<Icon type="double-right" className={styles.zyf_micro_activity_check_more_tag} />
							</div> :
							checkOrPickup == 'pickup' ?
								<div>
									<div className={styles.zyf_micro_activity_check_or_pickup_more_tag_font}>收起</div>
									<Icon type="double-right" className={styles.zyf_micro_activity_pickup_more_tag} />
								</div> : ''
						}
					</div>
					: ''
				}
				
					
					<div className={styles.game_list_cont} >
					
						{/*单个游戏的展示块*/}
						{gameItemListRender}
						{/*单个游戏的展示块*/}
						
					</div>
					
					{loading ?
						<Spin spinning={loading} tip="加载中..." className={styles.loading_cont}/>
					:
					null
					}
					
				</div>
			</div>
			
			
			<PageModal
				title="新增微游戏"
				visible={gameFrameVisible}
				className={styles.modal_frame_modal}
				width="calc(100vw - 150px)"
				style={{top: '20px'}}
				/* footer = {[<Button type="ghost" type="primary" onClick={onSubmitModal}>保存</Button>,
					<Button type="ghost" onClick={closeGameCreateModal}>关闭</Button>
				]}  */
				footer={[
						<Popconfirm title="确定要保存吗?" placement="bottom"  okText="确定" cancelText="取消" onConfirm={() => onSubmitModal()} >
							<Button type="primary">保存</Button>
						</Popconfirm>,
						<Popconfirm title="确定要关闭吗?" placement="bottomRight"  okText="确定" cancelText="取消" onConfirm={() => closeGameCreateModal()} >
							<Button type="ghost">关闭</Button>
						</Popconfirm>
				]}
				onCancel = { closeGameCreateModal }
				maskClosable = { false }
	        >
	          <div className={styles.modal_frame_cont}>
	          	<iframe 
	          		src = { gameFrameUrl } 
								frameBorder="0"
								id="ifr"
	          		width="100%" 
	          		height="100%" 
	          		marginHeight="0" 
	          		marginWidth="0" 
	          		scrolling="auto" ></iframe>
	          </div>
	        </PageModal>
			<GameCreatePage />

			<Modal
				visible={openGameModalVisible}
				width={700}
				style={{height:'560px',minWidth:'700px'}}
				onCancel={closeCreateGameModal}
				footer={null}>
				<div style={{padding:'15px',boxSizing:'border-box'}}>
					{
						gameItem == undefined 
						? null
						: <div style={{display:'flex'}}>
							<div className={styles.activity_modal_left_box}>
								<img src={ gameItem.showImg} />
							</div>
							<div className={styles.activity_modal_right_box}>
								<h3 className={styles.activity_modal_right_title}>{gameItem.gameTitle}</h3>
								<p className={styles.activity_modal_right_type}>
									<span className={styles.activity_modal_right_icon}></span>模板类型:
								</p>
								<p className={styles.activity_modal_right_typeText}>
									{
										gameItem.labels && gameItem.labels.length > 0 
										? 	gameItem.labels.map(function(itemLab, indexLab){
												return <span key={indexLab} className={styles.activity_modal_right_textIcon}>{itemLab.label_name}</span>
											})
										:	<span className={styles.activity_modal_right_textIcon}>其他</span>
									}
								</p>
								<p className={styles.activity_modal_right_type}>
									<span className={styles.activity_modal_right_icon}></span>模板介绍:
								</p>
								<p className={styles.activity_modal_right_intro}>{gameItem.gameIntro}</p>
								{/* <p className={styles.activity_modal_right_download}>
									<a className={styles.activity_modal_right_downText}>下载活动方案</a>
								</p> */}
								<p className={styles.activity_modal_right_type}>
									<span className={styles.activity_modal_right_icon}></span>其他推荐:
								</p>
								<div className={styles.activity_modal_right_other}>
										{ 
											!!gameOtherList && gameOtherList.length && gameOtherList.length>0 ?
											gameOtherList.map(function(item,index){
												
											   return (<div className={styles.activity_modal_right_imgs} key={'game_other_list_' + index}>
														<img src={item.icon} key={index} title={item.gameTitle} onClick={()=>changeGameItem(item.gameId)}/>
													   </div>)
											   })
										   : ''
										}
								</div>
								<div className={styles.activity_modal_right_qrbox}>
									<QRCode size={132} value={gameItem.demoUrl} />
									<p>扫码试玩</p>
								</div>
								{gameItem.btnType == 'ON' ?
									<Button type="primary" className={styles.gameOractivity_div_select_button2} onClick={()=>openCreateGame(gameItem)}>立即创建</Button>
									:
									<Button type="primary" className={styles.gameOractivity_div_select_button2} onClick={openBuyModal}><span>￥{gameItem.price}</span><span style={{marginLeft: '5px'}}>购买</span></Button>
								}
							</div>
						</div>
					}
				</div>
			</Modal>
		</div>
    );
}

export default MicroGameComponent;
