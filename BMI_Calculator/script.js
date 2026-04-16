const form = document.querySelector("form")
form.addEventListener("submit" ,function(e){
e.preventDefault(e)

const height = parseInt( document.querySelector("#height").value)
const weight = parseInt( document.querySelector("#weight").value)
const result = document.querySelector("#results")



  const bmi_result =( weight / ((height * height) / 10000)).toFixed(2);

  
if (height == "" || height < 0 || isNaN(height) ){
    result.innerHTML = "please Enter a valid Height"
  }else if(weight == "" || weight < 0 || isNaN(weight))
  {
    result.innerHTML = "please Enter a valid weight";
  }
 else if(bmi_result <= 18.6 ){
  result.innerHTML = `<span>${bmi_result} <p> Under Weight </p></span>`
} else if(bmi_result > 18.6 || result < 24.9 ){
  result.innerHTML = `<span>${bmi_result} <p>  Normal Weight </p></span>`
}else{
  result.innerHTML = `<span>${bmi_result} <p> Over Weight </p></span>`
}

})






