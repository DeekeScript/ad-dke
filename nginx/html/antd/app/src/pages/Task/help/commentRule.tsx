import { ProColumns } from "@ant-design/pro-components";
import { Tag } from "antd";
import moment from "moment";

export const columns: ProColumns<any>[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        search: false,
        width: 120,
        fixed: 'left',
    },
    {
        title: '名称',
        dataIndex: 'name',
        ellipsis: true,
        width: 200,
        copyable: true,
    },
    {
        title: '昵称类型',
        dataIndex: 'nickname_type',
        search: false,
        render: (text, record) => {
            if (!text) {
                return '-';
            }
            //1，纯字母或者数字；2纯汉字，3纯表情，4其他
            let arr = ['不限', '纯英文或者数字', '纯汉字', '纯表情', '其他'];
            text = JSON.parse(text);
            return text.map((item, key) => {
                return <Tag key={key}>{arr[item]}</Tag>
            })
        },
    },
    {
        title: '时间限制',
        dataIndex: 'in_time',
        search: false,
        render: (v) => {
            let res = ['-', '30分钟内', '1小时内', '12小时内', '3天内', '7天内', '1月内', '3月内', '6月内', '不限制'];
            return res[v] || '-';
        }
    },
    {
        title: 'IP限制',
        dataIndex: 'province_name',
        search: false,
        render: (v) => {
            if (!v) {
                return '-';
            }
            return v.map((item, key) => {
                return <Tag key={key}>{item}</Tag>
            })
        }
    },
    {
        title: '评论长度区间',
        dataIndex: 'min_comment',
        search: false,
        render: (text, record) => {
            if (record.min_comment === 0 && record.max_comment === 0) {
                return '-';
            }
            return record.min_comment + ' - ' + record.max_comment;
        },
    },
    {
        title: '点赞数量区间',
        dataIndex: 'min_zan',
        render: (text, record) => {
            if (record.min_zan === 0 && record.max_zan === 0) {
                return '-';
            }
            return record.min_zan + ' - ' + record.max_zan;
        },
        search: false,
    },
    {
        title: '包含关键词',
        dataIndex: 'contain',
        ellipsis: true,
        width: 200,
        copyable: true,
        search: false,
    },
    {
        title: '不包含关键词',
        dataIndex: 'no_contain',
        ellipsis: true,
        width: 200,
        copyable: true,
        search: false,
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        valueType: 'dateTime',
        width: 180,
        search: false,
        render: (text) => {
            return moment(text.props.text * 1000).format("YYYY-MM-DD HH:mm:ss");
        }
    },
];
