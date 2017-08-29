var data = [];
var newO = {};
var editMode = {
    edit: false,
    editId: undefined
};

var marequete = new XMLHttpRequest();

marequete.open('GET', "http://localhost:3000/api/liste", true);
marequete.send();

marequete.addEventListener("readystatechange", processRequest, false);

function processRequest(event) {
    console.log(event);
    console.log(marequete.readyState);
    console.log(marequete.status);

    if (marequete.readyState == 4 && marequete.status == 200) {
        var mareponseText = marequete.responseText;
        mareponseText = JSON.parse(mareponseText);
        data = mareponseText;
        data.forEach(function(eleve) {
            bindList(eleve);

        });
    }

}

var monUl = document.createElement("ul");
monUl.classList.add("list-group")
var monWrap = document.getElementById("wrap");
monWrap.appendChild(monUl);

var monBtn = document.getElementById("addNew");
monBtn.addEventListener("click", function(event) {
    document.getElementById("myForm").classList.toggle("show");

});

function bindList(eleve) {
    var monLi = document.createElement("li");
    monLi.innerHTML = eleve.nom + ' ' + eleve.prenom;
    monLi.classList.add("list-group-item");
    monLi.setAttribute("data-idEleve", eleve._id);

    addBtnProfile(monLi);
    addBtnDelete(monLi);
    addBtnEdit(monLi);

    monUl.appendChild(monLi);
}


function addBtnProfile(elem) {
    var btnProfile = document.createElement("span");
    btnProfile.classList.add("badge")
    btnProfile.innerHTML = "<span class='glyphicon glyphicon-user' aria-hidden='true'></span>";
    btnProfile.addEventListener("click", detectClick);
    elem.appendChild(btnProfile);
}

function addBtnDelete(elem) {
    var deleteBtn = document.createElement("span");
    deleteBtn.classList.add("badge")
    deleteBtn.innerHTML = "<span class='glyphicon glyphicon-trash' aria-hidden='true'></span>";
    deleteBtn.addEventListener("click", deleteEleve);
    elem.appendChild(deleteBtn);
}

function addBtnEdit(elem) {
    var deleteEdit = document.createElement("span");
    deleteEdit.classList.add("badge")
    deleteEdit.innerHTML = "<span class='glyphicon glyphicon-pencil' aria-hidden='true'></span>";
    deleteEdit.addEventListener("click", editEleve);
    elem.appendChild(deleteEdit);
}



function detectClick(event) {
    event.preventDefault();
    console.log(event);
    console.log(event.target);
    var myTarget = event.target.parentNode.parentNode;
    console.log(myTarget);
    var eleveId = myTarget.getAttribute("data-idEleve");
    console.log(eleveId);

    window.location = "./profil.html" + '#' + myTarget.getAttribute("data-idEleve");
}


function submitForm(event) {
    console.log("submitted");
    var monForm = document.getElementById("newUser").elements;
    var newUser = {};
    console.log(typeof monForm);
    _.forIn(monForm, function(item) {
        console.log(item);
        newUser[item.name] = item.value;

    });

    if (editMode.edit === false) {
        console.log("je suis en création");
        console.log(newUser);
    // data.push(newUser);
    // bindList(newUser);
    // console.log(data);

    var postUser = new XMLHttpRequest();
    postUser.open('POST', "http://localhost:3000/new", true);
    postUser.setRequestHeader("Content-type", "application/json");
    postUser.send(JSON.stringify(newUser));
    postUser.onreadystatechange = function() {
        if(postUser.readyState == XMLHttpRequest.DONE && postUser.status == 200) {
            console.log('req ok');
            console.log(postUser.responseText);
            var addEleve = JSON.parse(postUser.responseText);
            var addEleve = bindList(addEleve);
        }
    }
}

else if (editMode.edit === true) {
        console.log("je suis en edition");
        console.log(editMode);
        console.log(newUser);
        newUser._id = editMode.editId;
         
        var editEleve = new XMLHttpRequest();
        // j'ouvre une requete post vers la bonne aPI
        editEleve.open('PUT', "http://localhost:3000/api/edit/" + editMode.editId, true);
        // je lanche ma requete

        // editEleve.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        // je set le header de ma requete pour lui dire que j'envoie du json
        editEleve.setRequestHeader("Content-type", "application/json");

        // // je send ma requete en transformant mon newUser en string
        editEleve.send(JSON.stringify(newUser));

        // j'écoute que la requete soient bien finie pour log l'information 
        editEleve.onreadystatechange = function() { //Call a function when the state changes.
            if (editEleve.readyState == XMLHttpRequest.DONE && editEleve.status == 200) {
                // Request finished. Do processing here.
                console.log('req ok');
                // console.log(editEleve.responseText);
                // var addEleve = JSON.parse(editEleve.responseText);
                // var addEleve = bindList(addEleve);

            }
        }

    }


};

function deleteEleve(event) {
    event.preventDefault();
    console.log("delete");
    console.log(event);
    console.log(event.target);
    var myTarget = event.target.parentNode.parentNode;
    console.log(myTarget);
    var eleveId = myTarget.getAttribute("data-ideleve");
    console.log(eleveId);
    var idObj = { id : eleveId };

    var deleteUser = new XMLHttpRequest();
    // j'ouvre une requete post vers la bonne aPI
    deleteUser.open('POST', "http://localhost:3000/api/delete", true);
    // je lanche ma requete
    
    // deleteUser.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    // je set le header de ma requete pour lui dire que j'envoie du json
    deleteUser.setRequestHeader("Content-type", "application/json");

   // // je send ma requete en transformant mon newUser en string
    deleteUser.send(JSON.stringify(idObj));

    // j'écoute que la requete soient bien finie pour log l'information 
    deleteUser.onreadystatechange = function() { //Call a function when the state changes.
        if (deleteUser.readyState == XMLHttpRequest.DONE && deleteUser.status == 200) {
            // Request finished. Do processing here.
            console.log('req ok');
            myTarget.remove();
            // console.log(postUser.responseText);
            // var addEleve = JSON.parse(postUser.responseText);
            // var addEleve = bindList(addEleve);

        }
    }
    // var myIndex = data.findIndex(function(i) {
    //     return i.id === eleveId
    // });
    // data.splice(myIndex, 1);
    // removeElem(myTarget);
    // console.log(myIndex);

    // // je cherche l'eleve correspondant a l'index
    // var monuser = dataList[myIndex];
    // console.log(monuser);


    // var myIndex = data.findIndex(function(i) {
    //     return i.id === eleveId
    // });
    // data.splice(myIndex, 1);
    // removeElem(myTarget);
};

function editEleve(event) {
    console.log("edit");
    document.getElementById("myForm").classList.toggle("show");
    var myTarget = event.target.parentNode.parentNode;
    console.log(myTarget);
    var eleveId = myTarget.getAttribute("data-idEleve");
    console.log(eleveId);
    var myIndex = data.findIndex(function(i) {
        return i._id === eleveId;
    });
    console.log(myIndex);
    var monForm = document.getElementById("newUser").elements;
    _.forIn(monForm, function(item) {
        item.value = data[myIndex][item.name];
    });

};