import { useAccess, Access } from 'umi';

const If = props => {
    const access = useAccess(); // access 的成员: canReadFoo, canUpdateFoo, canDeleteFoo
    return (
        <Access
            accessible={access[props.access]}
        >
            {props.children}
        </Access>
    );
};

export default If;
