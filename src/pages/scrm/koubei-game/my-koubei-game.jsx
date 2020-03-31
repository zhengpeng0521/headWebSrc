import React from 'react';
import { Tabs, message} from 'antd';
const TabPane = Tabs.TabPane;
import GamePageList from './my-game-marketing-list';		// 游戏列表

let WxGameCreateUI = React.createClass({

	getInitialState() {
	    return {
	    	pageIndex 					: 0,	//默认请求分页数
	    	currentPageIndex			: 0,	//当前的分页数
	    	pageSize 					: 10,	//默认请求条数
	    	listDataSource				: [], 	//列表数据
	    	listPageData				: {}, 	//列表分页数据
	    	recordTouchTabKey			: '1',  //记录当前点击的tabkey
	    };
	},

	//渲染前先请求展示一次游戏数据
    componentWillMount:function() {
    	this.getGameListData( this.state.pageIndex );
    },

    //请求游戏数据
    getGameListData( pageIndex, value ) {
    	if( value != undefined ) {
    		if ( value.orgId == null || value.orgId == "" || value.orgId == undefined ){
    			delete value.orgId
    		}
    		if ( value.gameCode == null || value.gameCode == "" || value.gameCode == undefined ){
    			delete value.gameCode
    		}
    		if ( value.status == null || value.status == "" || value.status == undefined ){
    			delete value.status
    		}
    		if ( value.dataId == null || value.dataId == "" || value.dataId == undefined ){
    			delete value.dataId
    		}
    		if ( value.dataTitle == null || value.dataTitle == "" || value.dataTitle == undefined ){
    			delete value.dataTitle
    		}
    		this.request(
    				serachObj,
    				BASE_URL + '/pmgame/query/koubeiinst/list');
    	} else {
    		this.request(
    				{
    					pageIndex : pageIndex || this.state.pageIndex ,
    					pageSize  : this.state.pageSize
    				},
    				BASE_URL + '/pmgame/query/koubeiinst/list');
    	}
    },


    //数据请求（根据不同的接口获取不同的数据）
    request(parameter, url) {
    	let self = this;
		serviceRequest(
			url, parameter,
			function(res) {
				self.setState({
					listPageData 	: res.data,
					listDataSource	: res.results
				});
			},
			function(fai) {
				message.error(fai.errorMessage);
			});
    },

    //当前分页改变后判断是否有搜索条件，根据条件来进行加载数据
    changePage( pageIndex, searchConditions ) {
    	if(searchConditions != undefined) {
    		//有搜索条件
    		this.state.recordTouchTabKey == '1'
    			? this.getGameListData( searchConditions.pageIndex, searchConditions ) : this.state.recordTouchTabKey == '2'
    			? this.getActivityListData( searchConditions.pageIndex, searchConditions ) : this.getLeafletsListData(searchConditions.pageIndex, searchConditions);
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
    		? this.getGameListData( pageIndex) : this.state.recordTouchTabKey == '2'
    		? this.getActivityListData( pageIndex ) : this.getLeafletsListData( pageIndex );
    },

	//点击搜索进行搜索
	searchRet( value ) {
		if ( value.orgId == null || value.orgId == "" || value.orgId == undefined ){
			delete value.orgId
		}
		if ( value.gameCode == null || value.gameCode == "" || value.gameCode == undefined ){
			delete value.gameCode
		}
		if ( value.status == null || value.status == "" || value.status == undefined ){
			delete value.status
		}
		if ( value.dataId == null || value.dataId == "" || value.dataId == undefined ){
			delete value.dataId
		}
		if ( value.dataTitle == null || value.dataTitle == "" || value.dataTitle == undefined ){
			delete value.dataTitle
		}
		this.request(
			value,
			BASE_URL + '/pmgame/query/koubeiinst/list'
		)
	},

	render() {

		return (
                <div style={{padding:'0.1px 20px 20px 20px'}}>
                    <div className="game_base_list_div">
                        <GamePageList
                            type='1'
                            dataSource={this.state.listDataSource}
                            dataPage={this.state.listPageData}
                            pageSizeChangeCallBack ={this.changePage}
                            refreList={this.refresList}
                            search={this.searchRet}
                            getGameListRefresh = { this.getGameListData } />
                    </div>
                </div>
		)
	}
});

export default WxGameCreateUI;
