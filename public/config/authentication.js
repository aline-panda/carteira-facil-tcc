var user;

function logar() {
  var email = document.getElementById('emailLogin');
  var password = document.getElementById('senhaLogin');

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(() => {
    return firebase
    .auth()
    .signInWithEmailAndPassword(email.value, password.value)
    .then((userCredential) => {
      user = userCredential.user;
      localStorage.setItem('currentUser', String(user.email));
      alert('Login efetuado');
      window.location.href = './assets/views/dashboard.html';
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log('Código de erro', errorCode);
      alert(errorMessage);
    });
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
  });

  
}

function cadastrar() {
  const email = document.getElementById('cadEmail');
  const password = document.getElementById('cadPassword');
  const confirmePassword = document.getElementById('cadPassword');

  if (
    email.value != '' &&
    password.value != '' &&
    confirmePassword.value != ''
  ) {
    if (password.value === confirmePassword.value) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
          user = userCredential.user;
          setUser(user);
          alert('Usuário criado com sucesso!');
          window.location.href = '../views/dashboard.html';
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage);
        });
    } else {
      alert('Senhas são diferentes!');
    }
  } else {
    alert('Preencha todos os campos!');
  }
}

function logout() {
  firebase.auth().signOut();
  window.location.href = '/index.html';
}
