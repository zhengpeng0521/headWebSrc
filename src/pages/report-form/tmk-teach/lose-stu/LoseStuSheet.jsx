/**
 * 流失学员统计表
 */
import React from 'react'
import {connect} from 'dva'
import Media from 'react-media';
import SheetTop from '../../../../components/common/report-form/report-form-top/ReportFormTop'
import LoseStuTable from '../../../../components/report-form/tmk-teach/lose-stu/LoseStuTable'

function LoseStuSheet({dispatch, loseStuModel}){
  let {
    dataSource,
    searchValue,
    buttonLoading,
    firstEnter,
    totalData,
    loading
  } = loseStuModel

  //点击生成报表
  function onSearch(values){
    let orgIds = undefined
    if(values.orgId || values.orgId === 0){
      orgIds = 0
    }
    dispatch({
      type: 'loseStuModel/getList',
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
    exportPath : `/stat/tmk/cerp/runOff/export`,
    exportObj : searchValue,
    GeneratingReports: onSearch,      //点击生成报表
    buttonLoading,          //生成报表按钮加载状态
    // firstEnter,             //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
    popoverTitle: '流失学员统计表',
    popoverContent: [
      {
        name: '在读学员数：',
        content: '查询时间段内当前城市内所有校区的在读学员数量总计（如学员无在读合同/无剩余课时，则不计算该学员为在读学员）。',
        annotation: '注：1. 若一张会员卡内有绑定2个学员的，则统计2个在读学员；2. 账户冻结的学员若账户有剩余课时，也算进在读学员数；3. 若查询时间为本月，按实际当前学员关联账户下有课时为在读学员，若查询时间为之前月，学员账户生成时间在查询时间段内或早于查询时间段，且查询时间段内学员账户下有课时则算在读学员；4. 约课冻结课时也算进剩余课时数；5. 赠送合同课时数也算进剩余课时数。'
      },
      {
        name: '流失学员数：',
        content: '1. 查询时间在本月，实时查询当前学员账户下剩余常规课时+剩余赠课课时数=0 的学员，且在查询月有课时变动记录的记为流失学员（若一个账户下有2个学员，统计成2个流失学员）；2. 查询历史月（月末统一跑批查询）学员账户下剩余常规课时+剩余赠课课时数=0 的学员，且在查询月有课时变动记录的记为流失学员（若一个账户下有2个学员，统计成2个流失学员）。',
        annotation: '注：已冻结的学员账号绑定的学员若有剩余课时，不统计为流失学员。'
      },
      {
        name: '流失率：',
        content: '流失学员人数 / （流失学员人数 +在读学员人数）。'
      },
      {
        name: '同比增长率：',
        content: '（查询当月流失学员人数 - 上一年度同期流失学员人数）/ 上一年度同期流失学员人数。',
        annotation: '注：若上一年度同期流失学员人数为0，当月有流失学员人数，则查同比增长率也为0。'
      },
      {
        name: '环比增长率：',
        content: '（查询当月流失学员人数 - 上个月同期流失学员人数） / 上个月同期流失学员人数。',
        annotation: '注：若上个月流失学员人数为0，当月有流失学员人数，则环比增长率也为0。'
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
            <LoseStuTable {...tableProps} />
          </div>
          :
          <div style={{height: 'calc(100% - 42px)'}}>
            <LoseStuTable {...tableProps} />
          </div>
        }
      </Media>
    </div>
  )
}

const mapStateToProps = ({loseStuModel}) => ({loseStuModel})

export default connect(mapStateToProps)(LoseStuSheet)
