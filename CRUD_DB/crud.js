const bdUserNames = indexedDB.open("crudofnames",1);
const readUser = document.getElementById("readUser")
let cont = 1;
let bool = true;
let key = 0;
bdUserNames.addEventListener("upgradeneeded",()=>{
    const bdName = bdUserNames.result;
    bdName.createObjectStore("names",{
        autoIncrement:true
    })
})

bdUserNames.addEventListener("success",(e)=>{
    console.log("Se abrio la base de datos NO-SQL Correctamente")
})
bdUserNames.addEventListener("error",(e)=>{
    console.error("ocurrio un errros")

})

form.addEventListener("submit",(e)=>{
    e.preventDefault()
    if(bool){
        addUserNames(e.target.addUser.value)
    }
    else{
        putUserNames(e.target.addUser.value,key)
    }

       e.preventDefault()
   })


const addUserNames=(addName)=>{
    const dbs = bdUserNames.result,
    transation = dbs.transaction("names","readwrite"),
    obj = transation.objectStore("names");

    let nameUser = {
        nameUser : addName
    }

    obj.add(nameUser);
    window.location.reload()
    transation.addEventListener("complete",()=>{
        console.log("Objeto agregado corectamente")
    })

}

const readDates=()=>{
    const dbs = bdUserNames.result,
    transation = dbs.transaction("names","readonly"),
    obj = transation.objectStore("names");
    let  cursor = obj.openCursor();

    cursor.addEventListener("success",()=>{
        if(cursor.result){
            pintarLi(cursor.result.value,cursor.result.primaryKey)
            cursor.result.continue()
            deleteUser()
            editUserNames()
        }
        else console.log("")
    })
}
addEventListener("DOMContentLoaded",async function(e){
  setTimeout(()=>{
      readDates()
  },100)
})
function pintarLi(dates,key){
    
  readUser.innerHTML += `
  <div class="d-flex">
  <li class="list-group-item num " key="${key}" >${cont}</li>
  <li class="list-group-item" id="name" datename="${dates.nameUser}" style="width: 16rem;">${dates.nameUser}</li>
  <li class="list-group-item" ><button class="btn btn-success btn-edit" >Edit</button>
      <button class="btn btn-danger btn-delete">Delete</button>
  </li>
</div>
  `
  cont++
}

const deleteUser=()=>{
    document.querySelectorAll(".btn-delete").forEach((el)=>{
        el.addEventListener("click",(e)=>{
           let key =  el.parentNode.parentNode.querySelector(".num")
           let keyUser = parseInt(key.getAttribute("key"))
            let confi = confirm("Seguro que desea eliminar")

            if(confi){
                const db = bdUserNames.result,
                transation = db.transaction("names","readwrite"),//leemos la BD NO-SQL
                obj = transation.objectStore("names");//obtenemos la tabla
            
                obj.delete(keyUser);//accion
                transation.addEventListener("complete",()=>{
                    window.location.reload()
                })
            }
        })
    })
    
}

function editUserNames(){
        document.querySelectorAll(".btn-edit").forEach(function(btn_edit){
                btn_edit.addEventListener("click",(e)=>{
                    let keydates  =  btn_edit.parentNode.parentNode.querySelector(".num")
                    let keyName  =  btn_edit.parentNode.parentNode.querySelector("#name")
                    let keyUser = parseInt(keydates.getAttribute("key"))//nos da la clave del dato
                    addUser.value = keyName.getAttribute("datename")
                    bool = false
                    key = keyUser
                    return bool,key
                })
        })
}
const putUserNames=(addName)=>{

    if(addName == undefined){
        return;
    }
    else{
        let nameUser = {
            nameUser : addName
        }
        
        const db = bdUserNames.result,
        transation = db.transaction("names","readwrite"),
        obj = transation.objectStore("names");
        
        obj.put(nameUser,key);
        window.location.reload()
        transation.addEventListener("complete",()=>{
            console.log("Objeto modificado")
        })
        console.log(nameUser,key)
    }
}