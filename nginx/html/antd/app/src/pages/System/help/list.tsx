import { ProColumns } from "@ant-design/pro-components";
import moment from "moment";

export const columns: ProColumns<any>[] = [
    {
        title: '版本号',
        dataIndex: 'name',
        search: false,
    },
    {
        title: '大小',
        dataIndex: 'size',
        search: false,
        render: (v: number) => {
            return Math.round(v / 1024 / 1024 * 100) / 100 + 'M';
        }
    },
    {
        title: '下载地址',
        dataIndex: 'url',
        search: false,
        render: (v: number) => {
            return <a href={v} target="_blank">{v}</a>
        }
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        //valueType: 'dateTime',
        width: 180,
        search: false,
        render: (text) => {
            return moment(text * 1000).format("YYYY-MM-DD HH:mm:ss")
        }
    },
];
