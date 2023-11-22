class AuthenticatedUserManager {
    static instance;

    constructor() {
        if (AuthenticatedUserManager.instance) {
            return AuthenticatedUserManager.instance;
        }
        AuthenticatedUserManager.instance = this;
        this.currentUser = null;
    }

    login(id, login, password) {
        // Aqui você poderia ter uma verificação real de credenciais
        const user = users.get(login);
        if (user && user.password === password) {
            this.currentUser = user;
            updateCartDisplay();
        } else {
            alert("Login falhou! Por favor, verifique suas credenciais.");
        }
    }

    logout() {
        this.currentUser = null;
        // Lógica adicional para logout, se necessário
    }

    getAuthenticatedUser() {
        return this.currentUser;
    }
}

class Basket {
    constructor() {
        this.productList = [];
    }

    addProduct(product) {
        this.productList.push(product);
    }

    getProductList() {
        return [...this.productList];
    }
}

class BasketManager {
    static baskets = new Map(); //colection chave-valor, onde uma instancia da class Baskter vai ter ligada á um id de usuario.
    
    static getBasketForUser(userId) {
        if (!this.baskets.has(userId)) {
            this.baskets.set(userId, new Basket());
        }
        return this.baskets.get(userId);
    }
}

class User {
    constructor(id, login, password) {
        this.id = id;
        this.login = login;
        this.password = password;
        this.basket = BasketManager.getBasketForUser(this.id);
    }
}

class Products {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    getProduct() {
        return this.name;
    }
}

// Simulando uma lista de usuários para fins de demonstração
let users = new Map();
let currentUser = null;

const authManager = new AuthenticatedUserManager();

window.onload = function() {
    // Event Handlers Initialization
    document.getElementById('loginBtn').addEventListener('click', function() {
        showPopup('loginPopup');
    });

    document.getElementById('registerBtn').addEventListener('click', function() {
        showPopup('registerPopup');
    });

    document.getElementById('loginSubmit').addEventListener('click', function() {
        handleLogin();
    });
    // Mais eventos e inicializações podem ser adicionados conforme necessário
};

function handleLogin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    if (loginUser(username, password)) {
        closePopup('loginPopup');
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('registerBtn').style.display = 'none';

        const logoutBtn = document.createElement('button');
        logoutBtn.innerText = 'Logout';
        logoutBtn.id = 'logoutBtn';
        logoutBtn.addEventListener('click', logoutUser);
        document.querySelector('.user-actions').appendChild(logoutBtn);

        const userNameDisplay = document.createElement('span');
        userNameDisplay.innerText = currentUser.login;
        userNameDisplay.id = 'userNameDisplay';
        document.querySelector('.user-actions').appendChild(userNameDisplay);
    } else {
        alert("Login falhou! Por favor, verifique suas credenciais.");
    }
}

function registerUser(id, login, password) {
    console.log(login)
    if (!users.has(login)) {
        const newUser = new User(id, login, password);
        users.set(login, newUser);
        return true;    
    }
    return false;
}

registerUser(1, 'usuario1', 'senha123');
registerUser(2, 'usuario2', 'senha321');


function loginUser(login, password) {
    if (users.has(login)) {
        const user = users.get(login);
        if (user.password === password) {
            currentUser = user;
            document.getElementById('loginBtn').innerText = user.login;
            console.log(currentUser.id)
            localStorage.setItem('currentUser', JSON.stringify({ id: currentUser.id, login: currentUser.login }));
            loadCartFromLocalStorage(currentUser.id);
            return true;
        }
    }
    return false;
}



function showPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'block';
    }
}

function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'none';
    }
}

// ... Adicione o restante das funções conforme necessário
