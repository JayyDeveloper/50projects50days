const cards = document.querySelectorAll('.card');

function removeActive() {
  cards.forEach(card => {
    card.classList.remove('active');
  })
}

cards.forEach(card => {
  card.addEventListener("click",function() {
    removeActive();
    card.classList.add("active");
  })
})