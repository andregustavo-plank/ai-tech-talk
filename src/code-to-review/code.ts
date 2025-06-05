// @ts-nocheck
// poorly named variables and lack of types
let x = 5
let y = "hello"

// inconsistent formatting and missing semicolons
function add(a,b){
return a+b
}

// global variable and any type
var globalData:any = []

// security vulnerability with eval
function processUserInput(input) {
    eval(input)
}

// memory leak potential
class DataManager {
    private listeners: unknown[] = []
    
    public addListener(cb: unknown) {
        this.listeners.push(cb)
        // no way to remove listeners
    }

    // poor error handling
    public async fetchData() {
        try {
            const res = await fetch('http://api.example.com/data')
            return res.json()
        } catch {
            // swallowing error without logging
        }
    }
}

// code duplication
function validateEmail(email) {
    if(!email) return false
    if(!email.includes('@')) return false
    if(email.length < 5) return false
    return true
}

function validateUsername(username) {
    if(!username) return false
    if(username.length < 3) return false
    return true
}

// nested callbacks and poor promise handling
function loadUserData(userId) {
    fetch(`/api/user/${userId}`).then((response) => {
        response.json().then((user) => {
            fetch(`/api/posts/${user.id}`).then((posts) => {
                posts.json().then((userPosts) => {
                    // callback hell
                    console.log(userPosts)
                })
            })
        })
    })
}

// magic numbers and poor naming
function calc(n) {
    return n * 1.15 + 2.95
}

// potential null reference
let user;
console.log(user.name)

// unused parameters and lack of return type
function processData(data, config, options, callback) {
    return data.map(i => i * 2)
}