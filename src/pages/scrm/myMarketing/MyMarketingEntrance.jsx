import React from 'react';
import { Tabs, message } from 'antd';
const TabPane = Tabs.TabPane;
import GamePageList from './my-game-marketing-list';		// 游戏列表
import LeafletsList from './my-leaflets-marketing-list';	// 传单列表
import ActivityList from './my-activity-marketing-list';	// 活动列表
import GameCreatePage from "../game-create/GameCreatePage";
import MicroGameTab from './micro-game-tab' // 新老版实例列表

let WxGameCreateUI = React.createClass({

	getInitialState() {
		return {
			pageIndex: 0,	//默认请求分页数
			currentPageIndex: 0,	//当前的分页数
			pageSize: 10,	//默认请求条数
			listDataSource1: [], 	//列表数据
			listPageData1: {}, 	//列表分页数据

			listDataSource2: [], 	//列表数据
			listPageData2: {}, 	//列表分页数据

			listDataSource3: [], 	//列表数据
			listPageData3: {}, 	//列表分页数据

			recordTouchTabKey: '1',  //记录当前点击的tabkey
			baseUrl: ''
		};
	},

	//渲染前先请求展示一次游戏数据
	componentWillMount: function () {
		//this.getGameListData( this.state.pageIndex );
	},

	//请求游戏数据
	getGameListData(pageIndex, value) {
		if (value != undefined) {
			if (value.orgId == null || value.orgId == "" || value.orgId == undefined) {
				delete value.orgId
			}
			if (value.gameCode == null || value.gameCode == "" || value.gameCode == undefined) {
				delete value.gameCode
			}
			if (value.status == null || value.status == "" || value.status == undefined) {
				delete value.status
			}
			if (value.dataId == null || value.dataId == "" || value.dataId == undefined) {
				delete value.dataId
			}
			if (value.dataTitle == null || value.dataTitle == "" || value.dataTitle == undefined) {
				delete value.dataTitle
			}
			this.request(
				value,
				BASE_URL + '/pmgame/query/inst/list');
		} else {
			this.request(
				{
					pageIndex: pageIndex || this.state.pageIndex,
					pageSize: this.state.pageSize
				},
				BASE_URL + '/pmgame/query/inst/list');
		}
	},

	//请求活动数据
	getActivityListData(pageIndex, serachObj) {
		if (serachObj != undefined) {
			this.request(
				serachObj,
				BASE_URL + '/microActivity/myMarketingActivity');
		} else {
			this.request(
				{
					pageIndex: pageIndex || 0,
					pageSize: this.state.pageSize || 10,
				},
				BASE_URL + '/microActivity/myMarketingActivity');
		}
	},

	//请求传单数据
	getLeafletsListData(pageIndex, serachObj) {
		if (serachObj != undefined) {
			this.request(
				serachObj,
				BASE_URL + '/microActivity/myMarketingLeaflet');
		} else {
			this.request(
				{

					pageIndex: pageIndex,
					pageSize: this.state.pageSize
				},
				BASE_URL + '/microActivity/myMarketingLeaflet');
		}
	},

	//数据请求（根据不同的接口获取不同的数据）
	request(parameter, url) {
		let self = this;

		let recordTouchTabKey = this.state.recordTouchTabKey;

		serviceRequest(
			url, { ...parameter, pageSize: 10 },
			function (res) {

				let state = self.state;
				state['listPageData' + recordTouchTabKey] = res.data;
				state['listDataSource' + recordTouchTabKey] = res.results;
				self.setState(state);
			},
			function (fai) {
				message.error(fai.errorMessage);
			});
	},

	//当前分页改变后判断是否有搜索条件，根据条件来进行加载数据
	changePage(pageIndex, searchConditions) {
		if (searchConditions != undefined) {
			//有搜索条件
			this.state.recordTouchTabKey == '1'
				? this.getGameListData(searchConditions.pageIndex, searchConditions) : this.state.recordTouchTabKey == '2'
					? this.getActivityListData(searchConditions.pageIndex, searchConditions) : this.getLeafletsListData(searchConditions.pageIndex, searchConditions);
		} else {
			//无搜索条件
			this.state.recordTouchTabKey == '1'
				? this.getGameListData(pageIndex) : this.state.recordTouchTabKey == '2'
					? this.getActivityListData(pageIndex) : this.getLeafletsListData(pageIndex);
		}
	},

	//刷新数据列表
	refresList(pageIndex) {
		this.state.recordTouchTabKey == '1'
			? this.getGameListData(pageIndex) : this.state.recordTouchTabKey == '2'
				? this.getActivityListData(pageIndex) : this.getLeafletsListData(pageIndex);
	},

	//切换tab
	callback(key) {
		this.setState({
			recordTouchTabKey: key
		});
		//  key == '1' ? this.getGameListData()
		//: key == '2' ? this.getActivityListData()
		//: this.getLeafletsListData();
	},

	//点击搜索进行搜索
	searchRet(value) {
		if (this.state.recordTouchTabKey == '1') {
			if (value.orgId == null || value.orgId == "" || value.orgId == undefined) {
				delete value.orgId
			}
			if (value.gameCode == null || value.gameCode == "" || value.gameCode == undefined) {
				delete value.gameCode
			}
			if (value.status == null || value.status == "" || value.status == undefined) {
				delete value.status
			}
			if (value.dataId == null || value.dataId == "" || value.dataId == undefined) {
				delete value.dataId
			}
			if (value.dataTitle == null || value.dataTitle == "" || value.dataTitle == undefined) {
				delete value.dataTitle
			}
			this.request(
				value,
				BASE_URL + '/pmgame/query/inst/list'
			)

		} else if (this.state.recordTouchTabKey == '2') {
			this.request(
				value,
				BASE_URL + '/microActivity/myMarketingActivity'
			)
		} else {
			this.request(
				value,
				BASE_URL + '/microActivity/myMarketingLeaflet'
			)
		}
	},

	render() {

		//后期处理，赶时间（谁看到告诉我-贾帅）
		let repeatArr = [], newDateSource = [];

		this.state.listDataSource1 && this.state.listDataSource1.length > 0 && this.state.listDataSource1.map((item, index) => {
			if (repeatArr.indexOf(item.instId) == -1) {
				repeatArr.push(item.instId);
				item.orgId = String(item.orgId);
				newDateSource.push(item);
			} else {
				let idsString = '', deleteRepeatIdArr = [];
				newDateSource && newDateSource.map((oItem, oIndex) => {
					if (oItem.instId === item.instId) {
						idsString = String(oItem.orgId) + `,${item.orgId}`;
						let idsArr = idsString.split(',');
						idsArr && idsArr.map((item, index) => {
							if (deleteRepeatIdArr.indexOf(item) == -1) {
								deleteRepeatIdArr.push(item);
							}
							oItem.orgId = deleteRepeatIdArr.join(',');
						})
					}
				})
			}
		})

		return (
			<div className="game_base_list_div" >
				<GameCreatePage />
				<div style={{ padding: '20px 0 40px'}}>
					<div className="tabs">
						<Tabs defaultActiveKey="1" onChange={this.callback}>
							<TabPane tab="微游戏" key="1">
								<MicroGameTab
									ref="market_entrance_game"
									type='1'
									recordTouchTabKey={this.state.recordTouchTabKey}
									dataSource={newDateSource}
									dataPage={this.state.listPageData1}
									pageSizeChangeCallBack={this.changePage}
									refreList={this.refresList}
									search={this.searchRet}
									getGameListRefresh={this.getGameListData}
								/>
								{/* <GamePageList
									ref="market_entrance_game"
									type='1'
									dataSource={newDateSource}
									dataPage={this.state.listPageData1}
									pageSizeChangeCallBack={this.changePage}
									refreList={this.refresList}
									search={this.searchRet}
									getGameListRefresh={this.getGameListData} /> */}
							</TabPane>
							<TabPane tab="微活动" key="2">
								<ActivityList
									ref="market_entrance_activity"
									type='2'
									dataSource={this.state.listDataSource2}
									dataPage={this.state.listPageData2}
									pageSizeChangeCallBack={this.changePage}
									refreList={this.refresList}
									search={this.searchRet}
									getActivityListRefresh={this.getActivityListData} />
							</TabPane>
						</Tabs>
					</div>
				</div>
			</div>
		)
	}
});

export default WxGameCreateUI;
