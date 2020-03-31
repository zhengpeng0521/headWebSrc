import React from 'react';
import {Switch,Card,Input,Button,message} from 'antd';
import './reservation-config.css';

let ReservationConfig = React.createClass({
	getInitialState() {
		return {
			babyName : 0,
			babySex  : 0,
			babyBirthday : 0,
			tel      : 0,
			addr     : 0,
			gift     : 0,
			giftContent : '',
			updateBtnLoad : false
		};
	},

	initReservationConfig() {
		let me = this;
		  serviceRequest(BASE_URL+'/koubeiReservationConfig/get', {},
			  function(ret) {
			  	let config = ret && ret.data && ret.data.config || {};
				me.setState({
					babyName     : config.babyName,
					babySex      : config.babySex,
					babyBirthday : config.babyBirthday,
					tel          : config.tel,
					addr         : config.addr,
					gift         : config.gift,
					giftContent  : config.giftContent,
					updateBtnLoad : false
				});
		  });
	},

	componentDidMount() {
		  this.initReservationConfig();
	},

	switchOnChange(item) {
		this.state[item] = this.state[item] == 1 ? 0 : 1;
		this.setState(this.state);
	},

	updateReservationConfig() {
		let me = this;
		this.setState({
			updateBtnLoad : true
		});
		serviceRequest(BASE_URL+'/koubeiReservationConfig/save',
				{
					babyName     : me.state.babyName,
					babySex      : me.state.babySex,
					babyBirthday : me.state.babyBirthday,
					tel          : me.state.tel,
					addr         : me.state.addr,
					gift         : me.state.gift,
					giftContent  : me.refs.reservation_config_gift_content?me.refs.reservation_config_gift_content.refs.input.value : ''
				},
				  function(ret) {
					message.success('预约设置修改成功');
					me.initReservationConfig();
				},
				  function(ret) {
					message.error(ret.errorMessage);
					me.setState({
						updateBtnLoad : false
					});
				} );
	},

	render() {
		return (
            <Card title="预约显示项设置" style={{ width: '100%', borderRadius: '10px', border: '0' }}>
                <div className="config-content">
                    <div className="config-item">
                        <div className="config-item-content">
                            <div className="config-item-label">是否显示宝宝姓名</div>
                            <div className="config-item-switch"><Switch checkedChildren="是" unCheckedChildren="否" checked={this.state.babyName==1} onChange={this.switchOnChange.bind(this, 'babyName')} /></div>
                        </div>
                    </div>

                    <div className="config-item">
                        <div className="config-item-content">
                            <div className="config-item-label">是否显示宝宝性别</div>
                            <div className="config-item-switch"><Switch checkedChildren="是" unCheckedChildren="否" checked={this.state.babySex==1} onChange={this.switchOnChange.bind(this, 'babySex')} /></div>
                        </div>
                    </div>

                    <div className="config-item">
                        <div className="config-item-content">
                            <div className="config-item-label">是否显示宝宝生日</div>
                            <div className="config-item-switch"><Switch checkedChildren="是" unCheckedChildren="否" checked={this.state.babyBirthday==1} onChange={this.switchOnChange.bind(this, 'babyBirthday')} /></div>
                        </div>
                    </div>

                    <div className="config-item">
                        <div className="config-item-content">
                            <div className="config-item-label">是否显示联系方式</div>
                            <div className="config-item-switch"><Switch checkedChildren="是" unCheckedChildren="否" checked={this.state.tel==1} onChange={this.switchOnChange.bind(this, 'tel')} /></div>
                        </div>
                    </div>

                    <div className="config-item">
                        <div className="config-item-content">
                            <div className="config-item-label">是否显示联系地址</div>
                            <div className="config-item-switch"><Switch checkedChildren="是" unCheckedChildren="否" checked={this.state.addr==1} onChange={this.switchOnChange.bind(this, 'addr')} /></div>
                        </div>
                    </div>

                    <div className="config-item">
                        <div className="config-item-gift">
                            <div className="config-item-gift-switch">
                                <div className="config-item-label">是否预约有礼</div>
                                <div className="config-item-switch"><Switch checkedChildren="是" unCheckedChildren="否" checked={this.state.gift==1} onChange={this.switchOnChange.bind(this, 'gift')} /></div>
                            </div>
                            {this.state.gift == 1 ?
                            <div className="config-item-gift-content">
                                <Input type="textarea" placeholder="请输入礼品信息,小礼物能有效提升家长预约到店率(礼物由商家自行提供)" defaultValue={this.state.giftContent} autosize={{ minRows: 3, maxRows: 6 }} ref="reservation_config_gift_content" />
                            </div>
                            : ''}
                        </div>
                    </div>

                    <div className="config-item">
                        <Button type="primary" className="reservation-config-update-btn" onClick={this.updateReservationConfig} loading={this.state.updateBtnLoad} disabled={this.state.updateBtnLoad}> 保  存 </Button>
                    </div>
                </div>
            </Card>
);
	}
});

export default ReservationConfig;
