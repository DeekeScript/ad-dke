import { logList, removeLog } from '@/services/api/api';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { message, Popconfirm } from 'antd';
import React from 'react';
import { columns } from './help/list';

export default class List extends React.Component {
  actionRef: React.RefObject<any>;
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.actionRef = React.createRef();
  }

  state = {

  }

  componentDidMount(): void {

  }

  getData = async (params: { current: number; pageSize: number; douyin: string; weixin: string; name: string; }) => {
    const res = await logList(params);
    return res;
  }

  handleRemove = async (id: number) => {
    let res = await removeLog({
      id: id,
    });
    console.log(res);
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
    }
  }

  render() {
    return (
      <PageContainer>
        <ProTable
          //headerTitle={'查询表格'}
          actionRef={this.actionRef}
          rowKey="id"
          scroll={{ x: 2000 }}
          search={{ labelWidth: 100, }}
          toolBarRender={() => []}
          request={this.getData}
          columns={[...columns, {
            title: '操作',
            width: 80,
            dataIndex: 'option',
            valueType: 'option',
            fixed: 'right',
            render: (_, record) => [
              <Popconfirm
                key={'delete__' + record.id}
                title="确定删除吗？"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => this.handleRemove(record.id)}
              > <a key={"delete_" + record.id}>删除</a></Popconfirm>,
            ],
          },]}
        />
      </PageContainer>
    );
  }
}
