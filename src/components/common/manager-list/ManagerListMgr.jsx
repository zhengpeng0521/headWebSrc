/*
 * 公共的管理列表界面渲染组件
 * 用于渲染，数据由外部调用的model提供
 * @author yujq
 *
 * search:                              检索栏相关配置
 *      searchAble          boolean     是否可以检索       默认值:false
 *      filterBtnIcon       string      筛选按钮的图标     默认值:'filter'
 *      filterBtnText       string      刷选按钮的文字     默认值: '筛选'
 *      showSearch          boolean     检索栏是否显示     默认值: false
 *      searchBtnText       string      检索按钮文字       默认值: '搜索'
 * 		onFilterClick		Function    筛选事件		

 *      clearBtnText        string      清除按钮文字       默认值: '清除条件'
 *      onSearch            function    点击检索时事件     必填
 *      onClear             function    点击检索时事件     必填
 *      wetherClear         boolean     是否清空表单(相同页面路由切换时)
 *      onSearchOrgId       function    校区回调
 *      fields:             array       检索栏字段
 *              key         string      后台传数据时的key
 *              type        string      显示类型            text/select/date/dateRange/orgSelect/rangePicker
 *              label       string      显示的文本
 *              placeholder string      提醒的文本
 *              initValue   string      初始值
 *              width       string      显示的宽度        默认值: '120px'
 *              options     array       下拉框的内容 type=select时有效  [{key,label}]
 *              opt_key     string       下拉框 选项的key  默认 key
 *              opt_label   string       下拉框 选项的label字段  默认 label

 ************** 如果type值为orgSelect, options 为 object, 参数为TenantOrgFilter 组件所需的参数
 ************** 如果type值为rangePicker,需要用到的参数写在options 为object
 *
 * table:                               表格列表相关配置
 *      loading             boolean     列表是否在加载中    默认值: false
 *      rowKey              string     表格行 key 的取值，可以是字符串或一个函数 string|Function(record):string	'key'
 *      columns             array       列展示规则
 *      dataSource          array       列表数据
 *      emptyText           string      列表为空时显示文字  默认值: '暂时没有数据'
 *      rowSelection        object      行选择配置项
 *              type        string      选择类型  多选/单选    checkbox or radio
 *              selectedRowKeys array   选中的行
 *              onChange    function    行选择变化时
 *              onSelectAll function    选择全部行时
 *      pagination          object      分页参数
 *              total       number      数据总条数
 *              pageIndex   number      当前页码(从0开始)
 *              pageSize    number      每页显示条数
 *              showTotal   function    用于显示数据总量和当前数据顺序 Function(total, range) 可选
 *              showSizeChanger   boolean    是否可以改变 pageSize
 *              pageSizeOptions   array    指定每页可以显示多少条      ['10', '20', '30', '40'] 可选
 *              onShowSizeChange  function    pageSize 变化的回调      Function(current, size)
 *              showQuickJumper   boolean    是否可以快速跳转至某页
 * leftBars: 左侧操作按钮
 *      label               string      按钮区标题
 *      btns:               array        按钮配置
 *          type            string      按钮显示类型 text/btn
 *          label           string      按钮显示文字
 *          icon            string      按钮显示图标
 * 			disabled		bool		是否不可点击
 *          handle          function    按钮触发事件
 *          confirm         boolean     是否需要确认
 *      subordinate         boolean     是否需要按下属过滤   默认false
 *      subordinateChange   function     下属变更时事件
 * rightBars: 左侧操作按钮
 *      isShowUpload        bool        引入导入学员
 *      label               string      按钮区标题
 *      btns:               array        按钮配置
 *          type            string      按钮显示类型 text/btn
 *          label           string      按钮显示文字
 *          icon            string      按钮显示图标
 * 			disabled		bool		是否不可点击
 *          handle          function    按钮触发事件
 *          confirm         boolean     是否需要确认
 * statusTab:   状态切换检索栏
 *      tabs                array       用于显示状态的tab
 *              key         string
 *              label       string
 *      active              string      当前选择的状态
 *      onTabChange         function    点击切换状态时触发事件
 *
 *
 * cssEditor: 控制css属性
 *		clearPadding  		bool 		清除内边距	默认false
 *
 */

import React from 'react';
import ManagerListSearch from './ManagerListSearch';
import ManagerListTable from './ManagerListTable';
import {Radio,Button,Popconfirm,} from 'antd';
import SubordinateFilter from '../../../pages/common/subordinate-filter/SubordinateFilter';
import styles from './ManagerListMgr.less';
import UploadStudent from '../../../pages/common/uploadStudent/UploadStudentPage';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

function ManagerListMgr ({
    search,
    table,
    leftBars,
    rightBars,
    statusTab,
	cssEditor,
}) {
    if(search == undefined) {
        search = {
            searchAble: false,
        };
    }

    if(table) {
        table.rowKey = table.rowKey || 'key';
    }

    let {
        tabs,
        active,
        onTabChange,
    } = statusTab||{};


    let renderHandleBtn = (btnItem, btnIndex) => {
        let {type,label,icon,handle, disabled, confirm} = btnItem;
        if(type == 'text') {
            if(confirm) {
                return (
                    <div key={'handle_btn_item_' + btnIndex} className={styles.handle_btn_item}>
                       <Popconfirm placement="top" title={'确定要' + label + '吗?'} onConfirm={handle} okText="确定" cancelText="取消">
                            <a className={styles.handle_text_btn} disabled={disabled} href="javascript:void(0);">{label}</a>
                       </Popconfirm>
                    </div>
                );
            } else {
                return (
                    <div key={'handle_btn_item_' + btnIndex} className={styles.handle_btn_item}>
                        <a className={styles.handle_text_btn} disabled={disabled} onClick={handle} href="javascript:void(0);">{label}</a>
                    </div>
                );
            }
        } else if(type == 'btn') {
            if(confirm) {
                return (
                    <div key={'handle_btn_item_' + btnIndex} className={styles.handle_btn_item}>
                       <Popconfirm placement="top" title={'确定要' + label + '吗?'} onConfirm={handle} okText="确定" cancelText="取消">
                            <Button type="primary" icon={icon} disabled={disabled} onClick={handle}>{label}</Button>
                        </Popconfirm>
                    </div>
                );
            } else {
                return (
                    <div key={'handle_btn_item_' + btnIndex} className={styles.handle_btn_item}>
                        <Button type="primary" icon={icon} disabled={disabled} onClick={handle}>{label}</Button>
                    </div>
                );
            }
        }
    };

    return (
        <div className={cssEditor&&cssEditor.clearPadding ? styles.common_manager_list_cont_css : styles.common_manager_list_cont} >
            {!!search.searchAble && <ManagerListSearch {...search}/>}
            {!!(leftBars || rightBars || statusTab) &&
             <div className={styles.bar_cont}>
                 {!!(statusTab && leftBars) &&
                  <div className="common_manager_list_status_tab_cont">
                      <RadioGroup value={active} onChange={onTabChange}>
                          {tabs && tabs.map(function(item) {
                              return (<RadioButton key={item.key} value={item.key}>{item.label}</RadioButton>);
                          })}
                      </RadioGroup>
                  </div>
                 }
                 {!!(leftBars || rightBars) &&
                 <div className={styles.handle_bar_cont}>
                     {!!leftBars &&
                        <div className={styles.left_handle_bars}>
                            {!!leftBars.label && <div className={styles.handle_bar_label}>{leftBars.label}</div>}
                            {leftBars.btns && leftBars.btns.map(function(leftBtnItem, leftBtnIndex) {
                                return renderHandleBtn(leftBtnItem, leftBtnIndex);
                            })}

                            {!!leftBars.subordinate &&
                                <SubordinateFilter onChange={leftBars.subordinateChange} />
                            }
                        </div>
                     }

                     {!!(statusTab && !leftBars) &&
                      <div className="common_manager_list_status_tab_cont" style={{float: 'left'}}>
                          <RadioGroup value={active} onChange={onTabChange}>
                              {tabs && tabs.map(function(item) {
                                  return (<RadioButton key={item.key} value={item.key}>{item.label}</RadioButton>);
                              })}
                          </RadioGroup>
                      </div>
                     }

                    {!!rightBars &&
                        <div className={styles.right_handle_bars}>
                            {
                                !!rightBars.isShowUpload && <UploadStudent />
                            }
                            {!!rightBars.label && <div className={styles.handle_bar_label}>{rightBars.label}</div>}
                            {rightBars.btns && rightBars.btns.map(function(rightBtnItem, rightBtnIndex) {
                                return renderHandleBtn(rightBtnItem, rightBtnIndex);
                            })}
                            {!!search.searchAble &&
                            <div key={'handle_btn_item_filter'} className={styles.handle_btn_item}>
                                <Button type="primary" onClick={search.onFilterClick}>{search.filterBtnText || '筛选'}</Button>
                            </div>
                            }
                        </div>
                     }
                 </div>
                 }
             </div>
            }

           <ManagerListTable {...table} />
        </div>
    );
}

export default ManagerListMgr;
