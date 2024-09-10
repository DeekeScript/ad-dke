import { ProColumns } from "@ant-design/pro-components";
import moment from "moment";

export const columns: ProColumns<any>[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        search: false,
    },
    {
        title: '设备ID',
        dataIndex: 'machine_id',
    },
    {
        title: '设备名称',
        dataIndex: 'name',
        renderText: (val: string) => `${val}`,
    },
    {
        title: '关注数',
        dataIndex: 'focus_count',
        search: false,
        renderText: (val: string) => `${val}`,
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
