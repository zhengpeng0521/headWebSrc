import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import HomeSchoolCommentTable from '../../../components/cerp/home-school-comment/table/HomeSchoolCommentTable';
import DetailModal from '../../../components/cerp/home-school-comment/detail/DetailModal';

function HomeSchoolComment({dispatch, homeSchoolComment}) {

	let {

        orgId,                              //cerp选中的校区
        /*table*/
        newColumns,                         //列表控制显示行数组
        tablePageIndex,                     //列表页码
        tablePageSize,                      //列表每页条数
        tableDataSource,                    //列表数据
        tableDataTotal,                     //列表数据条数
        tableLoading,                       //列表加载状态

        /*快捷搜索*/
        courseMsg,                          //课程下拉列表内容
        teacherMsg,                         //主教下拉列表内容
        fastSearchContent,                  //快捷搜索内容

        /*详情modal*/
        detailModalVisible,                 //详情modal是否显示
        detailModalKey,                     //详情modalkey
        detailModalMsg,                     //详情需要渲染的数据(列表中当前项的数据，详情头部和上课内容tab页的数据从此取，老师评价和家长评价数据从接口中取)

        /*老师评价tab页*/
        teacherCommentLoading,              //老师评价tab页是否是加载状态
        teacherCommentMsg,                  //老师评价列表数据

        /*老师评价编辑modal*/
        teacherCommentEditModalVisible,     //老师评价编辑modal是否显示
        teacherCommentEditModalLoading,     //老师评价编辑modal加载状态
        teacherCommentEditModalData,        //老师评价编辑modal回填数据

        /*家长评价tab页*/
        parentCommentLoading,               //家长评价tab页是否是加载状态
        parentCommentMsg,                   //家长评价列表数据

        /*上课内容tab页*/
        courseContentMsg,                   //上课内容渲染数据

        /*上课内容编辑modal*/
        courseContentEditModalVisible,      //上課內容编辑modal是否显示
        courseContentEditModalLoading,      //上課內容编辑modal加载状态
        courseContentEditModalData,         //上課內容编辑modal回填数据

    } = homeSchoolComment;

    function dp(path,obj){
        dispatch({
            type : path,
            payload : obj
        })
    }

    //改变表格显示项
	function ChangeColumns(newColumns){
        dp('homeSchoolComment/updateState',{ newColumns })
	}

    function Search(data){
        dp('homeSchoolComment/GetTableList',{
            pageIndex : 0,
            pageSize : tablePageSize,
            fastSearchContent : data
        })
    }

    function PageOnChange(pageIndex,pageSize){
        dp('homeSchoolComment/GetTableList',{
            pageIndex : pageIndex - 1,
            pageSize,
            fastSearchContent
        })
    }

    //打开详情modal(其中详情头部数据和上课内容从列表项中取)
    function OpenDetailModal(data){
        dp('homeSchoolComment/updateState',{
            detailModalVisible : true,
            detailModalMsg : data,
            courseContentMsg : data         //上课内容数据(虽然与上述参数内容一样，但是为了区分功能加入此参数)
        });
        //获取详情老师评价和家长评价列表数据
        dp('homeSchoolComment/GetDetail',{
            orgId : data.orgId,
            cpmId : data.cpmId,
            cpdId : data.cpdId
        })
    }

    //关闭详情modal
    function CloseDetailModal(){
        dp('homeSchoolComment/updateState',{
            detailModalVisible : false,
            detailModalMsg : {},            //清除详情头部数据
            courseContentMsg : {}           //清除上课内容数据
        })
    }

    //详情modal内tab页onChange事件
    function ModalTabChange(detailModalKey){
        dp('homeSchoolComment/updateState',{ detailModalKey })
    }

    //打开老师评价编辑modal
    function OpenCommentEditModal(item){
        dp('homeSchoolComment/updateState',{
            teacherCommentEditModalVisible : true,
            teacherCommentEditModalData : item
        })
    }

    //老师评价编辑modal关闭
    function CloseCommentEditModal(){
        dp('homeSchoolComment/updateState',{
            teacherCommentEditModalVisible : false,
            teacherCommentEditModalLoading : false,
            teacherCommentEditModalData : {}
        })
    }

    //老师评价编辑modal提交
    function SubmitCommentEditModal(data){
        dp('homeSchoolComment/SubmitCommentEditModal',data)
    }

    //上课内容编辑modal打开(数据从最外层列表中获取，直接开启modal)
    function OpenContentEditModal(){
        dp('homeSchoolComment/updateState',{
            courseContentEditModalVisible : true,
            courseContentEditModalData : courseContentMsg
        })
    }

    //上课内容编辑modal关闭
    function CloseContentEditModal(){
        dp('homeSchoolComment/updateState',{
            courseContentEditModalVisible : false,
            courseContentEditModalLoading : false,
            courseContentEditModalData : {}
        })
    }

    //上课内容编辑modal提交
    function SubmitContentEditModal(data){
        dp('homeSchoolComment/SubmitContentEditModal',data)
    }

    //详情modal属性
    let DetailModalProps = {
        detailModalVisible,                     //详情modal是否显示
        detailModalKey,                         //详情modalkey
        detailModalMsg,                         //详情需要渲染的数据(列表中当前项的数据，详情头部和上课内容tab页的数据从此取，老师评价和家长评价数据从接口中取)

        ModalTabChange,                         //详情modal内tab页onChange事件
        CloseDetailModal,                       //关闭详情modal

        /*老師评价tab页*/
        teacherCommentLoading,                  //老师评价tab页是否是加载状态
        teacherCommentMsg,                      //老师评价列表数据

        OpenCommentEditModal,                   //打开老师评价编辑modal

        /*老师评价编辑modal*/
        teacherCommentEditModalVisible,         //老师评价编辑modal是否显示
        teacherCommentEditModalLoading,         //老师评价编辑modal加载状态
        teacherCommentEditModalData,            //老师评价编辑modal回填数据

        CloseCommentEditModal,                  //老师评价编辑modal关闭
        SubmitCommentEditModal,                 //老师评价编辑modal提交

        /*家长评价tab页*/
        parentCommentLoading,                   //家长评价tab页是否是加载状态
        parentCommentMsg,                       //家长评价列表数据

        /*上课内容tab页*/
        courseContentMsg,                       //上课内容渲染数据

        OpenContentEditModal,                   //打开上课内容编辑modal

        /*上課內容編輯modal*/
        courseContentEditModalVisible,          //上课内容编辑modal是否显示
        courseContentEditModalLoading,          //上课内容编辑modal加载状态
        courseContentEditModalData,             //上课内容编辑modal回填数据

        CloseContentEditModal,                  //上課內容编辑modal关闭
        SubmitContentEditModal,                 //上课内容编辑modal提交
    }

    let HomeSchoolCommentTableProps = {
        OpenDetailModal,            //打开详情modal
        search: {
            onSearch : (data) => Search(data),
            onClear : (data) => Search(data),
            fields: [
                {
                    key : 'courseId',
                    type : 'select',
                    opt_key : 'id',
                    opt_label : 'title',
                    options : courseMsg,
                    placeholder : '课程名称',
                },
                {
                    key : 'mtid',
                    type : 'select',
                    opt_key : 'userId',
                    opt_label : 'userName',
                    options : teacherMsg,
                    placeholder : '主教',
                },
            ],
        },
        table: {
            newColumns : newColumns,
            changeColumns : ChangeColumns,
            loading : tableLoading,
            dataSource : tableDataSource,
            rowKey : 'cpdId'
        },
        pagination : {
             total             : tableDataTotal,
             pageIndex         : tablePageIndex,
             pageSize          : tablePageSize,
             showTotal         : total => `总共 ${total} 条` ,
             showSizeChanger   : true,
             showQuickJumper   : true,
             onChange          : PageOnChange,
             onShowSizeChange  : PageOnChange,
             size              : 'large'
        }
    }

    return (
        <div style = {{ overflow : 'hidden', height : '100%' }}>
            <HomeSchoolCommentTable {...HomeSchoolCommentTableProps}/>
            <DetailModal {...DetailModalProps}/>
        </div>
    );


}

function mapStateToProps({ homeSchoolComment }) {
  	return { homeSchoolComment };
}

export default connect(mapStateToProps)(HomeSchoolComment);
