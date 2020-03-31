import React from "react"
import SuperSearch from "../../common/new-component/super-search/SuperSearch"

function TmkOwnSeaSuperSearch({
    stuFollowStatelist,
    superSearchVisible, //高级搜索是否显示
    SuperSearchClick, //高级搜索点击搜索或者重置
    SuperSearchOnClear, // 高级搜索重置
    SuperSearchOnSearch, //点击右上角的X
    followResultList, //跟进结果
    channel, // 来源类别
    secondChannel, //市场渠道
    followUserList, // 跟进人列表
}) {
    let fields = [
        {
            key: "studentFollowState",
            type: "select",
            label: "跟进状态",
            placeholder: "请选择跟进状态",
            opt_key:'key',
            opt_label: 'value',
            options: stuFollowStatelist,
        },
        {
            key: "tmkerId",
            type: "select",
            label: "跟进人",
            opt_key: 'id',
            opt_label: 'name',
            placeholder: "请选择跟进人",
            options: followUserList
        },
        {
          key: "tmkFollowResult",
          type: "select",
          label: "跟进结果",
          opt_key: 'key',
          opt_label: 'value',
          placeholder: "请选择跟进结果",
          options: followResultList
        },
        {
            key: "signingStatus",
            type: "select",
            label: "是否签约",
            placeholder: "请选择签约状态",
            options: [
                { key: "1", label: "是" },
                { key: "0", label: "否" }
            ]
        },
        {
          key: "channel",
          type: "select",
          label: "来源类别",
          opt_key: 'key',
          opt_label: 'value',
          placeholder: "请选择来源类别",
          options: channel
        },
        {
          key: "secondChannel",
          type: "select",
          label: "市场渠道",
          opt_key: 'key',
          opt_label: 'value',
          placeholder: "请选择市场渠道",
          options: secondChannel
        },
        {
            key: "lastVisitTime",
            type: "rangePicker",
            label: "最后一次到访时间",
            startPlaceholder: "开始日期",
            endPlaceholder: "结束日期",
            dateFormat: 'YYYY-MM-DD',
            showTime: false
        }
    ]

    return (
        <SuperSearch
            searchVisible={superSearchVisible}
            onSearch={data => SuperSearchClick(data)}
            onClear={data => SuperSearchOnClear(data)}
            closeSearch={SuperSearchOnSearch}
            fields={fields}
        />
    )
}

export default TmkOwnSeaSuperSearch
