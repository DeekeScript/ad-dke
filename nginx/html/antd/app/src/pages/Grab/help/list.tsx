import { ProColumns } from "@ant-design/pro-components";
import moment from "moment";

export const columns: ProColumns<any>[] = [
    {
        title: '任务ID',
        dataIndex: 'id',
        search: false,
    },
    {
        title: '关键词',
        dataIndex: 'keyword',
    },
    {
        title: '重复率',
        dataIndex: 'repeat_rate',
        search: false,
        render: (v, record) => {
            if (v == 0 && record.status == 0) {
                return '-';
            }
            return v + '%';
        }
    },
    {
        title: '通过率',
        dataIndex: 'pass_rate',
        search: false,
        render: (v, record) => {
            if (v == 0 && record.status == 0) {
                return '-';
            }
            return v + '%';
        }
    },
    {
        title: '成交率',
        dataIndex: 'suc_rate',
        search: false,
        render: (v, record) => {
            if (v == 0 && record.status == 0) {
                return '-';
            }
            return v + '%';
        }
    },
    {
        title: '描述',
        dataIndex: 'desc',
        copyable: true,
        width: 200,
        ellipsis: true,
    },
    {
        title: '运行状态',
        dataIndex: 'status',
        valueEnum: {
            0: { text: '待执行' },
            1: {
                text: '已完成',
                status: 'Success',
            },
        },
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
