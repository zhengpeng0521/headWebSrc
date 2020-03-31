/**
 * 权责收入表
 */
import React from 'react'
import {connect} from 'dva'
import {Popover, message} from 'antd'
import Media from 'react-media'
import moment from 'moment'
import SheetTop from '../../../../components/common/report-form/report-form-top/ReportFormTop'
import PowerTable from '../../../../components/report-form/tmk-money/power/PowerTable'

function PowerSheet({dispatch, powerModel}){

  let {
    dataSource,
    searchValue,
    buttonLoading,
    firstEnter,
    totalData,
    loading,
    courseList,               // 课程列表

  } = powerModel

  //点击生成报表
  function onSearch(values){
    let orgIds = undefined
    if(values.orgId || values.orgId === 0){
      orgIds = 0
    }

    // 是否查询超过3年周期
    let maxTime = moment(values.startDate).clone().add(3, 'years')
    if(maxTime.isAfter(values.endDate, 'day') || maxTime.isSame(values.endDate, 'day')){
      dispatch({
        type: 'powerModel/getList',
        payload: {
          orgIds,
          depIds: values.orgId,
          startTime: values.startDate,
          endTime: values.endDate
        }
      })
    } else {
      message.error('时间段选择不可超过3年！')
    }

  }

  // 搜索属性
  const topProps = {
    noOrg: true,
    // tmkCity: true,
    tmkOrg: true,
    default: 'thisMonth',
    dataTotal : dataSource.length,
    exportPath : `/stat/tmk/accrucal/export`,
    exportObj : searchValue,
    GeneratingReports: onSearch,      //点击生成报表
    buttonLoading,          //生成报表按钮加载状态
    // firstEnter,             //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
    popoverTitle: '权责收入表',
    popoverContent: [
      {
        name: '各科权责收入：',
        content: '查询时段内，消耗该课系的每个学员的权责收入之和单个学员权责收入 = （合计）学员完成考勤该课系的课时数 * 考勤该课时的所属合同的课时均价。'
      },
      {
        content: '考勤该课时的所属合同的课时均价 = 该合同金额/该合同总课时（合同课时+赠送课时））示例：一学员在查询时间段内在书法班中消耗了A合同的20个课时，B合同（假设B合同为A合同的赠送合同）的10个课时，C合同的10个课时（为主合同课时）。假设这个学员A合同金额为3000元，则课时单价为3000/（20+10）=100元，B合同课时单价也为100元（因为B合同为A合同的赠送合同，课时单价需打包计算），C合同的合同金额为2000元，合同单价则为2000/10=200元。'
      },
      {
        content: '则计算这个学员在查询时间段消耗掉的书法权责收入：（20+10）*100+10*200=5000元，该课系权责收入为上述考勤该课系学员的所有权责收入之和。'
      },
      {
        name: '其他：',
        content: '删除课系的金额和手动消课的通用课时的金额归在“其他”。'
      },
      {
        name: '退费手续费：',
        content: '查询时间内所在校区合同退费的手续费合计（包括查询时段外在时段内合同退费产生的手续费）。'
      },
      {
        name: '权责金额合计：',
        content: '选择时段内各科权责金额合计 + 退费手续费 + 合同过期作废的课时金额 + 其他。'
      },
      {
        name: '耗课课时数：',
        content: '选择时间段内各科已考勤消耗的总课时。'
      },
      {
        name: '耗课平均单价：',
        content: '耗课平均单价 = 选择时间段各科权责金额合计/耗课课时数。'
      },
      {
        name: '2018年6月1日前：',
        content: '付清时间（合同完成审核、全额付款完成、并完成收款审核后正式成立的时间）在2018年6月1日前的合同在查询时间段内消耗课时的权责收入合计（包括查询时段内过期作废合同中付清时间在2018年6月1日前的剩余课时金额，包括查询时段内退费的合同付清时间在2018年6月1日前的合同的退费手续费）。'
      },
      {
        name: '2018年6月1日后：',
        content: '付清时间（合同完成审核、全额付款完成、并完成收款审核后正式成立的时间）在2018年6月1日后（包括6月1日）的合同在查询时间段内消耗课时的权责收入合计（包括查询时段内过期作废合同中付清时间在2018年6月1日后的剩余课时金额，包括查询时段内退费的合同付清时间在2018年6月1日后的合同的退费手续费）。'
      }
    ]
  }

  // 表格属性
  const tableProps = {
    loading,
    totalData,      //汇总数据
    dataSource,     //数据
    courseList,               // 课程列表
  }

  return (
    <div style={{overflow: 'hidden', height: '100%'}}>
      <SheetTop { ...topProps } />
      <Media query="(max-width: 1350px)">
        { matches => matches ?
          (
            <div style={{height: 'calc(100% - 80px)'}}>
              <PowerTable {...tableProps} />
            </div>
          )
          :
          (
            <div style={{height: 'calc(100% - 42px)'}}>
              <PowerTable {...tableProps} />
            </div>
          )
        }
      </Media>
    </div>
  )
}

const mapStateToProps = ({powerModel}) => ({powerModel})

export default connect(mapStateToProps)(PowerSheet)
