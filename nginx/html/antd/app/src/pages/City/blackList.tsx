import { blackFocusUserList, removeBlackFocusUser } from '@/services/api/api';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Popconfirm, message } from 'antd';
import React from 'react';
import { columns } from './help/blackUserList';

@window.connectModel('user', '@@initialState')
export default class List extends React.Component {
  actionRef: React.RefObject<any>;
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.actionRef = React.createRef();
  }

  state = {
    user: this.props.user?.initialState?.currentUser
  }

  componentDidMount(): void {

  }

  getData = async (params: { current: number; pageSize: number; douyin: string; weixin: string; name: string; }) => {
    const res = await blackFocusUserList(params);
    return res;
  }

  handleRemove = async (id: number) => {
    let res = await removeBlackFocusUser({
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
          search={{ labelWidth: 66, }}
          request={this.getData}
          columns={[...columns, {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
              this.state.user.id !== record.id ? <Popconfirm
                key={'delete__' + record.id}
                title="确定删除吗？"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => this.handleRemove(record.id)}
              > <a key={"delete_" + record.id}>删除</a></Popconfirm> : undefined,
            ],
          },]}
        />
      </PageContainer>
    );
  }
}
