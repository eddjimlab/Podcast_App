import {apiKey} from './.key'


export function getAuthForm() {
    return `
        <form class="mui-form" id="auth-form">
                <div class="mui-textfield mui-textfield--float-label">
                    <input type="email" id="email" required>
                    <label for="email">Email</label>
                 </div>
                 <div class="mui-textfield mui-textfield--float-label">
                    <input type="password" id="password" required>
                    <label for="password">Пароль</label>
                </div>

                <button type="submit" id="login"
                        class="mui-btn mui-btn--raised mui-btn--primary"
                >Войти
                </button>
        </form>
`
}


export function authWithEmailAndPassword(email, password) {
    return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey.key}`, {
        method: 'POST',
        body: JSON.stringify({
            email, password,
            returnSecureToken: true
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => data.idToken)

}

export function regWithEmailAndPassword(email, password) {
    return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey.key}`, {
        method: 'POST',
        body: JSON.stringify({
            email, password,
            returnSecureToken: true
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok){
              return  response.json().then(data => data.idToken)

            } else {
                return response.json().then(error => {
                    errorMessage(error.error.message)
                    throw error
                })
            }
        })
}
function errorMessage(e) {
    if (e === 'EMAIL_EXISTS'){
        alert('Даный Email уже занят!')
    }
}
