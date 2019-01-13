"use strict";

/*
  TODO:
  - modal: add animation 
           add event on cancel button
           close modal when clicking outside of it
           add date on title

*/

const UICtrl = (function() {
  return {
    showModal: (e) => {
      e = e.target;

      // this will solve the problem on firefox
      if(e.classList.contains('.add') || e.closest('.add')) {
        document.querySelector(".add-modal").style.display = "flex";
      }
      else if(e.classList.contains('.edit') || e.closest('.edit')) {
        document.querySelector(".add-modal").style.display = "flex";
      }
      else if(e.classList.contains('.del') || e.closest('.del')) {
        document.querySelector(".del-modal").style.display = "flex";
      }
    },

    hideModal: (e) => {
      const btnClose = e.target.classList.contains('.times') ? e.target : e.target.closest('.times');
      
      if(btnClose) {
        e.target.parentElement.parentElement.parentElement.style.display = "none";
      }
    },
    test: () => {
      console.log("test")
    }
  }
})();

const app = ((ui) => {

  const addListeners = function () {
    document.querySelector(".calendar").addEventListener("click", ui.showModal);
    document.querySelectorAll(".modal-wrapper").forEach(modal => modal.addEventListener("click", ui.hideModal));
  }

  return {
    init: () => {
      addListeners();
    }
  }
})(UICtrl);

app.init();

let today = new Date();
let nDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(); // number of days in this month
let firstDayWeek = new Date(today.getFullYear(), today.getMonth(), 1).getDay();// day of the week
let table = "";
let td = "";

table += "<tr>";

// start on the right day of the week
for(let c = 0; c < firstDayWeek; c++) {
  table += "<td></td>";
}

for(let c = 1; c <= nDays; c++) {  
  td = `
  <td>
    <span class="table-day">${c}</span>
    ${c >= today.getDate() ? '<a href="#" class="btn add"><span class="fas fa-plus"></span></a>' : ''}
  </td>`;
 
  // last element
  if(c === nDays) {
    table += td;
  }
  else if((c + firstDayWeek) % 7 === 0) { // new line
    table += `
      ${td} 
    </tr> 
    <tr> `;
  }
  else {
    table += td;
  }
  
}

table += "</tr>";

document.querySelector('.calendar-body').insertAdjacentHTML("beforeend", table)