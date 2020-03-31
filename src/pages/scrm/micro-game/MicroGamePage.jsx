import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Button, Modal, Collapse } from 'antd';
import MicroGameComponent from '../../../components/scrm/micro-game/MicroGameComponent';
import GameInstPreviewModal from '../myMarketing/GameInstPreviewModal';

function MicroGamePage({ dispatch, microGameMgrModel }) {

	let {
		dataSource, pageIndex, pageSize, loading, hasMore,
		query, instDataSource,
		gameFrameVisible, gameFrameUrl, buyModalVisible, attrModifyFrameUrl,
		openGameModalVisible,
		gameItem,
		gameTypeList,
		labelIds,
		gameOtherList,
		checkOrPickup,
		themeInfo,
		h5createUrl, // 新版游戏编辑器地址

	} = microGameMgrModel;

	function checkMoreOrPickup(type) {
		switch (type) {
			case 'check':
				dispatch({
					type: 'microGameMgrModel/updateState',
					payload: {
						checkOrPickup: 'pickup',
					}
				})
				break;
			case 'pickup':
				dispatch({
					type: 'microGameMgrModel/updateState',
					payload: {
						checkOrPickup: 'check',
					}
				})
				break;
		}
	}

	/*
	 * 滚动加载更多数据 
	 */
	function handleQueryMore() {

		dispatch({
			type: 'microGameMgrModel/queryDataSource',
			payload: {
				pageSize: pageSize + 15
			}
		});
	}

	/* 游戏类型 */
	function gameTypeListFun() {
		dispatch({
			type: 'microGameMgrModel/queryGameType',
			payload: {
				product: 2
			}
		})
	}

	/*机构切换选择时*/
	function handleOrgChange(selectOrgId, formatLabelIds, new_labelIds) {
		dispatch({
			type: 'microGameMgrModel/queryDataSource',
			payload: {
				formatLabelIds,
				new_labelIds,
				query: {
					...query,
					selectOrgId,
				}
			}
		});
	}

	/*打开创建游戏窗口*/
	function openCreateGame(gameItem) {
		closeCreateGameModal();
		let tenantId = gameItem.tenantId;
		let orgId = gameItem.orgId;
		let gameCode = gameItem.gameCode;
		let gameId = gameItem.gameId;
		let gameName = gameItem.gameTitle;
		let isGameEdit = gameItem.isGameEdit;
		let uid = window.uid || '';
		let runAs = window.runAs || '';

		let new_gameFrameUrl = gameItem.provider + '/page?m=create&tenantId=' + tenantId + '&orgId=' + orgId + '&gameCode=' + gameCode + '&gameId=' + gameId + '&uid=' + uid + '&runAs=' + runAs;

		if (isGameEdit == 'true') {
			dispatch({
				type: 'gameTemplateCreate/showCreateGamePage',
				payload: {
					attrShowPageModal: true,
					attrGameFrameUrl: new_gameFrameUrl,
					isHq: 2,
				}
			});

			dispatch({
				type: 'microGameMgrModel/updateState',
				payload: {
					attrModifyFrameUrl: new_gameFrameUrl,
				}
			});

		} else if (gameItem.isH5 == 1) {
			if (JSON.stringify(themeInfo) !== '{}') {
				var t = new Date()
				var iToDay = t.getDate()
				var iToMon = t.getMonth()
				var iToYear = t.getFullYear()
				var newDay = new Date(iToYear, iToMon, (iToDay + 31))
				const startDate = new Date(t)
				const endDate = new Date(newDay)
				themeInfo.startTime = startDate.getTime()
				themeInfo.endTime = endDate.getTime()
				delete themeInfo.content
				dispatch({
					type: 'microGameMgrModel/createThemeInst',
					payload: {
						...themeInfo,
						sources: '0'
					}
				})
				dispatch({
					type: 'gameTemplateCreate/showCreateGamePage',
					payload: {
						attrShowPageModal: true,
					}
				});
			}
		}
		else {
			dispatch({
				type: 'microGameMgrModel/updateState',
				payload: {
					gameFrameVisible: true,
					gameFrameUrl: new_gameFrameUrl,
				}
			});
		}

		//启动定时器   保证seesion有效
		window.wActivityTimer = setInterval(function () {
			serviceRequest(
				BASE_URL + '/organController/getTenant', {}
			)
		}, 600000);

		if (window._current_user_info && window._init_data) {
			let opIndex = window._current_user_info.opIndex++;
			let buriedPointParam = {
				PageCode: 'mic_game',
				PageName: '微游戏',
				Activeness: 2,
				_orgId: window._current_user_info.orgId,
				_tenantId: window._current_user_info.tenantId,
				_opId: window._init_data.firstOrg.pid,
				_account: window._init_data.account,
				_btnName: '创建微游戏',
				_opIndex: opIndex,
				_gameCode: gameCode,
				_gameName: gameName,
			}
			sa && sa.track('add_click', buriedPointParam);
		}
	}

	/*关闭创建游戏窗口*/
	function closeGameCreateModal() {
		dispatch({
			type: 'microGameMgrModel/updateState',
			payload: {
				gameFrameVisible: false,
				gameFrameUrl: '',
			}
		});

		window.wActivityTimer && clearInterval(window.wActivityTimer);
	}

	/* 创建和购买游戏的弹框打开 */
	function openCreateGameModal(gameItem) {
		dispatch({
			type: 'microGameMgrModel/updateState',
			payload: {
				openGameModalVisible: true,
				gameItem: gameItem,
			}
		})
		otherGameListFun(gameItem.gameId)
		if (gameItem.isH5 == 1) {
			queryThemeInfo(gameItem.themeId)
		}
	}

	function otherGameListFun(gameId) {
		dispatch({
			type: 'microGameMgrModel/otherGameList',
			payload: {
				gameId: gameId
			}
		})
	}
	/* 查询新版编辑器游戏模板信息 */
	function queryThemeInfo(themeId) {
		dispatch({
			type: 'microGameMgrModel/queryThemeInst',
			payload: {
				themeId: themeId
			}
		})
	}

	function queryGameItemFun(gameId) {
		new Promise((resolve) => {
			dispatch({
				type: 'microGameMgrModel/queryGameItem',
				payload: {
					resolve,
					gameId: gameId,
				}
			})
		}).then((newItem) => {
			if (!!newItem) {
				closeCreateGameModal();
				openCreateGameModal(newItem);
			}
		});
	}

	/* 关闭创建和购买游戏的弹框打开 */
	function closeCreateGameModal() {
		dispatch({
			type: 'microGameMgrModel/updateState',
			payload: {
				openGameModalVisible: false,
			}
		})
	}

	let componentProps = {
		dataSource, pageIndex, pageSize, loading, hasMore,
		query,
		gameFrameVisible, gameFrameUrl, openCreateGame, closeGameCreateModal,
		openCreateGameModal, openGameModalVisible, closeCreateGameModal,
		handleQueryMore, handleOrgChange,
		gameItem,
		gameTypeListFun,
		gameTypeList,
		otherGameListFun,
		queryGameItemFun,
		labelIds,
		gameOtherList,
		checkOrPickup,
		checkMoreOrPickup,
		h5createUrl // 新版游戏编辑器地址
	};

	/**
	 * 关闭
	 */
	function handleOnCloseInstPreviewModal() {
		// window.parent.postMessage('close', '*');
		dispatch({
			type: 'microGameMgrModel/updateState',
			payload: {
				instDataSource: {
					...instDataSource,
					gameInstPreviewVisible: false,
				},
				attrModifyFrameUrl: ''
			}
		});
	}

	/**
	 * 再次编辑
	 */
	function handleOnEditAgain() {
		attrModifyFrameUrl = attrModifyFrameUrl + '&dataId=' + instDataSource.gameInstId || '';
		dispatch({
			type: 'microGameMgrModel/updateState',
			payload: {
				instDataSource: {
					...instDataSource,
					gameInstPreviewVisible: false,
				},
			}
		});

		dispatch({
			type: 'gameTemplateCreate/showCreateGamePage',
			payload: {
				attrShowPageModal: true,
				attrGameFrameUrl: attrModifyFrameUrl,
				isHq: 0,
			}
		});
	}

	let gameInstPreviewProps = {
		visible: instDataSource.gameInstPreviewVisible,
		instId: instDataSource.gameInstId,
		inst_h5_url: instDataSource.instH5Url,
		inst_h5_preview_url: instDataSource.instH5PreviewUrl,
		gameInstData: instDataSource.gameInstData || {},
		handleOnClose: handleOnCloseInstPreviewModal,
		handleOnEditAgain: handleOnEditAgain,
	}

	return (
		<div style={{ height: '100%' }}>
			<MicroGameComponent {...componentProps} />
			<GameInstPreviewModal {...gameInstPreviewProps} />
		</div>
	);
}

MicroGamePage.propTypes = {
	dispatch: PropTypes.func,
	microGameMgrModel: PropTypes.object,
};

function mapStateToProps({ microGameMgrModel }) {
	return { microGameMgrModel };
}

export default connect(mapStateToProps)(MicroGamePage);
