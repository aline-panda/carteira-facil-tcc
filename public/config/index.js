var valor_meta = 0;
var total_metas = 0;
var tabela_parametro;
var numeroLinhas;
var linha;
var celula1;
var celula2;
var celula3;
var celula4;
var celula5;
var currentUser = null;


function createRow(data) {

  if (data == null) {
    data = {
      value: '',
      description: '',
      index: 0,
      prazo: '',
      userEmail: currentUser,
      id: 0
    }
  }

  document.getElementById('thead_metas').style.visibility = 'visible';

  tabela_parametro = document.getElementById("tabela_metas");

  numeroLinhas = tabela_parametro.getElementsByClassName('tr').length;
  linha = tabela_parametro.insertRow(numeroLinhas);
  linha.className = "tr";

  celula1 = linha.insertCell(0);
  celula2 = linha.insertCell(1);
  celula3 = linha.insertCell(2);
  celula4 = linha.insertCell(3);
  celula5 = linha.insertCell(4);

  celula1.innerHTML = `<td>${numeroLinhas + 1}</td>`;
  celula1.className = "seq";
  celula1.id = `seq_meta${numeroLinhas}`;

  celula2.innerHTML = `<td> <input placeholder="Descrição" type="text" id="des_meta${numeroLinhas}" value="${data.description}"></td>`;
  celula2.className = "car";

  celula3.innerHTML = `<td> <input placeholder="Valor" class="val_meta" type="text" id="val_meta${numeroLinhas}" onkeyup="somenteNumeros(this)" onblur="valor_total()" value="${data.value}"> </td>`;
  celula3.className = "car val";

  celula4.innerHTML = `<td> <input placeholder="Prazo" class="prazo_meta" type="date" id="prazo_meta${numeroLinhas}" value="${data.prazo}"> </td>`;
  celula4.className = "car date";

  celula5.innerHTML = `<td> <button class="del no_print" data-value="${numeroLinhas+1}" onclick="deleteRow(this.parentNode.parentNode.rowIndex, 9);" id="deletar_meta${numeroLinhas + 1}"><i class="fa-solid fa-close"></i></button> </td>`;

  document.getElementById("des_meta" + numeroLinhas).focus();
}

function deleteRow(linha) {
  removeMetas(linha);
  document.getElementById('tabela_metas').deleteRow(linha);
  total_metas = 0;
  
  for (let i = 0; i < document.getElementById('tabela_metas').getElementsByTagName('tr').length; i++) {
    if (!document.getElementById(`seq_meta${i}`)) {
      document.getElementById(`seq_meta${i+1}`).textContent = ((i + 1) + '.');
      document.getElementById(`seq_meta${i+1}`).setAttribute('id', `seq_meta${i}`);
      document.getElementById(`des_meta${i+1}`).setAttribute('id', `des_meta${i}`);
      document.getElementById(`val_meta${i+1}`).setAttribute('id', `val_meta${i}`);
    }
  }
  
  if (document.getElementById('tabela_metas').getElementsByTagName('tr').length == 0){
    document.getElementById('thead_metas').style.visibility = 'hidden';
  } 
  valor_total()
}

function somenteNumeros(num) {
  var er = /[^0-9. ,-,]/;
  er.lastIndex = 0;
  var campo = num;
  if (er.test(campo.value)) {
    campo.value = "";
  }
  total_metas = 0.00;
  for (let i = 0; i < document.getElementById('tabela_metas').getElementsByTagName('tr').length; i++) {
    if (document.getElementById(`val_meta${i}`) !== null) {
      var meta = document.getElementById(`val_meta${i}`).value;
      meta = meta.replace(",", ".");
      meta = parseFloat(meta).toFixed(2);

      if (meta !== "NaN") {
        total_metas += parseFloat(meta);
      }
    }
  }
  total_metas = parseFloat(total_metas).toFixed(2);
  document.getElementById('total_metas').value = (total_metas).replace(".", ",");
}

function valor_total() {
  total_metas = 0.00;

  if (document.getElementById('tabela_metas').childElementCount == 0) {
    return;
  }

  for (let i = 0; i < document.getElementById('tabela_metas').getElementsByTagName('tr').length; i++) {
    if (document.getElementById(`val_meta${i}`) !== null) {
      var meta = document.getElementById(`val_meta${i}`).value;
      meta = meta.replace(",", ".");
      meta = parseFloat(meta).toFixed(2);

      if (meta !== "NaN") {
        total_metas += parseFloat(meta);
      }
    }
  }

  total_metas = parseFloat(total_metas).toFixed(2);
  document.getElementById('total_metas').value = (total_metas).replace(".", ",");
}

async function getMetas() {
  currentUser = localStorage.getItem('currentUser');

  let data = [];
  try {
    firebase.firestore().collection("metas").where("userEmail", "==", currentUser)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          data.push(doc.data())
        });
        for (let i = 0; i < data.length; i++) {
          createRow(data[i]);
        }
        valor_total();
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);

      });
  } catch (error) {
    console.log('Erro ao obter metas')
  } 

};


function addMetas() {

  if (document.getElementById('tabela_metas').getElementsByTagName('tr').length == 0) {
    alert('Por favor, defina alguma meta antes de salvar')
    return;
  }

  let data = {};
  for (let i = 0; i < document.getElementById('tabela_metas').getElementsByTagName('tr').length; i++) {
    if (document.getElementById(`val_meta${i}`) !== null) {
      var description = document.getElementById(`des_meta${i}`).value;

      var meta = document.getElementById(`val_meta${i}`).value;
      meta = meta.replace(",", ".");
      meta = parseFloat(meta).toFixed(2);

      var prazo = document.getElementById(`prazo_meta${i}`).value;

      var id = currentUser + i;

      data = {
        value: meta,
        description: description,
        index: i,
        prazo: prazo,
        userEmail: currentUser,
        id: id
      }

      firebase.firestore().collection("metas").doc(id).set(data)
        .then(() => {
          console.log('Meta adicionada');
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }


};

function removeMetas(linha) {
  var id = currentUser + linha;

  firebase.firestore().collection("metas").doc(id).delete()
    .then(() => {
      console.log('Meta deletada');
    })
    .catch((error) => {
      console.error('Erro ao remover documento: ', error);
    })
};