import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover } from 'antd';
import ParentManageComponent from '../../../components/common/new-component/manager-list/ManagerList';
import SuperSearch from '../../../components/common/new-component/super-search/SuperSearch';
import style from './ParentManagePage.less';


function ParentManagePage({ dispatch, parentManageModel }){
    let {
        /*快捷搜索*/
        fastSearchContent,                          //快捷搜索栏搜索内容

        /*高级搜索*/
        superSearchVisible,                         //高级搜索是否显示
        superSearchContent,                         //高级搜索栏搜索内容

        /*table*/
        tableNewColumns,                            //选择列表是否显示字段是哪些
        tableLoading,                               //列表是否加载状态
        tableDataSource,                            //table列表数据

        /*pagination*/
        tableDataTotal,                             //数据总共数目
        tablePageIndex,                             //页码
        tablePageSize,                              //每页条数

    } = parentManageModel;

    //常用搜索
    function SearchBarOnSearch(data){
        if(!!data && !!data.dept_org){
            data.tenantIds = data.dept_org.substr(0,data.dept_org.indexOf('-'));
            data.orgIds = data.dept_org.substr(data.dept_org.indexOf('-') + 1);
            data.orgId = data.dept_org.substr(data.dept_org.indexOf('-') + 1);
            delete data.dept_org;
        }
        dispatch({
            type:'parentManageModel/GetTableList',
            payload:{
                pageIndex : 0,
                pageSize : tablePageSize,
                fastSearchContent : data,
                superSearchContent
            }
        });
    };

    //table点击高级搜索事件和高级搜索点击右上角的X
    function SuperSearchOnSearch(){
        dispatch({
            type:'parentManageModel/updateState',
            payload:{
                superSearchVisible : !superSearchVisible
            }
        });
    }

	//高级搜索点击搜索
    function SuperSearchClick(data){
        dispatch({
            type:'parentManageModel/GetTableList',
            payload:{
                pageIndex : 0,
                pageSize : tablePageSize,
                fastSearchContent,
                superSearchContent : data
            }
        });
    }

    //分页改变事件
    function TablePageOnChange(pageIndex,pageSize){
        dispatch({
            type:'parentManageModel/GetTableList',
            payload:{
                pageIndex : pageIndex - 1,
                pageSize : pageSize,
                fastSearchContent,
                superSearchContent
            }
        });
    }

	/*改变表格显示项*/
	function TableChangeColumns(tableNewColumns){
		dispatch({
			type : 'parentManageModel/updateState',
			payload : {
				tableNewColumns
			}
		})
	}

	let SuperSearchProps = {
		searchVisible : superSearchVisible,
		closeSearch : SuperSearchOnSearch,
		onSearch : SuperSearchClick,
		onClear : SuperSearchClick,
		fields : [{
            key         : 'bandStatus',
            type        : 'select',
            label       : '绑定微信',
            placeholder : '是否绑定微信',
            options     : [{ key : '0', label : '未绑定' } , { key : '1', label : '已绑定' }]
        }]
	}

    let ParentManageComponentProps = {
        search : {
            onSearch      : SearchBarOnSearch,
            onClear       : SearchBarOnSearch,
            fields : [
                { key : 'dept_org' , type : 'dept_org' },
                { key : 'name' , type : 'input' , placeholder : '家长姓名' },
                { key : 'mobile' , type : 'input' , placeholder : '家长手机号' }
            ],
        },
        rightBars : {
            isSuperSearch : true,
            superSearchVisible : superSearchVisible,
            superSearch : SuperSearchOnSearch,
            closeSearch : SuperSearchOnSearch
        },
        table : {
            newColumns : tableNewColumns,
            changeColumns : TableChangeColumns,
            loading : tableLoading,
            dataSource : tableDataSource,
			xScroll : 1100,
            columns : [
                {
                    dataIndex : 'name',
                    key       : 'name',
                    title     : '家长姓名',
                    width     : 120,
                    render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
                        	{ text }
						</Popover>
                    )
                },{
                    dataIndex : 'mobile',
                    key       : 'mobile',
                    title     : '联系手机',
                    width     : 120,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'click' >
							<div>
								<a>查看</a>
								<div style = {{ color : '#4CA54C' }}>{ !!record.openId && '已验证' }</div>
							</div>
						</Popover>
					)
                },{
                    dataIndex : 'bandStatus',
                    key       : 'bandStatus',
                    title     : '绑定微信',
                    width     : 120,
                    render    : ( text, record ) => (
                        <div>
							{ record.bandStatus == '1' && <Icon type = "guanzhuweixin" className = { record.bandStatus == '1' ? style.yiguanzhu : style.noguanzhu } /> }
                        </div>
                    )
                },{
                    dataIndex : 'qqNumber',
                    key       : 'qqNumber',
                    title     : 'qq',
                    width     : 120,
                },{
                    dataIndex : 'trade',
                    key       : 'trade',
                    title     : '所属行业',
                    width     : 120,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
                },{
                    dataIndex : 'workUnit',
                    key       : 'workUnit',
                    title     : '工作单位',
                    width     : 120,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
                },{
                    dataIndex : 'email',
                    key       : 'email',
                    title     : '邮箱',
                    width     : 120,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
                },{
                    dataIndex : 'tel',
                    key       : 'tel',
                    title     : '固定电话',
                    width     : 120,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '--'}
						</Popover>
					)
                },{
                    dataIndex : 'orgName',
                    key       : 'orgName',
                    title     : '所属校区',
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
                }
            ],
         },
		pagination : {
			total : tableDataTotal,
            pageIndex : tablePageIndex,
            pageSize : tablePageSize,
            onChange : TablePageOnChange,
            onShowSizeChange : TablePageOnChange,
            showSizeChanger : true,
            showQuickJumper : true,
            showTotal : () => (`共${tableDataTotal}条`),

		}
    };

    return (
        <div style = {{ overflow : 'hidden', height : '100%' }}>
            <ParentManageComponent { ...ParentManageComponentProps } />
			<SuperSearch { ...SuperSearchProps } />
        </div>
    )
};

function mapStateToProps ({ parentManageModel }){
	return { parentManageModel };
};

export default connect( mapStateToProps )( ParentManagePage );
