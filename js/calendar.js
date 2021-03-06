"use strict";

/*
  TODO:
  - select month
  - localStorage 
  - merge add and edit modals and info
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

    removeApp: (id) => {
      let index, ids;

      ids = data.map(i => i.id);
      index = ids.indexOf(id);
   
      if(ids != -1)
        data.splice(index, 1);
    },

    editApp: (item) => {
      let index, elems;

      elems = data.map(i => i.id);
      index = elems.indexOf(item.id);

      data[index].title = item.title;
      data[index].desc = item.desc;
    },

    getData: (id) => {
      if(id) {
        let index, ids;
        
        ids = data.map(i => i.id);
        index = ids.indexOf(id);       
    
        if(ids != -1)
          return data[index];
      }
      else 
        return data;
    },

    setDate: (d) => {
      data.push(d);
    },    
  }
})();
//------ CALENDAR


//------ UI
const UICtrl = (function(calendar) {
  
  return {
    showModal: (e) => {
      e = e.target;
      const modalAdd = document.querySelector(".add-modal");
      const modalEdit = document.querySelector(".edit-modal");
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
        // show modal and get the values of the selected item
        modalEdit.style.display = "flex";
        modalEdit.setAttribute("data-day", btnEdit.dataset["day"]);

        let item = calendar.getData(btnEdit.dataset["day"]);
        
        document.querySelector('.inputs-title-edit').value = item.title;
        document.querySelector('.inputs-desc-edit').value = item.desc
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
      document.querySelector(".inputs-title-edit").value = '';
      document.querySelector(".inputs-desc-edit").value = '';
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

      // start month on the right day of the week
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
              <a href="#" class="btn edit" data-day="${c}"><span class="fas fa-pencil-alt"></span></a>
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
    
    getInfoEdit: () => {
      const d = new Date();
      
      return {
        id: document.querySelector('.edit-modal').dataset.day,
        date: document.querySelector('.edit-modal').dataset.day + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(),
        title: document.querySelector('.inputs-title-edit').value,
        desc: document.querySelector('.inputs-desc-edit').value, 
      }
    },

    getInfoDel: () => {
      return document.querySelector('.del-modal').dataset.day;
    }  
  }
})(calendarCtrl);
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

  const editItem = () => {
    ui.hideModal();
    calendar.editApp(ui.getInfoEdit());
    ui.clearFields();
    ui.removeTable();
    ui.generateTable(calendar.getData());
  }

  const addListeners = function () {
    document.querySelector(".calendar").addEventListener("click", ui.showModal);
    document.querySelectorAll(".times").forEach(modal => modal.addEventListener("click", ui.hideModal));
    document.querySelectorAll(".cancel").forEach(modal => modal.addEventListener("click", ui.hideModal));
    document.querySelector(".no").addEventListener("click", ui.hideModal);
    document.querySelector(".modal-save").addEventListener("click", addItem);
    document.querySelector(".modal-update").addEventListener("click", editItem);
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
