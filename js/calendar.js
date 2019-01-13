

function init() {
  document.querySelector(".calendar").addEventListener("click", e => {
    // this way it'll work on chrome and firefox
    const btnAdd = e.target.classList.contains('.add') ? e.target : e.target.closest('.add');

    if(btnAdd) {
      document.querySelector(".modal-wrapper").style.display = "flex";
    }
  });

  document.querySelector(".modal-wrapper").addEventListener("click", e => {
    const btnClose = e.target.classList.contains('.times') ? e.target : e.target.closest('.times');

    if(btnClose) {
      document.querySelector(".modal-wrapper").style.display = "none";
    }
  });
}

init();