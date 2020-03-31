/**
 * 签单类型统计表
 */
import React from 'react'
import {connect} from 'dva'
import Media from 'react-media';
import SheetTop from '../../../../components/common/report-form/report-form-top/ReportFormTop'
import SignTypeTable from '../../../../components/report-form/operation/sign-type/SignTypeTable'

function SignTypeSheet({dispatch, signTypeModel}){
  let {
    dataSource,
    searchValue,
    buttonLoading,
    firstEnter,
    totalData,
    loading
  } = signTypeModel

  //点击生成报表
  function onSearch(values){
    let orgIds = undefined
    if(values.tenantId || values.tenantId === 0){
      orgIds = 0
    }
    dispatch({
      type: 'signTypeModel/getList',
      payload: {
        orgIds,
        depIds: values.tenantId,
        startTime: values.startDate,
        endTime: values.endDate
      }
    })
  }

  // 搜索属性
  const topProps = {
    noOrg: true,
    tmkCity: true,
    default: 'thisMonth',
    dataTotal : dataSource.length,
    exportPath : `/stat/tmk/signType/export`,
    exportObj : searchValue,
    GeneratingReports: onSearch,      //点击生成报表
    buttonLoading,          //生成报表按钮加载状态
    // firstEnter,             //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
    popoverTitle: '签单类型统计表',
    popoverContent: [
      {
        name: '业绩金额：',
        content: '退费前业绩 - 退费金额。（退费金额：查询时间段内当前校区中所有合同的退费金额，以退费审核通过时间作为退费计算时间；该退费包括部分退费；该退费包括在选择时段外生成的合同在选择时段内的进行退费的金额，退费金额包括转校转入合同）。'
      },
      {
        name: '业绩占比：',
        content: '当前签约类型业绩金额 / 该城市总业绩金额。'
      },
      {
        name: '退费前业绩：',
        content: '查询时段内，以合同审核时间为数据选取点，合同审核通过、合同全额付款完成、付款审核通过的合同才计算退费前业绩金额，转校转入的合同不算进退费前业绩金额。'
      },
      {
        name: '招生人数：',
        content: '查询时间段内合同算为业绩，则对应学员计算为签单人数。',
        annotation: '注：1. 一个学员查询时段内多次签单/生成多个合同的，只计算一个招生人数；2. 若学员对应合同部分退费，该学员人数不减；3. 当该学员在查询时段内所生成的所有主合同所有课时都通过退款单退课时退为0，该学员减去；4. 招生人数增减计算只看主合同，不考虑赠送合同情况；5. 历史合同退费不影响查询时间段内的招生人数；6. 转校转入学员不计算招生人数。'
      },
      {
        name: '均单金额：',
        content: '（查询时间段内的所有计算为业绩的金额 - 在查询时间段内计算业绩并当月发生退费的合同产生退费的金额）/ 招生人数。',
        annotation: '注：1.查询时间段内的转校转入合同不计算转入校业绩；2.查询时间段内的转校学员不计算转入校的招生人数；3.历史签订为业绩的合同退费不影响查询时间段内的均单金额。'
      },
      {
        name: '合同数：',
        content: '按合同审核通过时间在查询时段内为筛选点，合同审核通过，合同全额付款完成，付款审核通过即记一个合同数；合同数包括赠送合同数，赠送合同按合同审核通过时间在查询时段内为筛选点，合同审核为“已通过”，付款状态为”已通过“则记一个合同数。',
        annotation: '注：1.如果在查询时间段内发生部分退费，合同内的剩余课时数大于0，则不扣除该退费合同数，如果该合同所含所有课时都通过退款单退课时全部退光，则扣除该合同数，不算转校转入合同。（退合同计算包括赠送合同）；2.查询时段内手工作废的赠送合同数也要扣除；3.历史合同退费不影响查询时间段内的合同数。'
      },
      {
        name: '签单课时：',
        content: '查询时间段内由客户签单所生成对应合同类型所包含的课时总数（含赠送合同），只计算有过付清记录的合同数量（如发生退费，则扣除相应的退费课时）。',
        annotation: '注：1.查询时段内已经计算签单课时之后又手工作废掉的赠送合同内所含的课时数也扣除；2.查询时间段内的转校合同内所含的课时不计算转入校的签单课时；3.历史合同退费不影响查询时间段内的签单课时。'
      },
      {
        name: '课时单价：',
        content: '（查询时间段内退费前业绩的金额 - 在查询时间段内计算业绩并当月发生退费的合同产生退费的金额）/ 签单课时。',
        annotation: '注：1.查询时间段内的转校收入不计算转入校业绩；2.历史签订业绩合同退费不影响查询时间段内的课时单价。'
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
            <SignTypeTable {...tableProps} />
          </div>
          :
          <div style={{height: 'calc(100% - 42px)'}}>
            <SignTypeTable {...tableProps} />
          </div>
        }
      </Media>
    </div>
  )
}

const mapStateToProps = ({signTypeModel}) => ({signTypeModel})

export default connect(mapStateToProps)(SignTypeSheet)
