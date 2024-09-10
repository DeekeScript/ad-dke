import {
  DrawerForm,
  ProFormText,
} from '@ant-design/pro-components';
import { Form } from 'antd';
import React from 'react';

export type UpdateFormProps = {
  onSubmit: (values: any) => Promise<void>;
  values: any;
  btn: any,
};
const DouyinUpdateForm: React.FC<UpdateFormProps> = (props: any) => {
  const [form] = Form.useForm();
  return (
    <DrawerForm
      title={props.values ? '编辑' : '添加'}
      form={form}
      preserve={false}
      trigger={
        props.btn
      }
      layout={'horizontal'}
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      onFinish={async (data) => {
        data.id = props.values?.id || 0;
        return props.onSubmit(data);
      }}
      width={"400px"}
    >
      <ProFormText name="nickname" labelCol={{ span: 4 }} label="昵称" initialValue={props.values?.nickname || ''} />
      <ProFormText name="douyin" labelCol={{ span: 4 }} label="抖音号" initialValue={props.values?.douyin || ''} />
      <ProFormText name="zan_count" labelCol={{ span: 4 }} label="点赞数" initialValue={props.values?.zan_count || ''} />
      <ProFormText name="focus_count" labelCol={{ span: 4 }} label="关注数" initialValue={props.values?.focus_count || ''} />
      <ProFormText name="fans_count" labelCol={{ span: 4 }} label="粉丝数" initialValue={props.values?.fans_count || ''} />
    </DrawerForm>
  );
};
export default DouyinUpdateForm;
