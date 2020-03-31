/* 新老版游戏列表 */
import React from 'react';
import { connect } from 'dva';
import { Tabs, message } from 'antd';
import * as styles from "./dataViewPage.less"
const TabPane = Tabs.TabPane;
import GamePageList from './my-game-marketing-list';		// 游戏列表

let WxGameListUI = React.createClass({

	getInitialState() {
		return {
      attrGameFrameUrl: '',
      baseUrl: '',
      token: '',
		};
  },
  componentWillUnmount() {
    //重写组件的setState方法，直接返回空
    this.setState = (state,callback)=>{
      return;
    }
  },
  componentDidMount() {
    let self = this
		serviceRequest( BASE_URL + '/getUrl' , {} , function (res){
        self.setState({
          baseUrl : res.domain.replace("\"","").replace("\"","")
        })
      }
    )
    window.addEventListener('message', function(e) {
      var receiver = document.getElementById('receiver') && document.getElementById('receiver').contentWindow;
      let arr = e.data.split('_')
      if(arr && arr.length > 0) {
        if(arr[0] == "editH5Game") {
          let editUrl = `${self.state.baseUrl}/headquarters.html?action=editInst&instId=` + arr[1] + `&instStatus=` + arr[2] + `&token=` + self.state.token
          self.props.dispatch({
            type: 'gameTemplateCreate/showCreateGamePage',
            payload: {
              attrShowPageModal: true,
              h5createUrl: editUrl,
              isH5: 1,
            }
          });
        } else if(arr[0] == "dataDetail"){
          let dataDetailUrl = `${self.state.baseUrl}/headquarters.html?action=dataDetail&instId=` + arr[1] + `&busiType=` + arr[2] + `&distributionType=` + arr[3] + `&token=` + self.state.token
          self.props.dispatch({
            type: 'gameTemplateCreate/showCreateGamePage',
            payload: {
              attrShowPageModal: true,
              h5createUrl: dataDetailUrl,
              isH5DataDetail: true,
            }
          });
        }
      }
      /* 关闭数据详情 */
      if(e.data === 'closeDataDetail') {
        self.props.dispatch({
          type: 'gameTemplateCreate/showCreateGamePage',
          payload: {
            attrShowPageModal: false,
            h5createUrl: '',
          }
        });
        receiver && receiver.postMessage("updateData", "*");
      }
      /* 关闭游戏编辑 */
      else if(e.data === 'closeGame') {
        self.props.dispatch({
          type: 'gameTemplateCreate/showCreateGamePage',
          payload: {
            attrShowPageModal: false,
            h5createUrl: '',
          }
        })
        receiver && receiver.postMessage("updateData", "*");
      }
    }, false)
  },
	render() {
    let arr
    var reg = new RegExp("(^| )" + 'Authorization' + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      this.state.token  = unescape(arr[2]).slice(7)
    }
    this.state.attrGameFrameUrl = `${this.state.baseUrl}/headquarters.html?action=userInstList&token=` + this.state.token

		return (
			<div className="game_base_list_div" >
				<div style={{ padding: '20px 20px 40px 0px' }}>
					<div className={styles.gameTabs}>
						<Tabs defaultActiveKey='1' type="card">
							<TabPane tab="老版游戏" key="1">
                <GamePageList
                    dataSource={this.props.dataSource}
                    dataPage={this.props.dataPage}
                    pageSizeChangeCallBack={this.props.pageSizeChangeCallBack}
                    refreList={this.props.refreList}
                    search={this.props.search}
                    getGameListRefresh={this.props.getGameListRefresh} />
							</TabPane>
							<TabPane tab="新版游戏" key="2">
                <div style={{ height: `calc(100vh - 240px)`}} >
                  <iframe
                    id="receiver"
                    src={this.state.attrGameFrameUrl || ''}
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    marginHeight="0"
                    marginWidth="0"
                    scrolling="auto">
                  </iframe>
                </div>
							</TabPane>
						</Tabs>
					</div>
				</div>
			</div>
		)
	}
});
function mapStateToProps({ gameTemplateCreate }) {
	return { gameTemplateCreate };
}
export default connect(mapStateToProps)(WxGameListUI);
