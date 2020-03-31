/**
 * 活跃学员统计表
 */
import React from 'react'
import {connect} from 'dva'
import Media from 'react-media';
import SheetTop from '../../../../components/common/report-form/report-form-top/ReportFormTop'
import ActiveStuTable from '../../../../components/report-form/tmk-teach/active-stu/ActiveStuTable'

function ActiveStuSheet({dispatch, activeStuModel}){
  let {
    dataSource,
    searchValue,
    buttonLoading,
    firstEnter,
    totalData,
    loading
  } = activeStuModel

  //点击生成报表
  function onSearch(values){
    let orgIds = undefined
    if(values.orgId || values.orgId === 0){
      orgIds = 0
    }

    dispatch({
      type: 'activeStuModel/getList',
      payload: {
        orgIds,
        depIds: values.orgId,
        yearAndMonth: values.month
      }
    })
  }

  // 搜索属性
  const topProps = {
    noOrg: true,
    tmkOrg: true,
    dateType: 'month',
    dataTotal : dataSource.length,
    exportPath : `/stat/tmk/cerp/active/export`,
    exportObj : searchValue,
    GeneratingReports: onSearch,      //点击生成报表
    buttonLoading,          //生成报表按钮加载状态
    // firstEnter,             //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
    popoverTitle: '活跃学员统计表',
    popoverContent: [
      {
        name:'在读学员数：',
        content: '查询时间段内当前城市内所有校区的在读学员数量总计（如学员无在读合同/无剩余课时，则不计算该学员为在读学员）。',
        annotation: '注：1. 若一张会员卡内有绑定2个学员的，则统计2个在读学员；2. 账户冻结的学员若账户有剩余课时，也算进在读学员数；3. 若查询时间为本月，按实际当前学员关联账户下是否有课时为判断；若查询时间为之前月，学员账户生成时间在查询时间段内或早于查询时间段，且查询时间段内学员账户下有课时则算在读学员（查验方法：课时月结表上查看学员剩余课时）；4. 约课冻结课时也算进剩余课时数；5. 赠送合同课时数也算进剩余课时数。'
      },
      {
        name: '活跃学员数：',
        content: '查询时间段内当前城市所有校区内有考勤记录/课时消耗记录的学员，且查询时段内（查询历史月份为月末跑批数据）账户有剩余课时数（多次消耗只计算一次活跃人数，多人共用一张学员卡的，则这些学员分开计算活跃数）。',
        annotation: '注：若一张会员账户内绑定2个学员，其中只有一个学员出勤，另一个学员未出勤，只计算为1个活跃学员；扣课方式为旷课和请假，手动消课的不算，只算正常出勤或者补课出勤。'
      },
      {
        name: '活跃率：',
        content: '活跃学员人数 / 在读学员人数。'
      },
      {
        name: '同比增长率：',
        content: '（查询当月活跃学员人数 - 上一年度同期活跃学员人数） / 上一年度同期活跃学员人数。',
        annotation: '注：若上一年度同期活跃学员人数为0，当月有活跃学员人数，则查同比增长率也为0。'
      },
      {
        name: '环比增长率：',
        content: '（查询当月活跃学员人数 - 上个月同期活跃学员人数） / 上个月同期活跃学员人数。',
        annotation: '注：若上个月活跃学员人数为0，当月有活跃学员人数，则环比增长率也为0。'
      }
    ]
  }

  // 表格属性
  const tableProps = {
    loading,
    totalData,      //汇总数据
    dataSource,     //数据
  }

  return (
    <div style={{overflow: 'hidden', height: '100%'}}>
      <SheetTop { ...topProps } />
      <Media query="(max-width: 1350px)">
        { matches => matches ?
          <div style={{height: 'calc(100% - 80px)'}}>
            <ActiveStuTable {...tableProps} />
          </div>
          :
          <div style={{height: 'calc(100% - 42px)'}}>
            <ActiveStuTable {...tableProps} />
          </div>
        }
      </Media>
    </div>
  )
}

const mapStateToProps = ({activeStuModel}) => ({activeStuModel})

export default connect(mapStateToProps)(ActiveStuSheet)
