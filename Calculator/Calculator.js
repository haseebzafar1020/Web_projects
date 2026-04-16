
 let inputDisplay = document.querySelector("#display")

let buttons  = document.querySelectorAll(".button")
 
let array = Array.from(buttons)

let curent_dispaly = ""

array.forEach(btn =>{

      btn.addEventListener("click" , (e) =>{

        if(e.target.innerHTML == 'c'){
                curent_dispaly = ""
                inputDisplay.value = curent_dispaly

        }
       
        else if(e.target.innerHTML == '='){
                curent_dispaly = eval(curent_dispaly)
                 inputDisplay.value = curent_dispaly

        }
        

        else{
        curent_dispaly  += e.target.innerHTML
        inputDisplay.value = curent_dispaly
        }
      })
})