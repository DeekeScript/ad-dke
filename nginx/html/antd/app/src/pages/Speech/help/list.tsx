import { ProColumns } from "@ant-design/pro-components";
import moment from "moment";

export const columns: ProColumns<any>[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        search: false,
    },
    {
        title: '话术',
        dataIndex: 'desc',
    },
    {
        title: '混淆级别',
        dataIndex: 'level',
        valueEnum: {
            0: { text: '不使用' },
            1: {
                text: '推荐',
                status: 'Success',
            },
            2: {
                text: '高级',
                status: 'Processing',
            },
            3: {
                text: 'VIP',
                status: 'Error',
            },
        },
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        valueType: 'dateTime',
        search: false,
        render: (text) => {
            return moment(text.props.text * 1000).format("YYYY-MM-DD HH:mm:ss");
        }
    },
];
