"use strict";

/*
  TODO:
  - select month
  - localStorage 
  - modal: add animation 
           close modal when clicking outside of it
           add date on title
*/

//------ CALENDAR
const calendarCtrl = (() => {
  let data = [];  

  // app here means appointment 
  return {
    addApp: (item) => {
      data.push(item);
    }, 

    removeApp: (item) => {
      let index, elems;

      elems = data.map(i => i.id);

      index = elems.indexOf(item);
   
      if(elems != -1)
        data.splice(index, 1);
    },

    getData: () => {
      return data;
    },

    setDate: (d) => {
      data.push(d);
    },    
  }
})();
//------ CALENDAR


//------ UI
const UICtrl = (function() {
  return {
    showModal: (e) => {
      e = e.target;
      const modalAdd = document.querySelector(".add-modal");
      const modalDel = document.querySelector(".del-modal");

      // this will solve the problem on firefox
      const btnAdd = e.classList.contains('.add') ? e : e.closest('.add');
      const btnEdit = e.classList.contains('.edit') ? e : e.closest('.edit');
      const btnDel = e.classList.contains('.del') ? e : e.closest('.del');

      if(btnAdd) {
        modalAdd.style.display = "flex";
        modalAdd.setAttribute("data-day", btnAdd.dataset["day"]);
      }
      else if(btnEdit) {
        document.querySelector(".add-modal").style.display = "flex";
      }
      else if(btnDel) {
        modalDel.style.display = "flex";
        modalDel.setAttribute("data-day", btnDel.dataset["day"]);
      }
    },

    hideModal: () => {
      document.querySelectorAll(".modal-wrapper").forEach(modal => modal.style.display = "none");
    },

    clearFields: () => {
      document.querySelector(".inputs-title").value = '';
      document.querySelector(".inputs-desc").value = '';
      document.querySelector(".inputs-title").focus();
    },

    removeTable:() => {
      document.querySelectorAll('.calendar-body tr').forEach(tr => tr.remove());
    },

    generateTable: (data) => {
      const today = new Date();
      const nDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(); // number of days in this month
      const firstDayWeek = new Date(today.getFullYear(), today.getMonth(), 1).getDay(); // day of the week
      let table = "";
      let td = "";
      let day = [];

      table += "<tr>";
      
      if(data) {
        for(let c = 0; c < data.length; c++) {
          day[c] = data[c].date.split("/")[0];
        }
      }

      // start on the right day of the week
      for(let c = 0; c < firstDayWeek; c++) {
        table += "<td></td>";
      }

      for(let c = 1; c <= nDays; c++) {   
        let value = day.findIndex(d => d == c);

        if(value != -1) {
          td = `
          <td>
            <span class="table-day">${c}</span>
            <span class="buttons">
              <a href="#" class="btn edit"><span class="fas fa-pencil-alt"></span></a>
              <a href="#" class="btn del" data-day="${c}"><span class="fas fa-trash-alt"></span></a>
            </span>
            <p><a href="#">${data[value]["title"]}</a></p>
          </td>`;
        }
        else {
          td = `
          <td>
            <span class="table-day">${c}</span>
            ${c >= today.getDate() ? '<a href="#" class="btn add" data-day="' + c + '"><span class="fas fa-plus"></span></a>' : ''}
          </td>`;
        }
        
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
      
      return {
        id: document.querySelector('.add-modal').dataset.day,
        date: document.querySelector('.add-modal').dataset.day + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(),
        title: document.querySelector('.inputs-title').value,
        desc: document.querySelector('.inputs-desc').value, 
      }
    },

    getInfoDel: () => {
      return document.querySelector('.del-modal').dataset.day;
    }  
  }
})();
//------ UI


//------ APP
const app = ((ui, calendar) => {

  const addItem = () => {
    const info = ui.getInfo();

    if(info.title != "") {
      ui.hideModal();
      ui.clearFields();
      calendar.addApp(info);
      ui.removeTable();
      ui.generateTable(calendar.getData());
    }
  }

  const deleteItem = () => {
    ui.hideModal();
    calendar.removeApp(ui.getInfoDel());
    ui.removeTable();
    ui.generateTable(calendar.getData());
  }

  const addListeners = function () {
    document.querySelector(".calendar").addEventListener("click", ui.showModal);
    document.querySelectorAll(".times").forEach(modal => modal.addEventListener("click", ui.hideModal));
    document.querySelector(".cancel").addEventListener("click", ui.hideModal);
    document.querySelector(".no").addEventListener("click", ui.hideModal);
    document.querySelector(".modal-save").addEventListener("click", addItem);
    document.querySelector(".yes").addEventListener("click", deleteItem);
  }

  return {
    init: () => {
      addListeners();
      ui.generateTable(calendar.getData());
    }
  }
})(UICtrl, calendarCtrl);
//------ APP

app.init();

