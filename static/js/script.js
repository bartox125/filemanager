window.addEventListener("DOMContentLoaded", function () {
    const dialog1 = document.getElementById("c1")
    const dialog2 = document.getElementById("c2")
    const dialog3 = document.getElementById("c3")
    const dialog4 = document.getElementById("c4")
    const changeName = document.getElementById("changeName")
    const newFolder = document.getElementById("newfolder")
    const newFile = document.getElementById("newfile")
    const fileForm = document.getElementById('fileForm')
    const nameForm = document.getElementById("nameForm")
    const catalogForm=document.getElementById('catalogForm')
    const openForm=document.getElementById("openForm")
    openForm.addEventListener("click", ()=>{
        document.getElementById("uploadForm").showModal()
    })
    newFile.addEventListener("click", function () {
        document.getElementById("dialogFile").showModal()
    })
    newFolder.addEventListener("click", function () {
        document.getElementById("dialogFolder").showModal()
    })
    changeName.addEventListener("click", function (){
        document.getElementById("dialogChangeName").showModal()
    })
    dialog1.addEventListener("click", ()=> {
        cancel('dialogFolder')
    })
    dialog2.addEventListener("click", ()=> {
        cancel('dialogFile')
    })
    dialog3.addEventListener("click", ()=>{
        cancel('dialogChangeName')
    })
    dialog4.addEventListener("click", ()=>{
        cancel('uploadForm')
    })
    fileForm.addEventListener('submit', function(event) {
        let inputValue = document.getElementById('fileName').value;
        console.log(inputValue);
        if (inputValue == '') { 
          event.preventDefault();
          alert('Pole nie może być puste!');
        }
      });
    catalogForm.addEventListener('submit',function(event){
        let inputValue = document.getElementById('catalogName').value;
        console.log(inputValue);
        if (inputValue == '') {
          event.preventDefault(); 
          alert('Pole nie może być puste!');
        }
    })
    nameForm.addEventListener('submit', function (event){
        let inputValue = document.getElementById('newName').value;
        if (inputValue == '') {
          event.preventDefault(); 
          alert('Pole nie może być puste!');
        }
    })
})
function cancel(id) {
    document.getElementById(id).close();
}
function sureToDelete(e){
    if(confirm('czy usunąc?')){
        return true;
    }else{
        e.preventDefault();
    }
}

