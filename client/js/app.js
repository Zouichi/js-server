var data = [];
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
        mareponseText.forEach(function(eleve) {
            bindList(eleve);

        });
        data = mareponseText;
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
    var newUser = {
        id: data.length + 1
    };
    console.log(typeof monForm);
    _.forIn(monForm, function(item) {
        console.log(item);
        newUser[item.name] = item.value;

    });
    console.log(newUser);
    data.push(newUser);
    bindList(newUser);
    console.log(data);

};

function deleteEleve(event) {
    event.preventDefault();
    console.log("delete");
    console.log(event);
    console.log(event.target);
    var myTarget = event.target.parentNode.parentNode;
    console.log(myTarget);
    var eleveId = myTarget.getAttribute("data-ideleve");
    console.log(eleveId)
    var myIndex = data.findIndex(function(i) {
        return i.id === eleveId
    });
    data.splice(myIndex, 1);
    removeElem(myTarget);
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