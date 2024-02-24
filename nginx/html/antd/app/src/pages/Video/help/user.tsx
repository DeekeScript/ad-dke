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
        title: '设备ID',
        dataIndex: 'machine_id',
        width: 120,
        //search: false,
        render: (val) => {
            if (!val) {
                return '-';
            }
            return val;
        }
    },
    {
        title: 'IP',
        dataIndex: 'province_name',
        search: false
    },
    {
        title: '昵称',
        dataIndex: 'nickname',
        ellipsis: true,
        copyable: true,
        width: 160,
        search: false
    },
    {
        title: '抖音号',
        ellipsis: true,
        copyable: true,
        width: 160,
        dataIndex: 'douyin',
        search: false,
        render: (val) => {
            if (!val) {
                return '-';
            }
            return val;
        }
    },
    {
        title: '性别',
        dataIndex: 'gender',
        search: false,
        valueEnum: {
            3: { text: '未知' },
            1: {
                text: '男',
            },
            2: {
                text: '女',
            },
        },
    },
    {
        title: '年龄',
        dataIndex: 'age',
        search: false,
        render: (text) => {
            if (!text) {
                return '-';
            }
            return text;
        }
    },
    {
        title: '类型',
        dataIndex: 'type',
        tip: '其他：包括视频作者和评论人以外的任何人',
        //search: false,
        //类型，0视频作者，1视频评论人，2其他（看评论来的）
        valueEnum: {
            0: { text: '作者' },
            1: {
                text: '评论区',
            },
            2: {
                text: '其他',
            },
        },
    },
    {
        title: '个人号',
        dataIndex: 'is_person',
        search: false,
        valueEnum: {
            0: { text: '否' },
            1: {
                text: '是',
            },
        },
    },
    {
        title: '团购达人',
        dataIndex: 'is_tuangou',
        search: false,
        valueEnum: {
            0: { text: '否' },
            1: {
                text: '是',
            },
        },
    },
    {
        title: '开启橱窗',
        dataIndex: 'open_window',
        search: false,
        valueEnum: {
            0: { text: '否' },
            1: {
                text: '是',
            },
        },
    },
    {
        title: '点赞数',
        dataIndex: 'zan_count',
        search: false,
        render: (text) => {
            if (text > 10000) {
                return (text / 10000).toFixed(2) + 'w';
            }
            return text;
        }
    },
    {
        title: '关注数',
        dataIndex: 'focus_count',
        search: false,
        render: (text) => {
            if (text > 10000) {
                return (text / 10000).toFixed(2) + 'w';
            }
            return text;
        }
    },
    {
        title: '粉丝数',
        dataIndex: 'fans_count',
        search: false,
        render: (text) => {
            if (text > 10000) {
                return (text / 10000).toFixed(2) + 'w';
            }
            return text;
        }
    },
    {
        title: '作品数',
        dataIndex: 'works_count',
        search: false,
        render: (text) => {
            if (text > 10000) {
                return (text / 10000).toFixed(2) + 'w';
            }
            return text;
        }
    },
    {
        title: '简介',
        dataIndex: 'introduce',
        ellipsis: true,
        copyable: true,
        width: 240,
        search: false,
    },
    {
        title: '视频标题',
        dataIndex: 'title',
        ellipsis: true,
        copyable: true,
        width: 320,
        search: false,
        render: (val) => {
            if (!val) {
                return '-';
            }
            return val;
        }
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        valueType: 'dateTimeRange',
        width: 180,
        search: {
            transform: (value) => {
                return {
                    startTime: value[0],
                    endTime: value[1],
                };
            },
        },
        render: (text) => {
            return moment(text.props.text * 1000).format("YYYY-MM-DD HH:mm:ss");
        }
    },
];
