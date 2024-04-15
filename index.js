import products from "./data.js";
const cardRow = document.querySelector(".card-row");
const tbody = document.querySelector("tbody");


window.addEventListener("load", () => {
  if (!localStorage.getItem("basket")) {
    localStorage.setItem("basket", JSON.stringify([]));
  }
});



products.forEach((product) => {
  cardRow.innerHTML += `
    <div id=${product.id} class="col-lg-3 col-md-6 col-sm-12 mb-4">
                <div class="card" style="width: 18rem;">
                    <img class="card-img-top" height="250" src="${product.img
    }" alt="Card image cap">
                    <div class="card-body">
                      <h5 class="card-title">${product.name}</h5>
                        <h5>${product.discountPercentage > 0
      ? `<del class="text-secondary">${product.salePrice
      }</del>${product.calcPrice()}}`
      : Number(product.salePrice).toFixed(2)
    }</h5>
                        <button data-name=${product.name} data-id=${product.id
    } class="btn btn-outline-primary basket-btn">Basket</button>
                        <button  data-id=${product.id
    } class="btn btn-outline-danger delete-btn">Delete</button>
                    </div>
                  </div>
            </div>
    `;
  let delBtn = document.querySelectorAll(".delete-btn");

  delBtn.forEach((del) => {
    del.addEventListener("click", function () {

      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then((result) => {

          if (result.isConfirmed) {
            const prodIdx = products.findIndex(
              (x) => x.id == this.getAttribute("data-id")
            );
            this.closest(".col-lg-3").remove();
            products.splice(prodIdx, 1);
            const localBasket = JSON.parse(localStorage.getItem("basket"))
            const idx = localBasket.findIndex((x) => x.id == this.getAttribute("data-id"))
            localBasket.splice(idx, 1)
            renderBasket(localBasket, products)
            localStorage.setItem("basket", JSON.stringify(localBasket))
            swalWithBootstrapButtons.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire({
              title: "Cancelled",
              text: "Your imaginary file is safe :)",
              icon: "error",
            });
          }
        });
    });
  });

  const basketBtns = document.querySelectorAll(".basket-btn");
  basketBtns.forEach((basketBtn) => {
    basketBtn.addEventListener("click", function () {
      const localBasketArr = JSON.parse(localStorage.getItem("basket"));

      const currentProductId = this.getAttribute("data-id")

      const foundDublicate = localBasketArr.find((x) => x.id == currentProductId)

      if (foundDublicate) {
        foundDublicate.count++
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${this.getAttribute("data-name")} count increases`,
          showConfirmButton: false,
          timer: 1000
        });
      } else {
        localBasketArr.push({ id: currentProductId, count: 1 })
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${this.getAttribute("data-name")} added  to basket`,
          showConfirmButton: false,
          timer: 1000
        });
      }
      const currentProd = products.find((x) => x.id == currentProductId)
      tbody.innerHTML += `  <tr>
      <th scope="row">${currentProd.id}</th>
      <td>${currentProd.name}</td>
      <td><img height="100" width="100" src="${currentProd.img}" alt=""></td>
      <td><b>${currentProd.price}</b></td>
      <td><i>${foundDublicate ? foundDublicate.count : 1}</i></td>
      <td><button class="btn btn-outline-primary increase-btn"><i class="fa-solid fa-plus"></i></button></td>
      <td><button class="btn btn-outline-primary decrease-btn"><i class="fa-solid fa-minus"></i></button></td>
      <td><button class="btn btn-outline-danger trash-btn"><i class="fa-solid fa-trash"></i></button></td>
    </tr>`
      localStorage.setItem("basket", JSON.stringify(localBasketArr))
      renderBasket(localBasketArr, products)
    });
  });
});













//LOCAL BASKET

const basketArr = JSON.parse(localStorage.getItem("basket"))
console.log(basketArr, products);
basketArr && renderBasket(basketArr, products)

function renderBasket(basketArr, productArr) {


  function adBasket(basketA) {
    tbody.innerHTML = ""
    basketA.forEach((basketItem) => {
      const currentProds = productArr.find((x) => x.id == basketItem.id)
      tbody.innerHTML += `  <tr>
        <th scope="row">${currentProds.id}</th>
        <td>${currentProds.name}</td>
        <td><img height="100" width="100" src="${currentProds.img}" alt=""></td>
        <td><b>${Number(currentProds.calcPrice() * basketItem.count).toFixed(2)}</b></td>
        <td><i>${basketItem.count}</i></td>
        <td><button id=${basketItem.id} class="btn btn-outline-primary increase-btn"><i class="fa-solid fa-plus"></i></button></td>
        <td><button id=${basketItem.id} ${basketItem.count < 2 ?   `class="btn btn-outline-danger decrease-btn"`   : `class="btn btn-outline-primary decrease-btn"`  } ><i class="fa-solid fa-minus"></i></button></td>
        <td><button id=${basketItem.id} class="btn btn-outline-danger trash-btn"><i class="fa-solid fa-trash"></i></button></td>
      </tr>`



      const trashbtnAll = document.querySelectorAll(".trash-btn");
      trashbtnAll.forEach((trashbtn) => {
        trashbtn.addEventListener("click", function () {
          basketArr.forEach((item) => {
            if (item.id == this.getAttribute("id")) {
              console.log(item)
              const idx = basketArr.findIndex((x) => x.id == this.getAttribute("data-id"))
              basketArr.splice(idx, 1)
              adBasket(basketArr);
              localStorage.setItem("basket", JSON.stringify(basketArr));
            }
          })
          adBasket(basketArr);
        })
      })



      const increaseBtnAll = document.querySelectorAll(".increase-btn");
      increaseBtnAll.forEach((increase) => {
        increase.addEventListener("click", function () {
          basketArr.forEach((item) => {
            if (item.id == this.getAttribute("id")) {
              item.count++;
              return item
            }
          })
          localStorage.setItem("basket", JSON.stringify(basketArr))
          adBasket(basketArr);
        })
      })



      const decreaseBtnAll = document.querySelectorAll(".decrease-btn");
      decreaseBtnAll.forEach((decrease) => {
        decrease.addEventListener("click", function (e) {
          basketArr.forEach((item) => {
            if (item.id == this.getAttribute("id")) {
            
              if (item.count < 2) {
                  return item
              } else {
                item.count--;
                return item
              }

            }
          })
          localStorage.setItem("basket", JSON.stringify(basketArr))
          adBasket(basketArr);
        })
      })
    })
  }

  adBasket(basketArr)



}


const clear = document.querySelector(".clear-all")
clear.addEventListener("click", () => {
  tbody.innerHTML = ""
  localStorage.setItem("basket", JSON.stringify([]))
})




let form1 = document.querySelector(".form1")
let name1 = document.querySelector(".name1")
let password1 = document.querySelector(".password1")
let email1 = document.querySelector(".email1")
let name2 = document.querySelector(".name2")
let password2 = document.querySelector(".password2")
let form2 = document.querySelector(".form2")
let signin = document.querySelector(".sign-in")
let signup = document.querySelector(".sign-up")
let output = document.querySelector(".fa-sign-out")
let user = document.querySelector(".user")
let backSign = document.querySelector(".back-sign")
let value2, pass2
let names, password, email  

form1.addEventListener("submit", (e) => {
    e.preventDefault()
    if (name1.length === 0 || password1.length === 0 || email1.length === 0) {
        alert("xanalari doldurun")
    } else {
        localStorage.setItem("allData", names)
        localStorage.setItem("allPass", password)
        localStorage.setItem("allEmail", email)
        signup.style.display = "none";
        signin.style.display = "flex";
        location.reload()
    }
})

let localName = localStorage.getItem("allData")
let localPass = localStorage.getItem("allPass")
let localEmail = localStorage.getItem("allEmail")

let userLoad = false
if (localPass && localName && localEmail) {
    signup.style.display = "none";
    signin.style.display = "flex";
}
form2.addEventListener("submit", (e) => {
    e.preventDefault()
    if (value2.length === 0 || pass2.length === 0) {
        alert("xanalari doldurun")
    } else if (value2 == localName && pass2 == localPass) {
        signin.style.display = "none"
        userLoad = true
        localStorage.setItem("localUser", userLoad)
        location.reload()
    } else {
        alert("parol sehvdir")
    }

})
name1?.addEventListener("input", (e) => {
    names = e.target.value
})
password1?.addEventListener("input", (e) => {
    password = e.target.value
})
email1?.addEventListener("input", (e) => {
    email = e.target.value
})
name2?.addEventListener("input", (e) => {
    value2 = e.target.value
})
password2?.addEventListener("input", (e) => {
    pass2 = e.target.value
})
output.addEventListener("click", () => {
    signin.style.display = "block";
    user.innerHTML = " ";
    location.reload();
    userLoad = false;
    localStorage.removeItem("localUser")
})
let localUserGet = localStorage.getItem("localUser")
if (localPass && localName && localUserGet) {
    user.innerHTML = localName
    signin.style.display = "none"
    signup.style.display = "none"
}
backSign.addEventListener("click", () => {
    signin.style.display = "none"
    signup.style.display = "block"
    localStorage.removeItem("allData")
})
