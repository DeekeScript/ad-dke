import {
  DrawerForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form } from 'antd';
import React from 'react';

export type UpdateFormProps = {
  onSubmit: (values: any) => Promise<void>;
  values: any;
  btn: any,
};
const UpdateForm: React.FC<UpdateFormProps> = (props: any) => {
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
      width={"440px"}
    >
      <ProFormText name="name" labelCol={{ span: 5 }} label="名称" rules={[{ required: true, message: '名称不能为空' }]} initialValue={props.values?.name || ''} />
      <ProFormDigit name="mobile" labelCol={{ span: 5 }} label="手机号" rules={[{ required: true, message: '手机号不能为空' }]} initialValue={props.values?.mobile || ''} />
      {props.values?.id ? <ProFormText.Password name="password" fieldProps={{
        autoComplete: 'new-password',
      }} labelCol={{ span: 5 }} label="密码" extra={'不填写则不重置'} />
        : <ProFormText.Password name="password" fieldProps={{
          autoComplete: 'new-password',
        }} labelCol={{ span: 5 }} label="密码" rules={[{ required: true, message: '密码不能为空' }]} />}
      {props.roleType === 1 ? <ProFormSelect labelCol={{ span: 5 }} mode='multiple' name={'machine_id'} label={'手机配置'} rules={[{ required: true, message: '手机配置不能为空' }]} initialValue={props.values?.machine_id || []} request={async () => {
        let res = await props.getMachine();
        for (let i in res.data) {
          if (props.values?.machine_id?.includes(res.data[i].value)) {
            res.data[i].disabled = false;
          }
        }
        return res.data;
      }} /> : undefined}

      {props.roleType === 1 ? <ProFormSelect labelCol={{ span: 5 }} name={'type'} label={'时长'} rules={[{ required: true, message: '请选择时长' }]} initialValue={props.values?.type} options={[
        { 'label': '3天', value: 2 },
        { 'label': '1月', value: 1 },
        { 'label': '3月', value: 3 },
        { 'label': '1年', value: 0 }
      ]} /> : undefined}

      <ProFormSelect name="state" options={[
        { 'label': '开启', value: 1 },
        { 'label': '关闭', value: 0 }
      ]} labelCol={{ span: 5 }} label="是否开启" rules={[{ required: true, message: '是否开启必须设置' }]} initialValue={props.values?.state} />
    </DrawerForm>
  );
};
export default UpdateForm;
