import React, {useState} from 'react';

type userForm = {
    userId: string,
    userPw: string
}
function LoginScreen() {
    const [userFrom, setUserForm] = useState<userForm>({
        userId : "",
        userPw : ""
    })

    const onChangeInputValue = (event: any) => {
        setUserForm({...userFrom, [event.target.name] : event.target.value})
    }
    return (
        <div>
            <div>
                <h1>Login</h1>
                <p>enter your details to sign in to your account</p>
                <input value={userFrom.userId} name={"userId"} onChange={(event) => onChangeInputValue(event)}/>
                <input value={userFrom.userPw} name={"userPw"} onChange={(event) => onChangeInputValue(event)}/>
                <button>Login In</button>
                <p>Don't have an account? Signup Now?</p>
            </div>
        </div>
    );
}

export default LoginScreen;