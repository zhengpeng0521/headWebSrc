/*
 * 	微活动
 */
import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { Modal, Button, Pagination, Select, message, Input, Icon, Form, Spin } from 'antd';
import MicroActivityTemplate from '../microActivity-template/template-instance-form';
import TenantOrgSelect from '../../common/tenant-org-filter/TenantOrgFilter';
import MicroLeafletTemplate from '../microLeaflet-template/template-microLeaflet-instance-form';
import CodeModalActivity from '../microActivity-template/codeModal';
import CodeModalLeaflet from '../microLeaflet-template/codeModal';
import QRCode from 'qrcode.react';
import { NullData } from '../../../components/common/new-component/NewComponent';
import { uniqueArr } from '../../../utils/arrayUtils';          //数组去重
import { connect } from 'dva';
import styles from './MicroActivity.less';
import MicroModuleForm from '../micro-module/MicroModuleForm';//自定义的微模板 机构配置界面

const Search = Input.Search;

let Option = Select.Option;

const MicroActivity = React.createClass({

    //初始化
    getInitialState() {
        return {
            wetherScrollBottom: false,        //是否滑动到最底部
            loading: false,        //页面加载
            orgListDataSource: [], 		    //保存获取的机构列表数据
            organId: '', 		    //记录当前选中的机构ID
            defMsg: undefined,    //模板名称
            pageSize: 10,  		    //记录分页数量
            pageIndex: 0,  		    //记录分页码数
            currentSelectCampus: '', 		    //记录当前选中的校区
            currentSelectCampusName: '',           //记录当前选中校区名称
            ishowOpenActivityModal: false, 	    //是否显示开通活动
            acitvityList: [], 			//获取游戏或者活动列表
            acitvityData: {}, 			//获取游戏或者活动分页
            getInuputPhone: '',		    //获取输入电话
            currentInterfaceQr: '', 		    //当前点击的二维码
            ishowReviewOrtryModal: false,        //是否显示试玩或者预览
            ishowCustomModal: false, 		//是否显示试玩或者预览
            getSearchContent: '', 		    //获取搜索内容
            activityFormVisible: false, 	    //创建微活动实例
            leafletFormVisible: false,        //创建微传单实例
            activityTypeId: "",           //微活动实例id
            activityCode: "",			//微活动实例编码
            codeModalVisible: false,        //二维码模态框
            codeUrl: '',           //实例二维码
            categoryid: '',           //模板类型
            myLabel: [],           //标签
            labelIds: [],           //选中查询的标签数组
            checkOrPickup: 'check'       //默认是查看更多按钮
        }
    },

    //第一次进入调用
    componentWillMount() {
        let orgId = window._init_data.firstOrg && window._init_data.firstOrg.key;
        let orgName = window._init_data.firstOrg && window._init_data.firstOrg.label;
        this.setState({
            currentSelectCampus: orgId,
            currentSelectCampusName: orgName,
            //   organId                 : orgId,
            pageSize: 4 * Math.floor((document.body.clientWidth - 290) / 250) || this.state.pageSize,
        });
        this.getActivityList(this.state.pageIndex, orgId);
        this.getTagList(this.state.pageIndex, orgId);
    },

    //获取活动列表
    getActivityList(pageIndex, organId, defMsg, labelIds, searchType) {
        this.requestData(
            {
                type: 1,
                pageSize: 4 * Math.floor((document.body.clientWidth - 290) / 250) || this.state.pageSize,
                pageIndex: pageIndex || 0,
                // organId 	: organId   || 0,
                defMsg,
                labelIds,
                searchType,
                isHq: 1,
            },
            BASE_URL + '/microActivity/getActivityList',
        )
    },

    zyfOnSroll() {
        const { getFieldValue } = this.props.form;
        let div = document.getElementById('zyf_game_general_base');
        if (div.clientHeight + div.scrollTop >= div.scrollHeight && div.scrollTop > 0 && !this.state.wetherScrollBottom) {
            let pageIndex = this.state.pageIndex + 1;
            let organId = this.state.organId || undefined;
            let labelIds = [];

            if (!!this.state.labelIds && this.state.labelIds.length > 0) {
                for (let i in (this.state.labelIds)) {
                    labelIds.push(this.state.labelIds[i].labelId)
                }
            }

            setTimeout(this.getActivityList, 100, pageIndex, organId, this.state.defMsg, labelIds.join(','));
        }
    },

    getTagList(params) {
        this.serviceReq(
            { product: '1' },
            BASE_URL + '/productLabel/alllabel/query',
        )
    },

    //标签名查询
    serviceReq(paramter, url) {
        let self = this;
        serviceRequest(
            url,
            paramter,
            function (res) {
                for (let i in res.results) {
                    res.results[i].parentId = i,                //父组件id
                        res.results[i].wetherChooseAll = true      //是否选中全部
                    res.results[i].value.splice(0, 0, { id: undefined, labelName: '全部' })
                }
                self.setState({
                    myLabel: res.results
                })
            },
            function (fai) {
                message.error(fai.errorMessage);
            }
        );
    },

    //列表查询
    requestData(paramter, url, type) {

        this.setState({ loading: true })
        let self = this;
        let acitvityList = this.state.acitvityList;
        let searchType = paramter.searchType || undefined;
        delete paramter.searchType;
        paramter.isHq = 1;
        serviceRequest(
            url,
            paramter,
            function (res) {
                if (type) {
                    self.setState({
                        orgListDataSource: res.results,
                    });
                } else {
                    if (!!searchType) {
                        self.setState({
                            wetherScrollBottom: true,
                            acitvityList: res.results,
                        });
                    } else {
                        if (res.data.pageIndex == 0) {
                            self.setState({
                                wetherScrollBottom: true,
                                acitvityList: res.results,
                            });
                        } else if (res.data.pageIndex > 0) {
                            for (let i in res.results) {
                                acitvityList.push(res.results[i])
                            }
                            self.setState({
                                wetherScrollBottom: true,
                                acitvityList,
                            });
                        } else {
                            for (let i in res.results) {
                                acitvityList.push(res.results[i])
                            }
                            self.setState({
                                wetherScrollBottom: false,
                                acitvityList,
                            });
                        }
                    }
                    self.setState({
                        acitvityData: res.data,
                        pageIndex: res.data.pageIndex || 0,
                        pageSize: res.data.pageSize || 24,
                        // organId : paramter.organId,
                        type: paramter.type,
                        loading: false,
                        currentSelectCampus: paramter.organId,
                        defMsg: paramter.defMsg,
                        wetherScrollBottom: (res.data.pageIndex + 1) >= res.data.pageCount,
                    });
                }

            },
            function (fai) {
                self.setState({
                    loading: false
                });
                message.error(fai.errorMessage);
            });
    },

    //选择校区
    selectChange(value, name) {
        this.setState({
            currentSelectCampus: value,
            currentSelectCampusName: name,
            //organId                 : value,
        });
        //this.getActivityList( this.state.pageIndex, value );
    },

    //查看试玩二维码
    tryOrReview(item) {
        this.setState({ currentInterfaceQr: item.previewurl, ishowReviewOrtryModal: !this.state.ishowReviewOrtryModal });
    },

    //分页改变
    activityItemPageChange(pagination, filters, sorter) {
        // this.getActivityList( pagination - 1, this.state.organId );
        this.getActivityList(pagination - 1);
        this.setState({
            pageIndex: pagination - 1
        })
    },

    //获取用户输入的手机号码
    inputPhone(p) {
        this.setState({ getInuputPhone: p.target.value });
    },

    //试玩取消
    tryOrReviewPoQrCodeCancel() {
        this.setState({ ishowReviewOrtryModal: !this.state.ishowReviewOrtryModal });
    },

    //试玩确定
    tryOrReviewPoQrCodeOk() {
        this.setState({ ishowReviewOrtryModal: !this.state.ishowReviewOrtryModal });
    },

    //活动创建
    openActivityOrCreate(item) {
        // if (this.state.currentSelectCampusName&&this.state.currentSelectCampusName.length > 0) { //判断是否选择校区
        if (item.isopen == 0) {  					//判断是否开通状态
            this.setState({ ishowOpenActivityModal: !this.state.ishowOpenActivityModal });
        } else {

            if (item.categoryid == '1') {
                let activityType = item.type;
                //打开 高级模板的创建窗口
                if (activityType == undefined || activityType == '') {
                    //活动创建页面跳转
                    this.setState({
                        activityFormVisible: true,
                        activityTypeId: item.id,
                        activityCode: item.code,
                    });
                } else {
                    this.props.dispatch && this.props.dispatch({
                        type: 'microModuleFormModel/handleShow',
                        payload: {
                            moduleOpenOrgs: item.orgIds || '',
                            moduleId: item.id,
                            orgId: this.state.organId,
                            orgName: undefined,
                            afterFormSubmit: () => {
                                clearInterval(window.wActivityTimer);
                                window.wActivityTimer = null;
                            }
                        }
                    });
                }
            } else if (item.categoryid == '2') {

                this.setState({
                    leafletFormVisible: true,
                    activityTypeId: item.id,
                    activityCode: item.code,
                });

                window.wActivityTimer = setInterval(function () {
                    serviceRequest(
                        BASE_URL + '/organController/getTenant', {}
                    )
                }, 600000)
            }
            this.setState({
                categoryid: item.categoryid,
            });
        }
        // } else {
        // 	message.error('请选择校区');
        // 	return false;
        // };
    },

    //取消开通
    activityCancel() {
        this.setState({ getInuputPhone: '', ishowOpenActivityModal: !this.state.ishowOpenActivityModal });
    },
    //点击个性化定制
    touchCustom() {
        this.setState({ ishowCustomModal: !this.state.ishowCustomModal });
    },
    customCodeCancel() {
        this.setState({ getInuputPhone: '', ishowCustomModal: !this.state.ishowCustomModal });
    },
    customCodeOk() {
        if (this.state.getInuputPhone != '') { let reg = /^0?1[3|4|5|8][0-9]\d{8}$/; if (reg.test(this.state.getInuputPhone)) { this.setState({ ishowCustomModal: !this.state.ishowCustomModal }); } else { message.error("请输入正确的手机号码"); return; } } else { message.error('请输入手机号码'); }
        this.setState({ getInuputPhone: '' });
    },

    //搜索输入失去焦点
    onBlur(input) {
        this.setState({ getSearchContent: input.target.value });
    },
    //进行搜索
    touchSearch() {
        this.requestData({ activityName: this.state.getSearchContent }, BASE_URL + '/microActivity/getActivityList');
    },

    //关闭创建微活动
    changeTempletInstanceFormVisible() {
        this.setState({
            activityFormVisible: false,
            leafletFormVisible: false
        });
        clearInterval(window.wActivityTimer);
        window.wActivityTimer = null;
    },

    //二维码模态框
    changeCodeModalVisible() {
        this.setState({
            codeModalVisible: !this.state.codeModalVisible
        });
    },

    //确认二维码,关闭窗口
    onConfirmCodeModal() {
        this.setState({
            codeModalVisible: !this.state.codeModalVisible,
            activityFormVisible: false,
            leafletFormVisible: false,
        })
    },

    //传递二维码地址
    diliverCode(url) {
        this.setState({
            codeUrl: url
        })
    },
    //选择标签
    changeLabels(beforeId, labelId, parentId, flag) {
        if (!flag) {
            let labelIds = this.state.labelIds;
            this.singleGetActivityList({
                pageIndex: 0,
                pageSize: this.state.pageSize,
                organId: this.state.organId,
                defMsg: this.state.defMsg,
                labelId,
                parentId,
                beforeId
            });
        }
    },

    //点击单个标签获取活动列表
    singleGetActivityList(obj) {
        this.setState({ loading: true });
        let self = this;
        let acitvityList = self.state.acitvityList;
        let labelIds = self.state.labelIds || [];
        let myLabel = self.state.myLabel || [];
        let labelId = obj.labelId;
        let parentId = obj.parentId;
        let beforeId = obj.beforeId;
        let flag = false;
        if (!labelId) {
            //说明点击全部
            for (let i in myLabel) {
                if (myLabel[i].parentId == parentId) {
                    myLabel[i].wetherChooseAll = true;
                }
            }
            for (let i in labelIds) {
                if (labelIds[i].parentId == parentId) {
                    labelIds[i].labelId = undefined;
                }
            }
        } else {
            for (let i in myLabel) {
                if (myLabel[i].parentId == parentId) {
                    myLabel[i].wetherChooseAll = false;
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
        //说明当前行未选中
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
        obj.labelIds = formatLabelIds.join(',');
        delete obj.labelId;
        delete obj.parentId;
        delete obj.beforeId;
        serviceRequest(
            BASE_URL + '/microActivity/getActivityList',
            obj,
            function (res) {
                if (obj.type) {
                    self.setState({
                        orgListDataSource: res.results,
                    });
                } else {
                    if (res.data.pageIndex == 0) {
                        self.setState({
                            acitvityList: res.results,
                        });
                    } else if (res.data.pageIndex > 0) {
                        for (let i in res.results) {
                            acitvityList.push(res.results[i])
                        }
                        self.setState({
                            acitvityList,
                        });
                    } else {
                        for (let i in res.results) {
                            acitvityList.push(res.results[i])
                        }
                        self.setState({
                            acitvityList,
                        });
                    }

                    self.setState({
                        acitvityData: res.data,
                        pageIndex: res.data.pageIndex || 0,
                        pageSize: res.data.pageSize || 24,
                        // organId : obj.organId,
                        type: obj.type,
                        currentSelectCampus: obj.organId,
                        defMsg: obj.defMsg,
                        labelIds: new_labelIds,
                        myLabel,
                        wetherScrollBottom: (res.data.pageIndex + 1) >= res.data.pageCount
                    });
                }
                self.setState({
                    loading: false
                })
            },
            function (fai) {
                //请求失败返回上一次选中状态
                for (let i in labelIds) {
                    if (labelIds[i].parentId == parentId) {
                        labelIds[i].labelId = beforeId;
                    }
                }
                self.setState({
                    labelIds,
                    loading: false
                })
                message.error(fai.errorMessage);
            }
        )
    },

    onSearch(e, type) {
        e.preventDefault();
        let labelIds = [];
        let myLabel = this.state.myLabel
        for (let i in this.state.labelIds) {
            labelIds.push(this.state.labelIds[i].labelId);
        }
        const { getFieldValue, resetFields } = this.props.form;
        if (type == 'search') {
            this.getActivityList(0, this.state.currentSelectCampus, getFieldValue('defMsg'), labelIds.join(','), type);
        } else if (type == 'clear') {
            myLabel.map(function (item, index) {
                item.wetherChooseAll = true;
            })
            this.getActivityList(0, window._init_data.firstOrg.key, undefined, undefined, type);
            this.setState({ labelIds: '', myLabel });
            resetFields();
        }
    },

    checkMoreOrPickup(type) {
        switch (type) {
            case 'check': this.setState({ checkOrPickup: 'pickup' }); break;
            case 'pickup': this.setState({ checkOrPickup: 'check' }); break;
        }
    },

    render() {
        let self = this;
        let selectOptions = [];
        let acitityList = [];
        let labelList = [];
        let labelIds = this.state.labelIds;
        if (self.state.orgListDataSource && self.state.orgListDataSource.length > 0) {
            selectOptions = self.state.orgListDataSource.map(function (item, index) {
                return <Option key={"activityOrg_" + index} value={item.id + ''} id={item.id}>{item.name}</Option>
            });
        };
        labelList = this.state.myLabel.map(function (item, index) {
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
                if (!!self.state.myLabel[index].wetherChooseAll && !valueLabel.id && valueLabel.labelName == '全部') {
                    return (
                        <span
                            key={'laberlChild_' + indexLabel}
                            className={styles.labelChild}
                            style={{ color: '#fff', background: '#5D9CEC', borderRadius: '5px' }}
                            onClick={() => self.changeLabels(beforeId, valueLabel.id, parentId)}>
                            {valueLabel.labelName}
                        </span>
                    )
                } else {
                    return (
                        <span
                            key={'laberlChild_' + indexLabel}
                            className={styles.labelChild}
                            style={{ color: !!flag ? '#fff' : '#666', background: !!flag ? '#5D9CEC' : '', borderRadius: !!flag ? '5px' : '' }}
                            onClick={() => self.changeLabels(beforeId, valueLabel.id, parentId, flag)}>
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

        if (self.state.acitvityList && self.state.acitvityList.length > 0) {
            acitityList = self.state.acitvityList.map(function (item, index) {
                let price = item.price;
                let viewNum = parseFloat(parseFloat(item.views) + parseFloat(item.virtualViews));
                let imageurl = 'url(' + item.icon + ')';
                let delay = index * .1;
                return <div style={{ animationDelay: delay + 's' }} key={"microActivity_" + index} className={styles.activity_div} >
                    {
                        index && index == 0 || index < 4
                        ? 	<div className={styles.game_item_rightHot}>
                                <img src="https://img.ishanshan.com/gimg/n/20181008/b98bf7b1365be8676ec3985c0691add8" />
                            </div>
                        :   null
                    }
                    <div className={styles.activity_div_img} style={{ backgroundImage: imageurl, backgroundSize: '100% 100%', backgroundPosition: 'center' }}>
                        {/* <div className={styles.general_use_number}></div>
                        <p className={styles.general_use_number_p_left}>家机构已经创建<span className={styles.general_use_number_p_right}>{viewNum} </span></p> */}
                    </div>
                    <div className={styles.activity_div_botton_div}>
                        <p className={styles.activity_div_title}>{item.title}</p>
                        {/* <p className={styles.activity_div_sub_title}>{item.intro}</p> */}
                        {/* <Button className={styles.gameOractivity_div_select_button} type="primary"
                            onClick={self.openActivityOrCreate.bind(self, item)}>{item.isopen == 1 ? '创建' : '购买'}</Button> */}
                        <div>
                            <span className={styles.activity_div_useNum}><Icon type="eye" theme="outlined" className={styles.activity_icon_usernum} />{viewNum}</span>
                            <Button className={styles.gameOractivity_div_select_button} type="primary"
                                onClick={self.openActivityOrCreate.bind(self, item)}>{item.isopen == 1 ? '创建' : '购买'}
                            </Button>
                        </div>

                        <p className={styles.Oractivity_div_open_status}>{item.isopen == '1' ? '' : "￥" + price}</p>
                    </div>
                    <div className={styles.codeModalActive} >
                        <div className={styles.codeUrlActive} >
                            {item.previewurl == '' || item.previewurl == null || item.previewurl == undefined ?
                                <p style={{ height: '130px', width: '130px', lineHeight: '130px', textAlign: 'center', fontSize: '16px' }}>无二维码</p>
                                :
                                <div>
                                    <QRCode size={130} value={item.previewurl} />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            });
        } else {
            acitityList = <NullData height='200px' content='抱歉 没有符合相应条件的模板' />

        };

        let modalActOpts = {
            title: '新建微活动',
            formVisible: this.state.activityFormVisible,
            changeTempletInstanceFormVisible: this.changeTempletInstanceFormVisible,
            activityTypeId: this.state.activityTypeId,
            activityCode: this.state.activityCode,
            // organId : this.state.organId ,
            changeCodeModalVisible: this.changeCodeModalVisible,
            diliverCode: this.diliverCode,
            currentSelectCampus: this.state.currentSelectCampusName
        }

        let modalLeaOpts = {
            title: '新建微传单',
            formVisible: this.state.leafletFormVisible,
            changeTempletInstanceFormVisible: this.changeTempletInstanceFormVisible,
            activityId: '',
            activityTypeId: this.state.activityTypeId,
            activityCode: this.state.activityCode,
            // organId : this.state.organId ,
            changeCodeModalVisible: this.changeCodeModalVisible,
            diliverCode: this.diliverCode,
            currentSelectCampus: this.state.currentSelectCampusName
        }
        const { getFieldDecorator } = this.props.form;

        return (
            <div className={styles.game_general_base}
                id='zyf_game_general_base'
                onScroll={this.zyfOnSroll}
                style={{ height: '100%' }}>
                <Spin spinning={this.state.loading}>
                    <div className={styles.zyf_micro_activity_search_ontent}>
                        {/*
                            <div className={styles.zyf_micro_activity_search_item}>
                                 <TenantOrgSelect value = { this.state.currentSelectCampus } onSelect = { this.selectChange } />
                            </div>
                            */}
                        <div className={styles.zyf_micro_activity_search_item}>
                            {getFieldDecorator('defMsg')(
                                <Input style={{ width: 220, margin: 0 }} placeholder='模板名称' />
                            )}
                        </div>
                        <div className={styles.zyf_micro_activity_search_button_group}>
                            <Button type='primary' onClick={(e) => this.onSearch(e, 'search')}>搜索</Button>
                            <Button type='ghost' onClick={(e) => this.onSearch(e, 'clear')}>清空</Button>
                        </div>
                    </div>
                    <div className={styles.active_clearance}></div>
                    <div className={styles.activity_label}>
                        <QueueAnim
                            type={['top', 'top']}
                            ease={['easeOutQuart', 'easeInOutQuart']}>
                            {this.state.checkOrPickup == 'check' ? labelList.slice(0, 3) :
                                this.state.checkOrPickup == 'pickup' ? labelList : []
                            }
                        </QueueAnim>
                    </div>
                    <div className={styles.active_main}>
                        {this.state.myLabel.length > 3 ?
                            <div className={styles.zyf_micro_activity_check_or_pickup_more_tag} onClick={() => this.checkMoreOrPickup(this.state.checkOrPickup)}>
                                {this.state.checkOrPickup == 'check' ?
                                    <div>
                                        <div className={styles.zyf_micro_activity_check_or_pickup_more_tag_font}>更多</div>
                                        <Icon type="double-right" className={styles.zyf_micro_activity_check_more_tag} />
                                    </div> :
                                    this.state.checkOrPickup == 'pickup' ?
                                        <div>
                                            <div className={styles.zyf_micro_activity_check_or_pickup_more_tag_font}>收起</div>
                                            <Icon type="double-right" className={styles.zyf_micro_activity_pickup_more_tag} />
                                        </div> : ''
                                }
                            </div>
                            : ''

                        }
                        <div className={styles.general_game_acitity_list} data-name='microActivity'>
                            {acitityList}
                        </div>
                        <div className={styles.active_footer}>
                            {!!this.state.wetherScrollBottom ?
                                <div>
                                    {/*已经加载完啦*/}
                                </div>
                                :
                                <div>
                                    <Icon type="loading" style={{ fontSize: '1.5rem', marginRight: 10 }} />
                                    <span>加载中...</span>
                                </div>
                            }
                        </div>
                    </div>

                    <Modal
                        visible={self.state.ishowOpenActivityModal}
                        title="活动开通"
                        width={600}
                        onCancel={self.activityCancel}
                        footer={[
                            <Button key="back" type="ghost" size="large" onClick={self.activityCancel}>取消</Button>
                        ]}>

                        <div>
                            <p className={styles.game_general_open_create_qr_code_title}>您可以拨打400-660-5733在线升级</p>
                        </div>
                    </Modal>
                    <Modal
                        visible={self.state.ishowCustomModal}
                        title="个性定制"
                        width='600'
                        maskClosable={false}
                        onOk={self.customCodeOk}
                        onCancel={self.customCodeCancel}
                        footer={[
                            <Button key="back" type="ghost" size="large" onClick={self.customCodeCancel}>取消</Button>
                        ]}>

                        <div>
                            <p className={styles.game_general_open_create_qr_code_title}>您可以拨打400-660-5733进行个性化定制。</p>
                        </div>
                    </Modal>
                    <Modal
                        visible={self.state.ishowReviewOrtryModal}
                        closable={false}
                        maskClosable={false}
                        width="335"
                        onCancel={self.tryOrReviewPoQrCodeCancel}
                        footer={[<Button key="save" type="ghost" size="large" onClick={self.tryOrReviewPoQrCodeOk}>关闭</Button>]}>
                        <QRCode size={300} value={self.state.currentInterfaceQr} />
                    </Modal>

                    <MicroActivityTemplate {...modalActOpts} />
                    <MicroLeafletTemplate {...modalLeaOpts} />

                    {this.state.categoryid == '1' ? <CodeModalActivity url={this.state.codeUrl} codeModalVisible={this.state.codeModalVisible}
                        onConfirmCodeModal={this.onConfirmCodeModal} /> : ''}

                    {this.state.categoryid == '2' ? <CodeModalLeaflet url={this.state.codeUrl} codeModalVisible={this.state.codeModalVisible}
                        onConfirmCodeModal={this.onConfirmCodeModal} /> : ''}
                    <MicroModuleForm />
                </Spin>
            </div>

        );
    }
});

function mapStateToProps() {
    return {};
}

const FormMicroActivity = Form.create()(MicroActivity);
export default connect(mapStateToProps)(FormMicroActivity);
