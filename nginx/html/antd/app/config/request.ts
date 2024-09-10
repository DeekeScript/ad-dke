import { message } from 'antd';
import { RequestConfig, history } from 'umi';

// 运行时配置
export const requests: RequestConfig = {
    // 统一的请求设定
    timeout: 30000,
    // 错误处理： umi@3 的错误处理方案。
    errorHandler: (err: any) => {
        return err.data;
    },

    errorConfig: {
        adaptor: (resData) => {
            return {
                ...resData,
                success: resData.code === 0,
                errorMessage: resData.msg,
            };
        },
    },

    // 请求拦截器
    requestInterceptors: [
        (url: string, options: any[]) => {
            //console.log(options);
            options.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            return {
                url: url,
                options: { ...options, interceptors: true },
            };
        }
    ],

    // 响应拦截器
    responseInterceptors: [
        async (response: { clone: () => { (): any; new(): any; json: { (): any; new(): any; }; }; }) => {
            // 拦截响应数据，进行个性化处理
            const res = await response.clone().json();
            const { success, msg, code } = res;

            if (code === 401) {
                localStorage.removeItem('token');
                if (localStorage.getItem('roleType') === '0') {
                    history.push('/user/me');
                } else {
                    history.push('/user/login');
                }

                return response;
            }

            if (!success) {
                message.error(msg);
            }

            return response;
        }
    ]
};
