import {
  DrawerForm,
  ProFormSelect,
  ProFormText
} from '@ant-design/pro-components';
import { Form } from 'antd';
import React from 'react';
import { useAccess } from 'umi';

export type UpdateFormProps = {
  onSubmit: (values: any) => Promise<void>;
  values: any;
  btn: any,
};
const PhoneUpdateForm: React.FC<UpdateFormProps> = (props: any) => {
  const [form] = Form.useForm();
  const access = useAccess();

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
      <ProFormText name="mobile" labelCol={{ span: 6 }} label="手机号" initialValue={props.values?.mobile || ''} />
      <ProFormText name="wx" labelCol={{ span: 6 }} label="微信号" initialValue={props.values?.wx || ''} />
      <ProFormSelect label="已添加微信" name="wx_status" initialValue={props.values?.wx_status || 0} options={[
        { label: '已完成', value: 2 },
        { label: '添加失败', value: 1 },
        { label: '待添加', value: 0 },
      ]} />

      <ProFormSelect label="已添加企微" name="qw_status" initialValue={props.values?.qw_status || 0} options={[
        { label: '已完成', value: 2 },
        { label: '添加失败', value: 1 },
        { label: '待添加', value: 0 },
      ]} />
    </DrawerForm>
  );
};
export default PhoneUpdateForm;
