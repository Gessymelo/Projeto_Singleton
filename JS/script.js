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

class User{
    constructor(id,login,password){
        this.id = id;
        this.login = login;
        this.password = password;
        this.basket = BasketManager.getBasketForUser(this.id);
    }
}

class Products{
    constructor(id,name){
        this.id = id;
        this.name = name;
    }
    getProduct(){
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


}

function handleLogin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    if (loginUser(username, password)) {
        console.log('deve fechar')
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


function logoutUser() { 
    currentUser = null;
    
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('loginBtn').innerText = 'Entrar';
    document.getElementById('registerBtn').style.display = 'block';

    document.getElementById('logoutBtn').remove();
    document.getElementById('userNameDisplay').remove();
 
}


function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'none';
    }
}



function addToCart(product) {
    if (currentUser) {
        currentUser.basket.addProduct(product);
        console.log(currentUser.id)
        saveCartToLocalStorage(currentUser.id, currentUser.basket.getProductList());
    
    } else {
        alert("Por favor, faça login para adicionar itens ao carrinho.");
    }

    console.log(currentUser)
    console.log(currentUser.basket.getProductList())
}

function saveCartToLocalStorage(userId, productList) {
    const carts = JSON.parse(localStorage.getItem('carts') || '{}');
    console.log(carts)
    carts[userId] = productList;
    localStorage.setItem('carts', JSON.stringify(carts));
}

function loadCartFromLocalStorage(userId) {
    console.log(userId)
    const carts = JSON.parse(localStorage.getItem('carts') || '{}');
    if (carts[userId]) {
        const userCart = carts[userId];
        userCart.forEach(product => {
            currentUser.basket.addProduct(new Products(product.id, product.name, product.image));
        });
  
    }
}
