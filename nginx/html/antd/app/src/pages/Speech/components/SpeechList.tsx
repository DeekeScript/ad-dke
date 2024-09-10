import { Drawer, List } from 'antd';
import React, { useState } from 'react';

export type UpdateFormProps = {
  btn: any,
  title: any,
  values: (values: any) => Promise<void>;
};
const SpeechList: React.FC<UpdateFormProps> = (props: any) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(undefined);

  return (
    <>
      <a onClick={() => setOpen(true)}>话术混淆列表</a>
      <Drawer
        title={props.title}
        width={"420px"}
        open={open}
        afterOpenChange={async (open) => {
          if (!open) {
            return;
          }
          let res = await props.values();
          setData(res);
        }}
        onClose={() => setOpen(false)}
      >
        <List
          header={""}
          footer={<div style={{ color: '#666' }}>推荐客户使用VIP混淆模式（已开通请忽略）</div>}
          //bordered
          dataSource={data}
          renderItem={(item, key) => (
            <List.Item>
              {key + 1}. {item}
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
};
export default SpeechList;
