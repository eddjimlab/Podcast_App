import {Question} from "./question"
import {createModal, isValid} from "./utils";
import './style.css';
import {authWithEmailAndPassword, getAuthForm, regWithEmailAndPassword} from "./auth";

const form = document.getElementById('form')
const modalBtn = document.getElementById('modal-btn')
const input = form.querySelector('#label-input')
const submitBtn = form.querySelector('#submit')
const regBtn = document.getElementById('regBtn')

window.addEventListener('load', Question.renderList)
form.addEventListener('submit', submitFormHandler)
modalBtn.addEventListener('click', openModal)
regBtn.addEventListener('click', openReg)
input.addEventListener('input', () => {
    submitBtn.disabled = !isValid(input.value)
})

function submitFormHandler(event) {
    event.preventDefault()

    if (isValid(input.value)) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        }
        submitBtn.disabled = true
        //    async request to server to save question
        Question.create(question).then(() => {
            input.value = ''
            input.className = ''
            submitBtn.disabled = false
        })
        console.log('Question', question)


    }
}


function openModal() {
    createModal('Авторизация', getAuthForm())
    document
        .getElementById('auth-form')
        .addEventListener('submit', authFormHandler, {once: true})
}

function openReg() {
    createModal('Регистрация', getAuthForm())
        document
            .getElementById('auth-form')
            .addEventListener('submit', registerFormHandler, {once: true})
}

function registerFormHandler(event) {
 event.preventDefault()
    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value
    const btn = event.target.querySelector('#login')
    btn.addEventListener('click', regWithEmailAndPassword)

    btn.disabled = true

    regWithEmailAndPassword(email, password)
        .then(Question.fetch)
        .then(renderModalAfterAuth)
        .then(() => btn.disabled = false)

}

function authFormHandler(event) {
    event.preventDefault()
    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value
    const btn = event.target.querySelector('#login')
    btn.addEventListener('click', authWithEmailAndPassword)

    btn.disabled = true

    authWithEmailAndPassword(email, password)
        .then(Question.fetch)
        .then(renderModalAfterAuth)
        .then(() => btn.disabled = false)
}

function renderModalAfterAuth(content) {
    if (typeof content === 'string') {
        createModal('Ошибка', content)
    } else {
        createModal('Список вопросов', Question.listToHtml(content))
    }
}
