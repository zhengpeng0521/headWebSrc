import React from 'react';
import { message , Pagination,Popover } from 'antd';
import { connect } from 'dva';
//import AccountCardComponent from '../../../components/system/account-card/AccountCardComponent';
import Filelog from '../../../components/common/new-component/manager-list/ManagerList';
import SuperSearch from "../../../components/common/new-component/super-search/SuperSearch";
import styles from './FileLog.less';

function Filelogs({dispatch, filelogModel}) {

	let {
		newColumns,
        pageIndex,
        pageSize,
        total,
        loading,
        dataSource,         //
        opDateOrder, // 时间排序
        busTypeOerder, //业务类型排序
        superSearchVisible, // 高级搜索显示
        searchValues,  //搜索的内容 
        superSearchValues, //高级搜索内容
    } = filelogModel;

	/*表格显示项*/
	function changeColumns( newColumns ){
		dispatch({ 
			type : 'filelogModel/updateState',
			payload : {
                newColumns,
			}
		})
	}
    /*页码变更时触发事件*/
    function pageOnChange(pageIndex,pageSize) { 
        dispatch({
            type: 'filelogModel/GetTableList',
            payload: {
                pageIndex: pageIndex - 1,
                pageSize,
                searchValues,
                superSearchValues,
                opDateOrder : 1
            }
        });
    }
    // 排序
    function sorterChange(pagination, filters, sorter) {
        if(!!sorter.field && sorter.field == 'opDate'){
            let opDateOrder = sorter.order == 'descend' ? '1' : sorter.order == 'ascend' ? '2' : undefined;
            dispatch({
                type: 'filelogModel/GetTableList',
                payload: {
                    pageIndex: pageIndex,
                    pageSize,
                    opDateOrder,
                    searchValues,
                    superSearchValues
                }
            });
        } 
    }
    //搜索
    function onSearch(values){
        if(values.opDate && values.opDate.length > 0){
            values.startOpDate = values.opDate[0].valueOf()
            values.endOpDate = values.opDate[1].valueOf()
          }
        //   console.info('------', values, 
        //     values.opDate[0].format('YYYY-MM-DD HH:mm:ss'), 
        //     values.opDate[0].valueOf(),
        //     values.opDate[1].format('YYYY-MM-DD HH:mm:ss'),
        //     values.opDate[1].valueOf())
          // delete values.createTime
          delete values.opDate
          dispatch({
            type: 'filelogModel/GetTableList',
            payload: {
                pageIndex: 0,
                pageSize,
                searchValues:values,
                superSearchValues,
                opDateOrder : 1
            }
        });
    }
    // table点击高级搜索事件和高级搜索点击右上角的X
    function onSuperSearch(){
        dispatch({
            type: 'filelogModel/updateState',
            payload: {
                superSearchVisible: !superSearchVisible
            }
        });
    }
    //高级搜索
    function superSearchClick(values){
        dispatch({
            type: 'filelogModel/GetTableList',
            payload: {
                pageIndex: 0,
                pageSize,
                searchValues,
                opDateOrder : 1,
                superSearchValues:values

            }
        });
    }
    //时间格式
    Object.assign(Date.prototype, {
        pattern: function(fmt) {
          const o = {
            'M+': this.getMonth() + 1, // 月份
            'd+': this.getDate(), // 日
            'h+': this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, // 小时
            'H+': this.getHours(), // 小时
            'm+': this.getMinutes(), // 分
            's+': this.getSeconds(), // 秒
            'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
            'S': this.getMilliseconds() // 毫秒
          }
          const week = {
            '0': '/u65e5',
            '1': '/u4e00',
            '2': '/u4e8c',
            '3': '/u4e09',
            '4': '/u56db',
            '5': '/u4e94',
            '6': '/u516d'
          }
          if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
          }
          if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[this.getDay() + ''])
          }
          for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
          }
          return fmt
        }
      })

      // 表格
	let accountCardComponentProps = {
		search : {
            isShowSearch: false,
            onSearch: data => onSearch(data),
            onClear: data => onSearch(data),
            fields: [
                {
                    key: "opDate",
                    type: "rangePicker",
                    width: 300,
                    startPlaceholder: "请选择操作开始时间",
                    endPlaceholder: "请选择操作结束时间",
                    format: "YYYY-MM-DD hh:mm"
                },{
                    key:"busType",
                    type:"select",
                    placeholder:"请选择操作类型",
                    options:[{
                        key:"001",
                        label:"员工账号"
                    }
                    // {
                    //     key:"002",
                    //     label:"合同" 
                    // },{
                    //     key:"003",
                    //     label:"收款单"
                    // },{
                    //     key:"004",
                    //     label:"退款单"
                    // },{
                    //     key:"005",
                    //     label:"会员账户"
                    // }
                ]
                },{
                    key:"content",
                    type:"input",
                    placeholder:"请输入操作详情"
                }
            ]

        },
        rightBars : {
            isSuperSearch : true,
            superSearchVisible,
            superSearch: onSuperSearch,
            closeSearch: onSuperSearch,
        },
        table : {
            height        : 332,
            NullDataHeight : document.body.clientHeight - 370,
            ProgressBarHeight : document.body.clientHeight - 370,
            loading       : loading,
            dataSource    : dataSource,
			newColumns    : newColumns,
            changeColumns : changeColumns,
            onChange : sorterChange,
            columns : [
				{
					key : 'opDate',
					title : '操作日期',
                    dataIndex : 'opDate',
                    // sorter: true,
					sortOrder: opDateOrder == '1' ? 'descend' : opDateOrder == '2' ? 'ascend' : false,
					render: function(text, record) {
						return(
                            <Popover placement = 'top' content = { new Date(text).pattern('yyyy-MM-dd hh:mm') } trigger = 'hover' >
							    <div>{new Date(text).pattern('yyyy-MM-dd hh:mm')}</div>
                            </Popover>
						)
                    },
				},
                {
                    key       : 'userName',
                    title     : '操作人',
                    dataIndex : 'userName',
                    
                    render    : ( text, record ) => {                     
                        return(
                            <Popover placement = 'top' content = {text} trigger = 'hover' >
							    <div>{text}</div>
                            </Popover>
						)
                        }
                   
                },{
                    key       : 'mobile',
                    title     : '操作人账号',
                    dataIndex : 'mobile',
                    
                    render    : ( text, record ) => {                     
                        return(
                            <Popover placement = 'top' content = {text} trigger = 'hover' >
							    <div>{text}</div>
                            </Popover>
						)
                        }
                },{
                    key       : 'busType',
                    title     : '业务类型',
                    dataIndex : 'busType',
                    render    : ( text, record ) => {                     
                        return(
                            <Popover placement = 'top' content = {text == '001' ? '员工账号' : text == '002' ? '合同' : text == '003' ? '收款单' : text == '004' ? '退款单' : text == '005' ? '会员账号' : '--'} trigger = 'hover' >
							    <div>{text == '001' ? '员工账号' : text == '002' ? '合同' : text == '003' ? '收款单' : text == '004' ? '退款单' : text == '005' ? '会员账号' : '--'}</div>
                            </Popover>
						)
                        }
                },{
                    
                        key       : 'content',
                        title     : '操作详情',
                        dataIndex : 'content',
                        width:600,
                        render    : ( text, record ) => {                     
                            return(
                                <Popover placement = 'top' content = {text} trigger = 'hover' >
                                    <div>{text}</div>
                                </Popover>
                            )
                            }
                    }
                
            ],
         },
	}
          //高级搜索
          let superProps = {
            searchVisible: superSearchVisible,
            closeSearch: onSuperSearch,
            onSearch: data => superSearchClick(data),
            onClear: data => superSearchClick(data),
            fields:[
                {
                    key:"userName",
                    type:"input",
                    label: "操作人",
                    placeholder: "请输入操作人",
                },{
                    key:"mobile",
                    type:"input",
                    label: "操作人账号",
                    placeholder: "请输入操作人账号",
                }
            ]
          }
	return (
		<div className = { styles.all }>
			<Filelog { ...accountCardComponentProps } />
            <SuperSearch {...superProps}/>
            <span className = {styles.height}></span>
            <div className = { styles.pagination }>
                <Pagination
                    showSizeChanger
                    showQuickJumper
                    total = { total }
                    current = { !isNaN(pageIndex) ? pageIndex + 1 : 1 }
                    pageSize = { pageSize }
                    showTotal = {(total) => `共 ${total} 条`}
                    onChange = { pageOnChange }
                    onShowSizeChange = { pageOnChange }
					pageSizeOptions = {['20', '50', '100', '200']}
                />
            </div>
            <span className = {styles.heights}></span>
		</div>
    );
}

function mapStateToProps({ filelogModel }) {
  	return { filelogModel };
}

export default connect(mapStateToProps)(Filelogs);
