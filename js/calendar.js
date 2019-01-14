"use strict";

/*
  TODO:
  - choose month
  - modal: add animation 
           close modal when clicking outside of it
           add date on title
*/

//------ CALENDAR
const calendarCtrl = (function() {
  let data = {
    date: "",
    title: "",
    desc: ""
  }

  // app = appointment 
  return {
    addApp: (date, title, desc) => {
      data.date = date;
      data.title = title;
      data.desc = desc;
    }, 

    getData: () => {
      return data;
    }
  }
})();
//------ CALENDAR


//------ UI
const UICtrl = (function() {
  return {
    showModal: (e) => {
      e = e.target;
      const modal = document.querySelector(".add-modal");

      // this will solve the problem on firefox
      const btnAdd = e.classList.contains('.add') ? e : e.closest('.add');
      const btnEdit = e.classList.contains('.edit') ? e : e.closest('.edit');
      const btnDel = e.classList.contains('.del') ? e : e.closest('.del');

      if(btnAdd) {
        modal.style.display = "flex";
        modal.setAttribute("data-day", btnAdd.dataset["day"]);
      }
      else if(btnEdit) {
        document.querySelector(".add-modal").style.display = "flex";
      }
      else if(btnDel) {
        document.querySelector(".del-modal").style.display = "flex";
      }
    },

    hideModal: (e) => {
      e = e.target;
      
      // go up to the parent element until the modal-wrapper
      while(!e.classList.contains('modal-wrapper')) {
        e = e.parentElement;
      }
      e.style.display = "none";
    },

    generateTable: () => {
      const today = new Date();
      const nDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(); // number of days in this month
      const firstDayWeek = new Date(today.getFullYear(), today.getMonth(), 1).getDay(); // day of the week
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
          ${c >= today.getDate() ? '<a href="#" class="btn add" data-day="' + c + '"><span class="fas fa-plus"></span></a>' : ''}
        </td>`;
       
        
        if(c === nDays) { // last element
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

      document.querySelector('.calendar-body').insertAdjacentHTML("beforeend", table);
    },

    getInfo: () => {
      const d = new Date();
      const date = document.querySelector('.add-modal').dataset.day + "/" + d.getMonth() + "/" + d.getFullYear();
      const title = document.querySelector('.inputs-title').value;
      const desc = document.querySelector('.inputs-desc').value;
      hideModal();
    }
  }
})();
//------ UI


//------ APP
const app = ((ui, calendar) => {

  const addItem = () => {
    ui.getInfo();
  }

  const addListeners = function () {
    document.querySelector(".calendar").addEventListener("click", ui.showModal);
    document.querySelectorAll(".times").forEach(modal => modal.addEventListener("click", ui.hideModal));
    document.querySelector(".cancel").addEventListener("click", ui.hideModal);
    document.querySelector(".no").addEventListener("click", ui.hideModal);
    document.querySelector(".modal-save").addEventListener("click", addItem);
  }

  return {
    init: () => {
      addListeners();
      ui.generateTable();
    }
  }
})(UICtrl, calendarCtrl);
//------ APP

app.init();

