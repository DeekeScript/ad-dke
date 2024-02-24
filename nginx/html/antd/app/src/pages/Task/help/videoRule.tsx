import { ProColumns } from "@ant-design/pro-components";
import moment from "moment";

export const columns: ProColumns<any>[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        search: false,
        fixed: 'left',
        width: 120,
    },
    {
        title: '名称',
        ellipsis: true,
        width: 200,
        copyable: true,
        dataIndex: 'name',
    },
    {
        title: '是否同城',
        dataIndex: 'is_city',
        search: false,
        valueEnum: {
            0: { text: '否' },
            1: {
                text: '是',
            },
        },
    },
    {
        title: '视频距离',
        dataIndex: 'distance',
        search: false,
        valueEnum: {
            0: { text: '不限' },
            1: { text: '5公里以内' },
            2: { text: '10公里以内' },
            3: { text: '20公里以内' },
            4: { text: '30公里以内' },
            5: { text: '50公里以内' },
        }
    },
    {
        title: '视频时间',
        dataIndex: 'in_time',
        search: false,
        valueEnum: {
            0: { text: '不限' },
            1: { text: '1小时内' },
            2: { text: '12小时内' },
            3: { text: '1天内' },
            4: { text: '3天内' },
            5: { text: '7天内' },
            6: { text: '15天内' },
        }
    },
    {
        title: '点赞数范围',
        dataIndex: 'min_zan',
        search: false,
        render: (text, record) => {
            if (record.min_zan === 0 && record.max_zan === 0) {
                return '-';
            }
            return record.min_zan + ' - ' + record.max_zan;
        }
    },
    {
        title: '评论数范围',
        dataIndex: 'min_comment',
        search: false,
        render: (text, record) => {
            if (record.min_comment === 0 && record.max_comment) {
                return '-';
            }
            return record.min_comment + ' - ' + record.max_comment;
        }
    },
    {
        title: '收藏数范围',
        dataIndex: 'min_collect',
        search: false,
        render: (text, record) => {
            if (record.min_collect === 0 && record.max_collect === 0) {
                return '-';
            }
            return record.min_collect + ' - ' + record.max_collect;
        }
    },
    {
        title: '分享数范围',
        dataIndex: 'min_share',
        search: false,
        render: (text, record) => {
            if (record.min_share === 0 && record.max_collect === 0) {
                return '-';
            }
            return record.min_share + ' - ' + record.max_share;
        }
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
        search: false,
        width: 180,
        render: (text) => {
            return moment(text.props.text * 1000).format("YYYY-MM-DD HH:mm:ss");
        }
    },
];
