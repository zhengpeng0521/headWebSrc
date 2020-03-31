import React , { PropTypes } from 'react';
import { Table, Button, Select, Icon,Checkbox,Pagination   } from 'antd';
import CommonSelector from "./commonSelector";
import styles from './tables.less';

const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
let style = { //样式
    fontSize: "16px",
    color:"#666666",
}
export default class TableSelect extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            userDataColumns:[], //保存数组初始状态
            currentColums:[], //当前显示数据数组
            selectedKeyArr:[], //选中展示的表头
            filterCons:[], //所有表头
        }
        this.pageChange = this.pageChange.bind(this);
        this.onSelectKeys = this.onSelectKeys.bind(this);
        this.query = this.query.bind(this);
    }
    pageChange(current) {
        let {handleQueryUserdata} = this.props
		handleQueryUserdata && handleQueryUserdata({ pageIndex: current - 1 });
    }
    onSelectKeys(selectedKeyArr){
        let {getHeaderVal} = this.props
        let tempArr = [];
        let {currentColums,userDataColumns} = this.state
        userDataColumns && userDataColumns.map((item)=>{
            selectedKeyArr.map((inItem)=>{
                if(inItem == item.dataIndex ){
                    tempArr.push(item);
                }
            })
        })
        tempArr.push({
            key: 'actionBtn',
            dataIndex: 'actionBtn',
            width:80,
            className:"minCol",
            fixed: 'right',
            filterDropdown: (
                    <div className={styles.custom_filter_dropdown}>
                         <CheckboxGroup 
                            options={this.state.filterCons} 
                            defaultValue={selectedKeyArr} 
                            onChange={this.onSelectKeys}
                        />
                    </div>
            ),
            filterIcon: <Icon type="menu-xtsz" style={style}/>,
        })
        this.setState({
            selectedKeyArr,
            currentColums:tempArr,
        })
        getHeaderVal(selectedKeyArr)
    }
    componentDidMount(){
        this.query();
    }
    componentWillReceiveProps(nextProps){
        let { currentColums } = this.state;
        let {
            userDataColumns,getHeaderVal
        } = nextProps
        let renderOrNot = false; //当前组建状态改变标志 => 是否重新渲染界面
        currentColums.map((item1)=>{
            renderOrNot = currentColums.some((item2)=>{
                return item1.dataIndex == item2.dataIndex
            })
        })
        if(renderOrNot){
            return
        }
        let filterCons = [];
        let defaultKeys = [];
        let tempArr = userDataColumns.concat();
        userDataColumns && userDataColumns.length>0 && userDataColumns.map((item)=>{
            filterCons.push(
                {value:item.dataIndex,label:item.title}
            )
            defaultKeys.push(
                item.dataIndex
            )
        })
        
        tempArr.push({
            key: 'actionBtn',
            dataIndex: 'actionBtn',
            className:"fixedCol",
            width:80,
            fixed: 'right',
            filterDropdown: (
                    <div className={styles.custom_filter_dropdown}>
                         <CheckboxGroup 
                            options={filterCons} 
                            defaultValue={defaultKeys} 
                            onChange={this.onSelectKeys}
                        />
                    </div>
            ),
            filterIcon: <Icon type="menu-xtsz" style={style}/>,
        })
        getHeaderVal(defaultKeys)
        this.setState({
            currentColums:tempArr,
            userDataColumns,
            filterCons,
            selectedKeyArr:defaultKeys,
        })
    }
         //校区选择 暂未独立出此组建
        query() {
            let me = this;
            //获取缓存的校区列表
            let orgPermissionList = window._init_data && window._init_data.orgPermissionList;

            if (orgPermissionList && orgPermissionList.length > 0) {
                if (!this.props.headOrg) {
                    let org_list = this.filterMainOrg(orgPermissionList);
                    me.updateAllOrgList(org_list);
                } else {
                    me.updateAllOrgList(orgPermissionList);
                }
            } else {

                let queryPropsConfig = this.props.queryConfig || {};

                let quertConfig = {
                    service: queryPropsConfig.service || '/thinknode/game/' + window._init_data.gameCode + '/pApi',
                    data: queryPropsConfig.data || {
                        service: '/game/pApi/score/queryOrgInfo',
                        data: {
                            tenantId: window._init_data.tenantId,
                            orgId: window._init_data.orgId,
                            gameId: window._init_data.gameId,
                        }
                    }
                };

                serviceRequest(quertConfig.service, quertConfig.data,
                    function (ret) {
                        if (ret.errorCode === 9000) {
                            let all_org_list = ret.results;
                            //更新缓存机构
                            window._init_data.orgPermissionList = all_org_list;
                            if (!me.props.headOrg) {
                                me.updateAllOrgList(me.filterMainOrg(all_org_list));
                            } else {
                                me.updateAllOrgList(all_org_list);
                            }
                        }

                    }
                );
            }
        }

        //树形结构的机构列表转化为平级结构更新状态机
        updateAllOrgList(treeOrgList) {
            let all_org_list = [];

            treeOrgList && treeOrgList.map(function (item, index) {
                if (item && item.children && item.children.length > 0) {
                    all_org_list = [...all_org_list, ...item.children];
                }
            });

            this.setState({
                all_org_list
            });
        }

        //过滤总部机构
        filterMainOrg(all_org_list) {
            let new_org_list = [];
            if (all_org_list && all_org_list.length > 0) {
                for (let i = 0; i < all_org_list.length; i++) {
                    let city_item = {};
                    Object.assign(city_item, all_org_list[i]);
                    let city_org_list = city_item.children;

                    let new_city_org_list = [];
                    if (city_org_list && city_org_list.length > 0) {
                        for (let j = 0; j < city_org_list.length; j++) {
                            let org_item = city_org_list[j];
                            if (org_item.pid != '0') {
                                new_city_org_list.push(org_item);
                            }
                        }
                    }

                    if (new_city_org_list.length > 0) {
                        city_item.children = new_city_org_list;
                        new_org_list.push(city_item);
                    }
                }
            }
            return new_org_list;
        }
    render(){
        let {
            userData, //展示数据
            pageSize, 
            pageIndex, 
            dataTotal, //数据总数
            queryConfig, //
            handleQueryUserdata, //查寻用户数据
            handleUserdataExport,  //导出用户数据
        } = this.props
        let {currentColums} = this.state
        
            /**
	 * 自定义添加元素
	 */
        let selectorProps = {
            isShowCampus: false, //单校区
            onSearch: function (vue) {
                let params = {
                    ...vue,
                }
                handleQueryUserdata(params)
            },
            subComponents : [
                { 
                    placeholder:'请选择校区',
                    value:this.state.all_org_list || [],  //默认值
                    type:"select",  //需要渲染的状态 目前只有select
                    stateKey:"orgs",  //组件中要渲染的key值,传递到后台的条件要与条件的字面量值一样
                    style:{                 //样式
                        marginLeft:"10px",
                        marginRight:"10px",
                        width:150
                    }
                },
                { 
                    placeholder:'请选择支付状态',
                    value:['未支付', '已支付', '已退款'],  
                    type:"select",  
                    stateKey:"payStatus",  
                    style:{                
                        marginRight:"10px",
                        width:150
                    }
                },
                {
                    placeholder:'请填写学员姓名',
                    value:"", 
                    type:"input", 
                    stateKey:"babyName",  
                    style:{
                        marginRight:"10px",
                        width:150
                    }
                },
            ],
            export:handleUserdataExport,
        }
        
        let pagination = {
            total : dataTotal || 0,
            current: pageIndex+1,
            pageSize,
            showSizeChanger : false,
            showQuickJumper :true,
            onChange : this.pageChange,
            showTotal(){
                return '总共' + dataTotal + '条数据';
            }
        };
        
        return(
            <div className={styles.user_dataview_cont}>
                <CommonSelector {...selectorProps}/>
                <div className={styles.view_list_table_cont}>
                     <Table 
                        rowKey='sortNo' 
                        className={styles.dataview_table_list}
                        dataSource={userData} 
                        columns={currentColums}
                        pagination = { false }
                        scroll={{y:"calc(100vh - 319px)"}}
                     />
                </div>
                <div className={styles.pagination}>
                    <Pagination {...pagination} />
                </div>
            </div>
        )
    }
}
