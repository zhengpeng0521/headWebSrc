import React from 'react';
import { Tree, Popconfirm, Spin, Button, Input, Icon, Table, Select, Dropdown, Menu, Switch } from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './WxBanner.less';
const SubMenu = Menu.SubMenu;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;

/*banner轮播图table*/
function WxBannerTable({
    wxBannerTableLoading,                   //表格加载状态
    wxBannerTableContent,                   //表格数据
    wxBannerTableTotal,                     //表格数据总数
    wxBannerTableSelectedRowKeys,           //表格多选选中的数组
    wxBannerTableSelectedRow,               //表格多选中的对象数组
    wxBannerPageSize,                       //表格一页多少数据
    wxBannerPageIndex,                      //表格页码

    WxBannerTableOnChange,                  //表格分页，排序等信息改变事件
    WxBannerShowOrHideSearchBar,            //表格点击筛选
    WxBannerTableSelectedRow,               //批量操作checkbox改变事件
    WxBannerTableEditItem,                  //banner点击编辑
    WxBannerChangeBannerStatus,             //banner批量操作改变状态('显示','隐藏','删除')
    WxBannerAddNewBanner,                   //表格点击新增banner
  }) {

    const columns = [{
        width: 150,
        title: '名称',
        dataIndex: 'title',
        key: 'title',
        render:(text,record) => (
            <a onClick={() => WxBannerTableEditItem(record,'clickName')}>{text}</a>
        )
      }, {
        width: 200,
        title: '图片',
        dataIndex: 'picUrl',
        key: 'picUrl',
        render:(text,record) => (
            <img src={text} width='150px' height='80px'/>
        )
      }, {
        width: 100,
        title: '是否显示',
        dataIndex: 'status',
        key: 'status',
        render:(text,record) => (
            <div>
                {text == '1' ? '已显示' :
                 text == '2' ? '已隐藏' : ''}
            </div>
        )
      }, {
        width: 100,
        title: '排序值',
        dataIndex: 'sort',
        key: 'sort',
      }, {
        width: 150,
        title: '所属校区',
        dataIndex: 'orgName',
        key: 'orgName',
      }, {
        width: 200,
        title: '外链类型与地址',
        dataIndex: 'uri',
        key: 'uri',
        render:(text,record) => (
            <div>
                <div>{
                      (JSON.parse(text)).type == '0' ? '无' :
                      (JSON.parse(text)).type == '1' ? '课程' :
                      (JSON.parse(text)).type == '2' ? '活动' :
                      (JSON.parse(text)).type == '3' ? '自定义' : '无'
                     }
                </div>
                <div>
                    {
                     (JSON.parse(text)).type == '0' ? '无外链' :
                     (JSON.parse(text)).type == '1' ? `http://www.ishanshan.com/wx/h5/weixin/webSite?router=microCourseDetail&tenantId=${record.tenantId}&orgId=${record.orgId}&actId=${record.id}` :
                     (JSON.parse(text)).type == '2' ? `http://www.ishanshan.com/wx/h5/weixin/webSite?router=microActivityDetail&tenantId=${record.tenantId}&orgId=${record.orgId}&actId=${record.id}` :
                     (JSON.parse(text)).type == '3' ? (JSON.parse(text)).uri : '无外链'
                    }
                </div>
            </div>
        )
      }, {
        width: 200,
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      }];

    let rowSelection = {
        selectedRowKeys : wxBannerTableSelectedRowKeys,
        onChange : WxBannerTableSelectedRow,
	};

    let paginationProps = {
        size : 'large',
        total: wxBannerTableTotal,
        current : wxBannerPageIndex+1,
        pageSize : wxBannerPageSize,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal(){
            return '共'+this.total+'条';
        },
        pageSizeOptions : ['20', '50', '100', '200']
    };

    return(
        <div style={{width:'100%',padding:'20px'}}>
            <div className={styles.tableBtn}>
                <span>操作：</span>
                <a style={{marginLeft:'5px'}} onClick={() => WxBannerTableEditItem(wxBannerTableSelectedRow[0],'byCheckBox')}>编辑</a>
                <Popconfirm placement="top" title={<span>确定要设置为<span style={{color:'red'}}>显示</span>状态吗</span>} onConfirm={() => WxBannerChangeBannerStatus('1')}>
                    <a style={{marginLeft:'10px'}}>显示</a>
                </Popconfirm>
                <Popconfirm placement="top" title={<span>确定要设置为<span style={{color:'red'}}>隐藏</span>状态吗</span>} onConfirm={() => WxBannerChangeBannerStatus('2')}>
                    <a style={{marginLeft:'10px'}}>隐藏</a>
                </Popconfirm>
                <Popconfirm placement="top" title={<span>确定要<span style={{color:'red'}}>删除</span>{wxBannerTableSelectedRow.length > 1 ? '这些' : '此'}轮播图吗 : </span>} onConfirm={() => WxBannerChangeBannerStatus('0')}>
                    <a style={{marginLeft:'10px'}}>删除</a>
                </Popconfirm>
                <Button type="primary" onClick={() => WxBannerShowOrHideSearchBar()} style={{float:'right',marginLeft:'10px'}}><Icon type="filter" />筛选</Button>
                <Button type="primary" onClick={() => WxBannerAddNewBanner()} style={{float:'right',marginLeft:'10px'}}><Icon type="plus" />新增轮播图</Button>
            </div>
            <div style={{margin:'20px 0 20px 0'}} className='zj_scrm_wx_banner_table'>
                <Table
                    columns={columns}
                    dataSource={wxBannerTableContent}
                    loading={wxBannerTableLoading}
                    pagination={paginationProps}

                    rowSelection={rowSelection}
                    onChange={WxBannerTableOnChange}
                    bordered
                    rowKey="id"
                    size='middle'
                    scroll={{ x : 1000 }} />
            </div>
        </div>
    );
}

export default WxBannerTable;
